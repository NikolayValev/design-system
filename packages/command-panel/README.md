# @nikolayvalev/command-panel

A portable, chat-driven **generative-UI command panel** for the Nikolay Valev design system.

An LLM answers a user's question by proposing **widgets** — small UI built from an allow-listed
set of design-system components. Each proposal is JSX that is parsed, AST-validated against the
allow-list, and rendered in a sandbox (no `import`/`fetch`/`window`/`eval`). The only way a widget
can read data is `useMetric(id)`, which resolves against a read-only `DataRegistry` you define.
Users can **pin** a proposed widget to a persistent dashboard.

```
user asks ──▶ /api/command-panel ──▶ LLM proposes JSX (propose_widget tool)
                                          │
                              validate + sandbox render
                                          │
                          inline widget ──┴──▶ pin ──▶ dashboard
                                          │
                          useMetric(id) ──▶ /api/command-panel/data ──▶ your DataRegistry
```

**Why it's safe to embed:** the model never runs arbitrary code and never reaches the network.
It may only reference components you registered and data ids you registered; anything else is
rejected before render.

---

## Install

```bash
pnpm add @nikolayvalev/command-panel @nikolayvalev/design-system
```

- **Peer dependencies:** `@nikolayvalev/design-system`, `react` (^18 || ^19), `react-dom`.
  bondviz already has React 19 — you only need to add the design system.
- **Bundled for you:** the AI SDK (`ai`, `@ai-sdk/*`), `zod`, and the JSX sandbox
  (`@babel/parser`, `sucrase`) are regular dependencies of this package and install
  automatically. You do **not** add them yourself unless you want a non-default model
  provider (see [Choosing a model](#choosing-a-model)).

The generation layer lives behind a separate `/server` entry so the AI SDK and your
API key never end up in a client bundle:

| Import from | Contains | Safe in |
|---|---|---|
| `@nikolayvalev/command-panel` | `CommandPanel`, registries, `useMetric`, `createDataRouteHandler` | client **and** server |
| `@nikolayvalev/command-panel/server` | `createCommandPanelHandler`, `buildSystemPrompt`, generation internals | server only |

---

## Quick start (Next.js App Router)

This is the bondviz path: Next.js 16 App Router, React 19, Tailwind v4. Three pieces —
a data registry, two route handlers, and one client component.

### 1. Define your data (`app/command-panel/data.ts`)

`useMetric(id)` can only read ids you register here. Each source's `load()` runs on the
server, so it can hit your database, Python pricing service, Treasury API, etc.

```ts
import { createDataRegistry } from '@nikolayvalev/command-panel';

export const dataRegistry = createDataRegistry([
  {
    id: 'yield.treasury.curve',
    description: 'Current US Treasury par-yield curve as { label: tenor, value: yield% }[].',
    async load() {
      const res = await fetch('http://localhost:8000/api/yield-curve');
      return res.json(); // must be { label: string; value: number }[] to feed a chart
    },
  },
  {
    id: 'bond.price',
    description: 'Clean price for a bond. params: { cusip: string }. Returns { price, ytm }.',
    async load(params) {
      const res = await fetch(`http://localhost:8000/api/price/${params?.cusip}`);
      return res.json();
    },
  },
]);
```

> **Charts** (`LineChart`, `BarChart`, `AreaChart`, `Donut`) expect `{ label: string; value: number }[]`.
> If a source returns that shape, the model is told to pass it straight through — so shaping your
> `load()` output that way makes charts "just work."

### 2. Chat route (`app/api/command-panel/route.ts`)

```ts
import { createCommandPanelHandler } from '@nikolayvalev/command-panel/server';
import { defaultComponentRegistry } from '@nikolayvalev/command-panel';
import { dataRegistry } from '../../command-panel/data';

// Uses the default provider (Anthropic via ANTHROPIC_API_KEY). See "Choosing a model"
// to route through OpenRouter or another provider.
export const POST = createCommandPanelHandler({
  componentRegistry: defaultComponentRegistry,
  dataRegistry,
});
```

### 3. Data route (`app/api/command-panel/data/route.ts`)

```ts
import { createDataRouteHandler } from '@nikolayvalev/command-panel';
import { dataRegistry } from '../../../command-panel/data';

// Read-only: resolves a REGISTERED id and rejects anything else. This is the only
// outbound data path a generated widget has.
export const POST = createDataRouteHandler(dataRegistry);
```

### 4. Mount the panel (`app/command-panel/page.tsx`)

```tsx
'use client';

import { CommandPanel, defaultComponentRegistry } from '@nikolayvalev/command-panel';

export default function CommandPanelPage() {
  return (
    <main style={{ height: '100dvh', padding: '1rem' }}>
      <CommandPanel registry={defaultComponentRegistry} />
    </main>
  );
}
```

`<CommandPanel>` defaults to `apiEndpoint="/api/command-panel"` and
`dataEndpoint="/api/command-panel/data"` — matching the routes above. Override the props if
you mount the routes elsewhere. Pass a **stable** registry reference (module-scope, as above).

That's the whole loop. Ask the panel "show me the current yield curve" and it will propose a
`LineChart` bound to `useMetric('yield.treasury.curve')`, which you can pin to the dashboard.

---

## Choosing a model

The handler resolves the model **per request from `config.model`**, falling back to
Anthropic (`claude-opus-4-8`) via `ANTHROPIC_API_KEY` when you pass nothing.

**Default (Anthropic):** set `ANTHROPIC_API_KEY` in the environment — no `model` needed.

**OpenRouter / any OpenAI-compatible provider:** install `@ai-sdk/openai` and pass a model.
OpenRouter has no Responses API, so force chat-completions with `.chat()`:

```ts
import { createCommandPanelHandler } from '@nikolayvalev/command-panel/server';
import { defaultComponentRegistry } from '@nikolayvalev/command-panel';
import { createOpenAI } from '@ai-sdk/openai';
import { dataRegistry } from '../../command-panel/data';

