# Core Platform Roadmap

## Phase 1: Foundation (Now)

- Lock shared contracts (`@repo/auth`, `@repo/state`, design system).
- Keep CI strict for contract drift.
- Stand up Terraform modules for frontend and backend targets.
- Define app manifests for Game, Second Brain, and Strata.

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

