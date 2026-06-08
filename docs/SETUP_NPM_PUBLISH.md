# NPM Publish Setup

Two packages are published to npm under `@nikolayvalev`:

| Package | npm |
|---|---|
| `@nikolayvalev/design-system` | Components, CLI, VDE visions + per-vision CSS |
| `@nikolayvalev/design-system-mcp` | MCP server binary (stdio + HTTP) |

Publishing is handled by [Changesets](https://github.com/changesets/changesets) via the `release.yml` GitHub Action, which runs on every push to `main`.

---

## One-time setup

### 1. Create an npm automation token

1. Log in to [npmjs.com](https://www.npmjs.com)
2. **Account → Access Tokens → Generate New Token → Granular Access Token**
3. Set scope: `@nikolayvalev` (or all packages)
4. Permission: **Read and write**
5. Copy the token (starts with `npm_…`)

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
npm info @nikolayvalev/design-system-mcp
```
