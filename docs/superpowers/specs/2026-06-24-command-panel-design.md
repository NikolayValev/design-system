# Command Panel — Portable Generative-UI Chat Engine

> Design spec. Status: approved for planning. Date: 2026-06-24.

## Context

The repo publishes `@nikolayvalev/design-system` (v2.0.0) — a themeable
component library with a "vision" system (12 themes / 5 families, OKLCH tokens,
`VisionProvider` / `useVision`), composed sections and pages, and a
Vercel-deployed MCP server that lets AI agents browse the catalog. The only real
local app today is Storybook.

We want a **chat-driven generative command panel**: a user talks to an LLM, the
LLM generates graphs and custom components, and the user pins the useful ones
onto a dashboard. Crucially, this must be **reusable across other repos and
projects** — not welded to the design system. The design system stays the
**source of truth** for the component vocabulary (and gains chart primitives);
the engine is a **portable, published package** that any host project can drop
in, supplying its own data. The design-system monorepo hosts the **reference
implementation** that other repos copy.

This is a flagship demonstration of the design system *and* a standalone product
surface.

## Goals

1. A portable, published engine package that renders a two-pane "command panel"
   (chat + dashboard) and turns LLM output into live, on-brand widgets.
2. **Constrained codegen**: the LLM writes real JSX limited to an allow-listed
   component vocabulary, compiled and rendered safely at runtime.
3. **Live data**: widgets read real data through a host-provided, read-only data
   layer — never fabricated values.
4. **Pluggable by host**: the design system (+ charts) is the canonical default
   component vocabulary; a host can register additional vetted components and
   wires in its own data sources.
5. **Inline preview + pin**: proposed widgets render live in the chat; a pin
   action promotes them to a persistent dashboard grid.
6. Chart primitives added to the design system as reusable, themeable vocabulary.
7. A reference host in this repo that wires the engine to the monorepo's own
   metrics, as the worked example.

## Non-goals (v1 / YAGNI)

- Auth, multi-user, or server-side persistence (pinned state is single-user,
  `localStorage`).
- Host data **writes** — the data layer is read-only metrics only.
- Iframe / cross-origin hardening of the sandbox (documented as a future
  opt-in "hardened mode").
- Non-Next.js server adapters (the core stays framework-light, but only a
  Next.js route-handler factory ships in v1).
- Shared / collaborative dashboards.
- Re-theming or redesigning existing design-system components.

## Locked decisions

- **Generation model:** constrained codegen — LLM writes JSX limited to
  allow-listed components, sandboxed at runtime (not a fixed widget catalog, not
  arbitrary code).
- **Data:** live, host-provided, read-only. The reference host exposes the
  monorepo's own metrics.
- **Panel model:** both — inline live preview in chat **and** pin-to-persistent
  dashboard grid.
- **Sandbox strategy:** in-browser transpile + render against a frozen scope,
  gated by an AST allow-list validator (Option A). Iframe isolation is a
  documented future option, not v1.
- **Reusability:** the engine is a separate published package consuming the
  design system as a peer dependency; the design system is the source of truth;
  this repo holds the reference host.
- **Component vocabulary:** design system + chart primitives are the canonical
  default registry; a host **can register additional** components. The LLM may
  only use what is registered.
- **LLM:** `claude-opus-4-8` via the Vercel AI SDK + `@ai-sdk/anthropic`,
  streaming, with a structured `propose_widget` tool call.
- **Charts live in the design system**, not the engine, and are **hand-rolled
  dependency-free SVG** (no charting library) to preserve the design system's
  zero-runtime-dependency property.
- **Persistence:** pinned dashboard state via `@repo/state` (zustand) +
  `localStorage`.

## Architecture & package topology

Three pieces, built in dependency order:

```text
@nikolayvalev/design-system    ── source of truth: components + NEW chart primitives
        ▲ peer dep
@nikolayvalev/command-panel    ── the portable engine (the deliverable)
        ▲ consumes
apps/command-panel (this repo) ── reference host: wires the engine to monorepo data
```

The engine is **data-agnostic** and **component-extensible**. A host project:

