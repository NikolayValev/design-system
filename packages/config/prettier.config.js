/**
 * Shared Prettier configuration.
 *
 * Usage in package.json or .prettierrc.js:
 * ```json
 * "prettier": "@repo/config/prettier"
 * ```
 */
const config = {
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 100,
  tabWidth: 2,
  arrowParens: 'always',
  endOfLine: 'lf',
};

export default config;
