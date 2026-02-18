# Platform Pipeline

## Unified CI/CD

### 1) Core CI (`.github/workflows/ci.yml`)

- Runs build, typecheck, lint, and design-system export validation.
- Detects changes under `packages/design-system/**`.
- If design system changed, runs dependent app impact checks using:
  - `.github/dependent-apps.json`
  - `scripts/ci/dry-run-design-system-impact.mjs`
- Enforces all required apps listed in `.github/dependent-apps.json` (Game, Second Brain, Strata).

This catches breakages in downstream apps before deployment.

Each app dry-run build also validates contract files:

- `app.manifest.json`
- required shared dependencies (`design-system`, `auth`, `state`)

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
- App contract validation helper: `scripts/apps/validate-app.mjs`

Start with:

```bash
cd infra/terraform
cp environments/preview/terraform.tfvars.example terraform.tfvars
terraform init
terraform plan
```
