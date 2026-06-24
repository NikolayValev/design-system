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
  it('clamps a negative value to zero height at the baseline', () => {
    const bars = computeBars([-5, 10], { width: 200, height: 100, gap: 0 });
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
  it('starts the first slice at the top (12 o’clock)', () => {
    const [arc] = buildDonutArcs([1], { cx: 50, cy: 50, rOuter: 50, rInner: 30 });
    expect(arc.d.startsWith('M50,0 ')).toBe(true);
  });
  it('renders a non-degenerate near-full ring for a single 100% slice', () => {
    const [arc] = buildDonutArcs([5], { cx: 50, cy: 50, rOuter: 50, rInner: 30 });
    expect(arc.d.startsWith('M50,0 ')).toBe(true);
    // A 360° sweep would return the outer arc to its start point ("1 1 50,0"),
    // which SVG draws as nothing. The clamp keeps the endpoint distinct.
    expect(arc.d).not.toContain('1 1 50,0');
  });
});
