# Runbook: Contract Drift

## Trigger

Use this runbook when linked contract checks fail in CI:

- linked manifest validation fails
- linked backend OpenAPI snapshot check fails
- OpenAPI sync check reports snapshot drift

## Triage

1. Identify failing validation from CI logs.
2. Re-run locally:
   - `pnpm validate:linked-contracts`
   - `pnpm contracts:openapi:check -- --source-path <backend-openapi-file> --out openapi/second-brain.openapi.snapshot.json`
3. Confirm whether failure is:
   - missing upstream file (404)
   - snapshot drift
   - malformed manifest/OpenAPI document

## Mitigation

1. If upstream file is missing:
   - publish `app.manifest.json` and/or `openapi/openapi.json` in linked repo.
   - keep strict flags disabled until published.
2. If snapshot drift:
   - sync snapshot:
     - `pnpm contracts:openapi:sync -- --source-path <backend-openapi-file> --out openapi/second-brain.openapi.snapshot.json`
   - commit updated snapshot.
3. If manifest invalid:
   - fix against `docs/APP_MANIFEST_SPEC.md`.
   - validate with `node scripts/apps/validate-external-manifest.mjs --manifest <path-or-url> --app <id>`.

## Verification

1. Run:
   - `pnpm validate:linked-contracts`
   - `pnpm validate:linked-contracts -- --strict-manifests --strict-openapi` (once upstream is ready)
2. Confirm CI passes on next run.

## Rollback

If a strict-mode rollout causes repeated failures:

1. Temporarily set CI vars to advisory mode:
   - `LINKED_MANIFESTS_STRICT=false`
   - `LINKED_OPENAPI_STRICT=false`
2. Open follow-up issue to restore strict mode after upstream fixes.
