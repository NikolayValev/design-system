import { expect, test } from '@playwright/test';

interface StorybookEntry {
  id: string;
  type: 'story' | 'docs';
  tags?: string[];
}

interface StorybookIndex {
  entries: Record<string, StorybookEntry>;
}

const disableMotionStyles = `
  *, *::before, *::after {
    animation: none !important;
    transition: none !important;
    caret-color: transparent !important;
  }
`;

test('visual regression for every story', async ({ page, request, baseURL }) => {
  const indexResponse = await request.get(`${baseURL}/index.json`);
  expect(indexResponse.ok()).toBeTruthy();

  const index = (await indexResponse.json()) as StorybookIndex;
  const storyIds = Object.values(index.entries)
    .filter(entry => entry.type === 'story')
    .filter(entry => !(entry.tags ?? []).includes('skip-visual'))
    .map(entry => entry.id)
    .sort();

  for (const storyId of storyIds) {
    await page.goto(`/iframe.html?id=${storyId}&viewMode=story`, { waitUntil: 'networkidle' });
    await page.waitForSelector('#storybook-root > *');
    await page.addStyleTag({ content: disableMotionStyles });
    await page.evaluate(async () => {
      if ('fonts' in document) {
        await (document as Document & { fonts: FontFaceSet }).fonts.ready;
      }
    });

    await expect(page).toHaveScreenshot(`${storyId}.png`, {
      fullPage: false,
      animations: 'disabled',
    });
  }
});
