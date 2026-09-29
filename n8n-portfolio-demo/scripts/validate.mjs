import assert from "node:assert/strict";
import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createMockServer } from "../mock-api/server.mjs";
import { normalizeLead, qualifyLead, validateLead } from "../lib/lead-engine.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workflowDir = join(root, "workflows");
const sampleDir = join(root, "samples");
const workflowFiles = (await readdir(workflowDir)).filter((name) => name.endsWith(".json"));

for (const name of workflowFiles) {
  const text = await readFile(join(workflowDir, name), "utf8");
  const workflow = JSON.parse(text);
  assert.equal(typeof workflow.name, "string", `${name}: name`);
  assert.ok(Array.isArray(workflow.nodes) && workflow.nodes.length > 0, `${name}: nodes`);
  assert.equal(typeof workflow.connections, "object", `${name}: connections`);
  const nodeNames = workflow.nodes.map((node) => node.name);
  const nodeIds = workflow.nodes.map((node) => node.id);
  assert.equal(new Set(nodeNames).size, nodeNames.length, `${name}: unique node names`);
  assert.equal(new Set(nodeIds).size, nodeIds.length, `${name}: unique node ids`);
  for (const [source, groups] of Object.entries(workflow.connections)) {
    assert.ok(nodeNames.includes(source), `${name}: connection source ${source}`);
    for (const outputs of Object.values(groups)) for (const branch of outputs) for (const edge of branch) {
      assert.ok(nodeNames.includes(edge.node), `${name}: connection target ${edge.node}`);
    }
  }
  assert.ok(!text.includes('"credentials"'), `${name}: no credential references`);
}

const repositoryText = await Promise.all([
  ...workflowFiles.map((name) => readFile(join(workflowDir, name), "utf8")),
  readFile(join(root, ".env.example"), "utf8")
]).then((parts) => parts.join("\n"));
for (const pattern of [/\bsk-[A-Za-z0-9_-]{20,}\b/, /\bxox[baprs]-[A-Za-z0-9-]{20,}\b/, /\b\d{8,10}:[A-Za-z0-9_-]{30,}\b/, /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/]) {
  assert.ok(!pattern.test(repositoryText), `secret-like pattern detected: ${pattern}`);
}

async function fixture(name) { return JSON.parse(await readFile(join(sampleDir, name), "utf8")); }
const hot = await fixture("hot_lead.json");
const warm = await fixture("warm_lead.json");
const cold = await fixture("cold_lead.json");
const invalid = await fixture("invalid_lead.json");
const duplicate = await fixture("duplicate_lead.json");
const failure = await fixture("failure_lead.json");

for (const item of [hot, warm, cold, duplicate, failure]) assert.equal(validateLead(item).valid, true);
assert.deepEqual(validateLead(invalid).errors.map((error) => error.field), invalid._expected.validation_errors);
for (const item of [hot, warm, cold, failure]) {
  const result = qualifyLead(normalizeLead(item, new Date("2026-09-29T00:00:00.000Z")));
  assert.equal(result.lead_score, item._expected.score, `${item.name}: score`);
  assert.equal(result.lead_tier, item._expected.tier, `${item.name}: tier`);
}

const temporary = await mkdtemp(join(tmpdir(), "n8n-lead-demo-"));
const server = createMockServer({ dataFile: join(temporary, "state.json") });
await new Promise((resolveListen) => server.listen(0, "127.0.0.1", resolveListen));
const base = `http://127.0.0.1:${server.address().port}`;
const post = async (path, body) => {
  const response = await fetch(`${base}${path}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  return { status: response.status, body: await response.json() };
};

try {
  const hotLead = qualifyLead(normalizeLead(hot, new Date("2026-09-29T00:00:00.000Z")));
  assert.equal((await post("/crm/lookup", { context: hotLead })).body.duplicate, false);
  assert.equal((await post("/crm/upsert", { context: hotLead })).body.persisted, true);
  const duplicateLead = normalizeLead(duplicate, new Date("2026-09-29T00:01:00.000Z"));
  const duplicateResult = await post("/crm/lookup", { context: duplicateLead });
  assert.equal(duplicateResult.body.duplicate, true);
  assert.equal(duplicateResult.body.existing_lead_id, hotLead.lead_id);
  assert.equal((await post("/audit", { context: hotLead, events: [{ step: "SCORED", status: "OK", message: "test" }] })).body.audit_written, 1);
  assert.equal((await post("/notifications/approval", { context: hotLead, message: { lead_id: hotLead.lead_id } })).status, 202);
  const failedLead = qualifyLead(normalizeLead(failure, new Date("2026-09-29T00:02:00.000Z")));
  assert.equal((await post("/notifications/sales-handoff", { context: failedLead, message: {} })).status, 503);
  assert.equal((await post("/dead-letter", { context: failedLead, error: { message: "simulated" } })).body.dead_lettered, true);
  const state = await fetch(`${base}/debug/state`).then((response) => response.json());
  assert.equal(state.leads[failedLead.lead_id].status, "DEAD_LETTER");
  assert.equal(state.dead_letters.length, 1);
} finally {
  await new Promise((resolveClose) => server.close(resolveClose));
  await rm(temporary, { recursive: true, force: true });
}

const page = await readFile(resolve(root, "../demos/n8n-lead-automation/index.html"), "utf8");
for (const target of ["../../n8n-portfolio-demo/README.md", "../../n8n-portfolio-demo/ARCHITECTURE.md"]) {
  assert.ok(page.includes(target), `case study link missing: ${target}`);
  await readFile(resolve(root, "../demos/n8n-lead-automation", target));
}
assert.ok(page.includes("https://github.com/artem112art/lead-demo/blob/main/n8n-portfolio-demo/workflows/lead_intake.json"), "public workflow link missing");
await readFile(join(workflowDir, "lead_intake.json"));

process.stdout.write(`PASS: ${workflowFiles.length} workflows, 6 fixtures, mock API, links, and secret scan\n`);
