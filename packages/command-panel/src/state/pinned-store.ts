import { createStateFactory } from '@repo/state';

export interface PinnedWidget {
  id: string;
  title: string;
  description: string;
  jsx: string;
  dataSources: string[];
}

interface PinnedState {
  widgets: PinnedWidget[];
}

export type StorageLike = Pick<Storage, 'getItem' | 'setItem'>;

export interface PinnedStoreOptions {
  storageKey?: string;
  /** Injectable for tests / SSR. `null` disables persistence. Omit to use window.localStorage. */
  storage?: StorageLike | null;
}

export interface PinnedStore {
  getState(): PinnedWidget[];
  subscribe(listener: () => void): () => void;
  pin(widget: PinnedWidget): void;
  unpin(id: string): void;
  reorder(from: number, to: number): void;
  clear(): void;
}

export const DEFAULT_STORAGE_KEY = 'command-panel:pinned';

function isPinnedWidget(v: unknown): v is PinnedWidget {
  if (typeof v !== 'object' || v === null) return false;
  const w = v as Record<string, unknown>;
  return (
    typeof w.id === 'string' &&
    typeof w.title === 'string' &&
    typeof w.description === 'string' &&
    typeof w.jsx === 'string' &&
    Array.isArray(w.dataSources) &&
    w.dataSources.every((s) => typeof s === 'string')
  );
}

function loadWidgets(storage: StorageLike | null, key: string): PinnedWidget[] {
  if (!storage) return [];
  let raw: string | null;
  try {
    raw = storage.getItem(key);
  } catch {
    return [];
  }
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isPinnedWidget) : [];
  } catch {
    return [];
  }
}

function resolveStorage(options: PinnedStoreOptions): StorageLike | null {
  if (options.storage !== undefined) return options.storage; // explicit (incl. null) wins
  try {
    return typeof globalThis.localStorage !== 'undefined' ? globalThis.localStorage : null;
  } catch {
    return null; // localStorage access can throw under privacy settings
  }
}

const reducers = {
  pin: (state: PinnedState, payload: unknown): PinnedState => {
    const widget = payload as PinnedWidget;
    if (state.widgets.some((w) => w.id === widget.id)) return state;
    return { widgets: [...state.widgets, widget] };
  },
  unpin: (state: PinnedState, payload: unknown): PinnedState => {
    const id = payload as string;
    return { widgets: state.widgets.filter((w) => w.id !== id) };
  },
  reorder: (state: PinnedState, payload: unknown): PinnedState => {
    const { from, to } = payload as { from: number; to: number };
    const n = state.widgets.length;
    if (from < 0 || from >= n || to < 0 || to >= n || from === to) return state;
    const next = state.widgets.slice();
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    return { widgets: next };
  },
  clear: (_state: PinnedState, _payload: unknown): PinnedState => ({ widgets: [] }),
};

export function createPinnedStore(options: PinnedStoreOptions = {}): PinnedStore {
  const key = options.storageKey ?? DEFAULT_STORAGE_KEY;
  const storage = resolveStorage(options);

  const factory = createStateFactory<PinnedState, typeof reducers>({
    name: 'command-panel-pinned',
    initialState: { widgets: [] },
    reducers,
  });
  const store = factory.createStore({ widgets: loadWidgets(storage, key) });

  if (storage) {
    store.subscribe((state) => {
      try {
        storage.setItem(key, JSON.stringify(state.widgets));
      } catch {
        /* ignore quota / serialization errors */
      }
    });
  }

  return {
    getState: () => store.getState().widgets,
    subscribe: (listener) => store.subscribe(() => listener()),
    pin: (widget) => {
      store.dispatch('pin', widget);
    },
    unpin: (id) => {
      store.dispatch('unpin', id);
    },
    reorder: (from, to) => {
      store.dispatch('reorder', { from, to });
    },
    clear: () => {
      store.dispatch('clear', undefined);
    },
  };
}
