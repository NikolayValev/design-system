import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/server.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  external: [
    'react',
    'react-dom',
    '@nikolayvalev/design-system',
    'ai',
    '@ai-sdk/anthropic',
    '@ai-sdk/provider-utils',
    '@ai-sdk/react',
    'zod',
  ],
  // @repo/state is a PRIVATE workspace package; bundle it so the published
  // engine is self-contained (it has zero runtime deps of its own).
  noExternal: ['@repo/state'],
});
