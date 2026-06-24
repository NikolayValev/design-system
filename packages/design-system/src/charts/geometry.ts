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
    const h = max === 0 ? 0 : (Math.max(0, v) / max) * height;
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
  const oStart = polarToCartesian(cx, cy, rOuter, start);
  const oEnd = polarToCartesian(cx, cy, rOuter, end);
  const iStart = polarToCartesian(cx, cy, rInner, end);
  const iEnd = polarToCartesian(cx, cy, rInner, start);
  return [
    `M${round(oStart.x)},${round(oStart.y)}`,
    `A${rOuter},${rOuter} 0 ${largeArc} 1 ${round(oEnd.x)},${round(oEnd.y)}`,
    `L${round(iStart.x)},${round(iStart.y)}`,
    `A${rInner},${rInner} 0 ${largeArc} 0 ${round(iEnd.x)},${round(iEnd.y)}`,
    'Z',
  ].join(' ');
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}
