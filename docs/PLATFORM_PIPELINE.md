# Platform Pipeline

## Unified CI/CD

### 1) Core CI (`.github/workflows/ci.yml`)

- Runs build, typecheck, lint, and design-system export validation.
- Detects changes under `packages/design-system/**`.
- If design system changed, runs dependent app impact checks using:
  - `.github/dependent-apps.json`
  - `scripts/ci/dry-run-design-system-impact.mjs`
- Validates platform contracts through one extracted command:
  - `pnpm validate:platform-contracts`
- Enforces all required apps listed in `.github/dependent-apps.json` (Game, Second Brain, Strata).
- Runs linked external manifest validation using:
  - `.github/dependent-apps.json -> linkedRepositories`
  - `scripts/ci/validate-linked-repo-manifests.mjs`
  - extracted runner: `scripts/ci/validate-linked-contracts.mjs`
  - default CI mode is advisory (warnings on missing external manifests)
  - set `LINKED_MANIFESTS_STRICT=true` to enforce strict mode in CI
- Runs linked backend OpenAPI snapshot checks using:
  - `.github/dependent-apps.json -> linkedRepositories[*].openapiPath`
  - `scripts/contracts/sync-linked-openapi-snapshots.mjs`
  - default CI mode is advisory (warnings while linked backends do not publish OpenAPI snapshots)
  - set `LINKED_OPENAPI_STRICT=true` to enforce strict mode in CI
- Runs linked error-envelope sample checks using:
  - `.github/dependent-apps.json -> linkedRepositories[*].errorEnvelopeSamplePath`
  - `scripts/contracts/validate-linked-error-envelopes.mjs`
  - default CI mode is advisory
  - set `LINKED_ERROR_ENVELOPE_STRICT=true` to enforce strict mode in CI
- Emits linked strict-readiness report on each CI run:
  - `pnpm report:linked-contract-readiness`
  - `pnpm report:linked-contract-readiness:write` writes `docs/linked-contract-readiness.md`
  - CI uploads this file as artifact `linked-contract-readiness`

This catches breakages in downstream apps before deployment.

Each app dry-run build also validates contract files:

- `app.manifest.json`
- required shared dependencies (`design-system`, `auth`, `state`)

### 1.1) Polyrepo Contract Checks (Reference Flow)

When an app is split across repositories (for example `second-brain-ui` + `SecondBrain`), validate
the external manifest using the same manifest v2 schema:

```bash
node scripts/apps/validate-external-manifest.mjs --manifest <path-or-url> --app <id>
```

Recommended pattern:

- Keep `design-system` as the standards/orchestration repo.
- Store one `app.manifest.json` per external app repo root.
- Run the external validation command in each repo CI workflow.
- Keep topology as `polyrepo` and include frontend/backend repository URLs.
- Add `manifestId`, `manifestPath`, and `requiredManifest` for each `linkedRepositories` entry.
- Promote to strict checks after manifests are published in external repos:
  - `node scripts/ci/validate-linked-repo-manifests.mjs --strict`

### 1.2) OpenAPI Snapshot Sync + Drift Checks

Canonical source stays in backend repos. This repo can keep committed snapshots for consumer drift checks.

Sync snapshot from backend file:

```bash
pnpm contracts:openapi:sync -- --source-path ../SecondBrain/openapi/openapi.json --out openapi/second-brain.openapi.snapshot.json
```

Sync snapshot from backend URL:

```bash
pnpm contracts:openapi:sync -- --source-url https://example.com/openapi.json --out openapi/second-brain.openapi.snapshot.json
```

Check for drift (CI):

```bash
pnpm contracts:openapi:check -- --source-url https://example.com/openapi.json --out openapi/second-brain.openapi.snapshot.json
```

Check all configured linked backend OpenAPI targets:

```bash
pnpm contracts:linked-openapi:check
```

Run both linked validations together:

```bash
pnpm validate:linked-contracts
```

Run full platform contract checks (dependent config + linked contracts + error-envelope fixture):

```bash
pnpm validate:platform-contracts
```

Check linked error-envelope samples only:

```bash
pnpm contracts:linked-error-envelope:check
```

Workflow support:

- `.github/workflows/ci.yml` includes an optional OpenAPI drift step.
- Enable by setting GitHub repository variable `OPENAPI_SOURCE_URL`.
- Optional secret `OPENAPI_AUTH_HEADER` can be used for protected endpoints.
- Strict toggles:
  - `LINKED_MANIFESTS_STRICT=true`
  - `LINKED_OPENAPI_STRICT=true`
  - `LINKED_ERROR_ENVELOPE_STRICT=true`
  - CI translates these to `validate:platform-contracts -- --strict-*`
- Readiness report helper:
  - `pnpm report:linked-contract-readiness`
  - export Markdown: `pnpm report:linked-contract-readiness:write`
  - includes strict-readiness state for manifests, linked backend OpenAPI, and linked error-envelope samples

### 2) Monorepo Deploy (`.github/workflows/monorepo-deploy.yml`)

- Deploys `game`, `second-brain`, and `strata` apps with Vercel from one workflow.
- Uses per-app matrix entries with app path + Vercel project secret.
- Skips missing apps for deploy (CI impact checks enforce app presence on design-system changes).

Required GitHub secrets:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID_GAME`
- `VERCEL_PROJECT_ID_SECOND_BRAIN`
- `VERCEL_PROJECT_ID_STRATA`

## IaC

Terraform lives in `infra/terraform`.

- Frontends: Vercel project resources
- Backends: AWS App Runner + ECR for FastAPI services
- Validation in CI: `.github/workflows/iac-validate.yml`
- App contract validation helpers:
  - `scripts/apps/validate-app.mjs` (monorepo apps)
  - `scripts/apps/validate-external-manifest.mjs` (polyrepo/external apps)
  - `scripts/ci/validate-linked-repo-manifests.mjs` (bulk linked-repo validation)
  - `scripts/ci/validate-linked-contracts.mjs` (extracted linked validation runner)
  - `scripts/ci/validate-platform-contracts.mjs` (umbrella platform contract runner)
  - `scripts/ci/validate-dependent-apps-config.mjs` (dependent-app config validation)
  - `scripts/contracts/sync-openapi-contract.mjs` (OpenAPI sync + drift checks)
  - `scripts/contracts/sync-linked-openapi-snapshots.mjs` (linked backend OpenAPI checks)
  - `scripts/contracts/validate-linked-error-envelopes.mjs` (linked error-envelope checks)
  - `scripts/contracts/validate-error-envelope.mjs` (error model contract checks)

Start with:

```bash
cd infra/terraform
cp environments/preview/terraform.tfvars.example terraform.tfvars
terraform init
terraform plan
```
