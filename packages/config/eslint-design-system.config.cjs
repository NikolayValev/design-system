const baseConfig = require('./eslint.config.cjs');
const designSystemPlugin = require('./eslint-plugin-design-system.cjs');

/**
 * ESLint config enforcing design system governance.
 */
module.exports = [
  ...baseConfig,
  {
    plugins: {
      'design-system': designSystemPlugin,
    },
    rules: {
      'design-system/no-inline-styles': 'error',
      'design-system/no-local-component': 'error',
      'design-system/no-local-css': 'error',
      'design-system/no-raw-design-values': 'error',
    },
  },
  {
    /*
     * The token sources are where raw values are supposed to live. A theme file
     * that could not write `oklch(...)` or `rgba(...)` would have nothing to say,
     * and the CSS emitter is the thing that turns those into tokens.
     */
    files: [
      '**/src/vde-themes/**',
      '**/src/vde-core/css.ts',
      '**/src/styles/**',
      '**/scripts/**',
    ],
    rules: {
      'design-system/no-raw-design-values': 'off',
    },
  },
];
