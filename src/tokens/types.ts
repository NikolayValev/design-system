/**
 * Core design token types
 * These define the contract for all theme profiles
 */

export interface ColorTokens {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
  chart1: string;
  chart2: string;
  chart3: string;
  chart4: string;
  chart5: string;
  sidebar: string;
  sidebarForeground: string;
  sidebarPrimary: string;
  sidebarPrimaryForeground: string;
  sidebarAccent: string;
  sidebarAccentForeground: string;
  sidebarBorder: string;
  sidebarRing: string;
}

export interface SpacingTokens {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  '4xl': string;
}

export interface RadiusTokens {
  base: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  full: string;
}

export interface TypographyTokens {
  fontFamily: {
    sans: string;
    mono: string;
  };
  fontSize: {
    xs: [string, { lineHeight: string }];
    sm: [string, { lineHeight: string }];
    base: [string, { lineHeight: string }];
    lg: [string, { lineHeight: string }];
    xl: [string, { lineHeight: string }];
    '2xl': [string, { lineHeight: string }];
    '3xl': [string, { lineHeight: string }];
    '4xl': [string, { lineHeight: string }];
  };
  fontWeight: {
    normal: string;
    medium: string;
    semibold: string;
    bold: string;
  };
}

export interface DesignTokens {
  colors: ColorTokens;
  spacing: SpacingTokens;
  radius: RadiusTokens;
  typography: TypographyTokens;
}

export type DensityMode = 'comfortable' | 'compact';

export interface ThemeProfile {
  name: string;
  tokens: DesignTokens;
  density?: DensityMode;
}
