import type { Config } from 'tailwindcss';
import type { ThemeProfile } from '../tokens/types';
import { baseTokens } from '../tokens/base';

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
          background: 'var(--color-background)',
          foreground: 'var(--color-foreground)',
          card: {
            DEFAULT: 'var(--color-card)',
            foreground: 'var(--color-card-foreground)',
          },
          popover: {
            DEFAULT: 'var(--color-popover)',
            foreground: 'var(--color-popover-foreground)',
          },
          primary: {
            DEFAULT: 'var(--color-primary)',
            foreground: 'var(--color-primary-foreground)',
          },
          secondary: {
            DEFAULT: 'var(--color-secondary)',
            foreground: 'var(--color-secondary-foreground)',
          },
          muted: {
            DEFAULT: 'var(--color-muted)',
            foreground: 'var(--color-muted-foreground)',
          },
          accent: {
            DEFAULT: 'var(--color-accent)',
            foreground: 'var(--color-accent-foreground)',
          },
          destructive: {
            DEFAULT: 'var(--color-destructive)',
            foreground: 'var(--color-destructive-foreground)',
          },
          border: 'var(--color-border)',
          input: 'var(--color-input)',
          ring: 'var(--color-ring)',
          chart: {
            1: 'var(--color-chart-1)',
            2: 'var(--color-chart-2)',
            3: 'var(--color-chart-3)',
            4: 'var(--color-chart-4)',
            5: 'var(--color-chart-5)',
          },
          sidebar: {
            DEFAULT: 'var(--color-sidebar)',
            foreground: 'var(--color-sidebar-foreground)',
            primary: 'var(--color-sidebar-primary)',
            'primary-foreground': 'var(--color-sidebar-primary-foreground)',
            accent: 'var(--color-sidebar-accent)',
            'accent-foreground': 'var(--color-sidebar-accent-foreground)',
            border: 'var(--color-sidebar-border)',
            ring: 'var(--color-sidebar-ring)',
          },
        },
        borderRadius: {
          sm: 'var(--radius-sm)',
          md: 'var(--radius-md)',
          lg: 'var(--radius-lg)',
          xl: 'var(--radius-xl)',
        },
        fontFamily: {
          sans: tokens.typography.fontFamily.sans.split(', '),
          mono: tokens.typography.fontFamily.mono.split(', '),
        },
        spacing: {
          xs: tokens.spacing.xs,
          sm: tokens.spacing.sm,
          md: tokens.spacing.md,
          lg: tokens.spacing.lg,
          xl: tokens.spacing.xl,
          '2xl': tokens.spacing['2xl'],
          '3xl': tokens.spacing['3xl'],
          '4xl': tokens.spacing['4xl'],
        },
        fontSize: {
          xs: tokens.typography.fontSize.xs,
          sm: tokens.typography.fontSize.sm,
          base: tokens.typography.fontSize.base,
          lg: tokens.typography.fontSize.lg,
          xl: tokens.typography.fontSize.xl,
          '2xl': tokens.typography.fontSize['2xl'],
          '3xl': tokens.typography.fontSize['3xl'],
          '4xl': tokens.typography.fontSize['4xl'],
        },
        fontWeight: {
          normal: tokens.typography.fontWeight.normal,
          medium: tokens.typography.fontWeight.medium,
          semibold: tokens.typography.fontWeight.semibold,
          bold: tokens.typography.fontWeight.bold,
        },
      },
    },
  };
}

/**
 * Default preset using base tokens
 */
export const defaultPreset = createTailwindPreset();
