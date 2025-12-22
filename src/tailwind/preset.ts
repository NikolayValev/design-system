import type { Config } from 'tailwindcss';
import type { ThemeProfile } from '../tokens/types';
import { baseTokens } from '../tokens/base';

/**
 * Convert HSL color values to Tailwind-compatible format
 */
function hslToTailwind(hsl: string): string {
  // Extract values from "hsl(222.2 84% 4.9%)" format
  const match = hsl.match(/hsl\(([\d.]+)\s+([\d.]+)%\s+([\d.]+)%\)/);
  if (match) {
    return `${match[1]} ${match[2]}% ${match[3]}%`;
  }
  return hsl;
}

/**
 * Create a Tailwind preset from a theme profile
 * 
 * @example
 * ```ts
 * // tailwind.config.js
 * import { createTailwindPreset, publicProfile } from '@nikolayvalev/design-system/tailwind';
 * 
 * export default {
 *   presets: [createTailwindPreset(publicProfile)],
 *   content: ['./src/**\/*.{js,ts,jsx,tsx}'],
 * };
 * ```
 */
export function createTailwindPreset(profile?: ThemeProfile): Partial<Config> {
  const tokens = profile?.tokens || baseTokens;
  
  return {
    theme: {
      extend: {
        colors: {
          background: `hsl(var(--color-background, ${hslToTailwind(tokens.colors.background)}))`,
          foreground: `hsl(var(--color-foreground, ${hslToTailwind(tokens.colors.foreground)}))`,
          card: {
            DEFAULT: `hsl(var(--color-card, ${hslToTailwind(tokens.colors.card)}))`,
            foreground: `hsl(var(--color-card-foreground, ${hslToTailwind(tokens.colors.cardForeground)}))`,
          },
          popover: {
            DEFAULT: `hsl(var(--color-popover, ${hslToTailwind(tokens.colors.popover)}))`,
            foreground: `hsl(var(--color-popover-foreground, ${hslToTailwind(tokens.colors.popoverForeground)}))`,
          },
          primary: {
            DEFAULT: `hsl(var(--color-primary, ${hslToTailwind(tokens.colors.primary)}))`,
            foreground: `hsl(var(--color-primary-foreground, ${hslToTailwind(tokens.colors.primaryForeground)}))`,
          },
          secondary: {
            DEFAULT: `hsl(var(--color-secondary, ${hslToTailwind(tokens.colors.secondary)}))`,
            foreground: `hsl(var(--color-secondary-foreground, ${hslToTailwind(tokens.colors.secondaryForeground)}))`,
          },
          muted: {
            DEFAULT: `hsl(var(--color-muted, ${hslToTailwind(tokens.colors.muted)}))`,
            foreground: `hsl(var(--color-muted-foreground, ${hslToTailwind(tokens.colors.mutedForeground)}))`,
          },
          accent: {
            DEFAULT: `hsl(var(--color-accent, ${hslToTailwind(tokens.colors.accent)}))`,
            foreground: `hsl(var(--color-accent-foreground, ${hslToTailwind(tokens.colors.accentForeground)}))`,
          },
          destructive: {
            DEFAULT: `hsl(var(--color-destructive, ${hslToTailwind(tokens.colors.destructive)}))`,
            foreground: `hsl(var(--color-destructive-foreground, ${hslToTailwind(tokens.colors.destructiveForeground)}))`,
          },
          border: `hsl(var(--color-border, ${hslToTailwind(tokens.colors.border)}))`,
          input: `hsl(var(--color-input, ${hslToTailwind(tokens.colors.input)}))`,
          ring: `hsl(var(--color-ring, ${hslToTailwind(tokens.colors.ring)}))`,
        },
        spacing: {
          xs: `var(--spacing-xs, ${tokens.spacing.xs})`,
          sm: `var(--spacing-sm, ${tokens.spacing.sm})`,
          md: `var(--spacing-md, ${tokens.spacing.md})`,
          lg: `var(--spacing-lg, ${tokens.spacing.lg})`,
          xl: `var(--spacing-xl, ${tokens.spacing.xl})`,
          '2xl': `var(--spacing-2xl, ${tokens.spacing['2xl']})`,
          '3xl': `var(--spacing-3xl, ${tokens.spacing['3xl']})`,
          '4xl': `var(--spacing-4xl, ${tokens.spacing['4xl']})`,
        },
        borderRadius: {
          sm: `var(--radius-sm, ${tokens.radius.sm})`,
          md: `var(--radius-md, ${tokens.radius.md})`,
          lg: `var(--radius-lg, ${tokens.radius.lg})`,
          xl: `var(--radius-xl, ${tokens.radius.xl})`,
          full: `var(--radius-full, ${tokens.radius.full})`,
        },
        fontFamily: {
          sans: tokens.typography.fontFamily.sans.split(', '),
          mono: tokens.typography.fontFamily.mono.split(', '),
        },
        fontSize: Object.fromEntries(
          Object.entries(tokens.typography.fontSize).map(([key, [size, config]]) => [
            key,
            [size, config],
          ])
        ),
        fontWeight: tokens.typography.fontWeight,
      },
    },
  };
}

/**
 * Default preset using base tokens
 */
export const defaultPreset = createTailwindPreset();
