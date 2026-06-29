import { describe, it, expect } from 'vitest';
import { createPinnedStore, type PinnedWidget, type StorageLike } from './pinned-store';

const widget = (id: string): PinnedWidget => ({
  id,
  title: `Widget ${id}`,
  description: 'desc',
  jsx: 'return null;',
  dataSources: [],
});

function fakeStorage(seed?: Record<string, string>): StorageLike & { map: Map<string, string> } {
  const map = new Map<string, string>(Object.entries(seed ?? {}));
  return {
    map,
    getItem: (k) => (map.has(k) ? map.get(k)! : null),
    setItem: (k, v) => {
      map.set(k, v);
    },
  };
}

describe('createPinnedStore', () => {
  it('pins, dedups by id, unpins, and clears', () => {
    const store = createPinnedStore({ storage: null });
    store.pin(widget('a'));
    store.pin(widget('a')); // dedup
    store.pin(widget('b'));
    expect(store.getState().map((w) => w.id)).toEqual(['a', 'b']);
    store.unpin('a');
    expect(store.getState().map((w) => w.id)).toEqual(['b']);
    store.clear();
    expect(store.getState()).toEqual([]);
  });

  it('reorders by index and ignores out-of-range / no-op moves', () => {
    const store = createPinnedStore({ storage: null });
    store.pin(widget('a'));
    store.pin(widget('b'));
    store.pin(widget('c'));
    store.reorder(0, 2);
    expect(store.getState().map((w) => w.id)).toEqual(['b', 'c', 'a']);
    const before = store.getState();
    store.reorder(0, 0); // no-op
    store.reorder(5, 1); // out of range
    expect(store.getState()).toBe(before); // unchanged reference
  });

  it('persists to storage on change', () => {
    const storage = fakeStorage();
    const store = createPinnedStore({ storage, storageKey: 'k' });
    store.pin(widget('a'));
    expect(JSON.parse(storage.map.get('k')!)).toEqual([widget('a')]);
  });

  it('hydrates from storage and drops corrupt entries', () => {
    const good = widget('a');
    const storage = fakeStorage({ k: JSON.stringify([good, { id: 5 }, 'nope']) });
    const store = createPinnedStore({ storage, storageKey: 'k' });
    expect(store.getState()).toEqual([good]);
  });

  it('returns [] when storage holds invalid JSON', () => {
    const storage = fakeStorage({ k: '{not json' });
    const store = createPinnedStore({ storage, storageKey: 'k' });
    expect(store.getState()).toEqual([]);
  });

  it('notifies subscribers on change only', () => {
    const store = createPinnedStore({ storage: null });
    let calls = 0;
    const unsub = store.subscribe(() => {
      calls += 1;
    });
    store.pin(widget('a'));
    store.pin(widget('a')); // dedup → no notify
    expect(calls).toBe(1);
    unsub();
    store.pin(widget('b'));
    expect(calls).toBe(1);
  });
});
