import type { ThemeFamily, ThemeFamilyId, VisionTheme } from '../vde-core';
import { THEME_FAMILY_IDS } from '../vde-core';

/**
 * The five theme families. Each entry pairs a family with a short description
 * so the catalog reads as a deliberate taxonomy rather than a flat list.
 */
export const themeFamilies: readonly ThemeFamily[] = [
  {
    id: 'editorial',
    name: 'Editorial & Print',
    description:
      'Warm, typographic, reading-first systems with print-era hierarchy and measured pacing.',
  },
  {
    id: 'minimal',
    name: 'Minimal & Structured',
    description:
      'Calm, neutral, disciplined layouts that favour clarity, structure, and breathing room.',
  },
  {
    id: 'technical',
    name: 'Technical & Utility',
    description:
      'Hard edges, monospace rhythm, and high information density for tools and consoles.',
  },
  {
    id: 'atmospheric',
    name: 'Atmospheric & Luminous',
    description:
      'Depth, glow, and cinematic light that use layering and motion to guide attention.',
  },
  {
    id: 'expressive',
    name: 'Expressive & Statement',
    description:
      'Bold, playful, maximal identities built to be memorable and campaign-ready.',
  },
] as const;

const familiesById = new Map<ThemeFamilyId, ThemeFamily>(
  themeFamilies.map(family => [family.id, family]),
);

export function getThemeFamily(id: ThemeFamilyId): ThemeFamily | undefined {
  return familiesById.get(id);
}

/** Ordered family ids — mirrors `THEME_FAMILY_IDS`, re-exported for convenience. */
export const themeFamilyOrder = THEME_FAMILY_IDS;

export interface ThemeFamilyGroup {
  family: ThemeFamily;
  themes: VisionTheme[];
}

/**
 * Group a list of themes by family, preserving family order. Families with no
 * matching themes are omitted.
 */
export function groupThemesByFamily(themes: readonly VisionTheme[]): ThemeFamilyGroup[] {
  return themeFamilies
    .map(family => ({
      family,
      themes: themes.filter(theme => theme.family === family.id),
    }))
    .filter(group => group.themes.length > 0);
}
