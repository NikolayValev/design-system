# Command Panel — Phase 1: Chart Primitives Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add four themeable, dependency-free SVG chart primitives (`LineChart`, `BarChart`, `AreaChart`, `Donut`) to `@nikolayvalev/design-system` as the canonical charting vocabulary the command-panel engine will draw from.

**Architecture:** Pure SVG components in a new `src/charts/` family. All geometry (scales, paths, bars, donut arcs) lives in a separately unit-tested pure module (`charts/geometry.ts`); the components are thin renderers that read `var(--chart-1..5)` tokens for color. No charting library — the design system stays at zero runtime dependencies. Vitest is introduced (scoped to this package) to TDD the geometry and a light render check per component.

**Tech Stack:** TypeScript (ESM), React 18/19 (peer), SVG, Vitest (new dev dependency), Storybook + Playwright (existing visual infra).

## Global Constraints

- **Zero runtime dependencies.** `packages/design-system/package.json` `dependencies` MUST stay `{}`. Do not add a charting library.
- **Token-driven color only.** Series colors MUST be `var(--chart-1)`…`var(--chart-5)`. No hardcoded hex/rgb/oklch in chart components.
- **ESM only**, React `^18 || ^19` as a peer dependency, TypeScript strict.
- **Component convention:** `React.forwardRef`, merge an incoming `className`, spread remaining props, set `displayName` — mirror `src/components/StatChip.tsx`.
- **Charts live in `src/charts/`** and are re-exported through `src/index.ts` (sibling of `./components`, `./sections`, `./pages`).
- **Visual baselines** are generated via the repo's Playwright-container workflow (Linux PNGs), NOT a raw local `--update` (local OS snapshots won't match CI). New stories are auto-discovered by `apps/storybook/tests/visual/stories.visual.spec.ts`.
- **Commits:** conventional-commit messages, and every commit message ends with the trailer `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.
- Work happens on branch `feat/command-panel` (already checked out).

---

### Task 1: Vitest harness + chart geometry (pure math, TDD)

**Files:**
- Create: `packages/design-system/vitest.config.ts`
- Modify: `packages/design-system/package.json` (add `vitest` devDep + `test` script)
- Create: `packages/design-system/src/charts/geometry.ts`
- Test: `packages/design-system/src/charts/geometry.test.ts`

**Interfaces:**
- Consumes: nothing (first task).
- Produces (used by Tasks 2–5):
  - `type Point = { x: number; y: number }`
  - `scaleLinear(domain: [number, number], range: [number, number]): (value: number) => number`
  - `extent(values: number[]): [number, number]`
  - `buildLinePath(points: Point[]): string`
  - `buildAreaPath(points: Point[], baselineY: number): string`
  - `type Bar = { x: number; y: number; width: number; height: number }`
  - `computeBars(values: number[], opts: { width: number; height: number; gap?: number; max?: number }): Bar[]`
  - `type DonutArc = { d: string; colorIndex: number; value: number }`
  - `buildDonutArcs(values: number[], opts: { cx: number; cy: number; rOuter: number; rInner: number }): DonutArc[]`

- [ ] **Step 1: Add Vitest as a dev dependency**

Run:
```bash
pnpm --filter @nikolayvalev/design-system add -D vitest@^2.1.0
```
Expected: `vitest` appears under `devDependencies` in `packages/design-system/package.json`.

- [ ] **Step 2: Add the `test` script**

Edit `packages/design-system/package.json` — add to `"scripts"` (after `"lint"`):
```json
    "test": "vitest run",
    "test:watch": "vitest",
