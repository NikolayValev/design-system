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
