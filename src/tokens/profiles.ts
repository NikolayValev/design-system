import type { ThemeProfile } from './types';
import { baseTokens } from './base';

/**
 * Public profile - for marketing sites and public-facing applications
 * Vibrant, approachable, polished
 */
export const publicProfile: ThemeProfile = {
  name: 'public',
  tokens: {
    ...baseTokens,
    colors: {
      ...baseTokens.colors,
      primary: 'hsl(262.1 83.3% 57.8%)',
      primaryForeground: 'hsl(210 40% 98%)',
      secondary: 'hsl(220 14.3% 95.9%)',
      secondaryForeground: 'hsl(220.9 39.3% 11%)',
      accent: 'hsl(262.1 83.3% 57.8%)',
      accentForeground: 'hsl(210 40% 98%)',
    },
    radius: {
      sm: '0.5rem',
      md: '0.75rem',
      lg: '1rem',
      xl: '1.25rem',
      full: '9999px',
    },
  },
  density: 'comfortable',
};

/**
 * Dashboard profile - for internal tools and data-heavy interfaces
 * Neutral, efficient, high information density
 */
export const dashboardProfile: ThemeProfile = {
  name: 'dashboard',
  tokens: {
    ...baseTokens,
    colors: {
      ...baseTokens.colors,
      background: 'hsl(222.2 84% 4.9%)',
      foreground: 'hsl(210 40% 98%)',
      card: 'hsl(217.2 32.6% 17.5%)',
      cardForeground: 'hsl(210 40% 98%)',
      popover: 'hsl(217.2 32.6% 17.5%)',
      popoverForeground: 'hsl(210 40% 98%)',
      primary: 'hsl(210 40% 98%)',
      primaryForeground: 'hsl(222.2 47.4% 11.2%)',
      secondary: 'hsl(217.2 32.6% 17.5%)',
      secondaryForeground: 'hsl(210 40% 98%)',
      muted: 'hsl(217.2 32.6% 17.5%)',
      mutedForeground: 'hsl(215 20.2% 65.1%)',
      accent: 'hsl(217.2 32.6% 17.5%)',
      accentForeground: 'hsl(210 40% 98%)',
      border: 'hsl(217.2 32.6% 17.5%)',
      input: 'hsl(217.2 32.6% 17.5%)',
      ring: 'hsl(212.7 26.8% 83.9%)',
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.375rem',
      md: '0.75rem',
      lg: '1rem',
      xl: '1.5rem',
      '2xl': '2rem',
      '3xl': '3rem',
      '4xl': '4rem',
    },
    radius: {
      sm: '0.125rem',
      md: '0.25rem',
      lg: '0.375rem',
      xl: '0.5rem',
      full: '9999px',
    },
  },
  density: 'compact',
};

/**
 * Experimental profile - for prototypes and creative projects
 * Bold, unconventional, high contrast
 */
export const experimentalProfile: ThemeProfile = {
  name: 'experimental',
  tokens: {
    ...baseTokens,
    colors: {
      ...baseTokens.colors,
      background: 'hsl(0 0% 0%)',
      foreground: 'hsl(0 0% 100%)',
      card: 'hsl(0 0% 5%)',
      cardForeground: 'hsl(0 0% 100%)',
      primary: 'hsl(142.1 76.2% 36.3%)',
      primaryForeground: 'hsl(0 0% 0%)',
      secondary: 'hsl(240 3.7% 15.9%)',
      secondaryForeground: 'hsl(0 0% 100%)',
      accent: 'hsl(47.9 95.8% 53.1%)',
      accentForeground: 'hsl(0 0% 0%)',
      destructive: 'hsl(0 62.8% 30.6%)',
      border: 'hsl(240 3.7% 15.9%)',
      input: 'hsl(240 3.7% 15.9%)',
    },
    radius: {
      sm: '0rem',
      md: '0rem',
      lg: '0rem',
      xl: '0rem',
      full: '0rem',
    },
  },
  density: 'comfortable',
};
