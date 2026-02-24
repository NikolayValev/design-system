# Public Portal

This project is published through a single public domain:

- `https://designsystem.nikolayvalev.com`

The domain is served by the `packages/mcp-server` Vercel project and acts as a multi-audience portal.

## Route Map

- `/` - portal landing page
- `/engineers` - engineer-facing onboarding and integration links
- `/recruiters` - recruiter-facing demo narrative and proof points
- `/catalog` - live artifact listing powered by MCP source discovery
- `/docs` - documentation index
- `/storybook` - Storybook experience proxied from the Storybook Vercel project
- `/mcp` - streamable HTTP MCP endpoint
- `/healthz` - health status JSON

## Deployment Notes

1. Keep the Storybook project deployed from `apps/storybook`.
2. Set `STORYBOOK_ORIGIN=https://<storybook-project>.vercel.app` on the `design-system-mcp` Vercel project.
3. Deploy `packages/mcp-server`.

The `/storybook` path is reverse proxied by the MCP project so demo content and API endpoints live under one domain.

## CLI Scaffolding Contract

`@nikolayvalev/design-system` ships a CLI:

```bash
npx @nikolayvalev/design-system@latest init
```

Generated defaults:

- `.mcp.json` and `.cursor/mcp.json` include `https://designsystem.nikolayvalev.com/mcp`
- `design-system.config.json` stores install root and profile
- `src/design-system` scaffold for source-installed components/sections/pages

This contract should remain stable so future agents can bootstrap consuming repos without manual setup.
