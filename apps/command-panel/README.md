# @apps/command-panel — Reference Host

The reference host for `@nikolayvalev/command-panel`: a Vite + React SPA that mounts
`<CommandPanel>` and wires it to a read-only `DataRegistry` of this monorepo's own
metrics (component/section/page counts, the 12 visions across 5 families, Storybook
story count, design-system bundle sizes).

## Run locally

```bash
pnpm --filter @apps/command-panel dev
```

Set `ANTHROPIC_API_KEY` (see `.env.example`) for live chat. The Vite dev server mounts
the chat (`/api/chat`) and data (`/api/data`) routes via an in-process middleware.

## How it works

- **Client:** `src/App.tsx` mounts `<CommandPanel apiEndpoint="/api/chat" dataEndpoint="/api/data" />`.
- **Server:** `api/chat.ts` (`createCommandPanelHandler`) and `api/data.ts`
  (`createDataRouteHandler`) — web-standard handlers deployed as Vercel functions.
- **Data:** `src/data/sources.ts` defines the `DataSource`s. Filesystem-derived metrics
  are snapshotted at build time by `src/data/generate-metrics.ts` into
  `metrics.generated.json` (regenerated on `build`/`test`/`dev`); visions come straight
  from the design system's `visionThemes`.

## Deploy

Deploy-ready via `vercel.json`. Set `ANTHROPIC_API_KEY` in the Vercel project env, then
deploy. (Deployment is a separate, human-triggered step.)
