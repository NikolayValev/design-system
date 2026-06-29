// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CommandPanel } from './CommandPanel';
import { createPinnedStore, type PinnedWidget } from '../state/pinned-store';
import { defaultComponentRegistry } from '../registry/default-registry';

const w = (id: string): PinnedWidget => ({
  id,
  title: `Tile ${id}`,
  description: 'd',
  jsx: `return <StatChip label="${id}" value={1} />;`,
  dataSources: [],
});

describe('CommandPanel', () => {
  it('renders both panes: chat input and the dashboard with a pre-pinned widget', () => {
    const store = createPinnedStore({ storage: null });
    store.pin(w('a'));
    render(
      <CommandPanel
        registry={defaultComponentRegistry}
        dataResolver={async () => null}
        store={store}
      />,
    );
    // Chat pane.
    expect(screen.getByLabelText(/message/i)).toBeTruthy();
    expect(screen.getByRole('button', { name: /send/i })).toBeTruthy();
    // Dashboard pane shows the pinned tile.
    expect(screen.getByText('Tile a')).toBeTruthy();
  });
});