```

- [ ] **Step 3: Create the Vitest config**

Create `packages/design-system/vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  // esbuild's automatic JSX runtime means test files don't need to import React.
  esbuild: { jsx: 'automatic' },
  test: {
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
```

- [ ] **Step 4: Write the failing geometry tests**

Create `packages/design-system/src/charts/geometry.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import {
  scaleLinear,
  extent,
  buildLinePath,
  buildAreaPath,
  computeBars,
  buildDonutArcs,
} from './geometry';

describe('scaleLinear', () => {
  it('maps the midpoint of the domain to the midpoint of the range', () => {
    expect(scaleLinear([0, 10], [0, 100])(5)).toBe(50);
  });
  it('handles a zero-width domain without dividing by zero', () => {
    expect(scaleLinear([4, 4], [0, 100])(4)).toBe(0);
  });
});

describe('extent', () => {
  it('returns the min and max', () => {
    expect(extent([3, 1, 4, 1, 5])).toEqual([1, 5]);
  });
  it('returns [0, 0] for an empty list', () => {
    expect(extent([])).toEqual([0, 0]);
  });
});

describe('buildLinePath', () => {
  it('starts with M and uses L for subsequent points', () => {
    expect(buildLinePath([{ x: 0, y: 0 }, { x: 10, y: 5 }])).toBe('M0,0 L10,5');
  });
  it('returns an empty string for no points', () => {
    expect(buildLinePath([])).toBe('');
  });
});

describe('buildAreaPath', () => {
  it('closes the path down to the baseline', () => {
    const d = buildAreaPath([{ x: 0, y: 2 }, { x: 10, y: 4 }], 20);
    expect(d.endsWith('Z')).toBe(true);
    expect(d).toContain('L10,20');
    expect(d).toContain('L0,20');
  });
});

describe('computeBars', () => {
  it('produces one bar per value', () => {
    expect(computeBars([1, 2, 3], { width: 300, height: 100 })).toHaveLength(3);
  });
  it('scales the tallest value to the full height', () => {
    const bars = computeBars([1, 2, 4], { width: 300, height: 100, gap: 0 });
    expect(bars[2].height).toBe(100);
    expect(bars[2].y).toBe(0);
  });
  it('puts a zero value at the baseline with zero height', () => {
    const bars = computeBars([0, 4], { width: 200, height: 100, gap: 0 });
    expect(bars[0].height).toBe(0);
    expect(bars[0].y).toBe(100);
  });
});

describe('buildDonutArcs', () => {
  it('produces one arc per value and cycles colors 1..5', () => {
    const arcs = buildDonutArcs([1, 1, 1], { cx: 50, cy: 50, rOuter: 50, rInner: 30 });
    expect(arcs).toHaveLength(3);
    expect(arcs.map((a) => a.colorIndex)).toEqual([1, 2, 3]);
  });
  it('returns no arcs when the total is zero', () => {
    expect(buildDonutArcs([0, 0], { cx: 50, cy: 50, rOuter: 50, rInner: 30 })).toEqual([]);
  });
  it('produces closed arc paths', () => {
    const arcs = buildDonutArcs([2, 3], { cx: 50, cy: 50, rOuter: 50, rInner: 30 });
    for (const a of arcs) expect(a.d.endsWith('Z')).toBe(true);
  });
});
```

- [ ] **Step 5: Run the tests to verify they fail**

Run:
```bash
pnpm --filter @nikolayvalev/design-system test
```
Expected: FAIL — `Failed to resolve import "./geometry"` / module not found.

- [ ] **Step 6: Implement the geometry module**

Create `packages/design-system/src/charts/geometry.ts`:
```ts
export type Point = { x: number; y: number };

/** Map a value from an input domain to an output range, linearly. */
export function scaleLinear(
  domain: [number, number],
  range: [number, number],
): (value: number) => number {
  const [d0, d1] = domain;
  const [r0, r1] = range;
  const span = d1 - d0;
  return (value: number) => (span === 0 ? r0 : r0 + ((value - d0) / span) * (r1 - r0));
}

/** Min and max of a numeric list. Returns [0, 0] for an empty list. */
export function extent(values: number[]): [number, number] {
  if (values.length === 0) return [0, 0];
  let min = values[0];
  let max = values[0];
  for (const v of values) {
    if (v < min) min = v;
    if (v > max) max = v;
  }
  return [min, max];
}

/** SVG path string through points, e.g. "M0,0 L10,5 L20,2". */
export function buildLinePath(points: Point[]): string {
  if (points.length === 0) return '';
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'}${round(p.x)},${round(p.y)}`).join(' ');
}

/** SVG area path: the line through points, closed straight down to baselineY. */
export function buildAreaPath(points: Point[], baselineY: number): string {
  if (points.length === 0) return '';
  const line = buildLinePath(points);
  const last = points[points.length - 1];
  const first = points[0];
  return `${line} L${round(last.x)},${round(baselineY)} L${round(first.x)},${round(baselineY)} Z`;
}

export type Bar = { x: number; y: number; width: number; height: number };

/** Evenly spaced vertical bars within [0,width] x [0,height]; value 0 sits at the bottom. */
export function computeBars(
  values: number[],
  opts: { width: number; height: number; gap?: number; max?: number },
): Bar[] {
  const { width, height } = opts;
  const gap = opts.gap ?? 8;
  const n = values.length;
  if (n === 0) return [];
  const max = opts.max ?? Math.max(0, ...values);
  const slot = width / n;
  const barWidth = Math.max(0, slot - gap);
  return values.map((v, i) => {
    const h = max === 0 ? 0 : (v / max) * height;
    return {
      x: round(i * slot + gap / 2),
      y: round(height - h),
      width: round(barWidth),
      height: round(h),
    };
  });
}

export type DonutArc = { d: string; colorIndex: number; value: number };

/** Donut ring arcs, clockwise from the top, for the given values. */
export function buildDonutArcs(
  values: number[],
  opts: { cx: number; cy: number; rOuter: number; rInner: number },
): DonutArc[] {
  const { cx, cy, rOuter, rInner } = opts;
  const total = values.reduce((s, v) => s + Math.max(0, v), 0);
  if (total === 0) return [];
  let angle = 0;
  return values.map((v, i) => {
    const sweep = (Math.max(0, v) / total) * 360;
    const start = angle;
    const end = angle + sweep;
    angle = end;
    return { d: arcPath(cx, cy, rOuter, rInner, start, end), colorIndex: (i % 5) + 1, value: v };
  });
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number): Point {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

function arcPath(
  cx: number,
  cy: number,
  rOuter: number,
  rInner: number,
  start: number,
  end: number,
): string {
  const largeArc = end - start > 180 ? 1 : 0;
  const oStart = polarToCartesian(cx, cy, rOuter, end);
  const oEnd = polarToCartesian(cx, cy, rOuter, start);
  const iEnd = polarToCartesian(cx, cy, rInner, start);
  const iStart = polarToCartesian(cx, cy, rInner, end);
  return [
    `M${round(oStart.x)},${round(oStart.y)}`,
    `A${rOuter},${rOuter} 0 ${largeArc} 0 ${round(oEnd.x)},${round(oEnd.y)}`,
    `L${round(iEnd.x)},${round(iEnd.y)}`,
    `A${rInner},${rInner} 0 ${largeArc} 1 ${round(iStart.x)},${round(iStart.y)}`,
    'Z',
  ].join(' ');
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}
```

- [ ] **Step 7: Run the tests to verify they pass**

Run:
```bash
pnpm --filter @nikolayvalev/design-system test
```
Expected: PASS — all geometry tests green.

- [ ] **Step 8: Confirm zero runtime dependencies unchanged**

Run:
```bash
node -e "const p=require('./packages/design-system/package.json'); if (Object.keys(p.dependencies||{}).length) { console.error('FAIL: runtime deps added', p.dependencies); process.exit(1) } else console.log('OK: zero runtime deps')"
```
Expected: `OK: zero runtime deps`.

- [ ] **Step 9: Commit**

```bash
git add packages/design-system/vitest.config.ts packages/design-system/package.json packages/design-system/src/charts/geometry.ts packages/design-system/src/charts/geometry.test.ts pnpm-lock.yaml
git commit -m "feat(charts): add chart geometry helpers + vitest harness"
```

---

### Task 2: Shared chart types + `LineChart` (TDD)

**Files:**
- Create: `packages/design-system/src/charts/types.ts`
- Create: `packages/design-system/src/charts/LineChart.tsx`
- Test: `packages/design-system/src/charts/LineChart.test.tsx`

**Interfaces:**
- Consumes: `scaleLinear`, `extent`, `buildLinePath`, `Point` from `./geometry`.
- Produces (used by Tasks 3–5 and the engine):
  - `interface ChartDatum { label: string; value: number }`
  - `type ChartColorIndex = 1 | 2 | 3 | 4 | 5`
  - `interface CartesianChartProps extends Omit<React.SVGAttributes<SVGSVGElement>, 'children'> { data: ChartDatum[]; width?: number; height?: number; colorIndex?: ChartColorIndex }`
  - `interface DonutProps extends Omit<React.SVGAttributes<SVGSVGElement>, 'children'> { data: ChartDatum[]; size?: number; thickness?: number }`
  - `LineChart: React.ForwardRefExoticComponent<CartesianChartProps & React.RefAttributes<SVGSVGElement>>`

- [ ] **Step 1: Write the failing render test**

Create `packages/design-system/src/charts/LineChart.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { LineChart } from './LineChart';

const data = [
  { label: 'Jan', value: 10 },
  { label: 'Feb', value: 30 },
  { label: 'Mar', value: 20 },
];

describe('LineChart', () => {
  it('renders one svg with a single token-colored line path', () => {
    const html = renderToStaticMarkup(<LineChart data={data} />);
    expect(html).toContain('<svg');
    expect(html).toContain('stroke="var(--chart-1)"');
    expect((html.match(/<path/g) ?? []).length).toBe(1);
  });
  it('honors colorIndex', () => {
    const html = renderToStaticMarkup(<LineChart data={data} colorIndex={3} />);
    expect(html).toContain('stroke="var(--chart-3)"');
  });
  it('merges an incoming className', () => {
    const html = renderToStaticMarkup(<LineChart data={data} className="my-chart" />);
    expect(html).toContain('class="my-chart"');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:
```bash
pnpm --filter @nikolayvalev/design-system test
```
Expected: FAIL — cannot resolve `./LineChart`.

- [ ] **Step 3: Create the shared chart types**

Create `packages/design-system/src/charts/types.ts`:
```ts
import type React from 'react';

export interface ChartDatum {
  label: string;
  value: number;
}

export type ChartColorIndex = 1 | 2 | 3 | 4 | 5;

export interface CartesianChartProps
  extends Omit<React.SVGAttributes<SVGSVGElement>, 'children'> {
  data: ChartDatum[];
  width?: number;
  height?: number;
  colorIndex?: ChartColorIndex;
}

export interface DonutProps extends Omit<React.SVGAttributes<SVGSVGElement>, 'children'> {
  data: ChartDatum[];
  size?: number;
  thickness?: number;
}
```

- [ ] **Step 4: Implement `LineChart`**

Create `packages/design-system/src/charts/LineChart.tsx`:
```tsx
import React from 'react';
import { scaleLinear, extent, buildLinePath, type Point } from './geometry';
import type { CartesianChartProps } from './types';

const PAD = 8;

/** LineChart - single-series SVG line, colored by a --chart-N token. */
export const LineChart = React.forwardRef<SVGSVGElement, CartesianChartProps>(
  ({ data, width = 320, height = 180, colorIndex = 1, className = '', ...props }, ref) => {
    const innerW = width - PAD * 2;
    const innerH = height - PAD * 2;
    const [, yMax] = extent(data.map((d) => d.value));
    const xMax = Math.max(1, data.length - 1);
    const sx = scaleLinear([0, xMax], [PAD, PAD + innerW]);
    const sy = scaleLinear([0, yMax === 0 ? 1 : yMax], [PAD + innerH, PAD]);
    const points: Point[] = data.map((d, i) => ({ x: sx(i), y: sy(d.value) }));
    const d = buildLinePath(points);
    return (
      <svg ref={ref} viewBox={`0 0 ${width} ${height}`} role="img" className={className} {...props}>
        <path
          d={d}
          fill="none"
          stroke={`var(--chart-${colorIndex})`}
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    );
  },
);

LineChart.displayName = 'LineChart';
```

- [ ] **Step 5: Run the test to verify it passes**

Run:
```bash
pnpm --filter @nikolayvalev/design-system test
```
Expected: PASS — LineChart tests green (geometry tests still green).

- [ ] **Step 6: Commit**

```bash
git add packages/design-system/src/charts/types.ts packages/design-system/src/charts/LineChart.tsx packages/design-system/src/charts/LineChart.test.tsx
git commit -m "feat(charts): add ChartDatum types and LineChart"
```

---

### Task 3: `AreaChart` (TDD)

**Files:**
- Create: `packages/design-system/src/charts/AreaChart.tsx`
- Test: `packages/design-system/src/charts/AreaChart.test.tsx`

**Interfaces:**
- Consumes: `scaleLinear`, `extent`, `buildLinePath`, `buildAreaPath`, `Point` from `./geometry`; `CartesianChartProps` from `./types`.
- Produces: `AreaChart: React.ForwardRefExoticComponent<CartesianChartProps & React.RefAttributes<SVGSVGElement>>`.

- [ ] **Step 1: Write the failing render test**

Create `packages/design-system/src/charts/AreaChart.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { AreaChart } from './AreaChart';

const data = [
  { label: 'a', value: 1 },
  { label: 'b', value: 2 },
  { label: 'c', value: 1.5 },
];

describe('AreaChart', () => {
  it('renders a filled area path and a stroked line path', () => {
    const html = renderToStaticMarkup(<AreaChart data={data} />);
    expect((html.match(/<path/g) ?? []).length).toBe(2);
    expect(html).toContain('fill-opacity="0.2"');
    expect(html).toContain('stroke="var(--chart-1)"');
  });
  it('honors colorIndex for both fill and stroke', () => {
    const html = renderToStaticMarkup(<AreaChart data={data} colorIndex={4} />);
    expect(html).toContain('fill="var(--chart-4)"');
    expect(html).toContain('stroke="var(--chart-4)"');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:
```bash
pnpm --filter @nikolayvalev/design-system test
```
Expected: FAIL — cannot resolve `./AreaChart`.

- [ ] **Step 3: Implement `AreaChart`**

Create `packages/design-system/src/charts/AreaChart.tsx`:
```tsx
import React from 'react';
import { scaleLinear, extent, buildLinePath, buildAreaPath, type Point } from './geometry';
import type { CartesianChartProps } from './types';

const PAD = 8;

/** AreaChart - single-series SVG area + line, colored by a --chart-N token. */
export const AreaChart = React.forwardRef<SVGSVGElement, CartesianChartProps>(
  ({ data, width = 320, height = 180, colorIndex = 1, className = '', ...props }, ref) => {
    const innerW = width - PAD * 2;
    const innerH = height - PAD * 2;
    const [, yMax] = extent(data.map((d) => d.value));
    const xMax = Math.max(1, data.length - 1);
    const sx = scaleLinear([0, xMax], [PAD, PAD + innerW]);
    const sy = scaleLinear([0, yMax === 0 ? 1 : yMax], [PAD + innerH, PAD]);
    const points: Point[] = data.map((d, i) => ({ x: sx(i), y: sy(d.value) }));
    const area = buildAreaPath(points, PAD + innerH);
    const line = buildLinePath(points);
    const color = `var(--chart-${colorIndex})`;
    return (
      <svg ref={ref} viewBox={`0 0 ${width} ${height}`} role="img" className={className} {...props}>
        <path d={area} fill={color} fillOpacity={0.2} stroke="none" />
        <path
          d={line}
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    );
  },
);

AreaChart.displayName = 'AreaChart';
```

- [ ] **Step 4: Run the test to verify it passes**

Run:
```bash
pnpm --filter @nikolayvalev/design-system test
```
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/design-system/src/charts/AreaChart.tsx packages/design-system/src/charts/AreaChart.test.tsx
git commit -m "feat(charts): add AreaChart"
```

---

### Task 4: `BarChart` (TDD)

**Files:**
- Create: `packages/design-system/src/charts/BarChart.tsx`
- Test: `packages/design-system/src/charts/BarChart.test.tsx`

**Interfaces:**
- Consumes: `computeBars` from `./geometry`; `CartesianChartProps` from `./types`.
- Produces: `BarChart: React.ForwardRefExoticComponent<CartesianChartProps & React.RefAttributes<SVGSVGElement>>`.

- [ ] **Step 1: Write the failing render test**

Create `packages/design-system/src/charts/BarChart.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { BarChart } from './BarChart';

describe('BarChart', () => {
  it('renders one rect per datum, colored by a chart token', () => {
    const html = renderToStaticMarkup(
      <BarChart
        data={[
          { label: 'a', value: 1 },
          { label: 'b', value: 2 },
          { label: 'c', value: 3 },
        ]}
      />,
    );
    expect((html.match(/<rect/g) ?? []).length).toBe(3);
    expect(html).toContain('fill="var(--chart-1)"');
  });
  it('renders no rects for empty data', () => {
    const html = renderToStaticMarkup(<BarChart data={[]} />);
    expect(html).not.toContain('<rect');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:
```bash
pnpm --filter @nikolayvalev/design-system test
```
Expected: FAIL — cannot resolve `./BarChart`.

- [ ] **Step 3: Implement `BarChart`**

Create `packages/design-system/src/charts/BarChart.tsx`:
```tsx
import React from 'react';
import { computeBars } from './geometry';
import type { CartesianChartProps } from './types';

const PAD = 8;

/** BarChart - single-series SVG bars, colored by a --chart-N token. */
export const BarChart = React.forwardRef<SVGSVGElement, CartesianChartProps>(
  ({ data, width = 320, height = 180, colorIndex = 1, className = '', ...props }, ref) => {
    const innerW = width - PAD * 2;
    const innerH = height - PAD * 2;
    const bars = computeBars(
      data.map((d) => d.value),
      { width: innerW, height: innerH },
    );
    return (
      <svg ref={ref} viewBox={`0 0 ${width} ${height}`} role="img" className={className} {...props}>
        <g transform={`translate(${PAD},${PAD})`}>
          {bars.map((b, i) => (
            <rect
              key={i}
              x={b.x}
              y={b.y}
              width={b.width}
              height={b.height}
              rx={2}
              fill={`var(--chart-${colorIndex})`}
            />
          ))}
        </g>
      </svg>
    );
  },
);

BarChart.displayName = 'BarChart';
```

- [ ] **Step 4: Run the test to verify it passes**

Run:
```bash
pnpm --filter @nikolayvalev/design-system test
```
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/design-system/src/charts/BarChart.tsx packages/design-system/src/charts/BarChart.test.tsx
git commit -m "feat(charts): add BarChart"
```

---

### Task 5: `Donut` (TDD)

**Files:**
- Create: `packages/design-system/src/charts/Donut.tsx`
- Test: `packages/design-system/src/charts/Donut.test.tsx`

**Interfaces:**
- Consumes: `buildDonutArcs` from `./geometry`; `DonutProps` from `./types`.
- Produces: `Donut: React.ForwardRefExoticComponent<DonutProps & React.RefAttributes<SVGSVGElement>>`.

- [ ] **Step 1: Write the failing render test**

Create `packages/design-system/src/charts/Donut.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { Donut } from './Donut';

describe('Donut', () => {
  it('renders one path per slice with cycling chart tokens', () => {
    const html = renderToStaticMarkup(
      <Donut
        data={[
          { label: 'a', value: 1 },
          { label: 'b', value: 1 },
        ]}
      />,
    );
    expect((html.match(/<path/g) ?? []).length).toBe(2);
    expect(html).toContain('fill="var(--chart-1)"');
    expect(html).toContain('fill="var(--chart-2)"');
  });
  it('renders no slices when all values are zero', () => {
    const html = renderToStaticMarkup(
      <Donut data={[{ label: 'a', value: 0 }, { label: 'b', value: 0 }]} />,
    );
    expect(html).not.toContain('<path');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:
```bash
pnpm --filter @nikolayvalev/design-system test
```
Expected: FAIL — cannot resolve `./Donut`.

- [ ] **Step 3: Implement `Donut`**

Create `packages/design-system/src/charts/Donut.tsx`:
```tsx
import React from 'react';
import { buildDonutArcs } from './geometry';
import type { DonutProps } from './types';

/** Donut - multi-slice ring chart; slice colors cycle --chart-1..5. */
export const Donut = React.forwardRef<SVGSVGElement, DonutProps>(
  ({ data, size = 180, thickness = 28, className = '', ...props }, ref) => {
    const cx = size / 2;
    const cy = size / 2;
    const rOuter = size / 2;
    const rInner = Math.max(0, rOuter - thickness);
    const arcs = buildDonutArcs(
      data.map((d) => d.value),
      { cx, cy, rOuter, rInner },
    );
    return (
      <svg ref={ref} viewBox={`0 0 ${size} ${size}`} role="img" className={className} {...props}>
        {arcs.map((a, i) => (
          <path key={i} d={a.d} fill={`var(--chart-${a.colorIndex})`} />
        ))}
      </svg>
    );
  },
);

Donut.displayName = 'Donut';
```

- [ ] **Step 4: Run the test to verify it passes**

Run:
```bash
pnpm --filter @nikolayvalev/design-system test
```
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/design-system/src/charts/Donut.tsx packages/design-system/src/charts/Donut.test.tsx
git commit -m "feat(charts): add Donut"
```

---

### Task 6: Public exports + build + typecheck/lint green

**Files:**
- Create: `packages/design-system/src/charts/index.ts`
- Modify: `packages/design-system/src/index.ts` (add `export * from './charts';`)

**Interfaces:**
- Consumes: all four chart components + `./types` from Tasks 2–5.
- Produces: `LineChart`, `AreaChart`, `BarChart`, `Donut`, and the chart types, importable from `@nikolayvalev/design-system`.

- [ ] **Step 1: Create the charts barrel export**

Create `packages/design-system/src/charts/index.ts`:
```ts
export { LineChart } from './LineChart';
export { AreaChart } from './AreaChart';
export { BarChart } from './BarChart';
export { Donut } from './Donut';
export type { ChartDatum, ChartColorIndex, CartesianChartProps, DonutProps } from './types';
```

- [ ] **Step 2: Wire charts into the package entry**

Edit `packages/design-system/src/index.ts` — add after `export * from './components';`:
```ts
export * from './charts';
```

- [ ] **Step 3: Typecheck the package**

Run:
```bash
pnpm --filter @nikolayvalev/design-system typecheck
```
Expected: PASS — no type errors (test files and chart sources included).

- [ ] **Step 4: Lint the package**

Run:
```bash
pnpm --filter @nikolayvalev/design-system lint
```
Expected: PASS — no lint errors under `src`.

- [ ] **Step 5: Build the package and verify charts are in the type output**

Run:
```bash
pnpm --filter @nikolayvalev/design-system build
node -e "const fs=require('fs');const d=fs.readFileSync('./packages/design-system/dist/index.d.ts','utf8');for (const n of ['LineChart','AreaChart','BarChart','Donut']) { if(!d.includes(n)){console.error('MISSING export type:',n);process.exit(1)} } console.log('OK: chart exports present in dist')"
```
Expected: build succeeds; prints `OK: chart exports present in dist`.

- [ ] **Step 6: Run the full package test suite once more**

Run:
```bash
pnpm --filter @nikolayvalev/design-system test
```
Expected: PASS — geometry + all four component tests green.

- [ ] **Step 7: Commit**

```bash
git add packages/design-system/src/charts/index.ts packages/design-system/src/index.ts
git commit -m "feat(charts): export chart primitives from the package entry"
```

---

### Task 7: Storybook stories + visual baselines

**Files:**
- Create: `apps/storybook/src/LineChart.stories.tsx`
- Create: `apps/storybook/src/BarChart.stories.tsx`
- Create: `apps/storybook/src/AreaChart.stories.tsx`
- Create: `apps/storybook/src/Donut.stories.tsx`

**Interfaces:**
- Consumes: the chart components from `@nikolayvalev/design-system` (Task 6).
- Produces: four `Charts/*` stories with **deterministic** fixture data, auto-covered by `apps/storybook/tests/visual/stories.visual.spec.ts`.

- [ ] **Step 1: Write the LineChart story**

Create `apps/storybook/src/LineChart.stories.tsx`:
```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { LineChart } from '@nikolayvalev/design-system';

const data = [
  { label: 'Jan', value: 12 },
  { label: 'Feb', value: 28 },
  { label: 'Mar', value: 19 },
  { label: 'Apr', value: 34 },
  { label: 'May', value: 26 },
  { label: 'Jun', value: 41 },
];

const meta = {
  title: 'Charts/LineChart',
  component: LineChart,
  tags: ['autodocs'],
  parameters: {
    storyCaption: 'Dependency-free SVG line chart. Series color reads --chart-1..5 and tracks the active vision.',
  },
  args: { data, colorIndex: 1 },
  argTypes: { colorIndex: { control: 'inline-radio', options: [1, 2, 3, 4, 5] } },
} satisfies Meta<typeof LineChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
```

- [ ] **Step 2: Write the BarChart story**

Create `apps/storybook/src/BarChart.stories.tsx`:
```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { BarChart } from '@nikolayvalev/design-system';

const data = [
  { label: 'A', value: 8 },
  { label: 'B', value: 16 },
  { label: 'C', value: 11 },
  { label: 'D', value: 22 },
  { label: 'E', value: 14 },
];

const meta = {
  title: 'Charts/BarChart',
  component: BarChart,
  tags: ['autodocs'],
  parameters: {
    storyCaption: 'Dependency-free SVG bar chart. Bars read --chart-1..5 and track the active vision.',
  },
  args: { data, colorIndex: 2 },
  argTypes: { colorIndex: { control: 'inline-radio', options: [1, 2, 3, 4, 5] } },
} satisfies Meta<typeof BarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
```

- [ ] **Step 3: Write the AreaChart story**

Create `apps/storybook/src/AreaChart.stories.tsx`:
```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { AreaChart } from '@nikolayvalev/design-system';

const data = [
  { label: 'Mon', value: 5 },
  { label: 'Tue', value: 9 },
  { label: 'Wed', value: 7 },
  { label: 'Thu', value: 14 },
  { label: 'Fri', value: 11 },
  { label: 'Sat', value: 18 },
  { label: 'Sun', value: 13 },
];

const meta = {
  title: 'Charts/AreaChart',
  component: AreaChart,
  tags: ['autodocs'],
  parameters: {
    storyCaption: 'Dependency-free SVG area chart. Fill + line read --chart-1..5 and track the active vision.',
  },
  args: { data, colorIndex: 3 },
  argTypes: { colorIndex: { control: 'inline-radio', options: [1, 2, 3, 4, 5] } },
} satisfies Meta<typeof AreaChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
```

- [ ] **Step 4: Write the Donut story**

Create `apps/storybook/src/Donut.stories.tsx`:
```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Donut } from '@nikolayvalev/design-system';

const data = [
  { label: 'Editorial', value: 4 },
  { label: 'Minimal', value: 3 },
  { label: 'Technical', value: 2 },
  { label: 'Atmospheric', value: 2 },
  { label: 'Expressive', value: 1 },
];

const meta = {
  title: 'Charts/Donut',
  component: Donut,
  tags: ['autodocs'],
  parameters: {
    storyCaption: 'Dependency-free SVG donut. Slices cycle --chart-1..5 and track the active vision.',
  },
  args: { data, size: 180, thickness: 28 },
} satisfies Meta<typeof Donut>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
```

- [ ] **Step 5: Typecheck and lint the Storybook app**

Run:
```bash
pnpm --filter @apps/storybook typecheck && pnpm --filter @apps/storybook lint
```
Expected: PASS.

- [ ] **Step 6: Build Storybook and smoke-test the story index**

Run:
```bash
pnpm --filter @apps/storybook build
node -e "const fs=require('fs');const i=JSON.parse(fs.readFileSync('./apps/storybook/dist/storybook/index.json','utf8'));const ids=Object.keys(i.entries).filter(k=>k.startsWith('charts-'));if(ids.length<4){console.error('FAIL: expected >=4 chart stories, got',ids);process.exit(1)}console.log('OK chart stories:',ids)"
```
Expected: build succeeds; prints the four `charts-*` story ids.

- [ ] **Step 7: Generate Linux visual baselines via the Playwright-container workflow**

Visual baselines must be Linux PNGs produced by the repo's container workflow, not a local OS run. Locate the visual-baseline workflow in `.github/workflows/` (the one that runs `playwright test --update-snapshots` / `pnpm test:visual:update` inside the Playwright container) and run it (e.g. via `gh workflow run <file>` on this branch, or the documented local-container command). It will add baseline PNGs under `apps/storybook/tests/visual/stories.visual.spec.ts-snapshots/` for the four new `charts-*-playground` stories.

Verify the new baselines exist:
```bash
ls apps/storybook/tests/visual/stories.visual.spec.ts-snapshots | grep -i chart
```
Expected: four `charts-*-playground-*.png` baseline files.

> If you cannot trigger the container workflow in this environment, stop and hand back to the user: committing locally-generated (non-Linux) snapshots would fail CI. Note this in the task status.

- [ ] **Step 8: Commit**

```bash
git add apps/storybook/src/LineChart.stories.tsx apps/storybook/src/BarChart.stories.tsx apps/storybook/src/AreaChart.stories.tsx apps/storybook/src/Donut.stories.tsx apps/storybook/tests/visual/stories.visual.spec.ts-snapshots
git commit -m "feat(charts): add Storybook stories and visual baselines for chart primitives"
```

---

## Self-Review

**1. Spec coverage (Phase 1 scope = "Charts in the design system"):**
- `LineChart`, `BarChart`, `AreaChart`, `Donut` → Tasks 2–5. ✓
- Dependency-free / zero new runtime deps → enforced in Task 1 Step 8 and the build check; Global Constraints. ✓
- Token-driven colors (`var(--chart-1..5)`) → asserted in every component test. ✓
- Storybook stories + Playwright visual snapshots, deterministic data → Task 7. ✓
- Reusable export surface (`src/charts` → `src/index.ts`) → Task 6. ✓
- (Engine consumption of these as the default allow-list is **Phase 2**, out of this plan's scope.)

**2. Placeholder scan:** No TBD/TODO; every code step contains complete code; every command has expected output. The only deferred action is the container-run baseline generation in Task 7 Step 7, which is an environment/CI step with an explicit fallback instruction, not a code placeholder. ✓

**3. Type consistency:** `ChartDatum`/`CartesianChartProps`/`DonutProps`/`ChartColorIndex` defined in Task 2 and consumed unchanged in Tasks 3–6. Geometry signatures (`scaleLinear`, `extent`, `buildLinePath`, `buildAreaPath`, `computeBars`, `buildDonutArcs`, `Point`, `Bar`, `DonutArc`) defined in Task 1 and consumed with matching names/arity in Tasks 2–5. Barrel + entry export names match the component `export`s. ✓

---

## Follow-on plans (not in this document)

- **Phase 2 — Engine package** (`@nikolayvalev/command-panel`): registries, system-prompt builder, `propose_widget`, sandbox (validate → transpile → eval → render), `useMetric`, `CommandPanel` UI, pinned store, Next.js handler factory. Gets its own plan; the chart components from this phase become part of the default `ComponentRegistry`.
- **Phase 3 — Reference host** (`apps/command-panel`): wires the engine to monorepo metrics; e2e smoke. Its own plan.
