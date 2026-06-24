import { describe, it, expect } from 'vitest';
import {
  createComponentRegistry,
  extendRegistry,
  registryComponentNames,
  registryScope,
  type ComponentEntry,
} from './component-registry';

const A = () => null;
const B = () => null;
const B2 = () => null;

const entry = (name: string, component: ComponentEntry['component']): ComponentEntry => ({
  name,
  component,
  description: `${name} desc`,
});

describe('component registry', () => {
  it('lists registered component names', () => {
    const reg = createComponentRegistry([entry('Alpha', A), entry('Beta', B)]);
    expect(registryComponentNames(reg)).toEqual(['Alpha', 'Beta']);
  });

  it('builds a name->component scope map', () => {
    const reg = createComponentRegistry([entry('Alpha', A)]);
    expect(registryScope(reg)).toEqual({ Alpha: A });
  });

  it('extends a base registry, with later entries overriding by name', () => {
    const base = createComponentRegistry([entry('Alpha', A), entry('Beta', B)]);
    const ext = extendRegistry(base, [entry('Beta', B2), entry('Gamma', A)]);
    expect(registryComponentNames(ext)).toEqual(['Alpha', 'Beta', 'Gamma']);
    expect(registryScope(ext).Beta).toBe(B2);
  });
});
