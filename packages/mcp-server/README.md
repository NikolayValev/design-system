# Design System MCP Server

MCP server for design-system discovery and governance across repositories.

## What It Exposes

Tools:

- `list_components` - list all components or search by query
- `get_component_source` - fetch source for a component by name
- `get_contribution_guide` - fetch `CONTRIBUTION_GUIDE.md`

Resources:

- `design-system://components`
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
- Example production endpoint: `https://designsystem.nikolayvalev.com/mcp`

### Custom Domain

Attach `designsystem.nikolayvalev.com` to this Vercel project in Vercel Domains settings.
Point your DNS CNAME for `designsystem` to Vercel as instructed by Vercel.

## Environment Overrides

Defaults assume this package runs inside this monorepo. Override paths if needed:

- `DESIGN_SYSTEM_COMPONENTS_DIR`
- `DESIGN_SYSTEM_CONTRIBUTION_GUIDE_PATH`

## Transport Flags

- `--transport stdio` (default)
- `--transport http`
- `--port <number>` (HTTP only)
