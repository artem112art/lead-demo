# Deployment

## Docker Compose (recommended for review)

1. Copy `.env.example` to `.env`.
2. Replace `N8N_ENCRYPTION_KEY` with a random value.
3. Run `docker compose up -d`.
4. Open `http://localhost:5678` and create the local owner account.
5. Import the three files under `workflows/`.
6. In the intake and approval workflow settings, select `Demo — ERROR_HANDLER` as the error workflow.
7. Publish the intake and approval workflows.

The Compose file pins stable n8n `2.40.7` for reproducibility. Review upstream release notes before upgrading.

## Existing local n8n

Run the mock adapter separately:

```bash
npm run mock
```

Set `MOCK_API_BASE_URL=http://host.docker.internal:8080` when n8n runs in Docker, or `http://localhost:8080` when n8n runs directly on the host. Import workflow JSON from the UI or CLI.

## CLI import

Inside the n8n container:

```bash
n8n import:workflow --input=/files/workflows/lead_intake.json
n8n import:workflow --input=/files/workflows/approval_handler.json
n8n import:workflow --input=/files/workflows/error_handler.json
```

CLI import verifies workflow structure but does not publish workflows or resolve the error-workflow relationship. Configure those in the UI after import.

## Webhook configuration

Local endpoints:

- `POST http://localhost:5678/webhook/demo-lead`
- `POST http://localhost:5678/webhook/demo-lead-approval`

Behind a reverse proxy, set `WEBHOOK_URL` to the external HTTPS origin. Keep `APPROVAL_ALLOWED_HOSTS` aligned with that public host and use `APPROVAL_INTERNAL_BASE_URL` for the internal n8n service URL.

## Replace mock storage

Replace `CRM Duplicate Lookup` and each `CRM ...` HTTP node with the target service. Preserve these behaviors:

- lookup before create;
- idempotent upsert by `lead_id`;
- status and `error_count` updates;
- retry only safe/idempotent operations;
- append-only audit writes.

For Google Sheets, use a dedicated sheet ID and lookup column. For HubSpot, use email as a contact key and store `lead_id` as a custom property. For Airtable or Notion, enforce a unique `lead_id` field at the adapter layer.

## Connect real messaging later

The exported workflows intentionally contain no credentials. In a production copy:

1. Create credentials in n8n or an external secret manager.
2. Replace one adapter Code node with the official service node or a signed HTTP request.
3. Enable only that channel's environment toggle.
4. Add an idempotency key based on `lead_id` and action.
5. Keep demo mode disabled only in the isolated production environment.
6. Test against sandbox recipients before any real destination.

## Operations

Back up the n8n database and encryption key together. Monitor waiting executions, retry exhaustion, and dead-letter growth. Define retention for webhook payloads because they may contain personal data in a real deployment.
