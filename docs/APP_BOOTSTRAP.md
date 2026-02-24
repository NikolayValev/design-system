# App Bootstrap Guide

Create a new app scaffold:

```bash
node scripts/apps/new-app.mjs --id client-portal --name "Client Portal" --domain "consultancy-ops"
```

This generates:

- `apps/<id>/package.json`
- `apps/<id>/app.manifest.json`
- `apps/<id>/README.md`
- `apps/<id>/src/main.ts`

Then validate:

```bash
pnpm --filter @apps/<id> build
pnpm --filter @apps/<id> typecheck
pnpm --filter @apps/<id> lint
```

The scaffold emits manifest v2 (`manifestVersion: 2`, `topology: "monorepo"`).
After that, replace `src/main.ts` with real Next.js app code while keeping the manifest contract intact.

## Polyrepo Manifest Bootstrap (Reference)

Create a manifest v2 file for split frontend/backend repos:

```bash
node scripts/apps/new-polyrepo-manifest.mjs \
  --id second-brain \
  --name "Second Brain" \
  --domain knowledge-management \
  --frontend-repo https://github.com/NikolayValev/second-brain-ui \
  --backend-repo https://github.com/NikolayValev/SecondBrain
```

Then validate it:

```bash
node scripts/apps/validate-external-manifest.mjs --manifest app.manifest.json --app second-brain
```
