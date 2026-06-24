import { describe, it, expect } from 'vitest';
import { defaultComponentRegistry } from './default-registry';
import { registryComponentNames, registryScope } from './component-registry';

describe('defaultComponentRegistry', () => {
  it('includes the four chart primitives', () => {
    const names = registryComponentNames(defaultComponentRegistry);
    for (const n of ['LineChart', 'BarChart', 'AreaChart', 'Donut']) {
      expect(names).toContain(n);
    }
  });

  it('includes layout/data primitives for arrangement', () => {
    const names = registryComponentNames(defaultComponentRegistry);
    for (const n of ['Card', 'CardHeader', 'CardTitle', 'CardContent', 'Badge', 'StatChip', 'Layout', 'SectionShell']) {
      expect(names).toContain(n);
    }
  });

  it('maps every name to a defined component and gives each a description', () => {
    const scope = registryScope(defaultComponentRegistry);
    for (const entry of defaultComponentRegistry.entries) {
      expect(typeof entry.description).toBe('string');
      expect(entry.description.length).toBeGreaterThan(0);
      expect(scope[entry.name]).toBeDefined();
    }
  });
});
