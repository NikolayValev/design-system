# Public Portal

This project is published through a single public domain:

- `https://designsystem.nikolayvalev.com`

The domain is served by the `packages/mcp-server` Vercel project and acts as a multi-audience portal.

## Vercel Project Map

Neither Vercel project is named after the directory it deploys, so check this
table before opening a dashboard link.

| Repo directory | Vercel project name | Deploy secret holding its project ID |
| --- | --- | --- |
| `packages/mcp-server` | `mcp-server` | `VERCEL_PROJECT_ID_DESIGN_SYSTEM_MCP` |
| `apps/storybook` | `design-system` | `VERCEL_PROJECT_ID_STORYBOOK` |

The Vercel project named `design-system` holds the **Storybook build**, not the
`@nikolayvalev/design-system` package and not this portal. The portal lives in
the project named `mcp-server`.

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

`.github/workflows/monorepo-deploy.yml` deploys both projects on every push to
`main`. It requires these repository secrets, and now fails the run when any of
them is missing:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID_DESIGN_SYSTEM_MCP`
- `VERCEL_PROJECT_ID_STORYBOOK`

Beyond the secrets, production needs:

1. Keep the Storybook project (`design-system`) deployed from `apps/storybook`.
2. `STORYBOOK_ORIGIN` must be set on the `mcp-server` project and point at the
   Storybook project's production URL, or `/storybook/` returns an error from
   `api/storybook/[[...path]].ts`.
3. Deploy `packages/mcp-server`. Its production deployment must build all eight
   route functions; a deployment exposing only `api/index`, `api/healthz`, and
   `api/mcp` predates the portal routes and will 404 on `/engineers`,
   `/recruiters`, `/catalog`, `/docs`, and `/storybook/`.
4. Assign `designsystem.nikolayvalev.com` to the `mcp-server` project and confirm
   `vercel alias ls` actually lists it. A domain can be configured on a project --
   showing up as its production URL and under `vercel inspect` aliases -- while no
   alias record exists; Vercel's edge then answers `DEPLOYMENT_NOT_FOUND` for every
   route. Compare against a working sibling such as `bondviz.nikolayvalev.com`,
   which resolves to the same Cloudflare IPs and differs only by having the alias.

   Moving the domain between projects cannot be done from the CLI. Both
   `vercel alias set` and `vercel domains add ... --force` fail with
   `alias_conflict` while another project holds it. Detach it in that project's
   Settings -> Domains first, then attach it to `mcp-server`. Vercel may report
   "Invalid Configuration" because Cloudflare proxies the DNS record; that is
   cosmetic and needs no DNS change.
5. Disable Vercel Authentication (Deployment Protection) on **both** projects.
   `mcp-server` must be public for visitors, the uptime probe, and `pnpm smoke:prod`.
   The Storybook project must also be reachable, because `/storybook/` is a
   server-side fetch from `mcp-server` to `STORYBOOK_ORIGIN` -- if that project is
   protected, the proxy receives a `vercel.com/sso-api` redirect instead of HTML.

The `/storybook` path is reverse proxied by the MCP project so demo content and
API endpoints live under one domain. `api/storybook.ts` is a single plain
function rather than a filesystem catch-all: Vercel's zero-config builder did not
match `api/storybook/[...path].ts` past one path segment, so nested assets such as
`/storybook/sb-addons/<addon>/manager-bundle.js` returned `NOT_FOUND` before any
handler ran. Every `/storybook/*` path is rewritten to that one function, which
still sees the original path because a rewrite does not change `req.url`. The
Storybook build references assets relatively, so they resolve under `/storybook/`.

## CLI Scaffolding Contract

`@nikolayvalev/design-system` ships a CLI:

```bash
npx @nikolayvalev/design-system@latest init
```

Generated defaults:

- `.mcp.json` and `.cursor/mcp.json` include `https://designsystem.nikolayvalev.com/mcp`
- `design-system.config.json` stores install root and selected vision(s)
- `src/design-system` scaffold for source-installed components/sections/pages

This contract should remain stable so future agents can bootstrap consuming repos without manual setup.
