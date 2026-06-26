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
    doStream: async () => ({
      stream: simulateReadableStream({
        chunks: [
          { type: 'tool-call', toolCallId: 'c1', toolName: 'propose_widget', input },
          {
            type: 'finish',
            finishReason: { unified: 'tool-calls', raw: undefined },
            usage: { inputTokens: { total: 1 }, outputTokens: { total: 1 } },
          },
        ],
      }),
    }),
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
  });
});
