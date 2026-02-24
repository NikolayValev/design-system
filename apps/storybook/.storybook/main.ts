import type { StorybookConfig } from '@storybook/react-vite';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const storybookDir = dirname(fileURLToPath(import.meta.url));
const storybookRoot = resolve(storybookDir, '..');
const designSystemEntry = resolve(storybookDir, '../../../packages/design-system/src/index.ts');
const designSystemRoot = resolve(storybookDir, '../../../packages/design-system');

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx|mdx)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-interactions', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  async viteFinal(config) {
    const existingAlias = config.resolve?.alias;
    const nextAlias = Array.isArray(existingAlias)
      ? [
          ...existingAlias.filter(alias => {
            if (typeof alias !== 'object' || !('find' in alias)) {
              return true;
            }
            return alias.find !== '@nikolayvalev/design-system';
          }),
          {
            find: '@nikolayvalev/design-system',
            replacement: designSystemEntry,
          },
        ]
      : {
          ...(existingAlias ?? {}),
          '@nikolayvalev/design-system': designSystemEntry,
        };

    const fsAllow = config.server?.fs?.allow ?? [];
    const optimizeDepsExclude = config.optimizeDeps?.exclude ?? [];

    return {
      ...config,
      resolve: {
        ...(config.resolve ?? {}),
        alias: nextAlias,
      },
      server: {
        ...(config.server ?? {}),
        fs: {
          ...(config.server?.fs ?? {}),
          allow: Array.from(new Set([...fsAllow, storybookRoot, designSystemRoot])),
        },
      },
      optimizeDeps: {
        ...(config.optimizeDeps ?? {}),
        exclude: Array.from(new Set([...optimizeDepsExclude, '@nikolayvalev/design-system'])),
      },
    };
  },
};

export default config;
