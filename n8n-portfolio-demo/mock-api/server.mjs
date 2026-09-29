import http from "node:http";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const defaultState = () => ({ leads: {}, audit: [], notifications: [], dead_letters: [], attempts: {} });

export function createMockServer({ dataFile = process.env.DATA_FILE || resolve(".data/state.json") } = {}) {
  let writeQueue = Promise.resolve();

  async function load() {
    try { return { ...defaultState(), ...JSON.parse(await readFile(dataFile, "utf8")) }; }
    catch (error) { if (error.code === "ENOENT") return defaultState(); throw error; }
  }

  async function save(state) {
    writeQueue = writeQueue.then(async () => {
      await mkdir(dirname(dataFile), { recursive: true });
      const temporary = `${dataFile}.tmp`;
      await writeFile(temporary, `${JSON.stringify(state, null, 2)}\n`, "utf8");
      await rename(temporary, dataFile);
    });
    return writeQueue;
  }

  function send(response, status, payload) {
    response.writeHead(status, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
    response.end(JSON.stringify(payload));
  }

  async function bodyOf(request) {
    const chunks = [];
    for await (const chunk of request) chunks.push(chunk);
    if (!chunks.length) return {};
    const raw = Buffer.concat(chunks).toString("utf8");
    if (Buffer.byteLength(raw) > 1_000_000) throw Object.assign(new Error("Payload too large"), { status: 413 });
    return JSON.parse(raw);
  }

  return http.createServer(async (request, response) => {
    try {
      const url = new URL(request.url, "http://mock.local");
      if (request.method === "GET" && url.pathname === "/health") return send(response, 200, { status: "ok" });
      if (request.method === "GET" && url.pathname === "/debug/state") return send(response, 200, await load());
      if (request.method !== "POST") return send(response, 404, { error: "NOT_FOUND" });

      const payload = await bodyOf(request);
      const context = payload.context ?? {};
      const state = await load();

      if (url.pathname === "/crm/lookup") {
        const candidate = Object.values(state.leads).find((lead) =>
          (context.email && lead.email === context.email) ||
          (context.phone && lead.phone === context.phone) ||
          (context.company && context.name && lead.company === context.company && lead.name === context.name)
        );
        return send(response, 200, { ...context, duplicate: Boolean(candidate), existing_lead_id: candidate?.lead_id ?? null });
      }

      if (url.pathname === "/crm/upsert") {
        const previous = state.leads[context.lead_id] ?? {};
        state.leads[context.lead_id] = { ...previous, ...context, updated_at: new Date().toISOString() };
        await save(state);
        return send(response, 200, { ...state.leads[context.lead_id], persisted: true, adapter: "mock-crm" });
      }

      if (url.pathname === "/audit") {
        const events = Array.isArray(payload.events) ? payload.events : [payload.event ?? {}];
        for (const event of events) state.audit.push({ timestamp: new Date().toISOString(), lead_id: context.lead_id ?? event.lead_id ?? null, ...event });
        await save(state);
        return send(response, 200, { ...context, audit_written: events.length });
      }

      if (url.pathname.startsWith("/notifications/")) {
        const channel = url.pathname.split("/").at(-1);
        const attemptKey = `${context.lead_id}:${channel}`;
        state.attempts[attemptKey] = (state.attempts[attemptKey] ?? 0) + 1;
        const permanentFailure = channel === "sales-handoff" && context.simulate_downstream_failure;
        if (permanentFailure) {
          await save(state);
          return send(response, 503, { error: "SIMULATED_DOWNSTREAM_FAILURE", lead_id: context.lead_id, channel, attempt: state.attempts[attemptKey] });
        }
        state.notifications.push({ timestamp: new Date().toISOString(), channel, payload: payload.message, lead_id: context.lead_id });
        await save(state);
        return send(response, 202, { ...context, notification_accepted: true, channel, attempt: state.attempts[attemptKey] });
      }

      if (url.pathname === "/dead-letter") {
        state.dead_letters.push({ timestamp: new Date().toISOString(), ...payload });
        if (context.lead_id) {
          const previous = state.leads[context.lead_id] ?? context;
          state.leads[context.lead_id] = { ...previous, status: "DEAD_LETTER", error_count: Number(previous.error_count ?? 0) + 1, last_action: "FAILED" };
        }
        await save(state);
        return send(response, 202, { ...context, dead_lettered: true });
      }

      return send(response, 404, { error: "NOT_FOUND" });
    } catch (error) {
      return send(response, error.status ?? 400, { error: error.name, message: error.message });
    }
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const port = Number(process.env.PORT || 8080);
  createMockServer().listen(port, "0.0.0.0", () => process.stdout.write(`mock-api listening on ${port}\n`));
}
