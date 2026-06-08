import type { ThemeMode, VisionColors } from '../vde-core';

/**
 * Transitional helper: assigns the same palette to both modes. Real opposite-mode
 * palettes replace `dualPalette({...})` with an explicit `{ light, dark }` per theme.
 */
export function dualPalette(colors: VisionColors): { light: VisionColors; dark: VisionColors } {
  return { light: colors, dark: colors };
}
export type { ThemeMode };
