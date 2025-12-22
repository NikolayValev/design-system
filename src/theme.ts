import type { ThemeProfile, DesignTokens, DensityMode } from './tokens/types';
import { baseTokens } from './tokens/base';
import { tokenKeyToCSSVar } from './utils/chart-mapping';

/**
 * Theme configuration options
 */
export interface ThemeConfig {
  profile?: ThemeProfile;
  tokens?: Partial<DesignTokens>;
  density?: DensityMode;
}

/**
 * Merged theme result
 */
export interface Theme {
  tokens: DesignTokens;
  density: DensityMode;
  cssVariables: Record<string, string>;
}

/**
 * Deep merge utility for token overrides
 */
function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const result = { ...target };
  
  for (const key in source) {
    const sourceValue = source[key];
    const targetValue = result[key];
    
    if (sourceValue && typeof sourceValue === 'object' && !Array.isArray(sourceValue)) {
      result[key] = deepMerge(
        targetValue || ({} as any),
        sourceValue
      );
    } else if (sourceValue !== undefined) {
      result[key] = sourceValue as any;
    }
  }
  
  return result;
}

/**
 * Convert design tokens to CSS custom properties
 */
function tokensToCSSVariables(tokens: DesignTokens): Record<string, string> {
  const vars: Record<string, string> = {};
  
  // Colors
  Object.entries(tokens.colors).forEach(([key, value]) => {
    const cssKey = tokenKeyToCSSVar(key);
    vars[`--${cssKey}`] = value;
  });
  
  // Spacing
  Object.entries(tokens.spacing).forEach(([key, value]) => {
    vars[`--spacing-${key}`] = value;
  });
  
  // Radius (base value only, calculated values are in CSS)
  vars['--radius'] = tokens.radius.base;
  
  // Typography
  vars['--font-family-sans'] = tokens.typography.fontFamily.sans;
  vars['--font-family-mono'] = tokens.typography.fontFamily.mono;
  
  return vars;
}

/**
 * Create a theme by composing a profile with custom overrides
 * 
 * @example
 * ```ts
 * import { createTheme, publicProfile } from '@nikolayvalev/design-system';
 * 
 * const theme = createTheme({
 *   profile: publicProfile,
 *   tokens: {
 *     colors: {
 *       primary: 'hsl(280 100% 70%)'
 *     }
 *   }
 * });
 * ```
 */
export function createTheme(config: ThemeConfig = {}): Theme {
  const profileTokens = config.profile?.tokens || baseTokens;
  const mergedTokens = config.tokens 
    ? deepMerge(profileTokens, config.tokens)
    : profileTokens;
  
  const density = config.density || config.profile?.density || 'comfortable';
  
  return {
    tokens: mergedTokens,
    density,
    cssVariables: tokensToCSSVariables(mergedTokens),
  };
}

/**
 * Apply theme CSS variables to a DOM element
 * 
 * @example
 * ```ts
 * import { applyTheme, publicProfile } from '@nikolayvalev/design-system';
 * 
 * const theme = createTheme({ profile: publicProfile });
 * applyTheme(document.documentElement, theme);
 * ```
 */
export function applyTheme(element: HTMLElement, theme: Theme): void {
  Object.entries(theme.cssVariables).forEach(([key, value]) => {
    element.style.setProperty(key, value);
  });
  
  element.setAttribute('data-density', theme.density);
}
