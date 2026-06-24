# Command Panel — Phase 2a: Engine Core (Registries + Sandbox) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold the new `@nikolayvalev/command-panel` package and build its security-critical core — the component/data registries and the sandbox that turns an LLM-written JSX widget body into a safely-rendered React component.

**Architecture:** A new ESM package consuming the design system as a peer dependency. The sandbox pipeline is **validate → transpile → evaluate → render**: an AST allow-list gate (`@babel/parser`) rejects unsafe source; `sucrase` transpiles JSX (classic runtime) to `React.createElement` calls; the transpiled body is wrapped as a component and built with `new Function`, injecting only allow-listed capabilities (registry components + a hook subset + `useMetric`) **and shadowing dangerous globals to `undefined`** as a defense-in-depth backstop; the component renders inside an error boundary. `useMetric` is the only data channel, resolving through a context-provided `DataResolver`.

**Tech Stack:** TypeScript (ESM), React 18/19 (peer), `@babel/parser` + `sucrase` (sandbox), Vitest + jsdom + @testing-library/react (tests). LLM/generation and the HTTP data transport are **Phase 2b**; the panel UI and pinned store are **Phase 2c** — both out of scope here.

## Global Constraints

- **Package name:** `@nikolayvalev/command-panel` (tentative public name; changeable before first publish — no changeset is added in this phase, so nothing publishes). `private: false` is NOT set yet; keep it publishable-shaped but unreleased.
- **The design system is a peer dependency**, referenced as `@nikolayvalev/design-system` (workspace `*` for dev). React and react-dom are peer dependencies (`^18 || ^19`). Do not bundle them.
- **The sandbox is a hard security boundary.** Generated code must never reach `window`/`document`/`fetch`/globals, perform imports, use `eval`/`Function`, access `constructor`/`__proto__`/`prototype`, or use `dangerouslySetInnerHTML`. Two layers enforce this: the AST validator (primary) and global-shadowing in the evaluator (backstop). Neither may be weakened without updating both.
- **JSX vocabulary:** generated widgets may use registered PascalCase components **and** a fixed safe subset of lowercase host elements, with host attributes restricted to a `className`/`key` allow-list. (Decided 2026-06-24.)
- ESM only; TypeScript strict; extends `@repo/config/tsconfig.react.json`.
- **Commits:** conventional-commit messages, and every commit message ends with the trailer `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.
- Tests: Vitest. Pure modules use the default `node` environment (`*.test.ts`); modules that render React use jsdom via a top-of-file `// @vitest-environment jsdom` pragma (`*.dom.test.tsx`).
- Work on a feature branch (e.g. `feat/command-panel-2a`); do NOT implement on `main`.

## File Structure

```text
packages/command-panel/
  package.json
  tsconfig.json
  tsup.config.ts
  vitest.config.ts
  src/
    registry/
      component-registry.ts   # ComponentEntry, ComponentRegistry, createComponentRegistry, extendRegistry, helpers
      data-registry.ts        # DataSource, DataRegistry, DataResolver, createDataRegistry, createRegistryResolver
      default-registry.ts     # defaultComponentRegistry (design-system primitives + charts)
    sandbox/
      constants.ts            # HOST_ELEMENTS, ALLOWED_HOST_ATTRS, DISALLOWED_IDENTIFIERS, FORBIDDEN_MEMBER_PROPS, SHADOWED_GLOBALS, HOOK_NAMES
      validate.ts             # validateWidgetSource(source, allowedComponents) -> ValidationResult
      transpile.ts            # transpileWidgetBody(source) -> string
      evaluate.ts             # buildWidgetComponent(transpiledCode, scope) -> React component
      use-metric.ts           # DataResolverProvider, useMetric, MetricState
      ErrorBoundary.tsx       # WidgetErrorBoundary (class)
      WidgetRenderer.tsx      # WidgetRenderer (validate→transpile→eval→render)
    index.ts                  # public exports
```

---

### Task 1: Scaffold the `@nikolayvalev/command-panel` package

**Files:**
- Create: `packages/command-panel/package.json`
- Create: `packages/command-panel/tsconfig.json`
- Create: `packages/command-panel/tsup.config.ts`
- Create: `packages/command-panel/vitest.config.ts`
- Create: `packages/command-panel/src/index.ts`
- Test: `packages/command-panel/src/smoke.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: a buildable, testable package; `pnpm --filter @nikolayvalev/command-panel test|typecheck|build` all work.

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "@nikolayvalev/command-panel",
  "version": "0.0.0",
  "description": "Portable chat-driven generative-UI command panel engine for the Nikolay Valev design system.",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "sideEffects": false,
  "license": "MIT",
  "files": ["dist"],
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "typecheck": "tsc --noEmit",
    "lint": "eslint src",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0",
    "@nikolayvalev/design-system": "workspace:*"
  },
  "dependencies": {
    "@babel/parser": "^7.29.0",
    "sucrase": "^3.35.0"
  },
  "devDependencies": {
    "@nikolayvalev/design-system": "workspace:*",
    "@repo/config": "workspace:*",
    "@testing-library/react": "^16.1.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "jsdom": "^25.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "tsup": "^8.5.1",
    "typescript": "^5.9.3",
    "vitest": "^2.1.0"
  },
  "eslintConfig": {
    "extends": "@repo/config/eslint-design-system.config.js"
  }
}
```

- [ ] **Step 2: Create `tsconfig.json`** (mirrors the design-system package)

```json
{
  "extends": "@repo/config/tsconfig.react.json",
  "compilerOptions": {
    "outDir": "./dist"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Step 3: Create `tsup.config.ts`**

```ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  external: ['react', 'react-dom', '@nikolayvalev/design-system'],
});
```

- [ ] **Step 4: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  esbuild: { jsx: 'automatic' },
  test: {
    // Default: fast node env for pure modules.
    // React-rendering tests opt into jsdom via a `// @vitest-environment jsdom`
    // pragma at the top of the file (used by *.dom.test.tsx files).
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
```

- [ ] **Step 5: Create a placeholder entry and a smoke test**

`packages/command-panel/src/index.ts`:
```ts
export const COMMAND_PANEL_VERSION = '0.0.0';
```

`packages/command-panel/src/smoke.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { COMMAND_PANEL_VERSION } from './index';

