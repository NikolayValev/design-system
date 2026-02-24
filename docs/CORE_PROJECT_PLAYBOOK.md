# Core Project Playbook

## Mission

Build one coherent platform with shared primitives and predictable delivery:

- Design consistency through `@nikolayvalev/design-system`
- Authentication consistency through `@repo/auth`
- State consistency through `@repo/state`
- Deployment consistency through GitHub Actions + Terraform

## Platform Shape

- `apps/game`: interactive product surface
- `apps/second-brain`: knowledge workflow product
- `apps/strata`: consultancy operations product
- `packages/*`: reusable platform contracts and shared tooling
- `infra/terraform`: deployment architecture as code

## Engineering Rules

- Every app must carry a manifest v2 `app.manifest.json`.
- Every app must depend on the shared contracts (`design-system`, `auth`, `state`).
- Design system changes must pass dependent-app dry-run validation.
- Infrastructure changes must pass `terraform fmt` and `terraform validate` in CI.

## Iteration Loop

1. Plan change in an issue or RFC.
2. Implement in a feature branch.
3. Run local quality checks.
4. Open PR with architecture and risk notes.
5. Merge only after CI + review pass.

## Definition Of Done

- Code merged and CI green.
- Docs updated for any architectural or contract changes.
- Changeset added for public package changes.
- Rollout and rollback notes captured for infra-affecting changes.

## Local Command Set

```bash
pnpm install
pnpm turbo run build
pnpm turbo run typecheck
pnpm turbo run lint
pnpm validate:platform-contracts
node scripts/ci/dry-run-design-system-impact.mjs
```
