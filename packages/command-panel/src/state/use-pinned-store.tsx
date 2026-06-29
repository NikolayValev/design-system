import * as React from 'react';
import { createPinnedStore, type PinnedStore, type PinnedWidget } from './pinned-store';

const PinnedStoreContext = React.createContext<PinnedStore | null>(null);

const EMPTY: PinnedWidget[] = [];

export function PinnedStoreProvider({
  store,
  children,
}: {
  store?: PinnedStore;
  children: React.ReactNode;
}): JSX.Element {
  const ref = React.useRef<PinnedStore | null>(null);
  if (!store && ref.current === null) ref.current = createPinnedStore();
  const value = store ?? ref.current!;
  return <PinnedStoreContext.Provider value={value}>{children}</PinnedStoreContext.Provider>;
}

export interface PinnedStoreApi {
  widgets: PinnedWidget[];
  pin: (widget: PinnedWidget) => void;
  unpin: (id: string) => void;
  reorder: (from: number, to: number) => void;
  clear: () => void;
}

export function usePinnedStore(): PinnedStoreApi {
  const store = React.useContext(PinnedStoreContext);
  if (!store) throw new Error('usePinnedStore must be used within a <PinnedStoreProvider>.');
  const widgets = React.useSyncExternalStore(store.subscribe, store.getState, () => EMPTY);
  return { widgets, pin: store.pin, unpin: store.unpin, reorder: store.reorder, clear: store.clear };
}
