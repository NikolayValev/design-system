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