function selectModel() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return undefined; // fall back to the Anthropic default
  const openrouter = createOpenAI({ baseURL: 'https://openrouter.ai/api/v1', apiKey });
  return openrouter.chat(process.env.OPENROUTER_MODEL ?? 'openai/gpt-4o');
}

export function POST(req: Request) {
  return createCommandPanelHandler({
    componentRegistry: defaultComponentRegistry,
    dataRegistry,
    model: selectModel(),
  })(req);
}
```

> Weaker/free models occasionally mis-shape chart data. The system prompt already coaches the
> `{ label, value }[]` pass-through; a capable model (gpt-4o, Claude) is more reliable for
> generation quality. **Keep your key server-side only** — never expose it to the client.

---

## Styling (Tailwind v4)

The registered widgets are design-system components: they render with **Tailwind utility
classes** and read design tokens (`--vde-*`, plus `--chart-1..5` for charts) from a **vision
stylesheet**. bondviz runs Tailwind v4, which matches how the design system ships its CSS, so
two steps wire it up:

1. **Let Tailwind see the DS classes.** In your global stylesheet (e.g. `app/globals.css`),
   add the design-system build to Tailwind's content scan so it generates the utilities the
   components use:

   ```css
   @import 'tailwindcss';
   @source '../node_modules/@nikolayvalev/design-system/dist';
   ```

2. **Load a vision's tokens.** Import one vision stylesheet for the `--vde-*` / `--chart-*`
   custom properties (available visions: `editorial`, `noir`, `swiss_international`, `zen`,
   `brutalist`, `clay_soft`, `immersive`, `museum`, `solarpunk`, `synthwave`, `terminal`,
   `y2k_chrome`):

   ```ts
   import '@nikolayvalev/design-system/styles/editorial.css';
   ```

   For runtime theme switching, wrap the panel in the design system's `VisionProvider` instead
   of importing a single vision file.

> This step depends on your Tailwind v4 config, so **verify the widgets pick up styling** in
> your app after wiring — it's the one part that isn't pure drop-in. The design-system README
> has the authoritative Tailwind-v4 integration notes if the `@source` path differs in your
> layout.

---

## Customizing the component vocabulary

`defaultComponentRegistry` exposes the DS primitives (`Card`, `Badge`, `StatChip`, `Layout`,
`SectionShell`, `FeatureTile`) and the chart primitives (`LineChart`, `BarChart`, `AreaChart`,
`Donut`). To offer a different set, build your own with `createComponentRegistry`:

```ts
import { createComponentRegistry } from '@nikolayvalev/command-panel';
import { Card, LineChart } from '@nikolayvalev/design-system';
import { BondLadder } from '@/components/BondLadder';

export const registry = createComponentRegistry([
  { name: 'Card', component: Card, description: 'Surface container grouping related content.' },
  { name: 'LineChart', component: LineChart, description: 'SVG line chart. Props: data ({label,value}[]), colorIndex (1-5).' },
  { name: 'BondLadder', component: BondLadder, description: 'Renders a bond ladder from a maturities array.' },
]);
```

The `description` is what the model sees in its system prompt, so write it for the model. Pass
the same registry to **both** the client `<CommandPanel registry={...} />` and the server
`createCommandPanelHandler({ componentRegistry: ... })` — the client renders the components, the
server describes them to the model. Use `extendRegistry` to add to an existing registry.

---

## Security model

The sandbox is the reason this is safe to point an LLM at:

- **Allow-list only.** A widget may reference registered components (PascalCase) and a fixed set
  of layout/text HTML elements. Unknown identifiers are rejected before render.
- **AST-validated.** Source is parsed with `@babel/parser` and checked against the allow-list;
  `import`, `fetch`, `window`, `document`, `eval`, and other globals are disallowed.
- **One data channel.** Widgets read data only through `useMetric(id)` → your data route → a
  **registered** `DataSource`. Unknown ids return 404; the model cannot invent data or endpoints.
- **No secrets client-side.** Generation and API keys live behind the `/server` entry and your
  route handlers.

You can validate a source string directly with `validateWidgetSource(src, registry)`.

---

## API reference

**Client-safe (`@nikolayvalev/command-panel`)**

- `CommandPanel`, `ChatPane`, `DashboardGrid`, `WidgetPreviewCard` — UI.
- `createComponentRegistry`, `extendRegistry`, `defaultComponentRegistry` — the component vocabulary.
- `createDataRegistry`, `getDataSource`, `createRegistryResolver` — data sources.
- `useMetric`, `DataResolverProvider`, `createHttpDataResolver` — the data channel.
- `createDataRouteHandler` — the read-only data route (no AI SDK; safe anywhere).
- `validateWidgetSource`, `WidgetRenderer`, `WidgetErrorBoundary` — the sandbox.
- `PinnedStoreProvider`, `usePinnedStore`, `createPinnedStore` — the pinned-dashboard store.

**Server-only (`@nikolayvalev/command-panel/server`)**

- `createCommandPanelHandler(config)` — the chat route handler. `config`: `{ componentRegistry, dataRegistry, model?, system? }`.
- `runGeneration`, `buildSystemPrompt`, `proposeWidgetTool`, `DEFAULT_MODEL_ID`.

---

## Reference host

`apps/command-panel` in this repo is a working reference host (Vite + React SPA) wired to this
monorepo's own metrics. It demonstrates the same pieces against a Vite dev server instead of
Next.js — useful as a second worked example. See its README for the SPA/Vercel-functions variant.
