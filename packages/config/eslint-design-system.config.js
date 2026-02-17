import baseConfig from './eslint.config.js';
import designSystemPlugin from './eslint-plugin-design-system.js';

/**
 * ESLint config enforcing design system governance.
 */
export default [
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
