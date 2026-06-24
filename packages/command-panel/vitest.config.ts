import { defineConfig } from 'vitest/config';

export default defineConfig({
  esbuild: { jsx: 'automatic' },
  test: {
    // Default: fast node env for pure modules.
    // React-rendering tests opt into jsdom via a `// @vitest-environment jsdom`
    // pragma at the top of the file (used by *.dom.test.tsx files).
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
