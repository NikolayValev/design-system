import { describe, it, expect } from 'vitest';
import {
  createComponentRegistry,
  createDataRegistry,
  defaultComponentRegistry,
  validateWidgetSource,
} from './index';

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
