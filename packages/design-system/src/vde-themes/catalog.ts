import { VisionRegistry } from '../vde-core';
import type { VisionTheme } from '../vde-core';
import { brutalistTheme } from './brutalist.theme';
import { claySoftTheme } from './clay-soft.theme';
import { editorialTheme } from './editorial.theme';
import { immersiveTheme } from './immersive.theme';
import { museumTheme } from './museum.theme';
import { noirTheme } from './noir.theme';
import { solarpunkTheme } from './solarpunk.theme';
import { swissInternationalTheme } from './swiss-international.theme';
import { synthwaveTheme } from './synthwave.theme';
import { terminalTheme } from './terminal.theme';
import { y2kChromeTheme } from './y2k-chrome.theme';
import { zenTheme } from './zen.theme';

export {
  brutalistTheme,
  claySoftTheme,
  editorialTheme,
  immersiveTheme,
  museumTheme,
  noirTheme,
  solarpunkTheme,
  swissInternationalTheme,
  synthwaveTheme,
  terminalTheme,
  y2kChromeTheme,
  zenTheme,
};

/**
 * The curated theme catalog, ordered by family
 * (Editorial → Minimal → Technical → Atmospheric → Expressive).
 * The first entry is the registry's default/fallback theme.
 */
export const visionThemes: VisionTheme[] = [
  // Editorial & Print
  editorialTheme,
  museumTheme,
  // Minimal & Structured
  swissInternationalTheme,
  zenTheme,
  claySoftTheme,
  // Technical & Utility
  terminalTheme,
  brutalistTheme,
  // Atmospheric & Luminous
  immersiveTheme,
  synthwaveTheme,
  noirTheme,
  // Expressive & Statement
  solarpunkTheme,
  y2kChromeTheme,
];

/**
 * A smaller cross-family highlight set, used by the optional compile-time
 * "expanded" vision subset and its visual regression coverage.
 */
export const expandedVisionThemeIds = [
  'swiss_international',
  'clay_soft',
  'solarpunk',
  'y2k_chrome',
] as const;

export function getVisionThemeById(themeId: string): VisionTheme | undefined {
  return visionThemes.find(theme => theme.id === themeId);
}

export function getVisionThemeIds(): string[] {
  return visionThemes.map(theme => theme.id);
}

export function getVisionThemeNames(): string[] {
  return visionThemes.map(theme => theme.name);
}

export function isVisionThemeId(themeId: string): boolean {
  return visionThemes.some(theme => theme.id === themeId);
}

export const defaultVisionRegistry = new VisionRegistry(visionThemes);
