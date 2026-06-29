# Command Panel Phase 2c — Panel UI + Pinned Store Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the two-pane Command Panel UI (chat ↔ dashboard) with inline live widget previews and a persistent pinned dashboard, completing the engine into a usable product.

**Architecture:** All client-safe React under `packages/command-panel/src/ui/` + `src/state/`, exported from `src/index.ts`. Chat uses `@ai-sdk/react`'s `useChat` with `ai`'s `DefaultChatTransport` (injectable `fetch`/transport → testable without a network). Inline previews **and** dashboard tiles both render through the existing Phase-2a `WidgetRenderer` (validate → transpile → eval → error boundary); data flows through the existing `DataResolverProvider` + `createHttpDataResolver`. Pinned state uses `@repo/state`'s `createStateFactory` + React's `useSyncExternalStore` + `localStorage` (no `zustand` dependency — it is not installed and would add runtime weight; `createStateFactory` is the framework-agnostic store the package actually ships).

**Tech Stack:** React 18, `@ai-sdk/react` (`useChat`) + `ai@7` (`DefaultChatTransport`, `isToolUIPart`, `getToolName`), `@repo/state` (`createStateFactory`), `@nikolayvalev/design-system` (`Button`, `Input`, `Card*`), Vitest + jsdom + `@testing-library/react`.

## Global Constraints

- **Client-safe only.** Nothing under `src/ui/` or `src/state/` may import the server surface (`./server`, `@ai-sdk/anthropic`, `streamText`, `convertToModelMessages`). The Anthropic key never reaches the client. Importing `DefaultChatTransport`, `isToolUIPart`, `getToolName`, and types from `'ai'` is allowed (these are the documented client-side primitives).
- **One sandbox path.** All widget rendering — inline preview AND dashboard — goes through the existing `WidgetRenderer` (`src/sandbox/WidgetRenderer.tsx`). Never introduce a second `eval`/`new Function`/transpile path. Always pass a **stable** `registry` reference (module-scope or `useMemo`); an unstable identity forces a full rebuild every render.
- **Tool parts use the v7 typed shape.** Narrow with `isToolUIPart(part)` + `getToolName(part) === 'propose_widget'`, gated on `part.state` being `'input-available'` or `'output-available'`. The proposal is `part.input` (`{ title, description, jsx, dataSources }`); the id is `part.toolCallId`. (Our `propose_widget` tool has no `execute`, so it lands at `'input-available'`.)
- **`useChat` does NOT manage input.** Manage input with `useState`; submit via `sendMessage({ text })`.
- **Persisted pinned shape:** `PinnedWidget[]` where `PinnedWidget = { id: string; title: string; description: string; jsx: string; dataSources: string[] }`. Stored as JSON under the key `command-panel:pinned`.
- **Publish-safe bundling.** `@nikolayvalev/command-panel` is published; `@repo/state` is a `private` workspace package, so it must be **bundled** into `dist` (add as a `devDependency` + tsup `noExternal: ['@repo/state']`), never externalized. `@ai-sdk/react` is a real runtime dependency and IS externalized (consumers install it), matching the Phase-2b treatment of `ai`/`@ai-sdk/anthropic`.
- **Engine lint config:** base + react-hooks (NOT the DS-governance config). `no-explicit-any` is off; `no-new-func` is an error. DOM test files start with `// @vitest-environment jsdom`; `globals: true` is already set in `vitest.config.ts` so `@testing-library/react`'s `afterEach(cleanup)` runs.
- **Styling:** reuse DS components (`Button`, `Input`, `Card*`) for chrome; any inline styles use design-system tokens (`var(--...)`), never hardcoded hex.

## File Structure

```text
packages/command-panel/src/
  state/
    pinned-store.ts             # createPinnedStore() — @repo/state + localStorage; PinnedWidget, PinnedStore
    pinned-store.test.ts        # node-env unit tests (injected fake storage)
    use-pinned-store.tsx        # PinnedStoreProvider + usePinnedStore (useSyncExternalStore)
    use-pinned-store.dom.test.tsx
  ui/
    WidgetPreviewCard.tsx       # presentational: title/desc + WidgetRenderer + Pin button
    WidgetPreviewCard.dom.test.tsx
    DashboardGrid.tsx           # grid of pinned widgets + remove/reorder
    DashboardGrid.dom.test.tsx
    ChatPane.tsx                # useChat + DefaultChatTransport; renders text + tool-propose_widget previews
    ChatPane.dom.test.tsx       # canned-SSE end-to-end of rendered tool-call parts (carry-over #1)
    CommandPanel.tsx            # two-pane shell wiring DataResolverProvider + PinnedStoreProvider
    CommandPanel.dom.test.tsx
    deps.smoke.test.ts          # Task 1 smoke import
  generation/
    data-route.ts               # MODIFY: non-object params guard (carry-over #2)
    data-transport.test.ts      # MODIFY: add params-guard cases
  index.ts                      # MODIFY: export the new UI + state public surface
package.json                    # MODIFY: deps
tsup.config.ts                  # MODIFY: external/noExternal
```

---

### Task 1: Dependencies + build wiring

**Files:**
- Modify: `packages/command-panel/package.json`
- Modify: `packages/command-panel/tsup.config.ts`
- Test: `packages/command-panel/src/ui/deps.smoke.test.ts` (create)

**Interfaces:**
- Consumes: nothing (foundation task).
- Produces: `@ai-sdk/react` (`useChat`) and `@repo/state` (`createStateFactory`) resolvable inside the package; tsup configured to externalize `@ai-sdk/react` and bundle `@repo/state`.

- [ ] **Step 1: Add the dependencies**

Run (from repo root):

```bash
pnpm --filter @nikolayvalev/command-panel add @ai-sdk/react
pnpm --filter @nikolayvalev/command-panel add -D @repo/state@workspace:*
```

Expected: `@ai-sdk/react` resolves to a version compatible with `ai@7` (expected `^2.x`) and lands in `dependencies`; `@repo/state` lands in `devDependencies` as `workspace:*`. If pnpm reports a peer conflict between `@ai-sdk/react` and `ai@7.0.2`, pick the `@ai-sdk/react` version whose peer range includes `ai@7` (do not downgrade `ai`).

- [ ] **Step 2: Update `tsup.config.ts`**

```ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/server.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  external: [
    'react',
    'react-dom',
    '@nikolayvalev/design-system',
    'ai',
    '@ai-sdk/anthropic',
    '@ai-sdk/provider-utils',
    '@ai-sdk/react',
    'zod',
  ],
  // @repo/state is a PRIVATE workspace package; bundle it so the published
  // engine is self-contained (it has zero runtime deps of its own).
  noExternal: ['@repo/state'],
});
```

