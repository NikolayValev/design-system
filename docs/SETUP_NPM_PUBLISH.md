# NPM Publish Setup

One package is published to npm under `@nikolayvalev`:

| Package                       | npm                                           |
| ----------------------------- | --------------------------------------------- |
| `@nikolayvalev/design-system` | Components, CLI, VDE visions + per-vision CSS |

The MCP server (`@nikolayvalev/design-system-mcp`) is **not** published to npm — it is marked `private` and ships as a hosted Vercel endpoint, so Changesets skips it.

Publishing is handled by [Changesets](https://github.com/changesets/changesets) via the `release.yml` GitHub Action, which runs on every push to `main`.

---

## One-time setup

### 1. Create an npm automation token

1. Log in to [npmjs.com](https://www.npmjs.com) as the account that owns the `@nikolayvalev` scope
2. **Account → Access Tokens → Generate New Token → Classic Token → Automation**
3. Copy the token (starts with `npm_…`)

> Use a **Classic Automation** token, not a Granular one. Automation tokens authenticate with `npm whoami`, bypass 2FA in CI, and can create new packages in the scope. Granular tokens often return `401` on `whoami` and `E404` on publish (npm masks auth failures as 404).
>
> Verify the token locally before adding it to CI — it should print your username:
>
> ```bash
> printf '//registry.npmjs.org/:_authToken=%s\n' "npm_YOURTOKEN" > /tmp/npmrc
> npm whoami --registry=https://registry.npmjs.org --userconfig /tmp/npmrc
> ```

### 2. Add the token to GitHub secrets

1. Go to your repo on GitHub → **Settings → Secrets and variables → Actions**
2. Click **New repository secret**
3. Name: `NPM_TOKEN`
4. Value: paste the raw token (do NOT wrap it in quotes or prefix with `_authToken=`)
5. Save

That's it — the release workflow will detect it and publish on the next changeset.

---

## Creating a release

```bash
# 1. Stage your changes for release
pnpm changeset

# 2. Pick the packages affected and the bump type (patch / minor / major)
# Changesets writes a markdown file to .changeset/

# 3. Commit and push — the release workflow opens a "Version Packages" PR
git add .changeset && git commit -m "chore: add changeset"
git push

# 4. Merge the "Version Packages" PR → the workflow publishes to npm
```

---

## Manual publish (emergency)

```bash
pnpm install --frozen-lockfile
pnpm run build          # builds all packages
NPM_TOKEN=npm_xxx pnpm run release
```

---

## Verify published packages

```bash
npm info @nikolayvalev/design-system
```
