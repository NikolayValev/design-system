import config from '@repo/config/eslint';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

export default [
  ...config,
  {
    plugins: {
      'react-hooks': reactHooksPlugin,
    },
    rules: {
      ...reactHooksPlugin.configs.recommended.rules,
      // Sandbox package: police `new Function` use explicitly so the one
      // intentional call site below carries a scoped, "used" disable directive.
      'no-new-func': 'error',
      // The engine renders arbitrary host-provided components and
      // dynamically-built widgets, so `any` at those type boundaries is
      // intentional and not a smell.
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];
