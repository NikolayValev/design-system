# App Manifest Specification

Each app must define `app.manifest.json` at its root.

## Required Fields

```json
{
  "id": "game",
  "displayName": "Game",
  "domain": "interactive-learning",
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
  "environments": ["preview", "production"]
}
```

## Why This Exists

- Makes app boundaries machine-readable.
- Lets CI enforce architectural contracts.
- Improves onboarding by documenting app intent and dependencies.

## Validation

Validated by:

```bash
node scripts/apps/validate-app.mjs --app <id> --path apps/<id> --mode build
```

