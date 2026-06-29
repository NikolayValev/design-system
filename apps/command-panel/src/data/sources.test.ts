import { describe, it, expect } from 'vitest';
import { dataSources } from './sources';

const byId = (id: string) => {
  const s = dataSources.find((x) => x.id === id);
  if (!s) throw new Error(`missing source ${id}`);
  return s;
};

const isSeries = (v: unknown): v is { label: string; value: number }[] =>
  Array.isArray(v) && v.every((d) => typeof (d as any).label === 'string' && typeof (d as any).value === 'number');

describe('reference data sources', () => {
  it('exposes the expected ids, each with a description', () => {
    const ids = dataSources.map((s) => s.id).sort();
    expect(ids).toEqual(
      [
        'bundle.sizes',
        'catalog.counts',
        'components.count',
        'pages.count',
        'sections.count',
        'stories.count',
        'visions.byFamily',
        'visions.list',
      ].sort(),
    );
    dataSources.forEach((s) => expect(s.description.length).toBeGreaterThan(0));
  });

  it('catalog.counts returns a chart-ready series', async () => {
    const out = await byId('catalog.counts').load();
    expect(isSeries(out)).toBe(true);
    expect((out as { label: string }[]).map((d) => d.label)).toEqual(['Components', 'Sections', 'Pages']);
  });

  it('components.count returns a positive count object', async () => {
    expect(await byId('components.count').load()).toMatchObject({ count: expect.any(Number) });
    expect(((await byId('components.count').load()) as { count: number }).count).toBeGreaterThan(0);
  });

  it('visions.list returns all 12 visions with id/name/family', async () => {
    const out = (await byId('visions.list').load()) as { id: string; name: string; family: string }[];
    expect(out.length).toBe(12);
    out.forEach((v) => {
      expect(typeof v.id).toBe('string');
      expect(typeof v.name).toBe('string');
      expect(typeof v.family).toBe('string');
    });
  });

  it('visions.byFamily returns a chart-ready series summing to 12', async () => {
    const out = (await byId('visions.byFamily').load()) as { label: string; value: number }[];
    expect(isSeries(out)).toBe(true);
    expect(out.reduce((n, d) => n + d.value, 0)).toBe(12);
  });

  it('bundle.sizes returns a non-empty chart-ready series', async () => {
    const out = await byId('bundle.sizes').load();
    expect(isSeries(out)).toBe(true);
    expect((out as unknown[]).length).toBeGreaterThan(0);
  });
});
