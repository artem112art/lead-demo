# Architecture

```text
POST /webhook/demo-lead
          |
          v
     Validation -------------------- invalid ----> Audit ----> HTTP 422
          |
          v
    Normalization
          |
          v
   Duplicate Check ---------------- duplicate ---> Audit ----> existing lead_id
          |
          v
 Scoring + deterministic summary
          |
          +---- HOT ---> Persist ---> Approval request ---> Wait webhook
          |                                         APPROVE / REJECT
          |                                                |
          |                         APPROVE ---> CRM ---> Adapter chain ---> Handoff
          |                         REJECT  ---> CRM ---> Audit
          |
          +---- WARM --> CRM ---> HTTP 202 ---> configurable Wait ---> mock follow-up
          |
          +---- COLD --> CRM ---> Audit ---> HTTP 201
                                  |
                                  v
                              Audit log

 retry exhaustion / unexpected failure ---> ERROR_HANDLER ---> Dead letter + Audit
```

## Components

| Component | Responsibility | Durable boundary |
|---|---|---|
| Lead intake workflow | Contract validation, normalization, score, routing, state transitions | CRM upsert before Wait or notification |
| Approval handler | Validate decision and safely resume one waiting execution | n8n execution database |
| Error handler | Normalize automatic-execution failures | Dead-letter record and audit event |
| Mock API | CRM, audit, notification, and dead-letter abstraction | Atomic JSON-file replacement |

## Lead state model

```text
RECEIVED
  -> VALIDATION_FAILED
  -> DUPLICATE
  -> QUALIFIED
       -> NEEDS_APPROVAL -> APPROVED -> HANDOFF_SENT
       |                 -> REJECTED
       -> FOLLOW_UP_SCHEDULED -> FOLLOW_UP_SENT
       -> STORED

Any downstream terminal failure -> DEAD_LETTER
```

## Persistence contract

The adapter stores the following portable fields:

`lead_id`, `created_at`, `name`, `company`, `email`, `phone`, `service`, `budget`, `source`, `lead_score`, `lead_tier`, `status`, `summary`, `approved`, `last_action`, `error_count`.

Additional demo fields (`score_reasons`, `approval_at`, `adapter_results`) are additive and can be mapped to CRM notes or an audit table.

## Reliability decisions

- Validation errors are data, not thrown exceptions.
- Duplicate detection happens before qualification side effects.
- A qualified lead is persisted before approval or follow-up work.
- Every external HTTP node has a bounded three-attempt retry policy.
- Expected adapter exhaustion is routed to a replayable dead-letter record.
- Unexpected automatic-execution errors are captured by the Error Trigger workflow.
- `lead_id` is the correlation key across CRM, audit, notifications, and errors.
- The approval handler validates both the URL host and `/webhook-waiting/` path before calling it, reducing SSRF exposure.

## Production upgrade path

For a multi-instance deployment, move the mock JSON store to a transactional database, use queue mode, enforce authenticated approval callbacks, and add idempotency keys at every external adapter. Keep audit records append-only and redact sensitive payload fields before observability export.