- [ ] **Step 3: Write the smoke test**

`packages/command-panel/src/ui/deps.smoke.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, isToolUIPart, getToolName } from 'ai';
import { createStateFactory } from '@repo/state';

describe('phase 2c dependencies', () => {
  it('exposes the client chat + state primitives', () => {
    expect(typeof useChat).toBe('function');
    expect(typeof DefaultChatTransport).toBe('function');
    expect(typeof isToolUIPart).toBe('function');
    expect(typeof getToolName).toBe('function');
    expect(typeof createStateFactory).toBe('function');
  });
});
```

- [ ] **Step 4: Run the smoke test**

Run: `pnpm --filter @nikolayvalev/command-panel exec vitest run src/ui/deps.smoke.test.ts`
Expected: PASS (1 test). If `@repo/state` fails to resolve, run `pnpm --filter @repo/state build` (it must be built to `dist`) and retry.

- [ ] **Step 5: Verify the build still emits both entries**

Run: `pnpm --filter @nikolayvalev/command-panel build`
Expected: build succeeds; `dist/index.js`, `dist/index.d.ts`, `dist/server.js`, `dist/server.d.ts` all present. (`@repo/state` code is inlined into `dist/index.js`; `@ai-sdk/react` is left as an external import.)

- [ ] **Step 6: Commit**

```bash
git add packages/command-panel/package.json packages/command-panel/tsup.config.ts packages/command-panel/src/ui/deps.smoke.test.ts pnpm-lock.yaml
git commit -m "feat(command-panel): add @ai-sdk/react + @repo/state for panel UI"
```

---

### Task 2: Data route — non-object `params` guard (review carry-over #2)

**Files:**
- Modify: `packages/command-panel/src/generation/data-route.ts`
- Test: `packages/command-panel/src/generation/data-transport.test.ts` (add cases)

**Interfaces:**
- Consumes: existing `createDataRouteHandler(dataRegistry)`.
- Produces: same handler, now rejecting a present-but-non-object `params` with HTTP 400 before resolving the source.

**Why:** Phase 2b deferred a guard so a malformed `params` (string, array, null) cannot reach a `DataSource.load`. `params` is optional; when present it must be a plain JSON object.

- [ ] **Step 1: Write the failing tests**

Add inside the existing `describe('createDataRouteHandler', ...)` block in `data-transport.test.ts`:

```ts
it('400s a non-object params (string)', async () => {
  const res = await createDataRouteHandler(registry)(post({ id: 'revenue.monthly', params: 'nope' }));
  expect(res.status).toBe(400);
  expect((await res.json()).error).toMatch(/params/i);
});

it('400s an array params', async () => {
  const res = await createDataRouteHandler(registry)(post({ id: 'revenue.monthly', params: [1, 2] }));
  expect(res.status).toBe(400);
});

it('still resolves when params is omitted', async () => {
  const res = await createDataRouteHandler(registry)(post({ id: 'revenue.monthly' }));
  expect(res.status).toBe(200);
  expect(await res.json()).toEqual({ p: null });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm --filter @nikolayvalev/command-panel exec vitest run src/generation/data-transport.test.ts`
Expected: the two 400 cases FAIL (currently a string/array `params` would be passed through to `load`).

- [ ] **Step 3: Add the guard**

In `data-route.ts`, insert this block immediately after the `if (!body.id)` check and before `getDataSource(...)`:

```ts
if (
  body.params !== undefined &&
  (typeof body.params !== 'object' || body.params === null || Array.isArray(body.params))
) {
  return Response.json({ error: 'Invalid params: expected an object.' }, { status: 400 });
}
```

- [ ] **Step 4: Run to verify pass**

Run: `pnpm --filter @nikolayvalev/command-panel exec vitest run src/generation/data-transport.test.ts`
Expected: PASS (all cases, including the pre-existing ones).

- [ ] **Step 5: Commit**

```bash
git add packages/command-panel/src/generation/data-route.ts packages/command-panel/src/generation/data-transport.test.ts
git commit -m "fix(command-panel): reject non-object params on the data route"
```

---

### Task 3: Pinned store (`@repo/state` + localStorage)

**Files:**
- Create: `packages/command-panel/src/state/pinned-store.ts`
- Test: `packages/command-panel/src/state/pinned-store.test.ts`

**Interfaces:**
- Consumes: `createStateFactory` from `@repo/state`.
- Produces:
  - `interface PinnedWidget { id: string; title: string; description: string; jsx: string; dataSources: string[] }`
  - `type StorageLike = Pick<Storage, 'getItem' | 'setItem'>`
  - `interface PinnedStoreOptions { storageKey?: string; storage?: StorageLike | null }`
  - `interface PinnedStore { getState(): PinnedWidget[]; subscribe(listener: () => void): () => void; pin(w: PinnedWidget): void; unpin(id: string): void; reorder(from: number, to: number): void; clear(): void }`
  - `function createPinnedStore(options?: PinnedStoreOptions): PinnedStore`
  - `const DEFAULT_STORAGE_KEY = 'command-panel:pinned'`

**Design note:** `@repo/state` reducers are typed `(state, payload: unknown) => state`. To satisfy that constraint cleanly under `strictFunctionTypes`, the reducers below take `unknown` payloads and narrow internally; the typed `PinnedStore` facade is the public API. `getState()` returns a stable array reference until a dispatch actually changes state (the factory skips notifying on `Object.is`-equal results), which is what `useSyncExternalStore` needs.

- [ ] **Step 1: Write the failing tests**