describe('package smoke', () => {
  it('exports a version constant', () => {
    expect(COMMAND_PANEL_VERSION).toBe('0.0.0');
  });
});
```

- [ ] **Step 6: Install and verify the harness**

Run:
```bash
pnpm install
pnpm --filter @nikolayvalev/command-panel test
pnpm --filter @nikolayvalev/command-panel typecheck
pnpm --filter @nikolayvalev/command-panel build
```
Expected: install succeeds; 1 test passes; typecheck clean; build emits `dist/index.js` + `dist/index.d.ts`. If `lint` is wired, also run `pnpm --filter @nikolayvalev/command-panel lint` and expect no errors (mirrors the design-system package's working lint setup).

- [ ] **Step 7: Commit**

```bash
git add packages/command-panel pnpm-lock.yaml
git commit -m "feat(command-panel): scaffold the engine package"
```

---

### Task 2: Registries — component + data

**Files:**
- Create: `packages/command-panel/src/registry/component-registry.ts`
- Create: `packages/command-panel/src/registry/data-registry.ts`
- Test: `packages/command-panel/src/registry/component-registry.test.ts`
- Test: `packages/command-panel/src/registry/data-registry.test.ts`

**Interfaces:**
- Consumes: nothing (React types only).
- Produces:
  - `interface ComponentEntry { name: string; component: React.ComponentType<any>; description: string; propsSchema?: Record<string, unknown> }`
  - `interface ComponentRegistry { entries: ComponentEntry[] }`
  - `createComponentRegistry(entries: ComponentEntry[]): ComponentRegistry`
  - `extendRegistry(base: ComponentRegistry, extra: ComponentEntry[]): ComponentRegistry` (dedupe by `name`; later entries win)
  - `registryComponentNames(reg: ComponentRegistry): string[]`
  - `registryScope(reg: ComponentRegistry): Record<string, React.ComponentType<any>>`
  - `interface DataSource { id: string; description: string; resultSchema?: Record<string, unknown>; load(params?: Record<string, unknown>): Promise<unknown> }`
  - `interface DataRegistry { sources: DataSource[] }`
  - `type DataResolver = (id: string, params?: Record<string, unknown>) => Promise<unknown>`
  - `createDataRegistry(sources: DataSource[]): DataRegistry`
  - `getDataSource(reg: DataRegistry, id: string): DataSource | undefined`
  - `createRegistryResolver(reg: DataRegistry): DataResolver` (rejects unknown ids)

- [ ] **Step 1: Write the failing component-registry tests**

`packages/command-panel/src/registry/component-registry.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import {
  createComponentRegistry,
  extendRegistry,
  registryComponentNames,
  registryScope,
  type ComponentEntry,
} from './component-registry';

const A = () => null;
const B = () => null;
const B2 = () => null;

const entry = (name: string, component: ComponentEntry['component']): ComponentEntry => ({
  name,
  component,
  description: `${name} desc`,
});