1. Installs `@nikolayvalev/command-panel` (+ the design system).
2. Builds a `ComponentRegistry` (defaults to design-system + charts; host may
   extend) and a `DataRegistry` (host's own read-only data sources).
3. Mounts one `<CommandPanel>` React component and one server route (from the
   engine's handler factory).

That is the entire integration surface.

Tentative package name: `@nikolayvalev/command-panel` (changeable).

### Engine package internal structure (proposed)

```text
packages/command-panel/src/
  registry/
    component-registry.ts   # ComponentEntry, default registry, extendRegistry()
    data-registry.ts        # DataSource, DataRegistry
  generation/
    system-prompt.ts        # builds the catalog prompt from the registries
    propose-widget.ts       # the propose_widget tool schema + parsing
    handler.ts              # createCommandPanelHandler() — Next.js route factory
  sandbox/
    validate.ts             # AST allow-list gate (security-critical)
    transpile.ts            # Sucrase JSX→JS
    evaluate.ts             # frozen-scope evaluation
    WidgetRenderer.tsx      # validate → transpile → eval → ErrorBoundary
    use-metric.ts           # the only data channel exposed to generated code
  ui/
    CommandPanel.tsx        # two-pane shell (chat + dashboard grid)
    ChatPane.tsx, WidgetPreviewCard.tsx, DashboardGrid.tsx
  state/
    pinned-store.ts         # zustand store via @repo/state, localStorage-persisted
  index.ts
```

## The two registries (the public API)

```ts
// Component vocabulary — what the LLM may render.
interface ComponentEntry {
  name: string;                    // identifier exposed in JSX scope, e.g. "LineChart"
  component: React.ComponentType<any>;
  description: string;             // shown to the LLM
  propsSchema: JSONSchema;         // documents props for the LLM + optional prop validation
  examples?: string[];             // optional few-shot JSX snippets
}

interface ComponentRegistry {
  entries: ComponentEntry[];
}

// defaultComponentRegistry = design-system components + chart primitives.
// Host extends:  extendRegistry(defaultComponentRegistry, [...hostEntries])

// Data — read-only, host-owned; the ONLY outside channel generated code can touch.
interface DataSource {
  id: string;                      // "components.count"
  description: string;             // shown to the LLM
  resultSchema: JSONSchema;        // shape returned by load()
  load(params?: Record<string, unknown>): Promise<unknown>;
}

interface DataRegistry {
  sources: DataSource[];
}
```

Both registries feed the **system-prompt builder**, so the LLM is told exactly
which component `name`s and data `id`s exist, plus their schemas — and is
constrained to them.

## Generation protocol

- The engine's **server route** (from `createCommandPanelHandler`) owns the
  Anthropic API key; the client never sees it. It runs **`claude-opus-4-8`** via
  the Vercel **AI SDK** + `@ai-sdk/anthropic`, **streaming** (long/var-length
  output; streaming avoids HTTP timeouts).
- The model emits widgets through a structured **`propose_widget`** tool call:

  ```ts
  propose_widget({
    title: string,
    description: string,
    jsx: string,            // component body — no imports
    dataSources: string[],  // declared data ids it consumes (cross-checked)
  })
  ```

  It may call the tool several times per turn; each call streams into the chat
  as an inline preview card.
- `jsx` is the **body of a function component** (no `import`s): it may call the
  allow-listed hook subset and `useMetric(id, params)`, and must **return** an
  element built from allow-listed component `name`s. The engine wraps it as a
  component so hooks have a valid render context.
- The **system prompt** is generated from the registries plus strict rules: only
  propose widgets that answer the user's question using the listed components and
  data ids; never invent data; declare every data id used in `dataSources`.

## The safe-render boundary (Option A — a first-class security boundary)

Because third-party hosts rely on it, the sandbox is a documented, hard
boundary. Every `jsx` string goes through:

1. **Parse** to an AST.
2. **Validate** against an allow-list: permit JSX, the allow-listed component
   identifiers, `useMetric`, a small hook subset (`useState`, `useMemo`),
   literals, and basic expressions / array maps. **Reject** `import` / `require`,
   `eval` / `Function`, and any access to `window` / `document` / `fetch` /
   `globalThis` / `process` / `dangerouslySetInnerHTML`. Rejected code shows an
   error card and **never executes**.
3. **Transpile** JSX→JS in-browser (Sucrase).
4. **Evaluate** against a **frozen scope** containing only the registry
   components (by `name`), `useMetric`, and the hook subset — generated code has
   nothing else in scope. Evaluation uses an explicit-named-parameter function
   (no `with`), so unknown identifiers are reference errors, not global lookups.
5. **Render** inside an error boundary; runtime errors degrade to an error card.

`useMetric(id, params)` is the **only** data path. It calls the engine's
read-only data endpoint, which resolves a **registered** `DataSource` by `id`
(rejecting unknown ids) and returns `{ data, loading, error }`. Generated code
cannot fetch arbitrarily or reach any host API beyond registered sources.

**Future (out of scope):** a hardened mode rendering generated code in a
sandboxed cross-origin iframe with a postMessage data bridge, for hosts running
untrusted prompts.

## Panel UX & persistence

- `<CommandPanel>` is a two-pane shell: **chat on the left, dashboard grid on the
  right**.
- Proposed widgets render **inline in chat as live previews** (real, sandboxed
  render — not a code block), each with a **Pin** action.
- Pin promotes the widget into the persistent **dashboard grid**, which supports
  **remove and reorder** (v1: simple grid; advanced drag-layout is a later
  enhancement).
- Pinned state — `{ id, title, jsx, dataSources }[]` — persists via **`@repo/state`**
  (zustand factory) + **`localStorage`**. Single-user, no auth in v1.

## Charts in the design system

Add themeable chart primitives to `@nikolayvalev/design-system` as
**dependency-free, hand-rolled SVG** components wired to the existing
`--chart-1..5` tokens and theme variables:

- `LineChart`, `BarChart`, `AreaChart`, `Donut` (initial set).
- Pure SVG — **no charting library, no new runtime dependency.** The design
  system ships with zero runtime dependencies today and stays that way.
- Token-driven colors only (no hardcoded hex), consistent with the design
  system's anti-hardcoding rules; series colors read `var(--chart-1..5)`.
- Storybook stories + Playwright visual snapshots (existing infra; the suite
  auto-discovers every story). Snapshots use **deterministic fixture data** so
  they are stable.

These become part of the engine's default allow-list but are reusable far beyond
it.

## Reference host (`apps/command-panel`)

A Next.js app (Vercel, consistent with the repo) that wires the engine to a
`DataRegistry` of **self-contained monorepo metrics**, e.g.:

- component / section / page counts (reuse the MCP server's `catalog`),
- the 12 visions / 5 families,
- Storybook story count,
- bundle sizes from `dist`,
- recent releases from changesets / git tags.

It mounts `<CommandPanel>` with `defaultComponentRegistry` and this data
registry, and provides the server route via `createCommandPanelHandler`. This is
the example other repos copy.

## Error handling

- **Sandbox rejects / runtime errors** → per-widget error card; the chat and the
  rest of the dashboard stay alive.
- **Unknown data id** (`useMetric`) → resolver returns an error; widget shows a
  data-error state.
- **Model proposes an off-list component / undeclared data id** → validation
  fails closed (error card); the failure is surfaced so the prompt can be tuned.
- **LLM / network errors** → surfaced in the chat pane; streaming so partial
  output is not lost.
- **Anthropic refusals / stop reasons** → handled per the AI SDK; refusal
  surfaces a chat message rather than a crash.

## Testing strategy

- **AST validation gate** (`sandbox/validate.ts`) is security-critical → built
  test-first against a table of allowed/rejected snippets (imports, `eval`,
  global access, valid widgets).
- **Sandbox render:** valid JSX renders; invalid is rejected pre-execution;
  runtime errors are caught by the boundary.
- **`propose_widget`** schema parsing + streaming assembly.
- **Charts:** Storybook stories + Playwright visual snapshots (deterministic
  data).
- **Reference host:** each data source resolves and matches its `resultSchema`.
- **End-to-end smoke:** one chat → propose → pin → persists-on-reload path.

## Implementation phasing

One cohesive spec, phased plan:

1. **Charts in the design system** — independently shippable vocabulary.
2. **Engine package** — registries, system-prompt builder, `propose_widget`,
   sandbox (validate → transpile → eval → render), `useMetric`, `CommandPanel`
   UI, pinned store, Next.js handler factory.
3. **Reference host** — `apps/command-panel` wiring monorepo data, e2e smoke.

(Phases could be split into separate plans if preferred; default is one phased
plan.)

## Open questions / to confirm during planning

- Final package name (`@nikolayvalev/command-panel` vs alternatives).
- ~~Recharts vs a lighter charting primitive~~ **Resolved (2026-06-24):**
  hand-rolled dependency-free SVG, to preserve the design system's zero-runtime-
  dependency property.
- Exact default `useMetric` transport (per-id GET endpoint vs batched) — settle
  in the engine plan.