`packages/command-panel/src/state/pinned-store.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { createPinnedStore, type PinnedWidget, type StorageLike } from './pinned-store';

const widget = (id: string): PinnedWidget => ({
  id,
  title: `Widget ${id}`,
  description: 'desc',
  jsx: 'return null;',
  dataSources: [],
});

function fakeStorage(seed?: Record<string, string>): StorageLike & { map: Map<string, string> } {
  const map = new Map<string, string>(Object.entries(seed ?? {}));
  return {
    map,
    getItem: (k) => (map.has(k) ? map.get(k)! : null),
    setItem: (k, v) => {
      map.set(k, v);
    },
  };
}

describe('createPinnedStore', () => {
  it('pins, dedups by id, unpins, and clears', () => {
    const store = createPinnedStore({ storage: null });
    store.pin(widget('a'));
    store.pin(widget('a')); // dedup
    store.pin(widget('b'));
    expect(store.getState().map((w) => w.id)).toEqual(['a', 'b']);
    store.unpin('a');
    expect(store.getState().map((w) => w.id)).toEqual(['b']);
    store.clear();
    expect(store.getState()).toEqual([]);
  });

  it('reorders by index and ignores out-of-range / no-op moves', () => {
    const store = createPinnedStore({ storage: null });
    store.pin(widget('a'));
    store.pin(widget('b'));
    store.pin(widget('c'));
    store.reorder(0, 2);
    expect(store.getState().map((w) => w.id)).toEqual(['b', 'c', 'a']);
    const before = store.getState();
    store.reorder(0, 0); // no-op
    store.reorder(5, 1); // out of range
    expect(store.getState()).toBe(before); // unchanged reference
  });

  it('persists to storage on change', () => {
    const storage = fakeStorage();
    const store = createPinnedStore({ storage, storageKey: 'k' });
    store.pin(widget('a'));
    expect(JSON.parse(storage.map.get('k')!)).toEqual([widget('a')]);
  });

  it('hydrates from storage and drops corrupt entries', () => {
    const good = widget('a');
    const storage = fakeStorage({ k: JSON.stringify([good, { id: 5 }, 'nope']) });
    const store = createPinnedStore({ storage, storageKey: 'k' });
    expect(store.getState()).toEqual([good]);
  });

  it('returns [] when storage holds invalid JSON', () => {
    const storage = fakeStorage({ k: '{not json' });
    const store = createPinnedStore({ storage, storageKey: 'k' });
    expect(store.getState()).toEqual([]);
  });

  it('notifies subscribers on change only', () => {
    const store = createPinnedStore({ storage: null });
    let calls = 0;
    const unsub = store.subscribe(() => {
      calls += 1;
    });
    store.pin(widget('a'));
    store.pin(widget('a')); // dedup → no notify
    expect(calls).toBe(1);
    unsub();
    store.pin(widget('b'));
    expect(calls).toBe(1);
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm --filter @nikolayvalev/command-panel exec vitest run src/state/pinned-store.test.ts`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement `pinned-store.ts`**

```ts
import { createStateFactory } from '@repo/state';

export interface PinnedWidget {
  id: string;
  title: string;
  description: string;
  jsx: string;
  dataSources: string[];
}

interface PinnedState {
  widgets: PinnedWidget[];
}

export type StorageLike = Pick<Storage, 'getItem' | 'setItem'>;

export interface PinnedStoreOptions {
  storageKey?: string;
  /** Injectable for tests / SSR. `null` disables persistence. Omit to use window.localStorage. */
  storage?: StorageLike | null;
}

export interface PinnedStore {
  getState(): PinnedWidget[];
  subscribe(listener: () => void): () => void;
  pin(widget: PinnedWidget): void;
  unpin(id: string): void;
  reorder(from: number, to: number): void;
  clear(): void;
}

export const DEFAULT_STORAGE_KEY = 'command-panel:pinned';

function isPinnedWidget(v: unknown): v is PinnedWidget {
  if (typeof v !== 'object' || v === null) return false;
  const w = v as Record<string, unknown>;
  return (
    typeof w.id === 'string' &&
    typeof w.title === 'string' &&
    typeof w.description === 'string' &&
    typeof w.jsx === 'string' &&
    Array.isArray(w.dataSources) &&
    w.dataSources.every((s) => typeof s === 'string')
  );
}

function loadWidgets(storage: StorageLike | null, key: string): PinnedWidget[] {
  if (!storage) return [];
  let raw: string | null;
  try {
    raw = storage.getItem(key);
  } catch {
    return [];
  }
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isPinnedWidget) : [];
  } catch {
    return [];
  }
}

function resolveStorage(options: PinnedStoreOptions): StorageLike | null {
  if (options.storage !== undefined) return options.storage; // explicit (incl. null) wins
  try {
    return typeof globalThis.localStorage !== 'undefined' ? globalThis.localStorage : null;
  } catch {
    return null; // localStorage access can throw under privacy settings
  }
}

const reducers = {
  pin: (state: PinnedState, payload: unknown): PinnedState => {
    const widget = payload as PinnedWidget;
    if (state.widgets.some((w) => w.id === widget.id)) return state;
    return { widgets: [...state.widgets, widget] };
  },
  unpin: (state: PinnedState, payload: unknown): PinnedState => {
    const id = payload as string;
    return { widgets: state.widgets.filter((w) => w.id !== id) };
  },
  reorder: (state: PinnedState, payload: unknown): PinnedState => {
    const { from, to } = payload as { from: number; to: number };
    const n = state.widgets.length;
    if (from < 0 || from >= n || to < 0 || to >= n || from === to) return state;
    const next = state.widgets.slice();
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    return { widgets: next };
  },
  clear: (_state: PinnedState, _payload: unknown): PinnedState => ({ widgets: [] }),
};

export function createPinnedStore(options: PinnedStoreOptions = {}): PinnedStore {
  const key = options.storageKey ?? DEFAULT_STORAGE_KEY;
  const storage = resolveStorage(options);

  const factory = createStateFactory<PinnedState, typeof reducers>({
    name: 'command-panel-pinned',
    initialState: { widgets: [] },
    reducers,
  });
  const store = factory.createStore({ widgets: loadWidgets(storage, key) });

  if (storage) {
    store.subscribe((state) => {
      try {
        storage.setItem(key, JSON.stringify(state.widgets));
      } catch {
        /* ignore quota / serialization errors */
      }
    });
  }

  return {
    getState: () => store.getState().widgets,
    subscribe: (listener) => store.subscribe(() => listener()),
    pin: (widget) => {
      store.dispatch('pin', widget);
    },
    unpin: (id) => {
      store.dispatch('unpin', id);
    },
    reorder: (from, to) => {
      store.dispatch('reorder', { from, to });
    },
    clear: () => {
      store.dispatch('clear', undefined);
    },
  };
}
```

- [ ] **Step 4: Run to verify pass**

