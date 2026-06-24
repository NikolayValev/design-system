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
