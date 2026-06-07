import { getVisionThemeIds } from './catalog';

/** Ids of the visions compiled into a build. Defaults to the full curated catalog. */
export function getCompiledVisionIds(selected?: readonly string[]): string[] {
  const all = getVisionThemeIds();
  if (!selected || selected.length === 0) return all;
  const allowed = new Set(all);
  const unknown = selected.filter(id => !allowed.has(id));
  if (unknown.length > 0) {
    throw new Error(`Unknown vision id(s): ${unknown.join(', ')}`);
  }
  return selected.filter(id => allowed.has(id));
}
