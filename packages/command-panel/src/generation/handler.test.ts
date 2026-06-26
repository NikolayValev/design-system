import { describe, it, expect } from 'vitest';
import { simulateReadableStream } from 'ai';
import { MockLanguageModelV4 } from 'ai/test';
import { runGeneration, createCommandPanelHandler } from './handler';
import { createComponentRegistry } from '../registry/component-registry';
import { createDataRegistry } from '../registry/data-registry';

const componentRegistry = createComponentRegistry([
  { name: 'LineChart', component: () => null, description: 'SVG line chart.' },
]);
const dataRegistry = createDataRegistry([
  { id: 'revenue.monthly', description: 'Monthly revenue.', load: async () => [1, 2, 3] },
]);

/** A mock model that emits a single propose_widget tool call. */
function mockProposing(input: unknown) {
  return new MockLanguageModelV4({
    doStream: {
      stream: simulateReadableStream({
        chunks: [
          // LanguageModelV4ToolCall requires input: string (JSON-encoded args).
          { type: 'tool-call', toolCallId: 'c1', toolName: 'propose_widget', input: JSON.stringify(input) },
          {
            type: 'finish',
            finishReason: { unified: 'tool-calls' as const, raw: undefined },
            usage: {
              inputTokens: { total: 1, noCache: undefined, cacheRead: undefined, cacheWrite: undefined },
              outputTokens: { total: 1, text: undefined, reasoning: undefined },
            },
          },
        ],
      }),
    },
  });
}

const widgetInput = {
  title: 'Revenue',
  description: 'Monthly revenue.',
  jsx: "const m = useMetric('revenue.monthly'); return <LineChart data={m.data ?? []} />;",
  dataSources: ['revenue.monthly'],
};

describe('runGeneration', () => {
  it('surfaces the model\'s propose_widget tool call', async () => {
    const result = runGeneration({
      componentRegistry,
      dataRegistry,
      model: mockProposing(widgetInput),
      messages: [{ role: 'user', content: 'show me revenue' }],
    });
    const calls = await result.toolCalls;
    expect(calls).toHaveLength(1);
    expect(calls[0].toolName).toBe('propose_widget');
    expect(calls[0].input).toMatchObject({ title: 'Revenue', dataSources: ['revenue.monthly'] });
  });
});

describe('createCommandPanelHandler', () => {
  it('returns a streaming Response for a POST of UI messages', async () => {
    const handler = createCommandPanelHandler({
      componentRegistry,
      dataRegistry,
      model: mockProposing(widgetInput),
    });
    const req = new Request('http://localhost/api/command-panel', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        messages: [{ id: 'm1', role: 'user', parts: [{ type: 'text', text: 'show me revenue' }] }],
      }),
    });
    const res = await handler(req);
    expect(res).toBeInstanceOf(Response);
    expect(res.ok).toBe(true);
    const body = await res.text();
    // The streamed body must not carry a top-level error part. A non-awaited
    // convertToModelMessages (passing a Promise to streamText) produces
    // {"type":"error"} here even though res.ok is true.
    expect(body).toContain('"type":"start"');
    expect(body).not.toContain('"type":"error"');
  });
});
