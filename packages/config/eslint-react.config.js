import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import baseConfig from './eslint.config.js';

/**
 * Shared ESLint flat config for React packages.
 * Extend in each package's eslint.config.js:
 *
 * ```js
 * import reactConfig from '@repo/config/eslint-react';
 * export default [...reactConfig];
 * ```
 */
export default [
  ...baseConfig,
  {
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
    },
  },
];
