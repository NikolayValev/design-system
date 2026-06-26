import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/server.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  external: ['react', 'react-dom', '@nikolayvalev/design-system', 'ai', '@ai-sdk/anthropic', 'zod'],
});
