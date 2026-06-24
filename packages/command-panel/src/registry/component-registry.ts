import type React from 'react';

export interface ComponentEntry {
  /** Identifier exposed to generated JSX (must be PascalCase to be usable as a component). */
  name: string;
  component: React.ComponentType<any>;
  /** Shown to the LLM in the system prompt (Phase 2b). */
  description: string;
  /** Optional JSON-schema-ish prop documentation for the LLM. */
  propsSchema?: Record<string, unknown>;
}

export interface ComponentRegistry {
  entries: ComponentEntry[];
}

export function createComponentRegistry(entries: ComponentEntry[]): ComponentRegistry {
  return { entries: [...entries] };
}

/** Merge `extra` onto `base`; entries with the same `name` are replaced (later wins), order preserved. */
export function extendRegistry(base: ComponentRegistry, extra: ComponentEntry[]): ComponentRegistry {
  const byName = new Map<string, ComponentEntry>();
  for (const e of base.entries) byName.set(e.name, e);
  for (const e of extra) byName.set(e.name, e);
  return { entries: [...byName.values()] };
}

export function registryComponentNames(reg: ComponentRegistry): string[] {
  return reg.entries.map((e) => e.name);
}

export function registryScope(reg: ComponentRegistry): Record<string, React.ComponentType<any>> {
  const scope: Record<string, React.ComponentType<any>> = {};
  for (const e of reg.entries) scope[e.name] = e.component;
  return scope;
}
