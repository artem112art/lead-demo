# Test Cases

All fixture data is synthetic. Scores are deterministic and checked by `npm test`.

| ID | Fixture | Expected score / tier | Expected result |
|---|---|---|---|
| A | `samples/hot_lead.json` | `100 / HOT` | `NEEDS_APPROVAL`, then `HANDOFF_SENT` after APPROVE |
| B | `samples/warm_lead.json` | `50 / WARM` | `FOLLOW_UP_SCHEDULED`, then mock follow-up after configured delay |
| C | `samples/cold_lead.json` | `0 / COLD` | `STORED`; no immediate notification |
| D | `samples/invalid_lead.json` | not scored | HTTP `422`, `VALIDATION_FAILED`, audited |
| E | `samples/duplicate_lead.json` | not re-scored | Run after A; returns A's existing `lead_id` with `DUPLICATE` |
| F | `samples/failure_lead.json` | `100 / HOT` | After APPROVE, three failed handoff attempts and `DEAD_LETTER` |

## Manual workflow test

1. Start Docker Compose and import all workflows.
2. Configure `Demo — ERROR_HANDLER` as the error workflow for intake and approval.
3. Publish intake and approval.
4. POST fixture A. Save `lead_id` and `resume_url` from the HTTP `202` response.
5. POST APPROVE to `/webhook/demo-lead-approval` with both values.
6. Verify `HANDOFF_SENT` in `http://localhost:8080/debug/state`.
7. Repeat fixture A with fixture E and verify the original ID is returned.
8. Run B with `FOLLOWUP_DELAY_MINUTES=1`; verify `FOLLOW_UP_SENT` after the Wait node resumes.
9. Run C and verify no notification entry is created.
10. Run D and verify HTTP `422` plus a `VALIDATED / ERROR` audit record.
11. Run F, approve it, and verify the attempt counter reaches three and the lead is `DEAD_LETTER`.

## Automated repository checks

`npm test` performs:

- JSON parse and n8n export-shape checks;
- node ID/name uniqueness and connection target validation;
- credential-reference and common secret-pattern scans;
- all six fixture assertions;
- duplicate lookup against a temporary mock store;
- CRM upsert, audit, notification, simulated failure, and dead-letter API checks;
- local HTML link resolution checks.

The automated checks do not claim a full n8n execution unless the workflows are imported and run in n8n. Import verification is performed separately through the n8n CLI during release validation.
