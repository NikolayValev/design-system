import type { ThemeProfile } from '../tokens/types';

/**
 * Generate CSS with injected CSS custom properties from a theme profile
 */
export function generateThemeCSS(profile: ThemeProfile): string {
  const { tokens } = profile;
  const lines: string[] = [':root {'];

  // Colors
  Object.entries(tokens.colors).forEach(([key, value]) => {
    const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    const hslValue = value.match(/hsl\((.*)\)/)?.[1] || value;
    lines.push(`  --color-${cssKey}: ${hslValue};`);
  });

  // Spacing
  Object.entries(tokens.spacing).forEach(([key, value]) => {
    lines.push(`  --spacing-${key}: ${value};`);
  });

  // Radius
  Object.entries(tokens.radius).forEach(([key, value]) => {
    lines.push(`  --radius-${key}: ${value};`);
  });

  // Typography
  lines.push(`  --font-sans: ${tokens.typography.fontFamily.sans};`);
  lines.push(`  --font-mono: ${tokens.typography.fontFamily.mono};`);

  lines.push('}');
  return lines.join('\n');
}
