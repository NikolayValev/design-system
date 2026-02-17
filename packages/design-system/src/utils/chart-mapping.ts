/**
 * Chart token name to CSS variable name mapping
 * Converts camelCase chart token names (chartOne, chartTwo, etc.)
 * to numeric kebab-case CSS variables (chart-1, chart-2, etc.)
 * for Tailwind CSS compatibility
 */
export const chartMapping: Record<string, string> = {
  chartOne: 'chart-1',
  chartTwo: 'chart-2',
  chartThree: 'chart-3',
  chartFour: 'chart-4',
  chartFive: 'chart-5',
};

/**
 * Convert a token key to a CSS variable name
 * Handles special cases like chart tokens and general camelCase conversion
 */
export function tokenKeyToCSSVar(key: string): string {
  if (chartMapping[key]) {
    return chartMapping[key];
  }
  return key.replace(/([A-Z])/g, '-$1').toLowerCase();
}
