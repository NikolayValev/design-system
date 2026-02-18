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

After that, replace `src/main.ts` with real Next.js app code while keeping the manifest contract intact.

