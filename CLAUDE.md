# CLAUDE.md — design-system

TurboRepo + pnpm workspaces. Publishes `@nikolayvalev/design-system`, hosts
Storybook and the command panel, and acts as the **platform repo** that owns the
contracts other repositories are validated against.

Package manager is **pnpm** (`pnpm@9.15.0`). Run everything from the repo root;
Turbo fans out to the workspaces.

## Commands

| Task | Command |
|---|---|
| Build / dev / lint / typecheck | `pnpm build` \| `pnpm dev` \| `pnpm lint` \| `pnpm typecheck` |
| Design tests (all three) | `pnpm test:design` |
| — stories | `pnpm test:stories` |
| — vision registry | `pnpm test:vision` |
| — visual snapshots | `pnpm test:visual` (`:update` to re-baseline) |
| Storybook | `pnpm storybook` \| `pnpm storybook:build` |
| Format | `pnpm format` \| `pnpm format:check` |
| Release | `pnpm changeset` → `pnpm version-packages` → `pnpm release` |
| Prod smoke | `pnpm smoke:prod` |

## Contracts

Anything touching OpenAPI, error envelopes, app manifests or
`.github/dependent-apps.json` goes through the **`contract-sync`** skill
(`.claude/skills/contract-sync/`). The short version: run
`pnpm validate:linked-contracts` before pushing, and never flip
`LINKED_MANIFESTS_STRICT` / `LINKED_OPENAPI_STRICT` without first running
`pnpm report:linked-contract-readiness`.

Design decisions are recorded in `docs/ADR/` — ADR-0002 covers the linked
contract workflow.

## Consumers

- **`PersonalRouter`** consumes the published npm package. Component and token
  changes reach it by publishing, not by local linking.
- **`second-brain-ui`** validates its generated client against a snapshot synced
  from here; drift reds CI on both sides.
- The `strata` entry in `.github/dependent-apps.json` points at `kami_times`,
  which is **archived and no longer on disk**. All its `required*` flags are
  `false`. If it starts failing, remove the entry.

## Conventions

- Tickets, branches and commits follow the **`linear-ticket-flow`** skill (team `NIK`).
- CI hardening added Aug–Sep 2026: deploy-secret validation (including
  leading/trailing whitespace), prod-domain smoke checks, and a 15-minute uptime
  probe that opens an issue on failure. Deploy secrets are validated by
  `scripts/ci/validate-deploy-secrets.mjs` — keep it passing rather than
  loosening it.
