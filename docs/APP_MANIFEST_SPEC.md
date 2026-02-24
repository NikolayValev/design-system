# App Manifest Specification (v2)

Each app must define `app.manifest.json` at its root and use `manifestVersion: 2`.

## Required Fields

```json
{
  "manifestVersion": 2,
  "id": "game",
  "displayName": "Game",
  "domain": "interactive-learning",
  "topology": "monorepo",
  "frontend": {
    "framework": "nextjs",
    "path": "apps/game"
  },
  "backend": {
    "framework": "fastapi",
    "serviceName": "game-api"
  },
  "contracts": {
    "designSystem": "@nikolayvalev/design-system",
    "auth": "@repo/auth",
    "state": "@repo/state"
  },
  "environments": ["preview", "production"],
  "owners": {
    "team": "core-platform",
    "contact": "platform@local"
  }
}
```

## Polyrepo Variant (Second Brain Pattern)

Use `topology: "polyrepo"` when frontend and backend live in separate repositories.
For this topology, include repository URLs and an OpenAPI contract reference:

```json
{
  "manifestVersion": 2,
  "id": "second-brain",
  "displayName": "Second Brain",
  "domain": "knowledge-management",
  "topology": "polyrepo",
  "frontend": {
    "framework": "nextjs",
    "path": ".",
    "repository": "https://github.com/NikolayValev/second-brain-ui"
  },
  "backend": {
    "framework": "fastapi",
    "serviceName": "second-brain-api",
    "repository": "https://github.com/NikolayValev/SecondBrain"
  },
  "contracts": {
    "designSystem": "@nikolayvalev/design-system",
    "auth": "@repo/auth",
    "state": "@repo/state",
    "openapi": "openapi/openapi.json"
  },
  "environments": ["preview", "production"],
  "owners": {
    "team": "second-brain",
    "contact": "second-brain@local"
  }
}
```

## Why This Exists

- Makes app boundaries machine-readable.
- Lets CI enforce architectural contracts.
- Supports monorepo and polyrepo app topologies with one contract.
- Improves onboarding by documenting app intent and dependencies.

## Validation

Monorepo app validation:

```bash
node scripts/apps/validate-app.mjs --app <id> --path apps/<id> --mode build
```

Polyrepo manifest generation helper:

```bash
node scripts/apps/new-polyrepo-manifest.mjs --id <id> --name "<display-name>" --domain <domain> --frontend-repo <url> --backend-repo <url>
```

External/polyrepo manifest validation:

```bash
node scripts/apps/validate-external-manifest.mjs --manifest <path-or-url> --app <id>
```

Bulk linked-repo validation (from `.github/dependent-apps.json`):

```bash
node scripts/ci/validate-linked-repo-manifests.mjs
```

Strict mode:

```bash
node scripts/ci/validate-linked-repo-manifests.mjs --strict
```

Combined linked contract checks:

```bash
pnpm validate:linked-contracts
```

Related OpenAPI snapshot utility:

```bash
pnpm contracts:openapi:sync -- --source-path ../SecondBrain/openapi/openapi.json --out openapi/second-brain.openapi.snapshot.json
```
