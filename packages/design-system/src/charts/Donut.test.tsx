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
