# Lead Qualification & Human-in-the-Loop Automation

## Problem

Inbound leads often arrive as inconsistent webhook payloads and are pushed directly into a CRM or chat channel. That creates duplicates, noisy alerts, weak prioritization, and no reliable failure record. This demo treats lead intake as a small production system: inputs are validated and normalized, qualified deterministically, persisted before risky downstream work, and routed through explicit human and error states.

No paid API, live messaging account, or real customer data is required.

## Architecture

The solution contains three importable n8n workflows and a local file-backed mock API:

- `lead_intake.json` — validation, normalization, duplicate detection, scoring, summary, tier routing, approval wait, follow-up delay, adapters, retries, and audit writes.
- `approval_handler.json` — validates `APPROVE` / `REJECT`, allowlists the resume URL, and resumes the exact waiting execution.
- `error_handler.json` — receives n8n Error Trigger events and stores a normalized dead-letter envelope.
- `mock-api/server.mjs` — emulates CRM, audit, notification, and dead-letter integrations using a durable JSON file.

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the component boundaries and state model.

## Workflow

1. `POST /webhook/demo-lead` receives a lead.
2. Required fields are checked without throwing. Invalid input returns HTTP `422` and is audited.
3. Contact fields, enums, budget, `lead_id`, and UTC timestamps are normalized.
4. The mock CRM checks email, phone, or company + contact name for duplicates.
5. A deterministic 0–100 score and readable summary are generated without an AI dependency.
6. HOT leads enter `NEEDS_APPROVAL` and pause on a unique n8n resume webhook.
7. WARM leads are persisted and resume after a configurable delay.
8. COLD leads are persisted without immediate notification.
9. Approved HOT leads pass through explicit Telegram, WhatsApp, and email adapter blocks. In demo mode, only the local mock endpoint is called.

## Key Features

- Contract-style validation with clear error payloads
- Stable normalization and correlation IDs
- Idempotency-oriented duplicate lookup
- Explainable score reasons and deterministic AI-style summary
- Human-in-the-loop `Wait` workflow with separate approval endpoint
- CRM-neutral persistence contract
- Adapter boundaries for Telegram, WhatsApp, and email
- Node-level retries plus dead-letter handling
- Error Trigger workflow for unexpected failures
- Audit events for every material state transition
- Six documented fixtures, including a permanent downstream failure
- No credential references or secrets in workflow exports

## Failure Handling

HTTP integration nodes retry three times. Lead state is written before approval, follow-up, or handoff work. A simulated permanent handoff failure is routed to `/dead-letter`, increments `error_count`, and preserves the lead as `DEAD_LETTER`. Unexpected workflow failures are normalized by `ERROR_HANDLER` with execution and last-node metadata.

n8n only invokes Error Trigger workflows for automatic executions, not manual editor tests. Link the imported error workflow in each main workflow's settings before activating them.

## How to Run

```bash
cp .env.example .env
docker compose up -d
```

Open `http://localhost:5678`, finish the local n8n owner setup, and import the three JSON files from `workflows/`. Link `Demo — ERROR_HANDLER` under **Workflow settings → Error workflow**, then publish the intake and approval workflows.

Run the repository checks with:

```bash
npm test
```

Submit a sample:

```bash
curl -X POST http://localhost:5678/webhook/demo-lead \
  -H "content-type: application/json" \
  --data @samples/hot_lead.json
```

The response includes an execution-specific `resume_url`. Submit it through the approval workflow:

```bash
curl -X POST http://localhost:5678/webhook/demo-lead-approval \
  -H "content-type: application/json" \
  -d '{"lead_id":"<lead_id>","decision":"APPROVE","actor":"portfolio-reviewer","resume_url":"<resume_url>"}'
```

Inspect local demo state at `http://localhost:8080/debug/state`.

## How to Replace Mock Integrations with Production Services

The n8n orchestration contract stays the same; replace only adapter nodes:

| Demo boundary | Production replacement |
|---|---|
| `/crm/lookup`, `/crm/upsert` | HubSpot search/upsert, Airtable, Google Sheets, Notion, or a custom CRM API |
| `/notifications/approval` | Slack, Teams, Telegram bot, email, or an internal approval UI |
| `telegram_adapter` | n8n Telegram node with a credential selected in the instance |
| `whatsapp_adapter` | Meta WhatsApp Cloud API or an approved provider |
| `email_adapter` | SMTP, SES, Postmark, or SendGrid |
| `/audit` | Append-only database table, event stream, or observability pipeline |
| `/dead-letter` | Queue, incident system, or replayable database table |

Production credentials belong in n8n's credential store or an external secret manager, never in exported JSON.

## Security Notes

- Fixtures use synthetic data only.
- The workflows contain no `credentials` objects or credential IDs.
- The approval handler accepts only allowlisted hosts and n8n waiting-webhook paths.
- All real messaging toggles default to `false`.
- The Docker defaults are suitable for local evaluation only; change the encryption key and add authentication/TLS for any shared environment.

See [SECURITY.md](./SECURITY.md) for the threat boundaries.

## What This Demonstrates

The project demonstrates production-minded automation design: explicit contracts, durable state before side effects, explainable qualification, human approval, retry policy, dead-letter capture, auditability, isolated adapters, and a documented path from local mocks to real services.