Run: `pnpm --filter @nikolayvalev/command-panel exec vitest run src/state/pinned-store.test.ts`
Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add packages/command-panel/src/state/pinned-store.ts packages/command-panel/src/state/pinned-store.test.ts
git commit -m "feat(command-panel): pinned store via @repo/state + localStorage"
```

---

### Task 4: React binding — `PinnedStoreProvider` + `usePinnedStore`

**Files:**
- Create: `packages/command-panel/src/state/use-pinned-store.tsx`
- Test: `packages/command-panel/src/state/use-pinned-store.dom.test.tsx`

**Interfaces:**
- Consumes: `createPinnedStore`, `PinnedStore`, `PinnedWidget` from `./pinned-store`.
- Produces:
  - `function PinnedStoreProvider({ store?, children }): JSX.Element` — supplies a `PinnedStore` via context; lazily creates a default one (once) if none is injected.
  - `function usePinnedStore(): { widgets: PinnedWidget[]; pin; unpin; reorder; clear }` — subscribes via `useSyncExternalStore`; throws if used outside a provider.

- [ ] **Step 1: Write the failing test**

`packages/command-panel/src/state/use-pinned-store.dom.test.tsx`:

```tsx
// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PinnedStoreProvider, usePinnedStore } from './use-pinned-store';
import { createPinnedStore, type PinnedWidget } from './pinned-store';

const w = (id: string): PinnedWidget => ({ id, title: `T${id}`, description: 'd', jsx: 'return null;', dataSources: [] });

function Probe(): JSX.Element {
  const { widgets, pin, unpin } = usePinnedStore();
  return (
    <div>
      <ul>{widgets.map((x) => <li key={x.id}>{x.title}</li>)}</ul>
      <button onClick={() => pin(w('a'))}>pin-a</button>
      <button onClick={() => unpin('a')}>unpin-a</button>
    </div>
  );
}

