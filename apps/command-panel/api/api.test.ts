import { describe, it, expect } from 'vitest';
import { MockLanguageModelV4, simulateReadableStream } from 'ai/test';
import { createCommandPanelHandler } from '@nikolayvalev/command-panel/server';
import { defaultComponentRegistry } from '@nikolayvalev/command-panel';
import { POST as dataPOST } from './data';
import { dataRegistry } from '../src/data/registry';

const post = (url: string, body: unknown) =>
  new Request(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });

describe('api/data', () => {
  it('resolves a registered source', async () => {
    const res = await dataPOST(post('http://localhost/api/data', { id: 'components.count' }));
    expect(res.status).toBe(200);
    expect(((await res.json()) as { count: number }).count).toBeGreaterThan(0);
  });

  it('404s an unknown source id', async () => {
    const res = await dataPOST(post('http://localhost/api/data', { id: 'nope.nope' }));
    expect(res.status).toBe(404);
  });
});

describe('api/chat wiring (host registries + mock model)', () => {
  it('streams a UI-message response with no top-level error', async () => {
    const model = new MockLanguageModelV4({
      doStream: async () => ({
        stream: simulateReadableStream({
          chunks: [
            { type: 'stream-start', warnings: [] },
            { type: 'text-start', id: 't1' },
            { type: 'text-delta', id: 't1', delta: 'Here is a chart.' },
            { type: 'text-end', id: 't1' },
            {
            type: 'finish',
            finishReason: { unified: 'stop', raw: undefined },
            usage: {
              inputTokens: { total: 1, noCache: undefined, cacheRead: undefined, cacheWrite: undefined },
              outputTokens: { total: 1, text: undefined, reasoning: undefined },
            },
          },
          ],
        }),
      }),
    });
    const handler = createCommandPanelHandler({
      componentRegistry: defaultComponentRegistry,
      dataRegistry,
      model,
    });
    const res = await handler(
      post('http://localhost/api/chat', {
        messages: [{ role: 'user', parts: [{ type: 'text', text: 'hi' }] }],
      }),
    );
    expect(res.ok).toBe(true);
    const text = await res.text();
    expect(text).not.toContain('"type":"error"');
  });
});
