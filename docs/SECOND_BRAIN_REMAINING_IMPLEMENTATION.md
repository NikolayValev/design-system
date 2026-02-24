# Second Brain Remaining Implementation Guide

## Purpose
This document captures the remaining implementation work after the initial Phase 1 foundation slice.
It is intended to be execution-ready for continuing the 12-week plan across:

- Backend: `SecondBrain` (FastAPI)
- Frontend: `second-brain-ui` (Next.js)
- Platform contracts/tooling: `design-system` (this repo)

## Execution Log (2026-02-24)

### Next Steps (Platform Repo)

1. [ ] Publish manifest v2 files in linked repos and switch linked-manifest validation to strict mode.
2. [ ] Publish backend OpenAPI snapshots/endpoints in linked repos and switch linked OpenAPI checks to strict mode.
3. [ ] Publish linked error-envelope sample fixtures and switch linked error-envelope checks to strict mode.
4. [ ] Integrate error-envelope schema checks in backend/frontend CI pipelines.
5. [x] Capture one ADR for OpenAPI sync workflow + one runbook for contract-drift incident response.

### Latest Readiness Snapshot (2026-02-24)

Source: `pnpm report:linked-contract-readiness:write`

- `game`: manifest not-ready (`404`), error-envelope sample not-ready (`404`)
- `second-brain-api`: manifest not-ready (`404`), OpenAPI not-ready (`404`), error-envelope sample not-ready (`404`)
- `second-brain-ui`: manifest not-ready (`404`), error-envelope sample not-ready (`404`)
- `strata`: manifest not-ready (`404`), error-envelope sample not-ready (`404`)

Strict readiness summary:

- Manifests: `not-ready`
- Linked backend OpenAPI: `not-ready`
- Linked error-envelope: `not-ready`

## Current Baseline (Already Implemented)

- Session auth endpoints exist in backend (`/auth/register`, `/auth/login`, `/auth/logout`, `/auth/me`)
- Notes + collections CRUD endpoints exist in backend (`/notes`, `/collections`)
- OpenAPI contract export pipeline exists in backend (`openapi/openapi.json`)
- Frontend has contract snapshot + generated client types
- Frontend has same-origin proxy routes for session/notes/collections
- Frontend workspace route exists (`/workspace`)
- Basic CI pipelines exist in backend and frontend
- ADR + runbook were started in backend

## Remaining Scope by Phase

## Phase 2: Production Vertical Completion (Weeks 3-6)

### A) Backend (`SecondBrain`)

1. Harden auth/session model
- Add session rotation on login and optional rotation on privileged actions.
- Add explicit session revoke-all endpoint per user.
- Add stronger brute-force protection:
  - IP + email keyed limiter
  - configurable lockout window
- Add password policy checks (length, complexity, breached-password optional check).

2. Notes domain maturity
- Add pagination to notes list (`cursor` or `offset` + `limit`).
- Add note metadata fields:
  - `archived_at`
  - `deleted_at` (soft delete)
- Add optimistic concurrency (`version` field or `updated_at` precondition).
- Add input/output contracts for error cases (400/401/403/404/409).

3. Collections domain maturity
- Add unique collection names per user.
- Add collection note count in list responses.
- Add bulk note assignment endpoint for collections.

4. Search contract alignment
- Add note-first search endpoint for the workspace vertical:
  - `GET /notes/search?q=...`
  - optional `collection_id`
  - optional pagination
- Keep existing vault/FTS endpoints as separate concern.

5. Database and migration discipline
- Move platform tables under Alembic migrations.
- Add migration policy docs:
  - expand/contract steps
  - rollback-safe migration patterns
- Add seed script for local dev/demo users.

### B) Frontend (`second-brain-ui`)

1. Replace temporary workspace UX with production-ready flows
- Add dedicated auth screens:
  - `/login`
  - `/register`
- Move from minimal forms to reusable components and error states.

2. Notes UX completeness
- Implement list/detail/edit/delete with optimistic updates.
- Add note editor autosave strategy (debounced PATCH).
- Add empty states, loading skeletons, retry states.

3. Collections UX completeness
- Create/update/delete collections UI.
- Add note-to-collection assignment UI (single and bulk).

4. Search UX
- Add combined search entrypoint on dashboard.
- Add keyboard shortcut (`/` or `Cmd+K`) for note search.

5. Frontend architecture cleanup
- Standardize API calls through a single service layer (`lib/workspace-api.ts` + feature modules).
- Remove duplicated direct fetches where generated contract client can be used.
- Add server-action or route-handler boundaries intentionally (document each choice).

### C) Cross-Repo Contract Workflow

1. Contract synchronization
- Define canonical source: backend OpenAPI file.
- Add explicit sync script in frontend that can pull from:
  - local backend URL
  - checked-out backend path
- Fail CI if generated types are stale.

2. Error model contract
- Standardize error envelope:
- `error.code`
- `error.message`
- `error.request_id`
- Enforce in backend responses + frontend parser.

## Phase 3: CI/CD and Reliability Hardening (Weeks 7-9)

### A) Backend CI/CD (`SecondBrain`)

1. Add full CI matrix
- `lint` (targeted first, then full once debt is reduced)
- `tests` (unit + integration)
- `contract` (OpenAPI generation drift)
- `migration-check` (upgrade + downgrade in ephemeral DB)

2. Add containerized deploy pipeline
- Build/push Docker image.
- Promote preview -> production via environment gates.
- Run migration step before app rollout.

3. Rollback mechanics
- Document and automate rollback command path:
  - previous image deploy
  - migration-compatible rollback policy

