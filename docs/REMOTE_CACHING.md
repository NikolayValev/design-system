# Remote Caching Setup

Turborepo supports remote caching to share build artifacts across machines — local development, CI, and teammates.

## Vercel Remote Cache (Recommended)

### 1. Link to Vercel

```bash
npx turbo login
npx turbo link
```

This authenticates with your Vercel account and links the repository to a Vercel project for remote caching.

### 2. CI/CD Setup (GitHub Actions)

Add two secrets/variables to your GitHub repository:

| Name         | Where to set   | Value                              |
| ------------ | -------------- | ---------------------------------- |
| `TURBO_TOKEN` | Repository secret | Generate at [vercel.com/account/tokens](https://vercel.com/account/tokens) |
| `TURBO_TEAM`  | Repository variable | Your Vercel team slug (e.g. `nikolayvalev`) |

The CI workflow (`.github/workflows/ci.yml`) is already configured to use these via:

```yaml
env:
  TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
  TURBO_TEAM: ${{ vars.TURBO_TEAM }}
```

### 3. Verify Remote Cache

After linking, run a build and check for remote cache hits:

```bash
pnpm turbo run build --summarize
```

Look for `Cached (Remote) = true` in the output.

## Self-Hosted Remote Cache (Alternative)

If you prefer not to use Vercel, you can run a self-hosted cache server compatible with the Turbo Remote Cache API:

- [ducktors/turborepo-remote-cache](https://github.com/ducktors/turborepo-remote-cache)
- [fox1t/turborepo-remote-cache](https://github.com/fox1t/turborepo-remote-cache)

Configure in `turbo.json`:

```jsonc
{
  // ... existing config
  "remoteCache": {
    "apiUrl": "https://your-cache-server.example.com"
  }
}
```

Then set `TURBO_TOKEN` and `TURBO_TEAM` environment variables locally or in CI.
