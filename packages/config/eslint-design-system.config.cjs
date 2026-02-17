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
    },
  },
];
