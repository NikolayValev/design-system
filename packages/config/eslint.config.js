import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

/**
 * Shared ESLint flat config for TypeScript packages.
 * Extend in each package's eslint.config.js:
 *
 * ```js
 * import baseConfig from '@repo/config/eslint';
 * export default [...baseConfig];
 * ```
 */
export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        { prefer: 'type-imports' },
      ],
    },
  },
  {
    ignores: ['dist/**', 'node_modules/**', '*.config.*'],
  },
);
