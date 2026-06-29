// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PinnedStoreProvider, usePinnedStore } from './use-pinned-store';
import { createPinnedStore, type PinnedWidget } from './pinned-store';

const w = (id: string): PinnedWidget => ({ id, title: `T${id}`, description: 'd', jsx: 'return null;', dataSources: [] });

function Probe(): JSX.Element {
  const { widgets, pin, unpin } = usePinnedStore();
  return (
    <div>
      <ul>{widgets.map((x) => <li key={x.id}>{x.title}</li>)}</ul>
      <button onClick={() => pin(w('a'))}>pin-a</button>
      <button onClick={() => unpin('a')}>unpin-a</button>
    </div>
  );
}

describe('usePinnedStore', () => {
  it('reflects pin/unpin and re-renders', () => {
    const store = createPinnedStore({ storage: null });
    render(
      <PinnedStoreProvider store={store}>
        <Probe />
      </PinnedStoreProvider>,
    );
    expect(screen.queryByText('Ta')).toBeNull();
    fireEvent.click(screen.getByText('pin-a'));
    expect(screen.getByText('Ta')).toBeTruthy();
    fireEvent.click(screen.getByText('unpin-a'));
    expect(screen.queryByText('Ta')).toBeNull();
  });

  it('throws outside a provider', () => {
    const spy = () => render(<Probe />);
    expect(spy).toThrow(/PinnedStoreProvider/);
  });
});
