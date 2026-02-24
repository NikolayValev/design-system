# OpenAPI Snapshots

This folder stores committed OpenAPI snapshot files used for contract drift checks.

Default snapshot target for Second Brain:

- `openapi/second-brain.openapi.snapshot.json`

Sync from a source file:

```bash
pnpm contracts:openapi:sync -- --source-path ../SecondBrain/openapi/openapi.json
```

Check drift (CI-safe):

```bash
pnpm contracts:openapi:check -- --source-path ../SecondBrain/openapi/openapi.json
```

Sync from URL:

```bash
pnpm contracts:openapi:sync -- --source-url https://example.com/openapi.json
```

Check configured linked backend OpenAPI sources from `.github/dependent-apps.json`:

```bash
pnpm contracts:linked-openapi:check
```

Run linked manifest + linked OpenAPI checks together:

```bash
pnpm validate:linked-contracts
```

Run full platform contract checks:

```bash
pnpm validate:platform-contracts
```
