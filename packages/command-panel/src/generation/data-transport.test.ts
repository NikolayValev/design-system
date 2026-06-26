import { describe, it, expect } from 'vitest';
import { createHttpDataResolver } from './http-resolver';
import { createDataRouteHandler } from './data-route';
import { createDataRegistry } from '../registry/data-registry';

describe('createHttpDataResolver', () => {
  it('POSTs the id/params and returns the parsed body', async () => {
    let seen: { url: string; body: string } | undefined;
    const fakeFetch = (async (url: string, init?: RequestInit) => {
      seen = { url, body: String(init?.body) };
      return new Response(JSON.stringify({ value: 42 }), { status: 200 });
    }) as unknown as typeof fetch;

    const resolve = createHttpDataResolver('/api/data', fakeFetch);
    const out = await resolve('revenue.monthly', { range: '30d' });
    expect(out).toEqual({ value: 42 });
    expect(seen?.url).toBe('/api/data');
    expect(JSON.parse(seen!.body)).toEqual({ id: 'revenue.monthly', params: { range: '30d' } });
  });

  it('throws when the response is not ok', async () => {
    const fakeFetch = (async () => new Response('boom', { status: 500 })) as unknown as typeof fetch;
    const resolve = createHttpDataResolver('/api/data', fakeFetch);
    await expect(resolve('x')).rejects.toThrow(/500/);
  });
});

describe('createDataRouteHandler', () => {
  const registry = createDataRegistry([
    { id: 'revenue.monthly', description: 'Monthly revenue.', load: async (p) => ({ p: p ?? null }) },
  ]);

  const post = (body: unknown) =>
    new Request('http://localhost/api/data', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });

  it('resolves a registered source', async () => {
    const res = await createDataRouteHandler(registry)(post({ id: 'revenue.monthly', params: { range: '7d' } }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ p: { range: '7d' } });
  });

  it('404s an unknown id', async () => {
    const res = await createDataRouteHandler(registry)(post({ id: 'nope' }));
    expect(res.status).toBe(404);
    expect((await res.json()).error).toMatch(/unknown data source: nope/i);
  });

  it('400s a missing id', async () => {
    const res = await createDataRouteHandler(registry)(post({}));
    expect(res.status).toBe(400);
  });
});
