import { VisionRegistry } from '../vde-core';
import type { VisionTheme } from '../vde-core';
import { auroraTheme } from './aurora.theme';
import { brutalistTheme } from './brutalist.theme';
import { claySoftTheme } from './clay-soft.theme';
import { deconstructTheme } from './deconstruct.theme';
import { editorialTheme } from './editorial.theme';
import { immersiveTheme } from './immersive.theme';
import { maMinimalismTheme } from './ma-minimalism.theme';
import { museumTheme } from './museum.theme';
import { noirTheme } from './noir.theme';
import { parchmentTheme } from './parchment.theme';
import { rawDataTheme } from './raw-data.theme';
import { solarpunkTheme } from './solarpunk.theme';
import { swissInternationalTheme } from './swiss-international.theme';
import { synthwaveTheme } from './synthwave.theme';
import { theArchiveTheme } from './the-archive.theme';
import { theEtherTheme } from './the-ether.theme';
import { terminalTheme } from './terminal.theme';
import { y2kChromeTheme } from './y2k-chrome.theme';
import { zenTheme } from './zen.theme';
import { zineCollageTheme } from './zine-collage.theme';

export {
  auroraTheme,
  brutalistTheme,
  claySoftTheme,
  deconstructTheme,
  editorialTheme,
  immersiveTheme,
  maMinimalismTheme,
  museumTheme,
  noirTheme,
  parchmentTheme,
  rawDataTheme,
  solarpunkTheme,
  swissInternationalTheme,
  synthwaveTheme,
  theArchiveTheme,
  theEtherTheme,
  terminalTheme,
  y2kChromeTheme,
  zenTheme,
  zineCollageTheme,
};

export const visionThemes = [
  swissInternationalTheme,
  rawDataTheme,
  theArchiveTheme,
  theEtherTheme,
  solarpunkTheme,
  y2kChromeTheme,
  deconstructTheme,
  maMinimalismTheme,
  claySoftTheme,
  zineCollageTheme,
  museumTheme,
  brutalistTheme,
  immersiveTheme,
  editorialTheme,
  zenTheme,
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
