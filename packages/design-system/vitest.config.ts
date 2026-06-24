import { defineConfig } from 'vitest/config';

export default defineConfig({
  // esbuild's automatic JSX runtime means test files don't need to import React.
  esbuild: { jsx: 'automatic' },
  test: {
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