describe('component registry', () => {
  it('lists registered component names', () => {
    const reg = createComponentRegistry([entry('Alpha', A), entry('Beta', B)]);
    expect(registryComponentNames(reg)).toEqual(['Alpha', 'Beta']);
  });

  it('builds a name->component scope map', () => {
    const reg = createComponentRegistry([entry('Alpha', A)]);
    expect(registryScope(reg)).toEqual({ Alpha: A });
  });

  it('extends a base registry, with later entries overriding by name', () => {
    const base = createComponentRegistry([entry('Alpha', A), entry('Beta', B)]);
    const ext = extendRegistry(base, [entry('Beta', B2), entry('Gamma', A)]);
    expect(registryComponentNames(ext)).toEqual(['Alpha', 'Beta', 'Gamma']);
    expect(registryScope(ext).Beta).toBe(B2);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm --filter @nikolayvalev/command-panel test`
Expected: FAIL — cannot resolve `./component-registry`.

- [ ] **Step 3: Implement `component-registry.ts`**

```ts
import type React from 'react';

export interface ComponentEntry {
  /** Identifier exposed to generated JSX (must be PascalCase to be usable as a component). */
  name: string;
  component: React.ComponentType<any>;
  /** Shown to the LLM in the system prompt (Phase 2b). */
  description: string;
  /** Optional JSON-schema-ish prop documentation for the LLM. */
  propsSchema?: Record<string, unknown>;
}

export interface ComponentRegistry {
  entries: ComponentEntry[];
}

export function createComponentRegistry(entries: ComponentEntry[]): ComponentRegistry {
  return { entries: [...entries] };
}

/** Merge `extra` onto `base`; entries with the same `name` are replaced (later wins), order preserved. */
export function extendRegistry(base: ComponentRegistry, extra: ComponentEntry[]): ComponentRegistry {
  const byName = new Map<string, ComponentEntry>();
  for (const e of base.entries) byName.set(e.name, e);
  for (const e of extra) byName.set(e.name, e);
  return { entries: [...byName.values()] };
}

export function registryComponentNames(reg: ComponentRegistry): string[] {
  return reg.entries.map((e) => e.name);
}

export function registryScope(reg: ComponentRegistry): Record<string, React.ComponentType<any>> {
  const scope: Record<string, React.ComponentType<any>> = {};
  for (const e of reg.entries) scope[e.name] = e.component;
  return scope;
}
```

- [ ] **Step 4: Run to verify component-registry passes**

Run: `pnpm --filter @nikolayvalev/command-panel test`
Expected: PASS.

- [ ] **Step 5: Write the failing data-registry tests**

`packages/command-panel/src/registry/data-registry.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import {
  createDataRegistry,
  getDataSource,
  createRegistryResolver,
  type DataSource,
} from './data-registry';

const src = (id: string, value: unknown): DataSource => ({
  id,
  description: `${id} desc`,
  load: async () => value,
});

describe('data registry', () => {
  it('finds a source by id', () => {
    const reg = createDataRegistry([src('a.count', 1)]);
    expect(getDataSource(reg, 'a.count')?.id).toBe('a.count');
    expect(getDataSource(reg, 'missing')).toBeUndefined();
  });

  it('resolver loads a registered source', async () => {
    const reg = createDataRegistry([src('a.count', 42)]);
    const resolve = createRegistryResolver(reg);
    await expect(resolve('a.count')).resolves.toBe(42);
  });

  it('resolver rejects an unknown id', async () => {
    const reg = createDataRegistry([src('a.count', 1)]);
    const resolve = createRegistryResolver(reg);
    await expect(resolve('nope')).rejects.toThrow(/unknown data source: nope/i);
  });

  it('resolver passes params through to load', async () => {
    let seen: unknown;
    const reg = createDataRegistry([
      { id: 's', description: 'd', load: async (p) => { seen = p; return null; } },
    ]);
    await createRegistryResolver(reg)('s', { range: '30d' });
    expect(seen).toEqual({ range: '30d' });
  });
});
```

- [ ] **Step 6: Implement `data-registry.ts`**

```ts
export interface DataSource {
  /** Stable id the LLM references, e.g. "components.count". */
  id: string;
  /** Shown to the LLM in the system prompt (Phase 2b). */
  description: string;
  /** Optional shape documentation for the LLM. */
  resultSchema?: Record<string, unknown>;
  load(params?: Record<string, unknown>): Promise<unknown>;
}

export interface DataRegistry {
  sources: DataSource[];
}

/** The only data channel exposed to generated widgets (via useMetric). */
export type DataResolver = (id: string, params?: Record<string, unknown>) => Promise<unknown>;

export function createDataRegistry(sources: DataSource[]): DataRegistry {
  return { sources: [...sources] };
}

export function getDataSource(reg: DataRegistry, id: string): DataSource | undefined {
  return reg.sources.find((s) => s.id === id);
}

/** Build a resolver that loads registered sources by id and rejects anything unknown. */
export function createRegistryResolver(reg: DataRegistry): DataResolver {
  return async (id, params) => {
    const source = getDataSource(reg, id);
    if (!source) throw new Error(`Unknown data source: ${id}`);
    return source.load(params);
  };
}
```

- [ ] **Step 7: Run to verify all registry tests pass**

Run: `pnpm --filter @nikolayvalev/command-panel test`
Expected: PASS — component + data registry tests green.

- [ ] **Step 8: Commit**

```bash
git add packages/command-panel/src/registry/component-registry.ts packages/command-panel/src/registry/data-registry.ts packages/command-panel/src/registry/component-registry.test.ts packages/command-panel/src/registry/data-registry.test.ts
git commit -m "feat(command-panel): component and data registries"
```

---

### Task 3: Default component registry (design-system primitives + charts)

**Files:**
- Create: `packages/command-panel/src/registry/default-registry.ts`
- Test: `packages/command-panel/src/registry/default-registry.test.ts`

**Interfaces:**
- Consumes: `createComponentRegistry`, `ComponentEntry`, `registryComponentNames` from `./component-registry`; components from `@nikolayvalev/design-system`.
- Produces: `defaultComponentRegistry: ComponentRegistry`.

- [ ] **Step 1: Write the failing test**

`packages/command-panel/src/registry/default-registry.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { defaultComponentRegistry } from './default-registry';
import { registryComponentNames, registryScope } from './component-registry';

describe('defaultComponentRegistry', () => {
  it('includes the four chart primitives', () => {
    const names = registryComponentNames(defaultComponentRegistry);
    for (const n of ['LineChart', 'BarChart', 'AreaChart', 'Donut']) {
      expect(names).toContain(n);
    }
  });

  it('includes layout/data primitives for arrangement', () => {
    const names = registryComponentNames(defaultComponentRegistry);
    for (const n of ['Card', 'CardHeader', 'CardTitle', 'CardContent', 'Badge', 'StatChip', 'Layout', 'SectionShell']) {
      expect(names).toContain(n);
    }
  });

  it('maps every name to a defined component and gives each a description', () => {
    const scope = registryScope(defaultComponentRegistry);
    for (const entry of defaultComponentRegistry.entries) {
      expect(typeof entry.description).toBe('string');
      expect(entry.description.length).toBeGreaterThan(0);
      expect(scope[entry.name]).toBeDefined();
    }
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm --filter @nikolayvalev/command-panel test`
Expected: FAIL — cannot resolve `./default-registry`.

- [ ] **Step 3: Implement `default-registry.ts`**

```ts
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  StatChip,
  Layout,
  SectionShell,
  FeatureTile,
  LineChart,
  BarChart,
  AreaChart,
  Donut,
} from '@nikolayvalev/design-system';
import { createComponentRegistry, type ComponentEntry } from './component-registry';

const entries: ComponentEntry[] = [
  { name: 'Card', component: Card, description: 'A surface container that groups related content.' },
  { name: 'CardHeader', component: CardHeader, description: 'Header region of a Card.' },
  { name: 'CardTitle', component: CardTitle, description: 'Title text inside a CardHeader.' },
  { name: 'CardContent', component: CardContent, description: 'Body region of a Card.' },
  { name: 'Badge', component: Badge, description: 'Small inline status/label chip.' },
  { name: 'StatChip', component: StatChip, description: 'Compact metric token: a label and a value.' },
  { name: 'Layout', component: Layout, description: 'Generic layout container for arranging children.' },
  { name: 'SectionShell', component: SectionShell, description: 'A titled section wrapper for grouping widgets.' },
  { name: 'FeatureTile', component: FeatureTile, description: 'A tile highlighting a single feature or figure.' },
  { name: 'LineChart', component: LineChart, description: 'SVG line chart. Props: data ({label,value}[]), colorIndex (1-5).' },
  { name: 'BarChart', component: BarChart, description: 'SVG bar chart. Props: data ({label,value}[]), colorIndex (1-5).' },
  { name: 'AreaChart', component: AreaChart, description: 'SVG area chart. Props: data ({label,value}[]), colorIndex (1-5).' },
  { name: 'Donut', component: Donut, description: 'SVG donut chart. Props: data ({label,value}[]), size, thickness.' },
];

/** The canonical default vocabulary: design-system primitives + chart primitives. */
export const defaultComponentRegistry = createComponentRegistry(entries);
```

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm --filter @nikolayvalev/command-panel test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/command-panel/src/registry/default-registry.ts packages/command-panel/src/registry/default-registry.test.ts
git commit -m "feat(command-panel): default component registry (design-system + charts)"
```

---

### Task 4: Sandbox constants + AST validator (security-critical, TDD)

**Files:**
- Create: `packages/command-panel/src/sandbox/constants.ts`
- Create: `packages/command-panel/src/sandbox/validate.ts`
- Test: `packages/command-panel/src/sandbox/validate.test.ts`

**Interfaces:**
- Consumes: `@babel/parser`; constants from `./constants`.
- Produces:
  - `interface ValidationResult { ok: boolean; errors: string[] }`
  - `validateWidgetSource(source: string, allowedComponents: Set<string>): ValidationResult`
  - constants: `HOST_ELEMENTS`, `ALLOWED_HOST_ATTRS`, `DISALLOWED_IDENTIFIERS`, `FORBIDDEN_MEMBER_PROPS`, `SHADOWED_GLOBALS`, `HOOK_NAMES` (all `ReadonlySet<string>` except `SHADOWED_GLOBALS: readonly string[]`).

- [ ] **Step 1: Write the failing validator tests** (the allow/reject table)

`packages/command-panel/src/sandbox/validate.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { validateWidgetSource } from './validate';

const ALLOWED = new Set(['Card', 'LineChart', 'StatChip']);
const ok = (src: string) => validateWidgetSource(src, ALLOWED).ok;
const errs = (src: string) => validateWidgetSource(src, ALLOWED).errors;

describe('validateWidgetSource — accepts', () => {
  it('a registered component with a host wrapper and className', () => {
    expect(ok("return <div className=\"grid\"><Card><LineChart data={[]} colorIndex={1} /></Card></div>;")).toBe(true);
  });
  it('useMetric + a hook + a map over data', () => {
    expect(
      ok("const m = useMetric('x'); const items = (m.data ?? []).map((d) => d.value); return <StatChip label=\"n\" value={items.length} />;"),
    ).toBe(true);
  });
  it('allowed host text elements', () => {
    expect(ok('return <section><h2 className="t">Hi</h2><p>body</p></section>;')).toBe(true);
  });
});

describe('validateWidgetSource — rejects', () => {
  it('an unregistered component', () => {
    expect(ok('return <Mystery />;')).toBe(false);
    expect(errs('return <Mystery />;').join(' ')).toMatch(/Mystery.*allow-list/i);
  });
  it('a disallowed host element', () => {
    expect(ok('return <img src="x" />;')).toBe(false);
  });
  it('a disallowed attribute on a host element', () => {
    expect(ok('return <div onClick={1}>x</div>;')).toBe(false);
    expect(ok('return <div style={{}}>x</div>;')).toBe(false);
    expect(ok('return <a href="x">x</a>;')).toBe(false); // <a> not in host allow-list
  });
  it('imports and requires', () => {
    expect(ok("import x from 'y'; return null;")).toBe(false);
    expect(ok("const x = require('y'); return null;")).toBe(false);
  });
  it('eval and the Function constructor', () => {
    expect(ok("return eval('1');")).toBe(false);
    expect(ok("return Function('return 1')();")).toBe(false);
  });
  it('global access (window/document/fetch)', () => {
    expect(ok('return window.location.href;')).toBe(false);
    expect(ok('document.cookie; return null;')).toBe(false);
    expect(ok("fetch('/x'); return null;")).toBe(false);
  });
  it('prototype-escape property access', () => {
    expect(ok("return [].constructor;")).toBe(false);
    expect(ok("return ({}).__proto__;")).toBe(false);
    expect(ok("return ({})['constructor'];")).toBe(false);
  });
  it('dangerouslySetInnerHTML', () => {
    expect(ok('return <Card dangerouslySetInnerHTML={{ __html: "x" }} />;')).toBe(false);
  });
  it('spread attributes on host elements', () => {
    expect(ok('return <div {...props}>x</div>;')).toBe(false);
  });
  it('tagged template expressions', () => {
    expect(ok('return foo`bar`;')).toBe(false);
  });
  it('a syntax error', () => {
    expect(ok('return <Card;')).toBe(false);
    expect(errs('return <Card;').join(' ')).toMatch(/syntax error/i);
  });
});

describe('validateWidgetSource — no false positives', () => {
  it('allows an object literal whose key is a forbidden name', () => {
    expect(ok("const o = { window: 1, fetch: 2 }; return <StatChip label=\"n\" value={o.window} />;")).toBe(true);
  });
  it('allows numeric array indexing', () => {
    expect(ok("const a = [1, 2, 3]; return <StatChip label=\"n\" value={a[0]} />;")).toBe(true);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm --filter @nikolayvalev/command-panel test`
Expected: FAIL — cannot resolve `./validate`.

- [ ] **Step 3: Implement `constants.ts`**

```ts
/** Lowercase host elements the LLM may use for layout/text. */
export const HOST_ELEMENTS: ReadonlySet<string> = new Set([
  'div', 'span', 'p', 'ul', 'ol', 'li', 'section', 'header', 'footer',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'small', 'strong', 'em', 'b', 'i', 'br', 'hr',
]);

/** The only attributes permitted on host elements. */
export const ALLOWED_HOST_ATTRS: ReadonlySet<string> = new Set(['className', 'key']);

/** Identifiers that are forbidden in any reference position. */
export const DISALLOWED_IDENTIFIERS: ReadonlySet<string> = new Set([
  'window', 'document', 'globalThis', 'self', 'top', 'parent', 'frames', 'navigator', 'location', 'history',
  'fetch', 'XMLHttpRequest', 'WebSocket', 'EventSource', 'Worker', 'SharedWorker', 'importScripts',
  'localStorage', 'sessionStorage', 'indexedDB', 'caches', 'crypto',
  'eval', 'Function', 'require', 'module', 'exports', 'process', 'global', 'Buffer',
  'setTimeout', 'setInterval', 'setImmediate', 'queueMicrotask', 'requestAnimationFrame',
  'arguments', 'postMessage', 'alert', 'prompt', 'confirm', 'open',
]);

/** Property names whose access enables prototype/constructor escapes. */
export const FORBIDDEN_MEMBER_PROPS: ReadonlySet<string> = new Set([
  'constructor', '__proto__', 'prototype',
  '__defineGetter__', '__defineSetter__', '__lookupGetter__', '__lookupSetter__',
]);

/**
 * Globals shadowed to `undefined` as evaluator params (defense-in-depth backstop).
 * MUST NOT include reserved words or `eval`/`arguments` (illegal as strict-mode params);
 * the validator already rejects those.
 */
export const SHADOWED_GLOBALS: readonly string[] = [
  'window', 'document', 'globalThis', 'self', 'top', 'parent', 'frames', 'navigator', 'location', 'history',
  'fetch', 'XMLHttpRequest', 'WebSocket', 'EventSource', 'Worker',
  'localStorage', 'sessionStorage', 'indexedDB', 'caches', 'crypto',
  'Function', 'require', 'process', 'global', 'Buffer',
  'setTimeout', 'setInterval', 'postMessage', 'alert', 'prompt', 'confirm', 'open',
];

/** React hooks (plus useMetric) injected into the evaluator scope. */
export const HOOK_NAMES: readonly string[] = ['useState', 'useMemo', 'useRef', 'useMetric'];
```

- [ ] **Step 4: Implement `validate.ts`**

```ts
import { parse } from '@babel/parser';
import {
  HOST_ELEMENTS,
  ALLOWED_HOST_ATTRS,
  DISALLOWED_IDENTIFIERS,
  FORBIDDEN_MEMBER_PROPS,
} from './constants';

export interface ValidationResult {
  ok: boolean;
  errors: string[];
}

type AnyNode = { type: string; [k: string]: any };

const SKIP_KEYS = new Set([
  'loc', 'start', 'end', 'range', 'extra', 'comments', 'tokens',
  'leadingComments', 'trailingComments', 'innerComments',
]);

/** Depth-first walk passing each node with its parent and the key it was reached by. */
function walk(
  node: any,
  parent: AnyNode | null,
  key: string,
  visit: (node: AnyNode, parent: AnyNode | null, key: string) => void,
): void {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) {
    for (const child of node) walk(child, parent, key, visit);
    return;
  }
  if (typeof node.type === 'string') visit(node as AnyNode, parent, key);
  for (const k of Object.keys(node)) {
    if (SKIP_KEYS.has(k)) continue;
    walk(node[k], typeof node.type === 'string' ? (node as AnyNode) : parent, k, visit);
  }
}

/** Is this Identifier a variable reference (vs. a property/key name that is harmless)? */
function isReference(parent: AnyNode | null, key: string): boolean {
  if (!parent) return true;
  // obj.prop  /  obj?.prop  — `prop` (non-computed) is not a reference
  if (
    (parent.type === 'MemberExpression' || parent.type === 'OptionalMemberExpression') &&
    key === 'property' &&
    !parent.computed
  ) {
    return false;
  }
  // { key: ... } / class member key (non-computed) — `key` is not a reference
  if (
    (parent.type === 'ObjectProperty' || parent.type === 'ObjectMethod' || parent.type === 'ClassProperty' || parent.type === 'ClassMethod') &&
    key === 'key' &&
    !parent.computed
  ) {
    return false;
  }
  return true;
}

function jsxName(nameNode: any): string {
  if (!nameNode) return '';
  if (nameNode.type === 'JSXIdentifier') return nameNode.name;
  if (nameNode.type === 'JSXMemberExpression') return `${jsxName(nameNode.object)}.${jsxName(nameNode.property)}`;
  if (nameNode.type === 'JSXNamespacedName') return `${jsxName(nameNode.namespace)}:${jsxName(nameNode.name)}`;
  return '';
}

export function validateWidgetSource(source: string, allowedComponents: Set<string>): ValidationResult {
  let ast: unknown;
  try {
    ast = parse(source, {
      sourceType: 'script',
      allowReturnOutsideFunction: true,
      plugins: ['jsx'],
      errorRecovery: false,
    });
  } catch (e) {
    return { ok: false, errors: [`Syntax error: ${(e as Error).message}`] };
  }

  const errors: string[] = [];

  walk(ast, null, '', (node, parent, key) => {
    switch (node.type) {
      case 'ImportDeclaration':
      case 'ImportExpression':
      case 'ExportNamedDeclaration':
      case 'ExportDefaultDeclaration':
      case 'ExportAllDeclaration':
        errors.push('Imports and exports are not allowed.');
        break;
      case 'TaggedTemplateExpression':
        errors.push('Tagged template expressions are not allowed.');
        break;
      case 'Identifier':
        if (DISALLOWED_IDENTIFIERS.has(node.name) && isReference(parent, key)) {
          errors.push(`Use of "${node.name}" is not allowed.`);
        }
        break;
      case 'MemberExpression':
      case 'OptionalMemberExpression': {
        const prop = node.property;
        if (!node.computed && prop?.type === 'Identifier' && FORBIDDEN_MEMBER_PROPS.has(prop.name)) {
          errors.push(`Access to "${prop.name}" is not allowed.`);
        }
        if (node.computed && prop?.type === 'StringLiteral' && FORBIDDEN_MEMBER_PROPS.has(prop.value)) {
          errors.push(`Access to "${prop.value}" is not allowed.`);
        }
        break;
      }
      case 'JSXOpeningElement': {
        const name = jsxName(node.name);
        const isComponent = /^[A-Z]/.test(name);
        if (isComponent) {
          if (!allowedComponents.has(name)) {
            errors.push(`Component "${name}" is not in the allow-list.`);
          }
        } else if (!HOST_ELEMENTS.has(name)) {
          errors.push(`HTML element "<${name}>" is not allowed.`);
        } else {
          for (const attr of node.attributes ?? []) {
            if (attr.type === 'JSXSpreadAttribute') {
              errors.push(`Spread attributes on <${name}> are not allowed.`);
              continue;
            }
            const attrName = jsxName(attr.name);
            if (!ALLOWED_HOST_ATTRS.has(attrName)) {
              errors.push(`Attribute "${attrName}" on <${name}> is not allowed.`);
            }
          }
        }
        break;
      }
      case 'JSXAttribute':
        if (jsxName(node.name) === 'dangerouslySetInnerHTML') {
          errors.push('"dangerouslySetInnerHTML" is not allowed.');
        }
        break;
    }
  });

  const unique = [...new Set(errors)];
  return { ok: unique.length === 0, errors: unique };
}
```

- [ ] **Step 5: Run to verify the validator passes**

Run: `pnpm --filter @nikolayvalev/command-panel test`
Expected: PASS — every accept/reject/no-false-positive case green.

- [ ] **Step 6: Commit**

```bash
git add packages/command-panel/src/sandbox/constants.ts packages/command-panel/src/sandbox/validate.ts packages/command-panel/src/sandbox/validate.test.ts
git commit -m "feat(command-panel): AST allow-list validator for the sandbox"
```

---

### Task 5: Transpile (sucrase, classic JSX)

**Files:**
- Create: `packages/command-panel/src/sandbox/transpile.ts`
- Test: `packages/command-panel/src/sandbox/transpile.test.ts`

**Interfaces:**
- Consumes: `sucrase`.
- Produces: `transpileWidgetBody(source: string): string` — wraps the widget body as `function Widget(props) { ... }` and transpiles JSX to classic `React.createElement` calls.

- [ ] **Step 1: Write the failing test**

`packages/command-panel/src/sandbox/transpile.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { transpileWidgetBody } from './transpile';

describe('transpileWidgetBody', () => {
  it('wraps the body in a Widget function and compiles JSX to React.createElement', () => {
    const code = transpileWidgetBody('return <Card>hi</Card>;');
    expect(code).toContain('function Widget');
    expect(code).toContain('React.createElement');
    expect(code).toContain('Card');
    expect(code).not.toContain('jsx('); // classic runtime, not automatic
  });

  it('compiles host elements to string-tag createElement calls', () => {
    const code = transpileWidgetBody('return <div className="x" />;');
    expect(code).toContain('React.createElement("div"');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm --filter @nikolayvalev/command-panel test`
Expected: FAIL — cannot resolve `./transpile`.

- [ ] **Step 3: Implement `transpile.ts`**

```ts
import { transform } from 'sucrase';

/**
 * Wrap a widget body (statements ending in `return <jsx/>`) as a function component
 * and transpile its JSX to classic `React.createElement` calls. `React` and any
 * component identifiers are supplied by the evaluator's scope, not by imports.
 */
export function transpileWidgetBody(source: string): string {
  const wrapped = `function Widget(props) {\n${source}\n}`;
  const { code } = transform(wrapped, {
    transforms: ['jsx'],
    jsxRuntime: 'classic',
    production: true,
  });
  return code;
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm --filter @nikolayvalev/command-panel test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/command-panel/src/sandbox/transpile.ts packages/command-panel/src/sandbox/transpile.test.ts
git commit -m "feat(command-panel): JSX transpile step (sucrase classic runtime)"
```

---

### Task 6: Evaluate (build the component with a shadowed-global scope)

**Files:**
- Create: `packages/command-panel/src/sandbox/evaluate.ts`
- Test: `packages/command-panel/src/sandbox/evaluate.dom.test.tsx`

**Interfaces:**
- Consumes: `react`; `SHADOWED_GLOBALS` from `./constants`; output of `transpileWidgetBody`.
- Produces: `buildWidgetComponent(transpiledCode: string, scope: Record<string, unknown>): React.ComponentType<any>`. `React` is injected automatically; `scope` supplies hooks + registry components. Forbidden globals are shadowed to `undefined`.

- [ ] **Step 1: Write the failing test** (jsdom)

`packages/command-panel/src/sandbox/evaluate.dom.test.tsx`:
```tsx
// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { transpileWidgetBody } from './transpile';
import { buildWidgetComponent } from './evaluate';

function build(source: string, scope: Record<string, unknown> = {}) {
  return buildWidgetComponent(transpileWidgetBody(source), scope);
}

describe('buildWidgetComponent', () => {
  it('builds a component that renders host JSX', () => {
    const Widget = build('return <div>hello</div>;');
    render(<Widget />);
    expect(screen.getByText('hello')).toBeDefined();
  });

  it('injects registry components into scope by name', () => {
    const Box = ({ children }: { children?: React.ReactNode }) => <section>{children}</section>;
    const Widget = build('return <Box>inside</Box>;', { Box });
    render(<Widget />);
    expect(screen.getByText('inside')).toBeDefined();
  });

  it('shadows forbidden globals to undefined inside the widget', () => {
    // typeof window must be 'undefined' inside the sandbox even though jsdom defines it.
    const seen: string[] = [];
    const probe = (t: string) => { seen.push(t); };
    const Widget = build('probe(typeof window); return <div>x</div>;', { probe });
    render(<Widget />);
    expect(seen).toEqual(['undefined']);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm --filter @nikolayvalev/command-panel test`
Expected: FAIL — cannot resolve `./evaluate`.

- [ ] **Step 3: Implement `evaluate.ts`**

```ts
import * as React from 'react';
import { SHADOWED_GLOBALS } from './constants';

/**
 * Build a React component from transpiled widget code.
 *
 * Security model: the transpiled code runs inside `new Function`, which has NO access
 * to this module's closure but DOES see ambient globals. We neutralize that by passing
 * the dangerous globals as parameters bound to `undefined`, so `window`, `fetch`, etc.
 * lexically resolve to `undefined` inside the widget. The AST validator is the primary
 * gate; this shadowing is the backstop. `"use strict"` ensures undeclared free
 * identifiers throw rather than leaking, and `this` is undefined.
 */
export function buildWidgetComponent(
  transpiledCode: string,
  scope: Record<string, unknown>,
): React.ComponentType<any> {
  const injected: Record<string, unknown> = { React, ...scope };

  // Unique param list: injected names first, then any shadowed globals not already injected.
  const paramNames: string[] = [...Object.keys(injected)];
  const paramSeen = new Set(paramNames);
  for (const g of SHADOWED_GLOBALS) {
    if (!paramSeen.has(g)) {
      paramNames.push(g);
      paramSeen.add(g);
    }
  }

  const args: unknown[] = paramNames.map((name) =>
    name in injected ? injected[name] : undefined,
  );

  const body = `"use strict";\n${transpiledCode}\nreturn Widget;`;
  // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
  const factory = new Function(...paramNames, body) as (...a: unknown[]) => React.ComponentType<any>;
  return factory(...args);
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm --filter @nikolayvalev/command-panel test`
Expected: PASS — including the `typeof window === 'undefined'` shadowing check.

- [ ] **Step 5: Commit**

```bash
git add packages/command-panel/src/sandbox/evaluate.ts packages/command-panel/src/sandbox/evaluate.dom.test.tsx
git commit -m "feat(command-panel): evaluate widget code with global-shadowed scope"
```

---

### Task 7: `useMetric` + `DataResolverProvider`

**Files:**
- Create: `packages/command-panel/src/sandbox/use-metric.ts`
- Test: `packages/command-panel/src/sandbox/use-metric.dom.test.tsx`

**Interfaces:**
- Consumes: `react`; `DataResolver` from `../registry/data-registry`.
- Produces:
  - `interface MetricState<T = unknown> { data: T | undefined; loading: boolean; error: string | undefined }`
  - `DataResolverProvider({ resolver, children }: { resolver: DataResolver; children: React.ReactNode }): JSX.Element`
  - `useMetric<T = unknown>(id: string, params?: Record<string, unknown>): MetricState<T>`

- [ ] **Step 1: Write the failing test** (jsdom)

`packages/command-panel/src/sandbox/use-metric.dom.test.tsx`:
```tsx
// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { DataResolverProvider, useMetric } from './use-metric';
import type { DataResolver } from '../registry/data-registry';

function Probe({ id }: { id: string }) {
  const { data, loading, error } = useMetric<number>(id);
  if (loading) return <span>loading</span>;
  if (error) return <span>error:{error}</span>;
  return <span>value:{String(data)}</span>;
}

function renderWith(resolver: DataResolver, id: string) {
  return render(
    <DataResolverProvider resolver={resolver}>
      <Probe id={id} />
    </DataResolverProvider>,
  );
}

describe('useMetric', () => {
  it('shows loading then the resolved value', async () => {
    renderWith(async () => 42, 'x');
    expect(screen.getByText('loading')).toBeDefined();
    await waitFor(() => expect(screen.getByText('value:42')).toBeDefined());
  });

  it('surfaces a resolver rejection as an error state', async () => {
    renderWith(async () => { throw new Error('boom'); }, 'x');
    await waitFor(() => expect(screen.getByText('error:boom')).toBeDefined());
  });

  it('errors when no resolver is provided', async () => {
    render(<Probe id="x" />);
    await waitFor(() => expect(screen.getByText(/error:/)).toBeDefined());
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm --filter @nikolayvalev/command-panel test`
Expected: FAIL — cannot resolve `./use-metric`.

- [ ] **Step 3: Implement `use-metric.ts`**

```ts
import * as React from 'react';
import type { DataResolver } from '../registry/data-registry';

export interface MetricState<T = unknown> {
  data: T | undefined;
  loading: boolean;
  error: string | undefined;
}

const DataResolverContext = React.createContext<DataResolver | null>(null);

export function DataResolverProvider({
  resolver,
  children,
}: {
  resolver: DataResolver;
  children: React.ReactNode;
}): JSX.Element {
  return React.createElement(DataResolverContext.Provider, { value: resolver }, children);
}

/**
 * The only data channel available to generated widgets. Resolves `id` through the
 * context resolver (which is backed by a read-only DataRegistry). Re-runs when
 * `id` or the JSON-serialized `params` change; guards against stale updates.
 */
export function useMetric<T = unknown>(id: string, params?: Record<string, unknown>): MetricState<T> {
  const resolver = React.useContext(DataResolverContext);
  const paramsKey = params ? JSON.stringify(params) : '';
  const [state, setState] = React.useState<MetricState<T>>({
    data: undefined,
    loading: true,
    error: undefined,
  });

  React.useEffect(() => {
    let cancelled = false;
    setState({ data: undefined, loading: true, error: undefined });

    if (!resolver) {
      setState({ data: undefined, loading: false, error: 'No data resolver provided.' });
      return;
    }

    resolver(id, params)
      .then((value) => {
        if (!cancelled) setState({ data: value as T, loading: false, error: undefined });
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setState({ data: undefined, loading: false, error: e instanceof Error ? e.message : String(e) });
        }
      });

    return () => {
      cancelled = true;
    };
    // paramsKey captures params by value; resolver/id are the other inputs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolver, id, paramsKey]);

  return state;
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm --filter @nikolayvalev/command-panel test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/command-panel/src/sandbox/use-metric.ts packages/command-panel/src/sandbox/use-metric.dom.test.tsx
git commit -m "feat(command-panel): useMetric hook + DataResolverProvider"
```

---

### Task 8: `WidgetErrorBoundary` + `WidgetRenderer`

**Files:**
- Create: `packages/command-panel/src/sandbox/ErrorBoundary.tsx`
- Create: `packages/command-panel/src/sandbox/WidgetRenderer.tsx`
- Test: `packages/command-panel/src/sandbox/WidgetRenderer.dom.test.tsx`

**Interfaces:**
- Consumes: `validateWidgetSource`, `transpileWidgetBody`, `buildWidgetComponent`, `useMetric`, `HOOK_NAMES`; `ComponentRegistry`, `registryComponentNames`, `registryScope`.
- Produces:
  - `WidgetErrorBoundary` (class component with a `fallback: (message: string) => React.ReactNode` prop).
  - `interface WidgetRendererProps { source: string; registry: ComponentRegistry; className?: string }`
  - `WidgetRenderer(props: WidgetRendererProps): JSX.Element`

- [ ] **Step 1: Write the failing test** (jsdom)

`packages/command-panel/src/sandbox/WidgetRenderer.dom.test.tsx`:
```tsx
// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { WidgetRenderer } from './WidgetRenderer';
import { DataResolverProvider } from './use-metric';
import { createComponentRegistry, type ComponentEntry } from '../registry/component-registry';

const Box = ({ children }: { children?: React.ReactNode }) => <section>{children}</section>;
const registry = createComponentRegistry([
  { name: 'Box', component: Box, description: 'box' } as ComponentEntry,
]);

describe('WidgetRenderer', () => {
  it('renders a valid widget using a registered component', () => {
    render(<WidgetRenderer source="return <Box>ok</Box>;" registry={registry} />);
    expect(screen.getByText('ok')).toBeDefined();
  });

  it('shows an error card (not a crash) for source that fails validation', () => {
    render(<WidgetRenderer source="return window.location.href;" registry={registry} />);
    expect(screen.getByRole('alert').textContent).toMatch(/not allowed/i);
  });

  it('catches a runtime error in a valid-but-throwing widget', () => {
    render(<WidgetRenderer source="return <Box>{undefined.x}</Box>;" registry={registry} />);
    expect(screen.getByRole('alert')).toBeDefined();
  });

  it('renders live data through useMetric', async () => {
    render(
      <DataResolverProvider resolver={async () => 7}>
        <WidgetRenderer source="const m = useMetric('k'); return <Box>{m.loading ? 'load' : String(m.data)}</Box>;" registry={registry} />
      </DataResolverProvider>,
    );
    await waitFor(() => expect(screen.getByText('7')).toBeDefined());
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm --filter @nikolayvalev/command-panel test`
Expected: FAIL — cannot resolve `./WidgetRenderer`.

- [ ] **Step 3: Implement `ErrorBoundary.tsx`**

```tsx
import * as React from 'react';

interface Props {
  fallback: (message: string) => React.ReactNode;
  children: React.ReactNode;
  /** Changing this key resets the boundary (e.g. when the widget source changes). */
  resetKey?: string;
}
interface State {
  message: string | null;
}

export class WidgetErrorBoundary extends React.Component<Props, State> {
  state: State = { message: null };

  static getDerivedStateFromError(error: unknown): State {
    return { message: error instanceof Error ? error.message : String(error) };
  }

  componentDidUpdate(prev: Props): void {
    if (prev.resetKey !== this.props.resetKey && this.state.message !== null) {
      this.setState({ message: null });
    }
  }

  render(): React.ReactNode {
    if (this.state.message !== null) return this.props.fallback(this.state.message);
    return this.props.children;
  }
}
```

- [ ] **Step 4: Implement `WidgetRenderer.tsx`**

```tsx
import * as React from 'react';
import { validateWidgetSource } from './validate';
import { transpileWidgetBody } from './transpile';
import { buildWidgetComponent } from './evaluate';
import { useMetric } from './use-metric';
import { WidgetErrorBoundary } from './ErrorBoundary';
import {
  type ComponentRegistry,
  registryComponentNames,
  registryScope,
} from '../registry/component-registry';

export interface WidgetRendererProps {
  source: string;
  registry: ComponentRegistry;
  className?: string;
}

function ErrorCard({ message, className }: { message: string; className?: string }): JSX.Element {
  return (
    <div
      role="alert"
      className={className}
      style={{
        padding: '0.75rem 1rem',
        borderRadius: 'var(--radius, 0.5rem)',
        border: '1px solid var(--destructive, #dc2626)',
        color: 'var(--destructive, #dc2626)',
        background: 'var(--card, transparent)',
        font: 'inherit',
        fontSize: '0.875rem',
      }}
    >
      Widget error: {message}
    </div>
  );
}

export function WidgetRenderer({ source, registry, className }: WidgetRendererProps): JSX.Element {
  const built = React.useMemo(() => {
    const validation = validateWidgetSource(source, new Set(registryComponentNames(registry)));
    if (!validation.ok) {
      return { component: null as React.ComponentType<any> | null, error: validation.errors.join(' ') };
    }
    try {
      const code = transpileWidgetBody(source);
      const scope = {
        useMetric,
        useState: React.useState,
        useMemo: React.useMemo,
        useRef: React.useRef,
        ...registryScope(registry),
      };
      return { component: buildWidgetComponent(code, scope), error: null as string | null };
    } catch (e) {
      return { component: null, error: e instanceof Error ? e.message : String(e) };
    }
  }, [source, registry]);

  if (built.error || !built.component) {
    return <ErrorCard message={built.error ?? 'Failed to build widget.'} className={className} />;
  }

  const Widget = built.component;
  return (
    <WidgetErrorBoundary resetKey={source} fallback={(m) => <ErrorCard message={m} className={className} />}>
      <div className={className}>
        <Widget />
      </div>
    </WidgetErrorBoundary>
  );
}
```

- [ ] **Step 5: Run to verify it passes**

Run: `pnpm --filter @nikolayvalev/command-panel test`
Expected: PASS — valid render, validation-error card, runtime-error card, and live `useMetric` data all green.

- [ ] **Step 6: Commit**

```bash
git add packages/command-panel/src/sandbox/ErrorBoundary.tsx packages/command-panel/src/sandbox/WidgetRenderer.tsx packages/command-panel/src/sandbox/WidgetRenderer.dom.test.tsx
git commit -m "feat(command-panel): WidgetRenderer + error boundary (sandbox render pipeline)"
```

---

### Task 9: Public exports + build + typecheck/lint green

**Files:**
- Modify: `packages/command-panel/src/index.ts`

**Interfaces:**
- Consumes: everything built in Tasks 2–8.
- Produces: the engine-core public API importable from `@nikolayvalev/command-panel`.

- [ ] **Step 1: Replace `src/index.ts` with the public surface**

```ts
// Registries
export {
  createComponentRegistry,
  extendRegistry,
  registryComponentNames,
  registryScope,
  type ComponentEntry,
  type ComponentRegistry,
} from './registry/component-registry';
export {
  createDataRegistry,
  getDataSource,
  createRegistryResolver,
  type DataSource,
  type DataRegistry,
  type DataResolver,
} from './registry/data-registry';
export { defaultComponentRegistry } from './registry/default-registry';

// Sandbox
export { validateWidgetSource, type ValidationResult } from './sandbox/validate';
export { WidgetRenderer, type WidgetRendererProps } from './sandbox/WidgetRenderer';
export { WidgetErrorBoundary } from './sandbox/ErrorBoundary';
export { DataResolverProvider, useMetric, type MetricState } from './sandbox/use-metric';
```

- [ ] **Step 2: Typecheck the package**

Run: `pnpm --filter @nikolayvalev/command-panel typecheck`
Expected: PASS.

- [ ] **Step 3: Lint the package**

Run: `pnpm --filter @nikolayvalev/command-panel lint`
Expected: PASS (no errors; the `no-new-func`/implied-eval disable in `evaluate.ts` is intentional and scoped).

- [ ] **Step 4: Build and verify the public API is in the type output**

Run:
```bash
pnpm --filter @nikolayvalev/command-panel build
node -e "const fs=require('fs');const d=fs.readFileSync('./packages/command-panel/dist/index.d.ts','utf8');for (const n of ['WidgetRenderer','validateWidgetSource','defaultComponentRegistry','useMetric','createDataRegistry']) { if(!d.includes(n)){console.error('MISSING export:',n);process.exit(1)} } console.log('OK: engine-core exports present in dist')"
```
Expected: build succeeds; prints `OK: engine-core exports present in dist`.

- [ ] **Step 5: Run the full package test suite once more**

Run: `pnpm --filter @nikolayvalev/command-panel test`
Expected: PASS — all registry + sandbox tests green, output pristine.

- [ ] **Step 6: Commit**

```bash
git add packages/command-panel/src/index.ts
git commit -m "feat(command-panel): export the engine-core public API"
```

---

## Self-Review

**1. Spec coverage (Phase 2a scope = engine package + registries + sandbox):**
- Portable, published-shaped engine package consuming the DS as a peer dep → Task 1. ✓
- `ComponentRegistry` (default = DS + charts; host-extendable via `extendRegistry`) → Tasks 2, 3. ✓
- `DataRegistry` / `DataSource` (read-only; `useMetric` the only channel) → Tasks 2, 7. ✓
- Sandbox = validate (AST allow-list) → transpile (sucrase) → evaluate (frozen/shadowed scope) → render (error boundary) → Tasks 4, 5, 6, 8. ✓
- Components + safe host-element subset with attribute allow-list (the 2026-06-24 decision) → Task 4 validator + tests. ✓
- Hard security boundary with two layers (AST gate + global shadowing) → Tasks 4, 6; asserted by the `typeof window` test and the reject table. ✓
- (Generation/system-prompt/`propose_widget`/AI-SDK handler = **Phase 2b**; panel UI + pinned store = **Phase 2c** — intentionally out of scope.)

**2. Placeholder scan:** No TBD/TODO; every code step has complete code; every command has expected output. No "similar to Task N" references — code is repeated where needed.

**3. Type consistency:** `ComponentRegistry`/`ComponentEntry`/`DataSource`/`DataRegistry`/`DataResolver`/`ValidationResult`/`MetricState`/`WidgetRendererProps` are defined once and consumed with matching names across tasks. `validateWidgetSource(source, Set<string>)`, `transpileWidgetBody(source)`, `buildWidgetComponent(code, scope)`, `useMetric(id, params?)`, `registryScope`/`registryComponentNames` signatures match every call site (notably in `WidgetRenderer`). `DataResolver` is defined in `data-registry.ts` and imported by `use-metric.ts` (no cycle).

---

## Follow-on plans (not in this document)

- **Phase 2b — Generation + server:** the system-prompt builder (from the registries), the `propose_widget` tool schema, a Next.js route-handler factory using the Vercel AI SDK + `@ai-sdk/anthropic` + `claude-opus-4-8` (streaming), and the HTTP `DataResolver` implementation (a read-only per-id data endpoint) that backs `useMetric` in a deployed host. Adds `ai`, `@ai-sdk/anthropic`, `zod` deps.
- **Phase 2c — Panel UI + state:** `CommandPanel` two-pane shell, `ChatPane`, `WidgetPreviewCard` (inline preview via `WidgetRenderer` + Pin), `DashboardGrid`, and the pinned store (`@repo/state` + `localStorage`). Wires 2a + 2b together.
- **Phase 3 — Reference host:** `apps/command-panel` wiring the engine to monorepo metrics; e2e smoke.
