# Command Panel — Phase 2b: Generation + Server Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the LLM generation layer to `@nikolayvalev/command-panel` — a system-prompt builder, the `propose_widget` tool, a streaming Next.js route-handler factory backed by Claude via the Vercel AI SDK, and the read-only HTTP data transport that backs `useMetric`.

**Architecture:** A server-only entry (`@nikolayvalev/command-panel/server`) keeps the AI SDK + Anthropic provider out of client bundles. The handler runs `streamText` with `claude-opus-4-8` and a single `propose_widget` tool (no `execute` — its calls stream to the client to render/pin). `buildSystemPrompt` turns the component + data registries into the model's instructions, constraining it to exactly the allowed components, host elements, hooks, and data ids that the Phase 2a sandbox enforces. `useMetric`'s data comes through a read-only route that resolves a registered `DataSource` by id and rejects unknown ids.

**Tech Stack:** Vercel AI SDK (`ai` v7), `@ai-sdk/anthropic` v4, `zod` v4, `claude-opus-4-8`. Web-standard `Request`/`Response` handlers (framework-agnostic; drop into a Next.js route). Tested with the AI SDK's `MockLanguageModelV4` (no live API calls).

## Global Constraints

- **New dependencies (regular `dependencies`, externalized in tsup):** `ai` `^7.0.0`, `@ai-sdk/anthropic` `^4.0.0`, `zod` `^4.0.0`. (Phase 2a's `@babel/parser`/`sucrase` deps and the react/design-system peers are unchanged.)
- **Model:** `claude-opus-4-8` via **`@ai-sdk/anthropic`** — `anthropic('claude-opus-4-8')`. Do NOT use the Vercel AI Gateway provider (the spec chose the Anthropic provider directly). The server owns the key — `@ai-sdk/anthropic` reads `ANTHROPIC_API_KEY` from the environment; it is never sent to or referenced by the client.
- **Server/client split:** all code that imports `ai` or `@ai-sdk/anthropic` is reachable only through the new `./server` entry (`src/server.ts`). The main `.` entry (`src/index.ts`) stays client-safe (the Phase 2a registries + sandbox, plus the client-only `createHttpDataResolver`).
- **AI SDK current API (verified against `ai@7.0.2` / `@ai-sdk/anthropic@4.0.0`):** tools use `tool({ description, inputSchema })` (NOT `parameters`); `streamText({ model, system, messages, tools })` returns a result with `.toUIMessageStreamResponse()` and a `.toolCalls` promise; convert client UI messages with `convertToModelMessages(...)`; tests use `MockLanguageModelV4` + `simulateReadableStream` from `ai/test`.
- **`propose_widget` has NO `execute`** — the model proposes widgets; the client renders them. The tool call is surfaced, not run server-side.
- **Read-only data channel:** `createDataRouteHandler` resolves a registered `DataSource` by id and rejects unknown ids (matches the 2a sandbox's read-only model). `createHttpDataResolver` is the client `DataResolver` that calls it.
- ESM only; TypeScript strict. Pure modules use the default `node` Vitest env (`*.test.ts`); these tasks add no React-render tests.
- **Commits:** conventional-commit messages ending with the trailer `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.
- Work on branch `feat/command-panel-2b`; do NOT implement on `main`.

## File Structure

```text
packages/command-panel/src/
  generation/
    system-prompt.ts     # buildSystemPrompt(componentRegistry, dataRegistry, options?) -> string
    propose-widget.ts    # proposeWidgetSchema (zod), proposeWidgetTool (ai tool), ProposeWidgetInput
    handler.ts           # runGeneration(...), createCommandPanelHandler(...), DEFAULT_MODEL_ID
    data-route.ts        # createDataRouteHandler(dataRegistry) -> (Request) => Response   [server]
    http-resolver.ts     # createHttpDataResolver(endpoint, fetchImpl?) -> DataResolver    [client]
  server.ts              # NEW entry: re-exports the server-only generation surface
  index.ts               # (modified) add createHttpDataResolver export
```

---

### Task 1: Add AI SDK deps + the server entry (build wiring)

**Files:**
- Modify: `packages/command-panel/package.json` (add deps + `./server` export)
- Modify: `packages/command-panel/tsup.config.ts` (second entry + externals)
- Create: `packages/command-panel/src/server.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: a two-entry build (`.` and `./server`); `ai`/`@ai-sdk/anthropic`/`zod` installed.

- [ ] **Step 1: Add the dependencies**

Run:
```bash
pnpm --filter @nikolayvalev/command-panel add ai@^7.0.0 @ai-sdk/anthropic@^4.0.0 zod@^4.0.0
```
Expected: the three packages appear under `dependencies` in `packages/command-panel/package.json`.

- [ ] **Step 2: Add the `./server` export to `package.json`**

Edit `packages/command-panel/package.json` — replace the `"exports"` block with:
```json
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    },
    "./server": {
      "types": "./dist/server.d.ts",
      "import": "./dist/server.js"
    }
  },
```

- [ ] **Step 3: Update `tsup.config.ts` for two entries + externals**

Replace `packages/command-panel/tsup.config.ts` with:
```ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/server.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  external: ['react', 'react-dom', '@nikolayvalev/design-system', 'ai', '@ai-sdk/anthropic', 'zod'],
});
```

- [ ] **Step 4: Create the server entry placeholder**

Create `packages/command-panel/src/server.ts`:
```ts
// Server-only entry for @nikolayvalev/command-panel.
// Everything that imports the AI SDK lives behind this entry so it never
// reaches client bundles. Real re-exports are added by Task 6.
export {};
```

- [ ] **Step 5: Install, build, and verify both entries emit**

Run:
```bash
pnpm install
pnpm --filter @nikolayvalev/command-panel build
node -e "const fs=require('fs');for (const f of ['dist/index.js','dist/index.d.ts','dist/server.js','dist/server.d.ts']) { if(!fs.existsSync('./packages/command-panel/'+f)){console.error('MISSING',f);process.exit(1)} } console.log('OK: both entries built')"
pnpm --filter @nikolayvalev/command-panel test
```
Expected: install succeeds; build emits all four `dist/` files; prints `OK: both entries built`; the existing 47 tests still pass.

- [ ] **Step 6: Commit**

```bash
git add packages/command-panel/package.json packages/command-panel/tsup.config.ts packages/command-panel/src/server.ts pnpm-lock.yaml
git commit -m "feat(command-panel): add AI SDK deps and a server-only entry"
```

---

### Task 2: `buildSystemPrompt` (TDD)

**Files:**
- Create: `packages/command-panel/src/generation/system-prompt.ts`
- Test: `packages/command-panel/src/generation/system-prompt.test.ts`

**Interfaces:**
- Consumes: `ComponentRegistry` from `../registry/component-registry`; `DataRegistry` from `../registry/data-registry`.
- Produces:
  - `interface SystemPromptOptions { appendix?: string }`
  - `buildSystemPrompt(components: ComponentRegistry, data: DataRegistry, options?: SystemPromptOptions): string`

- [ ] **Step 1: Write the failing test**

`packages/command-panel/src/generation/system-prompt.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { buildSystemPrompt } from './system-prompt';
import { createComponentRegistry } from '../registry/component-registry';
import { createDataRegistry } from '../registry/data-registry';

const components = createComponentRegistry([
  { name: 'LineChart', component: () => null, description: 'SVG line chart.' },
]);
const data = createDataRegistry([
  { id: 'revenue.monthly', description: 'Monthly revenue.', load: async () => [] },
]);

describe('buildSystemPrompt', () => {
  it('lists each component name and description', () => {
    const p = buildSystemPrompt(components, data);
    expect(p).toContain('LineChart');
    expect(p).toContain('SVG line chart.');
  });
  it('lists each data source id and forbids inventing data', () => {
    const p = buildSystemPrompt(components, data);
    expect(p).toContain('revenue.monthly');
    expect(p).toContain('useMetric');
    expect(p).toMatch(/never invent data|do not invent/i);
  });
  it('states the propose_widget tool and the jsx contract', () => {
    const p = buildSystemPrompt(components, data);
    expect(p).toContain('propose_widget');
    expect(p).toMatch(/return/i);
  });
  it('shows (none) when there are no data sources', () => {
    const p = buildSystemPrompt(components, createDataRegistry([]));
    expect(p).toContain('(none)');
  });
  it('appends an optional appendix', () => {
    const p = buildSystemPrompt(components, data, { appendix: 'EXTRA-GUIDANCE-XYZ' });
    expect(p).toContain('EXTRA-GUIDANCE-XYZ');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm --filter @nikolayvalev/command-panel test`
Expected: FAIL — cannot resolve `./system-prompt`.

- [ ] **Step 3: Implement `system-prompt.ts`**

```ts
import type { ComponentRegistry } from '../registry/component-registry';
import type { DataRegistry } from '../registry/data-registry';

export interface SystemPromptOptions {
  /** Extra guidance appended after the standard rules. */
  appendix?: string;
}

const HOST_ELEMENTS_DOC =
  'div, span, p, ul, ol, li, section, header, footer, h1-h6, small, strong, em, b, i, br, hr';

/** Build the model's system prompt from the live component + data registries. */
export function buildSystemPrompt(
  components: ComponentRegistry,
  data: DataRegistry,
  options: SystemPromptOptions = {},
): string {
  const componentLines = components.entries
    .map(
      (e) =>
        `- <${e.name}> — ${e.description}` +
        (e.propsSchema ? ` Props: ${JSON.stringify(e.propsSchema)}` : ''),
    )
    .join('\n');

  const dataLines = data.sources.length
    ? data.sources.map((s) => `- "${s.id}" — ${s.description}`).join('\n')
    : '- (none)';

  return [
    'You are a generative-UI assistant for a "command panel". When a request is best answered visually, call the `propose_widget` tool to propose one or more widgets. You may also reply with plain text.',
    '',
    "A widget's `jsx` is the BODY of a function component (no imports). It may call the hooks `useState`, `useMemo`, `useRef`, and `useMetric(id, params?)`, and MUST `return` a single element.",
    '',
    'You may ONLY use these components (PascalCase):',
    componentLines,
    '',
    `You may also use these plain HTML elements for layout/text: ${HOST_ELEMENTS_DOC}. On HTML elements only the \`className\` attribute is allowed — no inline styles, no event handlers.`,
    '',
    'Data comes ONLY from `useMetric(id)`, which returns `{ data, loading, error }`. You may ONLY reference these data source ids — never invent data or ids:',
    dataLines,
    '',
    'Rules:',
    "- List every data source id a widget uses in the tool's `dataSources` field.",
    '- Do NOT use imports, `fetch`, `window`, `document`, `eval`, or any other browser/global API. Only the components, host elements, hooks, and `useMetric` above are available.',
    '- Keep each widget focused on answering one question.',
    ...(options.appendix ? ['', options.appendix] : []),
  ].join('\n');
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm --filter @nikolayvalev/command-panel test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/command-panel/src/generation/system-prompt.ts packages/command-panel/src/generation/system-prompt.test.ts
git commit -m "feat(command-panel): system-prompt builder from the registries"
```

---

### Task 3: `propose_widget` schema + tool (TDD)

**Files:**
- Create: `packages/command-panel/src/generation/propose-widget.ts`
- Test: `packages/command-panel/src/generation/propose-widget.test.ts`

**Interfaces:**
- Consumes: `tool` from `ai`; `z` from `zod`.
- Produces:
  - `proposeWidgetSchema` (a `zod` object schema with `title`, `description`, `jsx`, `dataSources`)
  - `type ProposeWidgetInput = z.infer<typeof proposeWidgetSchema>`
  - `proposeWidgetTool` (the AI SDK tool, no `execute`)

- [ ] **Step 1: Write the failing test**

`packages/command-panel/src/generation/propose-widget.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { proposeWidgetSchema, proposeWidgetTool } from './propose-widget';

describe('proposeWidgetSchema', () => {
  it('accepts a valid widget proposal', () => {
    const r = proposeWidgetSchema.safeParse({
      title: 'Revenue',
      description: 'Monthly revenue line chart.',
      jsx: "const m = useMetric('revenue.monthly'); return <LineChart data={m.data ?? []} />;",
      dataSources: ['revenue.monthly'],
    });
    expect(r.success).toBe(true);
  });
  it('rejects a proposal missing jsx', () => {
    const r = proposeWidgetSchema.safeParse({ title: 'X', description: 'y', dataSources: [] });
    expect(r.success).toBe(false);
  });
  it('rejects dataSources that is not an array of strings', () => {
    const r = proposeWidgetSchema.safeParse({ title: 'X', description: 'y', jsx: 'return null;', dataSources: 'nope' });
    expect(r.success).toBe(false);
  });
});

describe('proposeWidgetTool', () => {
  it('is a tool with a description', () => {
    expect(typeof proposeWidgetTool.description).toBe('string');
    expect(proposeWidgetTool.description.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm --filter @nikolayvalev/command-panel test`
Expected: FAIL — cannot resolve `./propose-widget`.

- [ ] **Step 3: Implement `propose-widget.ts`**

```ts
import { tool } from 'ai';
import { z } from 'zod';

export const proposeWidgetSchema = z.object({
  title: z.string().describe('Short human-readable title for the widget.'),
  description: z.string().describe('One sentence on what the widget shows.'),
  jsx: z
    .string()
    .describe(
      'Function-component body (no imports) that returns a single element built only from the allowed components, host elements, and useMetric.',
    ),
  dataSources: z.array(z.string()).describe('The data source ids this widget reads via useMetric.'),
});

export type ProposeWidgetInput = z.infer<typeof proposeWidgetSchema>;

/**
 * The tool the model calls to propose a widget. It has NO `execute`: the tool
 * call is surfaced to the client, which renders/pins the widget. The model
 * proposes; it does not run anything.
 */
export const proposeWidgetTool = tool({
  description: 'Propose a UI widget (chart, stat card, etc.) to render in the command panel.',
  inputSchema: proposeWidgetSchema,
});
```

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm --filter @nikolayvalev/command-panel test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/command-panel/src/generation/propose-widget.ts packages/command-panel/src/generation/propose-widget.test.ts
git commit -m "feat(command-panel): propose_widget tool + schema"
```

---

### Task 4: Generation handler — `runGeneration` + `createCommandPanelHandler` (TDD)

**Files:**
- Create: `packages/command-panel/src/generation/handler.ts`
- Test: `packages/command-panel/src/generation/handler.test.ts`

**Interfaces:**
- Consumes: `streamText`, `convertToModelMessages`, types `ModelMessage`/`UIMessage`/`LanguageModel` from `ai`; `anthropic` from `@ai-sdk/anthropic`; `buildSystemPrompt` (`./system-prompt`); `proposeWidgetTool` (`./propose-widget`); `ComponentRegistry`/`DataRegistry`.
- Produces:
  - `const DEFAULT_MODEL_ID = 'claude-opus-4-8'`
  - `interface RunGenerationParams { componentRegistry; dataRegistry; messages: ModelMessage[]; model?: LanguageModel; system?: string }`
  - `runGeneration(params: RunGenerationParams)` → the `streamText` result
  - `interface CommandPanelHandlerConfig { componentRegistry; dataRegistry; model?: LanguageModel; system?: string }`
  - `createCommandPanelHandler(config): (req: Request) => Promise<Response>`

- [ ] **Step 1: Write the failing test**

`packages/command-panel/src/generation/handler.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { simulateReadableStream } from 'ai';
import { MockLanguageModelV4 } from 'ai/test';
import { runGeneration, createCommandPanelHandler } from './handler';
import { createComponentRegistry } from '../registry/component-registry';
import { createDataRegistry } from '../registry/data-registry';

const componentRegistry = createComponentRegistry([
  { name: 'LineChart', component: () => null, description: 'SVG line chart.' },
]);
const dataRegistry = createDataRegistry([
  { id: 'revenue.monthly', description: 'Monthly revenue.', load: async () => [1, 2, 3] },
]);

/** A mock model that emits a single propose_widget tool call. */
function mockProposing(input: unknown) {
  return new MockLanguageModelV4({
    doStream: async () => ({
      stream: simulateReadableStream({
        chunks: [
          { type: 'tool-call', toolCallId: 'c1', toolName: 'propose_widget', input },
          {
            type: 'finish',
            finishReason: { unified: 'tool-calls', raw: undefined },
            usage: { inputTokens: { total: 1 }, outputTokens: { total: 1 } },
          },
        ],
      }),
    }),
  });
}

const widgetInput = {
  title: 'Revenue',
  description: 'Monthly revenue.',
  jsx: "const m = useMetric('revenue.monthly'); return <LineChart data={m.data ?? []} />;",
  dataSources: ['revenue.monthly'],
};

describe('runGeneration', () => {
  it('surfaces the model\'s propose_widget tool call', async () => {
    const result = runGeneration({
      componentRegistry,
      dataRegistry,
      model: mockProposing(widgetInput),
      messages: [{ role: 'user', content: 'show me revenue' }],
    });
    const calls = await result.toolCalls;
    expect(calls).toHaveLength(1);
    expect(calls[0].toolName).toBe('propose_widget');
    expect(calls[0].input).toMatchObject({ title: 'Revenue', dataSources: ['revenue.monthly'] });
  });
});

describe('createCommandPanelHandler', () => {
  it('returns a streaming Response for a POST of UI messages', async () => {
    const handler = createCommandPanelHandler({
      componentRegistry,
      dataRegistry,
      model: mockProposing(widgetInput),
    });
    const req = new Request('http://localhost/api/command-panel', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        messages: [{ id: 'm1', role: 'user', parts: [{ type: 'text', text: 'show me revenue' }] }],
      }),
    });
    const res = await handler(req);
    expect(res).toBeInstanceOf(Response);
    expect(res.ok).toBe(true);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm --filter @nikolayvalev/command-panel test`
Expected: FAIL — cannot resolve `./handler`.

- [ ] **Step 3: Implement `handler.ts`**

```ts
import {
  streamText,
  convertToModelMessages,
  type ModelMessage,
  type UIMessage,
  type LanguageModel,
} from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import type { ComponentRegistry } from '../registry/component-registry';
import type { DataRegistry } from '../registry/data-registry';
import { buildSystemPrompt } from './system-prompt';
import { proposeWidgetTool } from './propose-widget';

/** Default Claude model for generation. Resolved via @ai-sdk/anthropic (ANTHROPIC_API_KEY). */
export const DEFAULT_MODEL_ID = 'claude-opus-4-8';

export interface RunGenerationParams {
  componentRegistry: ComponentRegistry;
  dataRegistry: DataRegistry;
  messages: ModelMessage[];
  /** Override the model (e.g. a mock in tests). Defaults to anthropic(DEFAULT_MODEL_ID). */
  model?: LanguageModel;
  /** Override the system prompt. Defaults to buildSystemPrompt(...). */
  system?: string;
}

/** Testable core: builds the system prompt and runs the model with the propose_widget tool. */
export function runGeneration(params: RunGenerationParams) {
  const { componentRegistry, dataRegistry, messages, model, system } = params;
  return streamText({
    model: model ?? anthropic(DEFAULT_MODEL_ID),
    system: system ?? buildSystemPrompt(componentRegistry, dataRegistry),
    messages,
    tools: { propose_widget: proposeWidgetTool },
  });
}

export interface CommandPanelHandlerConfig {
  componentRegistry: ComponentRegistry;
  dataRegistry: DataRegistry;
  model?: LanguageModel;
  system?: string;
}

/**
 * Web-standard route handler (drop into a Next.js `route.ts` as `POST`).
 * Accepts `{ messages: UIMessage[] }` and returns a streaming UI-message response.
 */
export function createCommandPanelHandler(config: CommandPanelHandlerConfig) {
  return async (req: Request): Promise<Response> => {
    const { messages } = (await req.json()) as { messages: UIMessage[] };
    const result = runGeneration({
      componentRegistry: config.componentRegistry,
      dataRegistry: config.dataRegistry,
      model: config.model,
      system: config.system,
      messages: convertToModelMessages(messages),
    });
    return result.toUIMessageStreamResponse();
  };
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm --filter @nikolayvalev/command-panel test`
Expected: PASS — `runGeneration` surfaces the `propose_widget` call; the handler returns an `ok` `Response`.

> If `convertToModelMessages` rejects the test's UI message shape, STOP and report the exact error — do not weaken the assertion. The `{ id, role, parts: [{ type: 'text', text }] }` shape is the AI SDK v7 `UIMessage`; a mismatch is a real signal to surface, not paper over.

- [ ] **Step 5: Commit**

```bash
git add packages/command-panel/src/generation/handler.ts packages/command-panel/src/generation/handler.test.ts
git commit -m "feat(command-panel): streaming generation handler (Claude + propose_widget)"
```

---

### Task 5: Data transport — `createHttpDataResolver` + `createDataRouteHandler` (TDD)

**Files:**
- Create: `packages/command-panel/src/generation/http-resolver.ts`
- Create: `packages/command-panel/src/generation/data-route.ts`
- Test: `packages/command-panel/src/generation/data-transport.test.ts`

**Interfaces:**
- Consumes: `DataResolver`, `DataRegistry`, `getDataSource` from `../registry/data-registry`.
- Produces:
  - `createHttpDataResolver(endpoint: string, fetchImpl?: typeof fetch): DataResolver` (client)
  - `createDataRouteHandler(dataRegistry: DataRegistry): (req: Request) => Promise<Response>` (server)

- [ ] **Step 1: Write the failing test**

`packages/command-panel/src/generation/data-transport.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { createHttpDataResolver } from './http-resolver';
import { createDataRouteHandler } from './data-route';
import { createDataRegistry } from '../registry/data-registry';

describe('createHttpDataResolver', () => {
  it('POSTs the id/params and returns the parsed body', async () => {
    let seen: { url: string; body: string } | undefined;
    const fakeFetch = (async (url: string, init?: RequestInit) => {
      seen = { url, body: String(init?.body) };
      return new Response(JSON.stringify({ value: 42 }), { status: 200 });
    }) as unknown as typeof fetch;

    const resolve = createHttpDataResolver('/api/data', fakeFetch);
    const out = await resolve('revenue.monthly', { range: '30d' });
    expect(out).toEqual({ value: 42 });
    expect(seen?.url).toBe('/api/data');
    expect(JSON.parse(seen!.body)).toEqual({ id: 'revenue.monthly', params: { range: '30d' } });
  });

  it('throws when the response is not ok', async () => {
    const fakeFetch = (async () => new Response('boom', { status: 500 })) as unknown as typeof fetch;
    const resolve = createHttpDataResolver('/api/data', fakeFetch);
    await expect(resolve('x')).rejects.toThrow(/500/);
  });
});

describe('createDataRouteHandler', () => {
  const registry = createDataRegistry([
    { id: 'revenue.monthly', description: 'Monthly revenue.', load: async (p) => ({ p: p ?? null }) },
  ]);

  const post = (body: unknown) =>
    new Request('http://localhost/api/data', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });

  it('resolves a registered source', async () => {
    const res = await createDataRouteHandler(registry)(post({ id: 'revenue.monthly', params: { range: '7d' } }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ p: { range: '7d' } });
  });

  it('404s an unknown id', async () => {
    const res = await createDataRouteHandler(registry)(post({ id: 'nope' }));
    expect(res.status).toBe(404);
    expect((await res.json()).error).toMatch(/unknown data source: nope/i);
  });

  it('400s a missing id', async () => {
    const res = await createDataRouteHandler(registry)(post({}));
    expect(res.status).toBe(400);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm --filter @nikolayvalev/command-panel test`
Expected: FAIL — cannot resolve `./http-resolver` / `./data-route`.

- [ ] **Step 3: Implement `http-resolver.ts`**

```ts
import type { DataResolver } from '../registry/data-registry';

/**
 * Client-side DataResolver that fetches from the engine's read-only data route.
 * Pass a custom `fetchImpl` for testing; defaults to the global `fetch`.
 */
export function createHttpDataResolver(endpoint: string, fetchImpl: typeof fetch = fetch): DataResolver {
  return async (id, params) => {
    const res = await fetchImpl(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id, params }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`Data request failed (${res.status})${text ? `: ${text}` : ''}`);
    }
    return (await res.json()) as unknown;
  };
}
```

- [ ] **Step 4: Implement `data-route.ts`**

```ts
import { getDataSource, type DataRegistry } from '../registry/data-registry';

/**
 * Read-only data route (drop into a Next.js `route.ts` as `POST`). Accepts
 * `{ id, params }`, resolves a REGISTERED DataSource, and rejects unknown ids.
 * This is the only outbound data path the generated widgets' `useMetric` can use.
 */
export function createDataRouteHandler(dataRegistry: DataRegistry) {
  return async (req: Request): Promise<Response> => {
    let body: { id?: string; params?: Record<string, unknown> };
    try {
      body = (await req.json()) as typeof body;
    } catch {
      return Response.json({ error: 'Invalid JSON body.' }, { status: 400 });
    }
    if (!body.id) {
      return Response.json({ error: 'Missing data source id.' }, { status: 400 });
    }
    const source = getDataSource(dataRegistry, body.id);
    if (!source) {
      return Response.json({ error: `Unknown data source: ${body.id}` }, { status: 404 });
    }
    try {
      const data = await source.load(body.params);
      return Response.json(data ?? null);
    } catch (e) {
      return Response.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
    }
  };
}
```

- [ ] **Step 5: Run to verify it passes**

Run: `pnpm --filter @nikolayvalev/command-panel test`
Expected: PASS — resolver POSTs + parses + errors; route resolves/404s/400s.

- [ ] **Step 6: Commit**

```bash
git add packages/command-panel/src/generation/http-resolver.ts packages/command-panel/src/generation/data-route.ts packages/command-panel/src/generation/data-transport.test.ts
git commit -m "feat(command-panel): read-only data route + http useMetric transport"
```

---

### Task 6: Wire the public surfaces + build + typecheck/lint

**Files:**
- Modify: `packages/command-panel/src/server.ts` (real re-exports)
- Modify: `packages/command-panel/src/index.ts` (add `createHttpDataResolver`)

**Interfaces:**
- Consumes: everything from Tasks 2–5.
- Produces: the generation server API importable from `@nikolayvalev/command-panel/server`, and `createHttpDataResolver` from `@nikolayvalev/command-panel`.

- [ ] **Step 1: Replace `src/server.ts` with the real re-exports**

```ts
// Server-only entry: the LLM generation layer (imports the AI SDK). Keep this
// out of client bundles — import from "@nikolayvalev/command-panel/server".
export { buildSystemPrompt, type SystemPromptOptions } from './generation/system-prompt';
export {
  proposeWidgetSchema,
  proposeWidgetTool,
  type ProposeWidgetInput,
} from './generation/propose-widget';
export {
  runGeneration,
  createCommandPanelHandler,
  DEFAULT_MODEL_ID,
  type RunGenerationParams,
  type CommandPanelHandlerConfig,
} from './generation/handler';
export { createDataRouteHandler } from './generation/data-route';
```

- [ ] **Step 2: Add the client transport to `src/index.ts`**

Append to `packages/command-panel/src/index.ts`:
```ts
// Client-side data transport for useMetric (no AI SDK — safe in client bundles).
export { createHttpDataResolver } from './generation/http-resolver';
```

- [ ] **Step 3: Typecheck and lint**

Run:
```bash
pnpm --filter @nikolayvalev/command-panel typecheck
pnpm --filter @nikolayvalev/command-panel lint
```
Expected: both clean (0 errors, 0 warnings).

- [ ] **Step 4: Build and verify both entries expose their surfaces**

Run:
```bash
pnpm --filter @nikolayvalev/command-panel build
node -e "const fs=require('fs');const s=fs.readFileSync('./packages/command-panel/dist/server.d.ts','utf8');for(const n of ['buildSystemPrompt','proposeWidgetTool','createCommandPanelHandler','createDataRouteHandler','runGeneration']){if(!s.includes(n)){console.error('MISSING server export:',n);process.exit(1)}}const i=fs.readFileSync('./packages/command-panel/dist/index.d.ts','utf8');if(!i.includes('createHttpDataResolver')){console.error('MISSING index export: createHttpDataResolver');process.exit(1)}console.log('OK: generation surfaces present in dist')"
```
Expected: build succeeds; prints `OK: generation surfaces present in dist`.

- [ ] **Step 5: Full test suite once more**

Run: `pnpm --filter @nikolayvalev/command-panel test`
Expected: PASS — all 2a + 2b tests green, output pristine.

- [ ] **Step 6: Commit**

```bash
git add packages/command-panel/src/server.ts packages/command-panel/src/index.ts
git commit -m "feat(command-panel): export the generation server + client transport surfaces"
```

---

## Self-Review

**1. Spec coverage (Phase 2b scope = "Generation + server"):**
- System-prompt builder from the registries → Task 2. ✓
- `propose_widget` tool (`{title, description, jsx, dataSources}`) → Task 3. ✓
- Streaming Next.js route-handler factory, Vercel AI SDK + `@ai-sdk/anthropic` + `claude-opus-4-8` → Tasks 1, 4. ✓
- HTTP `DataResolver` transport for `useMetric` (read-only per-id endpoint) → Task 5 (resolver + route). ✓
- Server owns the key; client never sees it → `@ai-sdk/anthropic` reads `ANTHROPIC_API_KEY` server-side; the server-only entry keeps it off the client (Tasks 1, 4; Global Constraints). ✓
- (Panel UI + pinned store = **Phase 2c**; reference host = **Phase 3** — out of scope.)

**2. Placeholder scan:** No TBD/TODO; every code step has complete, version-verified code; every command has expected output. The Task 1 `export {}` server placeholder is a real, building module replaced in Task 6 — not a stub left behind.

**3. Type consistency:** `RunGenerationParams`/`CommandPanelHandlerConfig`/`SystemPromptOptions`/`ProposeWidgetInput`/`DEFAULT_MODEL_ID` are defined once and consumed unchanged. `runGeneration`/`createCommandPanelHandler`/`buildSystemPrompt`/`proposeWidgetTool`/`createHttpDataResolver`/`createDataRouteHandler` signatures match every call site and the Task 6 re-exports. `DataResolver`/`DataRegistry`/`getDataSource`/`ComponentRegistry` are the exact Phase 2a names. AI SDK names (`tool`/`inputSchema`, `streamText`/`.toUIMessageStreamResponse`/`.toolCalls`, `convertToModelMessages`, `MockLanguageModelV4`/`simulateReadableStream`, `anthropic`) verified against `ai@7.0.2`/`@ai-sdk/anthropic@4.0.0`.

---

## Follow-on plans (not in this document)

- **Phase 2c — Panel UI + state:** the `CommandPanel` two-pane shell, `ChatPane` (consuming the streaming handler via `@ai-sdk/react` `useChat`), `WidgetPreviewCard` (inline preview via the 2a `WidgetRenderer` + a Pin action wired through a `DataResolverProvider` backed by `createHttpDataResolver`), `DashboardGrid`, and the pinned store (`@repo/state` + `localStorage`). This is where the `propose_widget` tool-call parts get rendered.
- **Phase 3 — Reference host:** `apps/command-panel` (Next.js) wiring `createCommandPanelHandler` + `createDataRouteHandler` to a `DataRegistry` of monorepo metrics, mounting `<CommandPanel>`; e2e smoke.