describe('usePinnedStore', () => {
  it('reflects pin/unpin and re-renders', () => {
    const store = createPinnedStore({ storage: null });
    render(
      <PinnedStoreProvider store={store}>
        <Probe />
      </PinnedStoreProvider>,
    );
    expect(screen.queryByText('Ta')).toBeNull();
    fireEvent.click(screen.getByText('pin-a'));
    expect(screen.getByText('Ta')).toBeTruthy();
    fireEvent.click(screen.getByText('unpin-a'));
    expect(screen.queryByText('Ta')).toBeNull();
  });

  it('throws outside a provider', () => {
    const spy = () => render(<Probe />);
    expect(spy).toThrow(/PinnedStoreProvider/);
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm --filter @nikolayvalev/command-panel exec vitest run src/state/use-pinned-store.dom.test.tsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement `use-pinned-store.tsx`**

```tsx
import * as React from 'react';
import { createPinnedStore, type PinnedStore, type PinnedWidget } from './pinned-store';

const PinnedStoreContext = React.createContext<PinnedStore | null>(null);

const EMPTY: PinnedWidget[] = [];

export function PinnedStoreProvider({
  store,
  children,
}: {
  store?: PinnedStore;
  children: React.ReactNode;
}): JSX.Element {
  const ref = React.useRef<PinnedStore | null>(null);
  if (!store && ref.current === null) ref.current = createPinnedStore();
  const value = store ?? ref.current!;
  return <PinnedStoreContext.Provider value={value}>{children}</PinnedStoreContext.Provider>;
}

export interface PinnedStoreApi {
  widgets: PinnedWidget[];
  pin: (widget: PinnedWidget) => void;
  unpin: (id: string) => void;
  reorder: (from: number, to: number) => void;
  clear: () => void;
}

export function usePinnedStore(): PinnedStoreApi {
  const store = React.useContext(PinnedStoreContext);
  if (!store) throw new Error('usePinnedStore must be used within a <PinnedStoreProvider>.');
  const widgets = React.useSyncExternalStore(store.subscribe, store.getState, () => EMPTY);
  return { widgets, pin: store.pin, unpin: store.unpin, reorder: store.reorder, clear: store.clear };
}
```

- [ ] **Step 4: Run to verify pass**

Run: `pnpm --filter @nikolayvalev/command-panel exec vitest run src/state/use-pinned-store.dom.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add packages/command-panel/src/state/use-pinned-store.tsx packages/command-panel/src/state/use-pinned-store.dom.test.tsx
git commit -m "feat(command-panel): PinnedStoreProvider + usePinnedStore binding"
```

---

### Task 5: `WidgetPreviewCard` (presentational preview + Pin)

**Files:**
- Create: `packages/command-panel/src/ui/WidgetPreviewCard.tsx`
- Test: `packages/command-panel/src/ui/WidgetPreviewCard.dom.test.tsx`

**Interfaces:**
- Consumes: `WidgetRenderer` from `../sandbox/WidgetRenderer`; `ComponentRegistry` from `../registry/component-registry`; `Button`, `Card`, `CardHeader`, `CardTitle`, `CardContent` from the design system.
- Produces:
  - `interface WidgetProposal { id: string; title: string; description: string; jsx: string; dataSources: string[] }`
  - `interface WidgetPreviewCardProps { proposal: WidgetProposal; registry: ComponentRegistry; onPin?: (proposal: WidgetProposal) => void; isPinned?: boolean; className?: string }`
  - `function WidgetPreviewCard(props): JSX.Element`

**Note:** purely presentational — it does NOT read the pinned store and does NOT provide a `DataResolverProvider`. The parent (ChatPane/CommandPanel) wires `onPin` and the resolver context. The test wraps it in `DataResolverProvider` with a stub resolver so the sandboxed widget can call `useMetric` if needed.

- [ ] **Step 1: Write the failing test**

`packages/command-panel/src/ui/WidgetPreviewCard.dom.test.tsx`:

```tsx
// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WidgetPreviewCard, type WidgetProposal } from './WidgetPreviewCard';
import { DataResolverProvider } from '../sandbox/use-metric';
import { defaultComponentRegistry } from '../registry/default-registry';

const proposal: WidgetProposal = {
  id: 'p1',
  title: 'Total',
  description: 'A single stat.',
  jsx: 'return <StatChip label="Total" value={3} />;',
  dataSources: [],
};

const stubResolver = async () => null;

function renderCard(props: Partial<React.ComponentProps<typeof WidgetPreviewCard>> = {}) {
  return render(
    <DataResolverProvider resolver={stubResolver}>
      <WidgetPreviewCard proposal={proposal} registry={defaultComponentRegistry} {...props} />
    </DataResolverProvider>,
  );
}

describe('WidgetPreviewCard', () => {
  it('renders title, description, and the live sandboxed widget', () => {
    renderCard();
    expect(screen.getByText('Total', { selector: ':not(button)' })).toBeTruthy();
    expect(screen.getByText('A single stat.')).toBeTruthy();
    // The StatChip renders its value.
    expect(screen.getByText('3')).toBeTruthy();
  });

  it('calls onPin with the proposal when Pin is clicked', () => {
    const onPin = vi.fn();
    renderCard({ onPin });
    fireEvent.click(screen.getByRole('button', { name: /pin to dashboard/i }));
    expect(onPin).toHaveBeenCalledWith(proposal);
  });

  it('shows a disabled Pinned state', () => {
    const onPin = vi.fn();
    renderCard({ onPin, isPinned: true });
    const btn = screen.getByRole('button', { name: /pinned/i }) as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm --filter @nikolayvalev/command-panel exec vitest run src/ui/WidgetPreviewCard.dom.test.tsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement `WidgetPreviewCard.tsx`**

```tsx
import * as React from 'react';
import { Button, Card, CardHeader, CardTitle, CardContent } from '@nikolayvalev/design-system';
import { WidgetRenderer } from '../sandbox/WidgetRenderer';
import type { ComponentRegistry } from '../registry/component-registry';

export interface WidgetProposal {
  id: string;
  title: string;
  description: string;
  jsx: string;
  dataSources: string[];
}

export interface WidgetPreviewCardProps {
  proposal: WidgetProposal;
  /** Pass a STABLE registry reference (see WidgetRenderer docs). */
  registry: ComponentRegistry;
  onPin?: (proposal: WidgetProposal) => void;
  isPinned?: boolean;
  className?: string;
}

export function WidgetPreviewCard({
  proposal,
  registry,
  onPin,
  isPinned,
  className,
}: WidgetPreviewCardProps): JSX.Element {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{proposal.title}</CardTitle>
        {proposal.description ? (
          <p style={{ margin: 0, color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>
            {proposal.description}
          </p>
        ) : null}
      </CardHeader>
      <CardContent>
        <WidgetRenderer source={proposal.jsx} registry={registry} />
        {onPin ? (
          <div style={{ marginTop: '0.75rem' }}>
            <Button
              type="button"
              variant={isPinned ? 'outline' : 'default'}
              size="sm"
              disabled={isPinned}
              onClick={() => onPin(proposal)}
            >
              {isPinned ? 'Pinned' : 'Pin to dashboard'}
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 4: Run to verify pass**

Run: `pnpm --filter @nikolayvalev/command-panel exec vitest run src/ui/WidgetPreviewCard.dom.test.tsx`
Expected: PASS (3 tests). If the `StatChip` value renders inside the same node as the label and `getByText('3')` is ambiguous, adjust the assertion to `screen.getByText('3', { exact: false })` or query the card body — keep the intent (the live widget rendered its value).

- [ ] **Step 5: Commit**

```bash
git add packages/command-panel/src/ui/WidgetPreviewCard.tsx packages/command-panel/src/ui/WidgetPreviewCard.dom.test.tsx
git commit -m "feat(command-panel): WidgetPreviewCard (inline preview + pin action)"
```

---

### Task 6: `DashboardGrid` (pinned widgets + remove/reorder)

**Files:**
- Create: `packages/command-panel/src/ui/DashboardGrid.tsx`
- Test: `packages/command-panel/src/ui/DashboardGrid.dom.test.tsx`

**Interfaces:**
- Consumes: `usePinnedStore` from `../state/use-pinned-store`; `WidgetRenderer`; `ComponentRegistry`; `Button`, `Card`, `CardHeader`, `CardTitle`, `CardContent` from the DS.
- Produces:
  - `interface DashboardGridProps { registry: ComponentRegistry; className?: string }`
  - `function DashboardGrid(props): JSX.Element` — renders pinned widgets in a responsive grid; each tile has Remove + Move up/Move down; shows an empty state when none.

- [ ] **Step 1: Write the failing test**

`packages/command-panel/src/ui/DashboardGrid.dom.test.tsx`:

```tsx
// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { DashboardGrid } from './DashboardGrid';
import { PinnedStoreProvider } from '../state/use-pinned-store';
import { DataResolverProvider } from '../sandbox/use-metric';
import { createPinnedStore, type PinnedWidget } from '../state/pinned-store';
import { defaultComponentRegistry } from '../registry/default-registry';

const w = (id: string): PinnedWidget => ({
  id,
  title: `Tile ${id}`,
  description: 'd',
  jsx: `return <StatChip label="${id}" value={1} />;`,
  dataSources: [],
});

function renderGrid(seed: PinnedWidget[]) {
  const store = createPinnedStore({ storage: null });
  seed.forEach((x) => store.pin(x));
  render(
    <DataResolverProvider resolver={async () => null}>
      <PinnedStoreProvider store={store}>
        <DashboardGrid registry={defaultComponentRegistry} />
      </PinnedStoreProvider>
    </DataResolverProvider>,
  );
  return store;
}

describe('DashboardGrid', () => {
  it('shows an empty state when nothing is pinned', () => {
    renderGrid([]);
    expect(screen.getByText(/no pinned widgets/i)).toBeTruthy();
  });

  it('renders pinned tiles and removes one', () => {
    renderGrid([w('a'), w('b')]);
    expect(screen.getByText('Tile a')).toBeTruthy();
    expect(screen.getByText('Tile b')).toBeTruthy();
    const tileA = screen.getByText('Tile a').closest('[data-widget-id]') as HTMLElement;
    fireEvent.click(within(tileA).getByRole('button', { name: /remove/i }));
    expect(screen.queryByText('Tile a')).toBeNull();
    expect(screen.getByText('Tile b')).toBeTruthy();
  });

  it('reorders with Move down', () => {
    const store = renderGrid([w('a'), w('b')]);
    const tileA = screen.getByText('Tile a').closest('[data-widget-id]') as HTMLElement;
    fireEvent.click(within(tileA).getByRole('button', { name: /move down/i }));
    expect(store.getState().map((x) => x.id)).toEqual(['b', 'a']);
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm --filter @nikolayvalev/command-panel exec vitest run src/ui/DashboardGrid.dom.test.tsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement `DashboardGrid.tsx`**

```tsx
import * as React from 'react';
import { Button, Card, CardHeader, CardTitle, CardContent } from '@nikolayvalev/design-system';
import { WidgetRenderer } from '../sandbox/WidgetRenderer';
import { usePinnedStore } from '../state/use-pinned-store';
import type { ComponentRegistry } from '../registry/component-registry';

export interface DashboardGridProps {
  /** Pass a STABLE registry reference (see WidgetRenderer docs). */
  registry: ComponentRegistry;
  className?: string;
}

export function DashboardGrid({ registry, className }: DashboardGridProps): JSX.Element {
  const { widgets, unpin, reorder } = usePinnedStore();

  if (widgets.length === 0) {
    return (
      <div className={className} style={{ color: 'var(--muted-foreground)', padding: '2rem', textAlign: 'center' }}>
        No pinned widgets yet. Pin a proposal from the chat to add it here.
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}
    >
      {widgets.map((widget, i) => (
        <Card key={widget.id} data-widget-id={widget.id}>
          <CardHeader>
            <CardTitle>{widget.title}</CardTitle>
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-label="Move up"
                disabled={i === 0}
                onClick={() => reorder(i, i - 1)}
              >
                ↑
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-label="Move down"
                disabled={i === widgets.length - 1}
                onClick={() => reorder(i, i + 1)}
              >
                ↓
              </Button>
              <Button type="button" variant="ghost" size="sm" aria-label="Remove" onClick={() => unpin(widget.id)}>
                ✕
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <WidgetRenderer source={widget.jsx} registry={registry} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Run to verify pass**

Run: `pnpm --filter @nikolayvalev/command-panel exec vitest run src/ui/DashboardGrid.dom.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add packages/command-panel/src/ui/DashboardGrid.tsx packages/command-panel/src/ui/DashboardGrid.dom.test.tsx
git commit -m "feat(command-panel): DashboardGrid with remove + reorder"
```

---

### Task 7: `ChatPane` (useChat + rendered tool-call parts e2e — carry-over #1)

**Files:**
- Create: `packages/command-panel/src/ui/ChatPane.tsx`
- Test: `packages/command-panel/src/ui/ChatPane.dom.test.tsx`

**Interfaces:**
- Consumes: `useChat` from `@ai-sdk/react`; `DefaultChatTransport`, `isToolUIPart`, `getToolName`, type `ChatTransport`, type `UIMessage` from `ai`; `WidgetPreviewCard` + `WidgetProposal` from `./WidgetPreviewCard`; `usePinnedStore` from `../state/use-pinned-store`; `ProposeWidgetInput` from `../generation/propose-widget`; `Button`, `Input` from the DS.
- Produces:
  - `interface ChatPaneProps { registry: ComponentRegistry; apiEndpoint?: string; transport?: ChatTransport<UIMessage>; className?: string }`
  - `function ChatPane(props): JSX.Element`

**Verification note (per the AI SDK skill — do not trust memory):** Before finalizing, confirm against the installed source the exact `useChat` return fields used here (`messages`, `sendMessage`, `status`, `error`) and the `DefaultChatTransport`/`ChatTransport` type names — `grep -r "useChat" node_modules/@ai-sdk/react/dist` and `node_modules/ai/dist/index.d.ts`. The test below is the real gate; adjust field names if the source differs.

**Pre-verified facts (captured during planning, ai@7.0.2):**
- A `propose_widget` tool call surfaces to `useChat` as a message part where `isToolUIPart(part)` is true, `getToolName(part) === 'propose_widget'`, `part.state === 'input-available'`, `part.input === { title, description, jsx, dataSources }`, and `part.toolCallId` is the id.
- The UI-message-stream wire format is SSE with headers `content-type: text/event-stream` and `x-vercel-ai-ui-message-stream: v1`. A single tool call serializes to the `data:` lines used in the test fixture below (verified output of `toUIMessageStreamResponse`).

- [ ] **Step 1: Write the failing test (the end-to-end of rendered tool-call parts)**

`packages/command-panel/src/ui/ChatPane.dom.test.tsx`:

```tsx
// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DefaultChatTransport } from 'ai';
import { ChatPane } from './ChatPane';
import { PinnedStoreProvider } from '../state/use-pinned-store';
import { DataResolverProvider } from '../sandbox/use-metric';
import { createPinnedStore } from '../state/pinned-store';
import { defaultComponentRegistry } from '../registry/default-registry';

// Exact UI-message-stream bytes that `toUIMessageStreamResponse` emits for one
// propose_widget tool call (verified against ai@7.0.2 during planning).
function proposalSse(input: Record<string, unknown>): string {
  const tool = {
    type: 'tool-input-available',
    toolCallId: 'call_1',
    toolName: 'propose_widget',
    input,
  };
  return (
    `data: {"type":"start"}\n\n` +
    `data: {"type":"start-step"}\n\n` +
    `data: ${JSON.stringify(tool)}\n\n` +
    `data: {"type":"finish-step"}\n\n` +
    `data: {"type":"finish"}\n\n` +
    `data: [DONE]\n\n`
  );
}

function cannedFetch(): typeof fetch {
  return (async () =>
    new Response(
      proposalSse({
        title: 'Total',
        description: 'A single stat.',
        jsx: 'return <StatChip label="Total" value={7} />;',
        dataSources: [],
      }),
      {
        status: 200,
        headers: {
          'content-type': 'text/event-stream',
          'x-vercel-ai-ui-message-stream': 'v1',
        },
      },
    )) as unknown as typeof fetch;
}

describe('ChatPane', () => {
  it('renders a proposed widget inline and pins it', async () => {
    const store = createPinnedStore({ storage: null });
    const transport = new DefaultChatTransport({ api: '/api/cp', fetch: cannedFetch() });

    render(
      <DataResolverProvider resolver={async () => null}>
        <PinnedStoreProvider store={store}>
          <ChatPane registry={defaultComponentRegistry} transport={transport} />
        </PinnedStoreProvider>
      </DataResolverProvider>,
    );

    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'show total' } });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    // The streamed tool call renders as a live preview card with the sandboxed widget.
    expect(await screen.findByText('A single stat.')).toBeTruthy();
    expect(await screen.findByText('7')).toBeTruthy();

    // Pinning the proposal updates the shared store.
    fireEvent.click(screen.getByRole('button', { name: /pin to dashboard/i }));
    expect(store.getState().map((w) => w.title)).toEqual(['Total']);
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm --filter @nikolayvalev/command-panel exec vitest run src/ui/ChatPane.dom.test.tsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement `ChatPane.tsx`**

```tsx
import * as React from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, isToolUIPart, getToolName, type ChatTransport, type UIMessage } from 'ai';
import { Button, Input } from '@nikolayvalev/design-system';
import { WidgetPreviewCard, type WidgetProposal } from './WidgetPreviewCard';
import { usePinnedStore } from '../state/use-pinned-store';
import type { ComponentRegistry } from '../registry/component-registry';
import type { ProposeWidgetInput } from '../generation/propose-widget';

export interface ChatPaneProps {
  /** Pass a STABLE registry reference (see WidgetRenderer docs). */
  registry: ComponentRegistry;
  apiEndpoint?: string;
  /** Injectable transport (tests / custom hosting). Defaults to DefaultChatTransport({ api }). */
  transport?: ChatTransport<UIMessage>;
  className?: string;
}

export function ChatPane({
  registry,
  apiEndpoint = '/api/command-panel',
  transport,
  className,
}: ChatPaneProps): JSX.Element {
  const chatTransport = React.useMemo(
    () => transport ?? new DefaultChatTransport({ api: apiEndpoint }),
    [transport, apiEndpoint],
  );
  const { messages, sendMessage, status, error } = useChat({ transport: chatTransport });
  const { widgets, pin } = usePinnedStore();
  const pinnedIds = React.useMemo(() => new Set(widgets.map((w) => w.id)), [widgets]);
  const [input, setInput] = React.useState('');
  const busy = status === 'submitted' || status === 'streaming';

  const onSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    sendMessage({ text });
    setInput('');
  };

  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {messages.map((message) => (
          <div key={message.id} data-role={message.role}>
            {message.parts.map((part, i) => {
              if (part.type === 'text') {
                return (
                  <p key={`${message.id}-text-${i}`} style={{ margin: 0 }}>
                    {part.text}
                  </p>
                );
              }
              if (
                isToolUIPart(part) &&
                getToolName(part) === 'propose_widget' &&
                (part.state === 'input-available' || part.state === 'output-available')
              ) {
                const proposal = toProposal(part.toolCallId, part.input as ProposeWidgetInput);
                return (
                  <WidgetPreviewCard
                    key={part.toolCallId}
                    proposal={proposal}
                    registry={registry}
                    onPin={pin}
                    isPinned={pinnedIds.has(proposal.id)}
                  />
                );
              }
              return null;
            })}
          </div>
        ))}
        {error ? (
          <p role="alert" style={{ color: 'var(--destructive)', margin: 0 }}>
            {error.message}
          </p>
        ) : null}
      </div>
      <form onSubmit={onSubmit} style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
        <Input
          aria-label="Message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask for a chart or a stat…"
          disabled={busy}
          style={{ flex: 1 }}
        />
        <Button type="submit" disabled={busy || input.trim() === ''}>
          Send
        </Button>
      </form>
    </div>
  );
}

function toProposal(id: string, input: ProposeWidgetInput): WidgetProposal {
  return {
    id,
    title: input.title,
    description: input.description,
    jsx: input.jsx,
    dataSources: input.dataSources,
  };
}
```

- [ ] **Step 4: Run to verify pass**

Run: `pnpm --filter @nikolayvalev/command-panel exec vitest run src/ui/ChatPane.dom.test.tsx`
Expected: PASS (1 test). If `useChat` does not surface the streamed part (e.g. the canned `Response` headers are rejected), confirm both required headers are present and the SSE block ends with `data: [DONE]\n\n`. If `status`/`sendMessage` names differ in the installed `@ai-sdk/react`, correct them per source (see the verification note) and re-run.

- [ ] **Step 5: Commit**

```bash
git add packages/command-panel/src/ui/ChatPane.tsx packages/command-panel/src/ui/ChatPane.dom.test.tsx
git commit -m "feat(command-panel): ChatPane with inline tool-call widget previews"
```

---

### Task 8: `CommandPanel` (two-pane shell)

**Files:**
- Create: `packages/command-panel/src/ui/CommandPanel.tsx`
- Test: `packages/command-panel/src/ui/CommandPanel.dom.test.tsx`

**Interfaces:**
- Consumes: `DataResolverProvider` from `../sandbox/use-metric`; `createHttpDataResolver` from `../generation/http-resolver`; type `DataResolver` from `../registry/data-registry`; `PinnedStoreProvider` from `../state/use-pinned-store`; type `PinnedStore` from `../state/pinned-store`; `ChatPane`, `DashboardGrid`; type `ChatTransport`, `UIMessage` from `ai`; `ComponentRegistry`.
- Produces:
  - `interface CommandPanelProps { registry: ComponentRegistry; apiEndpoint?: string; dataEndpoint?: string; dataResolver?: DataResolver; store?: PinnedStore; transport?: ChatTransport<UIMessage>; className?: string }`
  - `function CommandPanel(props): JSX.Element` — wires the resolver + pinned-store providers and lays out ChatPane (left) and DashboardGrid (right).

- [ ] **Step 1: Write the failing test**

`packages/command-panel/src/ui/CommandPanel.dom.test.tsx`:

```tsx
// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CommandPanel } from './CommandPanel';
import { createPinnedStore, type PinnedWidget } from '../state/pinned-store';
import { defaultComponentRegistry } from '../registry/default-registry';

const w = (id: string): PinnedWidget => ({
  id,
  title: `Tile ${id}`,
  description: 'd',
  jsx: `return <StatChip label="${id}" value={1} />;`,
  dataSources: [],
});

describe('CommandPanel', () => {
  it('renders both panes: chat input and the dashboard with a pre-pinned widget', () => {
    const store = createPinnedStore({ storage: null });
    store.pin(w('a'));
    render(
      <CommandPanel
        registry={defaultComponentRegistry}
        dataResolver={async () => null}
        store={store}
      />,
    );
    // Chat pane.
    expect(screen.getByLabelText(/message/i)).toBeTruthy();
    expect(screen.getByRole('button', { name: /send/i })).toBeTruthy();
    // Dashboard pane shows the pinned tile.
    expect(screen.getByText('Tile a')).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm --filter @nikolayvalev/command-panel exec vitest run src/ui/CommandPanel.dom.test.tsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement `CommandPanel.tsx`**

```tsx
import * as React from 'react';
import type { ChatTransport, UIMessage } from 'ai';
import { DataResolverProvider } from '../sandbox/use-metric';
import { createHttpDataResolver } from '../generation/http-resolver';
import type { DataResolver } from '../registry/data-registry';
import { PinnedStoreProvider } from '../state/use-pinned-store';
import type { PinnedStore } from '../state/pinned-store';
import { ChatPane } from './ChatPane';
import { DashboardGrid } from './DashboardGrid';
import type { ComponentRegistry } from '../registry/component-registry';

export interface CommandPanelProps {
  /** Pass a STABLE registry reference (e.g. module-scope defaultComponentRegistry). */
  registry: ComponentRegistry;
  /** Chat generation endpoint (POST). Defaults to '/api/command-panel'. */
  apiEndpoint?: string;
  /** Read-only data endpoint backing useMetric (POST). Defaults to '/api/command-panel/data'. */
  dataEndpoint?: string;
  /** Override the data resolver (tests / custom transport). Defaults to createHttpDataResolver(dataEndpoint). */
  dataResolver?: DataResolver;
  /** Override the pinned store (tests / shared instance). Defaults to a localStorage-backed store. */
  store?: PinnedStore;
  /** Override the chat transport (tests). Forwarded to ChatPane. */
  transport?: ChatTransport<UIMessage>;
  className?: string;
}

export function CommandPanel({
  registry,
  apiEndpoint = '/api/command-panel',
  dataEndpoint = '/api/command-panel/data',
  dataResolver,
  store,
  transport,
  className,
}: CommandPanelProps): JSX.Element {
  const resolver = React.useMemo(
    () => dataResolver ?? createHttpDataResolver(dataEndpoint),
    [dataResolver, dataEndpoint],
  );

  return (
    <DataResolverProvider resolver={resolver}>
      <PinnedStoreProvider store={store}>
        <div
          className={className}
          style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '1rem', height: '100%', minHeight: 0 }}
        >
          <ChatPane registry={registry} apiEndpoint={apiEndpoint} transport={transport} />
          <DashboardGrid registry={registry} />
        </div>
      </PinnedStoreProvider>
    </DataResolverProvider>
  );
}
```

- [ ] **Step 4: Run to verify pass**

Run: `pnpm --filter @nikolayvalev/command-panel exec vitest run src/ui/CommandPanel.dom.test.tsx`
Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
git add packages/command-panel/src/ui/CommandPanel.tsx packages/command-panel/src/ui/CommandPanel.dom.test.tsx
git commit -m "feat(command-panel): CommandPanel two-pane shell"
```

---

### Task 9: Public API surface + full green gate

**Files:**
- Modify: `packages/command-panel/src/index.ts`

**Interfaces:**
- Consumes: every public symbol produced by Tasks 3–8.
- Produces: the engine's complete client-facing public API.

- [ ] **Step 1: Add a failing export-surface assertion**

Append to `packages/command-panel/src/smoke.test.ts` (a new test block; do not remove existing ones):

```ts
import { describe, it, expect } from 'vitest';
import * as engine from './index';

describe('phase 2c public surface', () => {
  it('exports the panel UI + pinned store', () => {
    expect(typeof engine.CommandPanel).toBe('function');
    expect(typeof engine.ChatPane).toBe('function');
    expect(typeof engine.DashboardGrid).toBe('function');
    expect(typeof engine.WidgetPreviewCard).toBe('function');
    expect(typeof engine.PinnedStoreProvider).toBe('function');
    expect(typeof engine.usePinnedStore).toBe('function');
    expect(typeof engine.createPinnedStore).toBe('function');
  });
});
```

(If `smoke.test.ts` already imports `vitest` / `./index`, reuse those imports rather than duplicating.)

- [ ] **Step 2: Run to verify failure**

Run: `pnpm --filter @nikolayvalev/command-panel exec vitest run src/smoke.test.ts`
Expected: FAIL (undefined exports).

- [ ] **Step 3: Extend `index.ts`**

Append to `packages/command-panel/src/index.ts`:

```ts
// Panel UI (client-safe).
export { CommandPanel, type CommandPanelProps } from './ui/CommandPanel';
export { ChatPane, type ChatPaneProps } from './ui/ChatPane';
export { DashboardGrid, type DashboardGridProps } from './ui/DashboardGrid';
export { WidgetPreviewCard, type WidgetPreviewCardProps, type WidgetProposal } from './ui/WidgetPreviewCard';

// Pinned dashboard state.
export {
  PinnedStoreProvider,
  usePinnedStore,
  type PinnedStoreApi,
} from './state/use-pinned-store';
export {
  createPinnedStore,
  DEFAULT_STORAGE_KEY,
  type PinnedStore,
  type PinnedStoreOptions,
  type PinnedWidget,
  type StorageLike,
} from './state/pinned-store';
```

- [ ] **Step 4: Run the smoke test**

Run: `pnpm --filter @nikolayvalev/command-panel exec vitest run src/smoke.test.ts`
Expected: PASS.

- [ ] **Step 5: Full green gate**

Run each and confirm clean:

```bash
pnpm --filter @nikolayvalev/command-panel test
pnpm --filter @nikolayvalev/command-panel typecheck
pnpm --filter @nikolayvalev/command-panel lint
pnpm --filter @nikolayvalev/command-panel build
```

Expected: all tests pass; `tsc --noEmit` clean; ESLint 0 errors / 0 warnings; build emits `dist/index.{js,d.ts}` and `dist/server.{js,d.ts}` with the new exports present in `dist/index.d.ts`. If the dts build surfaces a `@repo/state` type-inlining issue, confirm `@repo/state` is built (`pnpm --filter @repo/state build`) and that `noExternal: ['@repo/state']` is set.

- [ ] **Step 6: Commit**

```bash
git add packages/command-panel/src/index.ts packages/command-panel/src/smoke.test.ts
git commit -m "feat(command-panel): export the panel UI + pinned store public API"
```

---

## Self-Review (planning)

- **Spec coverage:** two-pane `CommandPanel` (Task 8), inline live previews with Pin (Tasks 5+7), persistent dashboard grid with remove/reorder (Task 6), pinned state via `@repo/state` + localStorage (Tasks 3+4), `useChat` chat against `createCommandPanelHandler` (Task 7, via injectable transport; default `DefaultChatTransport`). Both review carry-overs folded in (Task 2 = params guard; Task 7 = real rendered-tool-call e2e). ✅
- **Out of scope (per spec non-goals):** no auth/multi-user, no server persistence, no drag-layout (simple grid + move up/down), no reference host (that is Phase 3). ✅
- **Type consistency:** `WidgetProposal`/`PinnedWidget` share the `{ id, title, description, jsx, dataSources }` shape; `ChatPane` maps `ProposeWidgetInput` + `toolCallId` → `WidgetProposal`; `pin` accepts `WidgetProposal` (a structural `PinnedWidget`). `usePinnedStore` returns `PinnedStoreApi`. Registry threaded as `ComponentRegistry` (stable ref) everywhere. ✅
- **No placeholders:** every step has complete code and exact commands. ✅

## Carry-overs to the final whole-branch review

- Confirm no `src/ui/**` or `src/state/**` module imports the server surface (grep for `@ai-sdk/anthropic`, `./server`, `streamText`, `convertToModelMessages`).
- Confirm `dist/index.js` does not contain `@ai-sdk/anthropic` or `streamText` (client boundary intact) and that `@repo/state` is inlined (not an external import in `dist`).
- Confirm `useChat` field names (`messages`/`sendMessage`/`status`/`error`) match the installed `@ai-sdk/react` (Task 7 verification note).
