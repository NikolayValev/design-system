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
    },
  },
];
