import { VisionRegistry } from '../vde-core';
import type { VisionTheme } from '../vde-core';
import { auroraTheme } from './aurora.theme';
import { brutalistTheme } from './brutalist.theme';
import { editorialTheme } from './editorial.theme';
import { immersiveTheme } from './immersive.theme';
import { museumTheme } from './museum.theme';
import { noirTheme } from './noir.theme';
import { parchmentTheme } from './parchment.theme';
import { solarpunkTheme } from './solarpunk.theme';
import { synthwaveTheme } from './synthwave.theme';
import { terminalTheme } from './terminal.theme';
import { zenTheme } from './zen.theme';

export {
  auroraTheme,
  brutalistTheme,
  editorialTheme,
  immersiveTheme,
  museumTheme,
  noirTheme,
  parchmentTheme,
  solarpunkTheme,
  synthwaveTheme,
  terminalTheme,
  zenTheme,
};

export const visionThemes = [
  museumTheme,
  brutalistTheme,
  immersiveTheme,
  editorialTheme,
  zenTheme,
  solarpunkTheme,
  synthwaveTheme,
  auroraTheme,
  noirTheme,
  parchmentTheme,
  terminalTheme,
];

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
