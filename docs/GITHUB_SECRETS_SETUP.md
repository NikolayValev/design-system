# GitHub Secrets Setup

All CI/CD is handled by two workflows:

- **`release.yml`** — publishes npm packages via Changesets
- **`monorepo-deploy.yml`** — deploys apps/packages to Vercel

Both require secrets configured at **Settings → Secrets and variables → Actions** in your GitHub repo.

---

## Required secrets

### npm publishing (`release.yml`)

| Secret | Value |
| --- | --- |
| `NPM_TOKEN` | npm automation token. Create at npmjs.com → Account → Access Tokens → Generate New Token → **Automation**. Copy the raw `npm_…` value. |

### Vercel deployments (`monorepo-deploy.yml`)

| Secret | Value |
| --- | --- |
| `VERCEL_TOKEN` | Vercel personal access token. Create at vercel.com → Settings → Tokens. |
| `VERCEL_ORG_ID` | `team_cdPyQNoQWU4a7VqcxHcotDLm` |
| `VERCEL_PROJECT_ID_DESIGN_SYSTEM_MCP` | `prj_wx3jdcy1uR5nCyByCdWllmJ1BqLh` |
| `VERCEL_PROJECT_ID_STORYBOOK` | Vercel project ID for the `storybook` app (create via `vercel link` in `apps/storybook`) |

> The `design-system` Vercel project (`prj_iHsjr9uW1WdibFDfbkiiOrEu2T4H`) is deployed via
> Vercel's native GitHub integration — it does **not** need a secret.

---

## How to find a Vercel project ID

```bash
# Option 1: Vercel CLI
vercel link   # run inside the app directory, then read .vercel/project.json

# Option 2: Vercel dashboard
# Open the project → Settings → General → Project ID
```

---

## Adding a secret

1. Go to your repo on GitHub
2. **Settings → Secrets and variables → Actions → New repository secret**
3. Name: one of the secret names above
4. Value: paste the raw value (no quotes, no extra whitespace)
5. Save

---

## Verifying

After adding secrets, push any commit to `main`. The `monorepo-deploy.yml` run will show
"Skipped" for any app whose secret is still missing, and "Deployed" for configured ones.

For npm, the `release.yml` run will print the result of `npm whoami` at step 8 —
a successful auth confirms `NPM_TOKEN` is correctly set.
