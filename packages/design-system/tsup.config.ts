import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'tailwind/index': 'src/tailwind/index.ts',
    'tokens/index': 'src/tokens/index.ts',
    'cli/init': 'src/cli/init.ts',
  },
  format: ['esm'],
  dts: true,
  clean: true,
  external: ['react', 'react-dom', 'tailwindcss'],
});
