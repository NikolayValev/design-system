import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'tokens/index': 'src/tokens/index.ts',
    'tailwind/index': 'src/tailwind/index.ts',
  },
  format: ['esm'],
  dts: true,
  clean: true,
  external: ['tailwindcss'],
});
