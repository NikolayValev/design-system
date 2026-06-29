// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { DefaultChatTransport } from 'ai';
import {
  CommandPanel,
  createPinnedStore,
  createRegistryResolver,
  defaultComponentRegistry,
} from '@nikolayvalev/command-panel';
import { dataRegistry } from '../src/data/registry';

// A proposal whose widget reads a REAL host data source via useMetric.
const jsx =
  "const m = useMetric('catalog.counts'); " +
  "const c = (m.data ?? []).find((d) => d.label === 'Components'); " +
  'return <StatChip label="Components" value={c ? c.value : 0} />;';

function proposalSse(): string {
  const tool = {
    type: 'tool-input-available',
    toolCallId: 'call_1',
    toolName: 'propose_widget',
    input: { title: 'Components', description: 'How many components exist.', jsx, dataSources: ['catalog.counts'] },
  };
  return (
    `data: {"type":"start"}\n\n` +
    `data: {"type":"start-step"}\n\n` +
    `data: ${JSON.stringify(tool)}\n\n` +
    `data: {"type":"finish-step"}\n\n` +
    `data: {"type":"finish"}\n\n` +
    `data: [DONE]\n\n`
  );
}

const cannedFetch = (async () =>
  new Response(proposalSse(), {
    status: 200,
    headers: { 'content-type': 'text/event-stream', 'x-vercel-ai-ui-message-stream': 'v1' },
  })) as unknown as typeof fetch;

describe('reference host e2e: propose -> pin -> persists on reload', () => {
  it('renders a real-data widget, pins it, and persists across reload', async () => {
    const STORAGE_KEY = 'cp-e2e:pinned';
    window.localStorage.clear();
    const resolver = createRegistryResolver(dataRegistry);
    const transport = new DefaultChatTransport({ api: '/api/chat', fetch: cannedFetch });

    // First mount: chat -> proposal -> live widget reading the real registry.
    const store1 = createPinnedStore({ storageKey: STORAGE_KEY });
    const view = render(
      <CommandPanel
        registry={defaultComponentRegistry}
        dataResolver={resolver}
        store={store1}
        transport={transport}
      />,
    );

    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'how many components?' } });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    // The widget rendered the real components count via useMetric (a positive number).
    const label = await screen.findByText('Components', { selector: 'h3' });
    expect(label).toBeTruthy();
    await screen.findByText((t) => /^\d+$/.test(t) && Number(t) > 0);

    // Pin it.
    fireEvent.click(screen.getByRole('button', { name: /pin to dashboard/i }));
    expect(store1.getState().map((w) => w.title)).toEqual(['Components']);

    // Simulate a reload: unmount, then mount a fresh store on the same storage key.
    view.unmount();
    cleanup();
    const store2 = createPinnedStore({ storageKey: STORAGE_KEY });
    expect(store2.getState().map((w) => w.title)).toEqual(['Components']);

    render(
      <CommandPanel registry={defaultComponentRegistry} dataResolver={resolver} store={store2} transport={transport} />,
    );
    // The pinned widget is present in the dashboard after "reload".
    expect(await screen.findAllByText('Components')).not.toHaveLength(0);
  });
});