### B) Frontend CI/CD (`second-brain-ui`)

1. Strengthen pipeline
- Keep lint, unit, build, contract checks.
- Expand Playwright suite to authenticated workflow smoke:
  - login/register
  - create note
  - edit note
  - assign collection

2. Preview quality gates
- Require e2e pass on preview before production promotion.
- Add performance budget check (Lighthouse or custom thresholds).

3. Vercel deployment strategy
- Preview deploy for PRs.
- Production deploy only from protected branch/tag.
- Add rollback playbook for bad production release.

### C) Platform Repo (`design-system`) Integration

1. Keep this repo as standards/orchestration source
- [x] Update `docs/APP_MANIFEST_SPEC.md` with manifest v2 fields used by Second Brain repos.
- [x] Add polyrepo variant docs in `docs/PLATFORM_PIPELINE.md`:
  - how backend/frontend repos consume shared contract standards.

2. Generator evolution
- [x] Update scaffold script strategy documentation:
  - monorepo mode (existing)
  - polyrepo mode (new reference flow)

3. Contract validation utility
- [x] Add optional validator script that can validate external repo manifests using the same schema.

### Platform Slice Status (Updated: 2026-02-24)

Completed in this repo:

- Added shared manifest v2 validation contract at `scripts/apps/manifest-contract.mjs`.
- Refactored monorepo validator to consume the shared contract (`scripts/apps/validate-app.mjs`).
- Added external/polyrepo validator (`scripts/apps/validate-external-manifest.mjs`).
- Updated app scaffolding + existing app manifests to v2 fields.
- Added linked-repository manifest validator (`scripts/ci/validate-linked-repo-manifests.mjs`) and wired it into CI (advisory mode).
- Added strict mode for linked-repository validation once external repos publish manifests.
- Added polyrepo manifest generator helper (`scripts/apps/new-polyrepo-manifest.mjs`).
- Added OpenAPI sync + drift-check tooling (`scripts/contracts/sync-openapi-contract.mjs`) with optional CI hook.
- Added standardized error envelope contract schema + validator utility.
- Added linked backend OpenAPI sync/check automation from `linkedRepositories` config.
- Added CI strict-mode toggles for linked manifests/OpenAPI (`LINKED_MANIFESTS_STRICT`, `LINKED_OPENAPI_STRICT`).
- Extracted linked manifest/OpenAPI checks into one runner (`scripts/ci/validate-linked-contracts.mjs`).
- Added ADR-0002 for OpenAPI sync and linked validation workflow.
- Added contract drift runbook (`docs/RUNBOOK_CONTRACT_DRIFT.md`).
- Added `.github/dependent-apps.json` schema-level validator and wired it into CI.
- Added linked contract readiness report command (`pnpm report:linked-contract-readiness`).
- Added umbrella platform contract validation command (`pnpm validate:platform-contracts`) and CI integration.
- Added CI visibility step that reports strict-readiness status for linked contracts each run.
- Added linked error-envelope sample validation (advisory/strict) with CI strict toggle support.
- Extended linked readiness reporting to include error-envelope strict readiness.
- Added Markdown export for linked readiness report and CI artifact upload.

## Phase 4: Observability + Portfolio Packaging (Weeks 10-12)

### A) Observability

1. Tracing
- Add OpenTelemetry to backend request lifecycle.
- Propagate trace/request IDs to frontend and logs.

2. Structured logging
- Ensure JSON logs across backend and frontend route handlers.
- Include fields:
  - `timestamp`
  - `request_id`
  - `user_id` (when available)
  - `route`
  - `latency_ms`

3. Error reporting
- Integrate Sentry in both repos.
- Add release + environment tags.
- Add alert routing for high severity failures.

### B) Portfolio Evidence

1. Architecture decision records
- Add ADRs for:
  - session strategy
  - database ownership
  - OpenAPI contract workflow
  - deploy topology (Vercel + App Runner)

2. Runbooks
- Add incident response runbooks for:
  - auth outage
  - database migration failure
  - contract drift break

3. Demonstration assets
- Capture end-to-end demo script and artifacts:
  - short architecture diagram
  - GIF/video of full workflow
  - CI screenshot showing gates

## Backlog and Debt Reduction (Parallel Track)

1. Backend lint debt
- Current repo has substantial historical Ruff debt.
- Use incremental cleanup:
  - start with touched files + new modules
  - then package-by-package cleanup

2. Frontend warning cleanup
- Resolve existing ESLint warnings in legacy ask route/page.
- Keep zero-error policy and drive toward zero-warning policy.

## Acceptance Criteria for “Plan Complete”

All items below must be true:

1. Product vertical
- Authenticated user can create, update, search, organize, and delete notes in production.

2. Contract discipline
- Backend OpenAPI is committed and authoritative.
- Frontend generated types are always in sync and CI-enforced.

3. Delivery rigor
- Backend and frontend CI pipelines block merge on regressions.
- Preview and production deployment flows are documented and operational.

4. Operational readiness
- Request-level tracing/logging/error monitoring is active.
- Rollback/runbook procedures are tested at least once.

5. Seniority signal
- Public docs clearly explain tradeoffs, architecture choices, and operational discipline.

## Recommended Execution Order (Next 2 Weeks)

1. Phase 2 auth hardening + notes pagination/mutations.
2. Phase 2 frontend workflow completion (note editing + collection assignment).
3. Contract + error envelope unification.
4. Expand e2e tests to authenticated CRUD flow.
5. Prepare migration/deploy guardrails before broader feature expansion.
