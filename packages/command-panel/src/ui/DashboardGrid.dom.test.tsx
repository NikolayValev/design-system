// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { DashboardGrid } from './DashboardGrid';
import { PinnedStoreProvider } from '../state/use-pinned-store';
import { DataResolverProvider } from '../sandbox/use-metric';
import { createPinnedStore, type PinnedWidget } from '../state/pinned-store';
import { defaultComponentRegistry } from '../registry/default-registry';

const w = (id: string): PinnedWidget => ({
  id,
  title: `Tile ${id}`,
  description: 'd',
  jsx: `return <StatChip label="${id}" value={1} />;`,
  dataSources: [],
});

function renderGrid(seed: PinnedWidget[]) {
  const store = createPinnedStore({ storage: null });
  seed.forEach((x) => store.pin(x));
  render(
    <DataResolverProvider resolver={async () => null}>
      <PinnedStoreProvider store={store}>
        <DashboardGrid registry={defaultComponentRegistry} />
      </PinnedStoreProvider>
    </DataResolverProvider>,
  );
  return store;
}

describe('DashboardGrid', () => {
  it('shows an empty state when nothing is pinned', () => {
    renderGrid([]);
    expect(screen.getByText(/no pinned widgets/i)).toBeTruthy();
  });

  it('renders pinned tiles and removes one', () => {
    renderGrid([w('a'), w('b')]);
    expect(screen.getByText('Tile a')).toBeTruthy();
    expect(screen.getByText('Tile b')).toBeTruthy();
    const tileA = screen.getByText('Tile a').closest('[data-widget-id]') as HTMLElement;
    fireEvent.click(within(tileA).getByRole('button', { name: /remove/i }));
    expect(screen.queryByText('Tile a')).toBeNull();
    expect(screen.getByText('Tile b')).toBeTruthy();
  });

  it('reorders with Move down', () => {
    const store = renderGrid([w('a'), w('b')]);
    const tileA = screen.getByText('Tile a').closest('[data-widget-id]') as HTMLElement;
    fireEvent.click(within(tileA).getByRole('button', { name: /move down/i }));
    expect(store.getState().map((x) => x.id)).toEqual(['b', 'a']);
  });
});
