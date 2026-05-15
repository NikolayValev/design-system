# MCP Integration Guide

The design-system ships an MCP (Model Context Protocol) server that lets AI agents browse, fetch, and install components, sections, pages, tokens, and VDE themes.

---

## Available transports

| Transport | When to use |
|---|---|
| **stdio** | Local development, Claude Desktop, VS Code extension |
| **HTTP (Streamable)** | Vercel deployment — already live at `https://designsystem.nikolayvalev.com/mcp` |

---

## Available tools

| Tool | What it does |
|---|---|
| `list_components` | Browse all components |
| `get_component_source` | Read a component's source |
| `get_component_bundle` | Install bundle: source + deps (shadcn-style) |
| `list_sections` | Browse section templates |
| `get_section_source` / `get_section_bundle` | Read / install sections |
| `list_pages` | Browse page templates |
| `get_page_source` / `get_page_bundle` | Read / install pages |
| `list_artifacts` | Unified list across component/section/page |
| `get_artifact_source` / `get_artifact_bundle` | Unified read / install |
| `list_themes` | Browse all 20 VDE themes |
| `get_theme` | Full token + motion + typography of a theme |
| `list_token_profiles` | public / dashboard / experimental profiles |
| `get_token_profile_source` | Raw OKLCH token values for all profiles |
| `get_contribution_guide` | How to add components/sections/pages |

---

## Option 1 — Claude Code (local, stdio)

The repo already ships `.claude/mcp.json`. After building the MCP server, Claude Code picks it up automatically.

```bash
# Build the MCP server once
pnpm --filter @nikolayvalev/design-system-mcp build

# Claude Code reads .claude/mcp.json automatically — no extra config needed
```

To verify it's running, open Claude Code in this repo and run:
```
/mcp
```
You should see `design-system` listed.

---

## Option 2 — Claude Desktop (local, stdio)

Add to `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or  
`%APPDATA%\Claude\claude_desktop_config.json` (Windows):

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

Or once `@nikolayvalev/design-system-mcp` is published to npm:

```json
{
  "mcpServers": {
    "design-system": {
      "command": "npx",
      "args": ["-y", "@nikolayvalev/design-system-mcp", "--transport", "stdio"]
    }
  }
}
```

---

## Option 3 — Remote HTTP (Vercel)

The server is already deployed at:

```
https://designsystem.nikolayvalev.com/mcp
```

Add to any MCP client that supports Streamable HTTP:

```json
{
  "mcpServers": {
    "design-system": {
      "url": "https://designsystem.nikolayvalev.com/mcp"
    }
  }
}
```

Health check: `https://designsystem.nikolayvalev.com/healthz`

---

## Option 4 — VS Code (Copilot / Continue / Cline)

For VS Code extensions that support MCP, add a `.vscode/mcp.json` to the consuming repo:

```json
{
  "servers": {
    "design-system": {
      "url": "https://designsystem.nikolayvalev.com/mcp"
    }
  }
}
```

Or for local stdio (inside this monorepo):

```json
{
  "servers": {
    "design-system": {
      "type": "stdio",
      "command": "node",
      "args": ["packages/mcp-server/dist/index.js", "--transport", "stdio"]
    }
  }
}
```

---

## Running the HTTP server locally

```bash
# dev (tsx, hot reload)
pnpm --filter @nikolayvalev/design-system-mcp dev:http

# production
pnpm --filter @nikolayvalev/design-system-mcp build
pnpm --filter @nikolayvalev/design-system-mcp start:http

# test
curl http://localhost:4100/healthz
```

Default port is `4100`. Override with `--port 3000` or `PORT=3000`.
