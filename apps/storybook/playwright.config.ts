import { defineConfig } from '@playwright/test';

const baseURL = 'http://127.0.0.1:6006';

export default defineConfig({
  testDir: './tests/visual',
  snapshotPathTemplate: '{testDir}/{testFilePath}-snapshots/{arg}{ext}',
  fullyParallel: false,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01,
    },
  },
  use: {
    baseURL,
    viewport: { width: 1440, height: 900 },
    colorScheme: 'light',
    locale: 'en-US',
  },
  webServer: {
    command: 'pnpm run build && pnpm run serve:storybook',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180000,
  },
});
