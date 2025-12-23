import type { ThemeProfile } from './types';
import { baseTokens } from './base';

/**
 * Public profile - for marketing sites and public-facing applications
 * Vibrant, approachable, polished (light mode)
 */
export const publicProfile: ThemeProfile = {
  name: 'public',
  tokens: baseTokens,
  density: 'comfortable',
};

/**
 * Dashboard profile - for internal tools and data-heavy interfaces
 * Dark mode with high information density
 */
export const dashboardProfile: ThemeProfile = {
  name: 'dashboard',
  tokens: {
    ...baseTokens,
    colors: {
      background: 'oklch(0.145 0 0)',
      foreground: 'oklch(0.985 0 0)',
      card: 'oklch(0.145 0 0)',
      cardForeground: 'oklch(0.985 0 0)',
      popover: 'oklch(0.145 0 0)',
      popoverForeground: 'oklch(0.985 0 0)',
      primary: 'oklch(0.985 0 0)',
      primaryForeground: 'oklch(0.205 0 0)',
      secondary: 'oklch(0.269 0 0)',
      secondaryForeground: 'oklch(0.985 0 0)',
      muted: 'oklch(0.269 0 0)',
      mutedForeground: 'oklch(0.708 0 0)',
      accent: 'oklch(0.269 0 0)',
      accentForeground: 'oklch(0.985 0 0)',
      destructive: 'oklch(0.396 0.141 25.723)',
      destructiveForeground: 'oklch(0.637 0.237 25.331)',
      border: 'oklch(0.269 0 0)',
      input: 'oklch(0.269 0 0)',
      ring: 'oklch(0.439 0 0)',
      chartOne: 'oklch(0.488 0.243 264.376)',
      chartTwo: 'oklch(0.696 0.17 162.48)',
      chartThree: 'oklch(0.769 0.188 70.08)',
      chartFour: 'oklch(0.627 0.265 303.9)',
      chartFive: 'oklch(0.645 0.246 16.439)',
      sidebar: 'oklch(0.205 0 0)',
      sidebarForeground: 'oklch(0.985 0 0)',
      sidebarPrimary: 'oklch(0.488 0.243 264.376)',
      sidebarPrimaryForeground: 'oklch(0.985 0 0)',
      sidebarAccent: 'oklch(0.269 0 0)',
      sidebarAccentForeground: 'oklch(0.985 0 0)',
      sidebarBorder: 'oklch(0.269 0 0)',
      sidebarRing: 'oklch(0.439 0 0)',
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
    radius: baseTokens.radius,
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
      background: 'oklch(0 0 0)',
      foreground: 'oklch(1 0 0)',
      card: 'oklch(0.05 0 0)',
      cardForeground: 'oklch(1 0 0)',
      popover: 'oklch(0.05 0 0)',
      popoverForeground: 'oklch(1 0 0)',
      primary: 'oklch(0.55 0.22 142)',
      primaryForeground: 'oklch(0 0 0)',
      secondary: 'oklch(0.16 0 0)',
      secondaryForeground: 'oklch(1 0 0)',
      muted: 'oklch(0.16 0 0)',
      mutedForeground: 'oklch(0.65 0 0)',
      accent: 'oklch(0.75 0.19 85)',
      accentForeground: 'oklch(0 0 0)',
      destructive: 'oklch(0.45 0.25 25)',
      destructiveForeground: 'oklch(1 0 0)',
      border: 'oklch(0.16 0 0)',
      input: 'oklch(0.16 0 0)',
      ring: 'oklch(0.75 0.19 85)',
      chartOne: 'oklch(0.55 0.22 142)',
      chartTwo: 'oklch(0.75 0.19 85)',
      chartThree: 'oklch(0.65 0.2 340)',
      chartFour: 'oklch(0.6 0.15 200)',
      chartFive: 'oklch(0.7 0.18 50)',
      sidebar: 'oklch(0 0 0)',
      sidebarForeground: 'oklch(1 0 0)',
      sidebarPrimary: 'oklch(0.55 0.22 142)',
      sidebarPrimaryForeground: 'oklch(0 0 0)',
      sidebarAccent: 'oklch(0.16 0 0)',
      sidebarAccentForeground: 'oklch(1 0 0)',
      sidebarBorder: 'oklch(0.16 0 0)',
      sidebarRing: 'oklch(0.75 0.19 85)',
    },
    // Note: This profile intentionally uses a zero-radius, sharp-cornered design.
    // Setting base to 0 means that any CSS using calc(var(--radius) - Npx)
    // may produce negative border-radius values, which browsers clamp to 0.
    // This behavior is acceptable and intentional for the experimental profile.
    radius: {
      base: '0rem',
      full: '0rem',
    },
  },
  density: 'comfortable',
};
