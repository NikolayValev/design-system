import { describe, it, expect } from 'vitest';
import {
  createComponentRegistry,
  createDataRegistry,
  defaultComponentRegistry,
  validateWidgetSource,
} from './index';
import * as engine from './index';

describe('package smoke', () => {
  it('exports createComponentRegistry', () => {
    const reg = createComponentRegistry([]);
    expect(reg.entries).toHaveLength(0);
  });

  it('exports createDataRegistry', () => {
    const reg = createDataRegistry([]);
    expect(reg.sources).toHaveLength(0);
  });

  it('exports defaultComponentRegistry', () => {
    expect(defaultComponentRegistry.entries.length).toBeGreaterThan(0);
  });

  it('exports validateWidgetSource', () => {
    const result = validateWidgetSource('return <div>hello</div>', new Set());
    expect(result).toHaveProperty('ok');
    expect(result).toHaveProperty('errors');
  });
});

describe('phase 2c public surface', () => {
  it('exports the panel UI + pinned store', () => {
    expect(typeof engine.CommandPanel).toBe('function');
    expect(typeof engine.ChatPane).toBe('function');
    expect(typeof engine.DashboardGrid).toBe('function');
    expect(typeof engine.WidgetPreviewCard).toBe('function');
    expect(typeof engine.PinnedStoreProvider).toBe('function');
    expect(typeof engine.usePinnedStore).toBe('function');
    expect(typeof engine.createPinnedStore).toBe('function');
  });
});
