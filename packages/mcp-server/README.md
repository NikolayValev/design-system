# Design System MCP Server

MCP server for design-system discovery and governance across repositories.

## What It Exposes

Tools:

- `list_artifacts` - list components/sections/pages by `kind`
- `get_artifact_source` - fetch source for a component/section/page by `kind` + `name`
- `get_artifact_bundle` - return install payload for a component/section/page set
- `list_components` - list all components or search by query
- `list_sections` - list all sections or search by query
- `list_pages` - list all pages or search by query
- `get_component_source` - fetch source for a component by name
- `get_section_source` - fetch source for a section by name
- `get_page_source` - fetch source for a page by name
- `get_component_bundle` - return shadcn-style install payload (requested components + transitive source files + external deps)
- `get_section_bundle` - return install payload for sections
- `get_page_bundle` - return install payload for pages
- `get_contribution_guide` - fetch `CONTRIBUTION_GUIDE.md`

`list_components` returns component entries with an `origin` field (`local` or `remote`).
`get_component_bundle` includes:
- `tokenPackage` (`@nikolayvalev/design-tokens`)
- `installRoot` (`src/design-system`)
- `files` (relative source file map to write)
- `externalDependencies` (non-React packages detected from imports)
- `warnings` for unresolved imports

Typical flow in consuming repos:
1. Install `tokenPackage`
2. Call `get_component_bundle` with component names
3. Write `files[*].path` under `installRoot`
4. Install `externalDependencies`
5. Import locally from `src/design-system/*`

Resources:

- `design-system://components`
- `design-system://sections`
- `design-system://pages`
- `design-system://contribution-guide`

## Run

From this repo:

```bash
pnpm --filter @repo/mcp-server build
pnpm --filter @repo/mcp-server start
```

HTTP mode:

```bash
pnpm --filter @repo/mcp-server start:http
```

Optional HTTP port override:

```bash
PORT=4100 pnpm --filter @repo/mcp-server start:http
```

PowerShell:

```powershell
$env:PORT = "4100"
pnpm --filter @repo/mcp-server start:http
```

## Use From Other Repos

### Option 1: MCP stdio client config (recommended)

Point your MCP client to this built server entrypoint:

```json
{
  "mcpServers": {
    "design-system": {
      "command": "node",
      "args": [
        "C:/Users/Nikolay/Code/design-system/packages/mcp-server/dist/index.js",
        "--transport",
        "stdio"
      ]
    }
  }
}
```

### Option 2: Streamable HTTP service

Run the server once in this repo, then connect from other repos/clients to:

- `http://127.0.0.1:4100/mcp`
- health check: `http://127.0.0.1:4100/healthz`

## Deploy To Vercel

This package is Vercel-ready via [vercel.json](./vercel.json) and `api/*` serverless handlers.

Set Vercel project root directory to:

- `packages/mcp-server`

Then deploy:

```bash
vercel --prod
```

After deploy, endpoints are:

- `/` - service metadata
- `/healthz` - health status
- `/mcp` - MCP Streamable HTTP endpoint
- `/storybook` - proxied Storybook UI (when `STORYBOOK_ORIGIN` is configured)
- `/engineers` - engineer onboarding view (HTML + JSON)
- `/recruiters` - recruiter demo view (HTML + JSON)
- `/catalog` - live artifact catalog (HTML + JSON)
- `/docs` - docs index for implementation and operations
- Example production endpoint: `https://designsystem.nikolayvalev.com/mcp`

### Custom Domain

Attach `designsystem.nikolayvalev.com` to this Vercel project in Vercel Domains settings.
Point your DNS CNAME for `designsystem` to Vercel as instructed by Vercel.

To serve Storybook on the same domain at `/storybook`, set:

- `STORYBOOK_ORIGIN` = the Storybook Vercel project URL (for example `https://design-system-storybook.vercel.app`)

Then `https://designsystem.nikolayvalev.com/storybook` will proxy to that origin.
Use `https://designsystem.nikolayvalev.com` as the single public entrypoint for both demo audiences and engineering onboarding.

## Environment Overrides

Defaults assume this package runs inside this monorepo. Override paths if needed:

- `DESIGN_SYSTEM_SRC_DIR`
- `DESIGN_SYSTEM_COMPONENTS_DIR`
- `DESIGN_SYSTEM_SECTIONS_DIR`
- `DESIGN_SYSTEM_PAGES_DIR`
- `DESIGN_SYSTEM_CONTRIBUTION_GUIDE_PATH`
- `DESIGN_SYSTEM_GITHUB_REPOSITORY` (default: `NikolayValev/design-system`)
- `DESIGN_SYSTEM_GITHUB_REF` (default: `main`)
- `DESIGN_SYSTEM_GITHUB_COMPONENTS_ROOT` (default: `packages/design-system/src/components`)
- `DESIGN_SYSTEM_GITHUB_SRC_ROOT` (default: `packages/design-system/src`)
- `DESIGN_SYSTEM_GITHUB_SECTIONS_ROOT` (default: `packages/design-system/src/sections`)
- `DESIGN_SYSTEM_GITHUB_PAGES_ROOT` (default: `packages/design-system/src/pages`)
- `DESIGN_SYSTEM_GITHUB_API_BASE` (default: `https://api.github.com`)
- `DESIGN_SYSTEM_REMOTE_TIMEOUT_MS` (default: `10000`)
- `GITHUB_TOKEN` (recommended in production to avoid GitHub API rate limits)
- `STORYBOOK_ORIGIN` (optional; enables `/storybook` reverse proxy)

## Transport Flags

- `--transport stdio` (default)
- `--transport http`
- `--port <number>` (HTTP only)
