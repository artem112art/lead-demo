# Security

## Demo guarantees

- No real API keys, passwords, bot tokens, credential IDs, or customer records are included.
- All fixture identities and contact details are synthetic.
- `DEMO_MODE=true` and every real-channel toggle defaults to `false`.
- Telegram, WhatsApp, and email blocks produce metadata only; the sole notification target is the local mock API.
- The mock API binds no authentication and is therefore for local evaluation only.

## Approval boundary

The approval workflow does not blindly request a caller-provided URL. It requires an allowlisted host and a `/webhook-waiting/` path, then rebuilds the request using `APPROVAL_INTERNAL_BASE_URL`. Production should also authenticate the approval endpoint, sign decisions, authorize actors, set approval expiry, and use TLS externally.

## Data handling

The local mock API stores payloads in a Docker volume as plain JSON. Do not use it for personal or regulated data. A production adapter should minimize stored fields, encrypt data at rest, define retention, and redact contact data from logs and error payloads.

## Secrets

Workflow exports deliberately contain no `credentials` object. Keep secrets in n8n credentials or a secret manager. Do not commit `.env`. The `.env.example` encryption key is a placeholder and must be replaced before any shared deployment.

## Production hardening checklist

- HTTPS reverse proxy and authenticated n8n UI
- Strong, backed-up `N8N_ENCRYPTION_KEY`
- Authenticated intake and approval webhooks
- Rate limits and payload-size limits at the edge
- Schema validation beyond required fields
- Transactional persistence with unique constraints
- Idempotency keys for notifications and CRM writes
- Append-only audit store with restricted access
- Alerting and replay policy for dead letters
- Execution-data retention and PII redaction
- Network egress restrictions for HTTP Request nodes
