# Core Platform Roadmap

## Phase 1: Foundation (Now)

- Lock shared contracts (`@repo/auth`, `@repo/state`, design system).
- Keep CI strict for contract drift.
- Stand up Terraform modules for frontend and backend targets.
- Define app manifests for Game, Second Brain, and Strata.

## Phase 1.5: Public Portal And DX (In Progress)

- Keep `designsystem.nikolayvalev.com` as the single domain for docs, demo, and integration endpoints.
- Harden portal routes (`/`, `/engineers`, `/recruiters`, `/catalog`, `/docs`, `/storybook`) with uptime checks.
- Ship and version the `design-system init` CLI flow from `@nikolayvalev/design-system`.
- Add release guardrails for npm auth/token health before `changeset publish`.
- Add an end-to-end smoke check that validates Storybook proxy + MCP endpoint from production domain.

## Phase 2: Product Acceleration

- Implement first production vertical in each app.
- Add API contract testing between frontend and FastAPI backends.
- Add visual regression checks for design-system upgrades.
- Add preview environment promotion workflow.

## Phase 3: Reliability And Scale

- Add centralized observability (logs, traces, error budgets).
- Add SLOs per app and service.
- Add deployment progressive rollout and automatic rollback.
- Add governance dashboards (lead time, change failure rate).

## Milestone Checklist

- M1: All three apps deploy from monorepo pipeline.
- M2: Design-system change gates block incompatible app builds.
- M3: Infra changes use PR plan and validated Terraform.
- M4: Release process is automated and repeatable.
- M5: Public portal routes are browsable and monitored on production domain.
- M6: CLI scaffold adoption documented and validated in at least one external consumer repo.
