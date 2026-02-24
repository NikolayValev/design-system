# Storybook Workspace

This app documents and previews components from `@nikolayvalev/design-system`.

## Run

```bash
pnpm --filter @apps/storybook dev
```

## Build Static Storybook

```bash
pnpm --filter @apps/storybook build
```

Output is generated in `apps/storybook/dist/storybook`.

## Public Endpoint (Vercel)

This workspace is deployed as a static Vercel site from this repo, then proxied by the MCP project so it is served at:

- `https://designsystem.nikolayvalev.com/storybook`
- Domain route contract: `docs/PUBLIC_PORTAL.md`

Setup:

1. Create/link a Vercel project with root directory `apps/storybook`.
2. Set build command to `pnpm run build` (or rely on `vercel.json`).
3. Set output directory to `dist/storybook` (or rely on `vercel.json`).
4. Add `VERCEL_PROJECT_ID_STORYBOOK` to GitHub secrets so `.github/workflows/monorepo-deploy.yml` can deploy it on `main`.
5. In the `design-system-mcp` Vercel project, set env var `STORYBOOK_ORIGIN` to the Storybook project URL (for example `https://<storybook-project>.vercel.app`).

Do not set `STORYBOOK_ORIGIN` to `https://designsystem.nikolayvalev.com/storybook`; use the upstream Storybook project URL.

## Validation Commands

```bash
# Storybook interaction/smoke checks
pnpm --filter @apps/storybook test:stories:ci

# Vision propagation + registry behavior checks
pnpm --filter @apps/storybook test:vision

# Visual regression snapshots
pnpm --filter @apps/storybook test:visual
```
