// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DefaultChatTransport } from 'ai';
import { ChatPane } from './ChatPane';
import { PinnedStoreProvider } from '../state/use-pinned-store';
import { DataResolverProvider } from '../sandbox/use-metric';
import { createPinnedStore } from '../state/pinned-store';
import { defaultComponentRegistry } from '../registry/default-registry';

// Exact UI-message-stream bytes that `toUIMessageStreamResponse` emits for one
// propose_widget tool call (verified against ai@7.0.2 during planning).
function proposalSse(input: Record<string, unknown>): string {
  const tool = {
    type: 'tool-input-available',
    toolCallId: 'call_1',
    toolName: 'propose_widget',
    input,
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

function cannedFetch(): typeof fetch {
  return (async () =>
    new Response(
      proposalSse({
        title: 'Total',
        description: 'A single stat.',
        jsx: 'return <StatChip label="Total" value={7} />;',
        dataSources: [],
      }),
      {
        status: 200,
        headers: {
          'content-type': 'text/event-stream',
          'x-vercel-ai-ui-message-stream': 'v1',
        },
      },
    )) as unknown as typeof fetch;
}

describe('ChatPane', () => {
  it('renders a proposed widget inline and pins it', async () => {
    const store = createPinnedStore({ storage: null });
    const transport = new DefaultChatTransport({ api: '/api/cp', fetch: cannedFetch() });

    render(
      <DataResolverProvider resolver={async () => null}>
        <PinnedStoreProvider store={store}>
          <ChatPane registry={defaultComponentRegistry} transport={transport} />
        </PinnedStoreProvider>
      </DataResolverProvider>,
    );

    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'show total' } });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    // The streamed tool call renders as a live preview card with the sandboxed widget.
    expect(await screen.findByText('A single stat.')).toBeTruthy();
    expect(await screen.findByText('7')).toBeTruthy();

    // Pinning the proposal updates the shared store.
    fireEvent.click(screen.getByRole('button', { name: /pin to dashboard/i }));
    expect(store.getState().map((w) => w.title)).toEqual(['Total']);
  });
});
