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
