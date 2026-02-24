# ADR-0002: OpenAPI Sync and Linked Contract Validation

## Status

Accepted

## Context

Second Brain frontend and backend are split across repositories. Contract drift can occur when:

- backend OpenAPI changes are not propagated to consumers
- linked repos miss required `app.manifest.json` updates
- CI checks run inconsistently across repos

The platform repo needs one repeatable contract-check workflow that can run in advisory mode first and
move to strict mode without code changes.

## Decision

Adopt a unified linked-contract validation workflow in this repository:

- Keep linked repository metadata in `.github/dependent-apps.json`.
- Validate linked manifests with `scripts/ci/validate-linked-repo-manifests.mjs`.
- Validate linked backend OpenAPI snapshots with `scripts/contracts/sync-linked-openapi-snapshots.mjs`.
- Provide a single extracted runner: `scripts/ci/validate-linked-contracts.mjs`.
- Drive strictness through CI variables:
  - `LINKED_MANIFESTS_STRICT`
  - `LINKED_OPENAPI_STRICT`

OpenAPI snapshot sync/check is standardized with `scripts/contracts/sync-openapi-contract.mjs`.

## Consequences

### Positive

- One command can validate linked contracts locally and in CI.
- Strictness can be enabled per contract type without editing workflow code.
- Contract drift readiness is explicit and documented.

### Negative

- External repo publication latency (missing files/404) still blocks strict mode adoption.
- Additional config complexity in `.github/dependent-apps.json`.
