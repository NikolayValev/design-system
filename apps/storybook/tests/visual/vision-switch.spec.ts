import { expect, test } from '@playwright/test';

type VisionId = 'museum' | 'brutalist' | 'immersive';

interface ProbeResult {
  appliedVision: string | null;
  backgroundColor: string;
  backdropFilter: string;
  boxShadow: string;
  contentFilter: string;
  hasImmersiveLayer: boolean;
  hasLightLeak: boolean;
  hasPaperOverlay: boolean;
  itemTransitionDuration: string;
  marginTop: string;
  textShadow: string;
  topLevelSpanCount: number;
}

const visions: VisionId[] = ['museum', 'brutalist', 'immersive'];

function storyUrl(storyId: string, vision: VisionId): string {
  return `/iframe.html?id=${storyId}&viewMode=story&globals=vision:${vision}`;
}

async function probe(page: Parameters<typeof test>[1]['page'], selector: string): Promise<ProbeResult> {
  await page.waitForSelector(selector);
  return page.evaluate(probeSelector => {
    const root = document.querySelector(probeSelector) as HTMLElement | null;
    if (!root) {
      throw new Error(`Probe target not found: ${probeSelector}`);
    }

    const rootStyle = window.getComputedStyle(root);
    const mediaContent = root.firstElementChild
      ? window.getComputedStyle(root.firstElementChild as HTMLElement)
      : null;
    const firstOrbItem = root.querySelector('ul li:first-child button, ul li:first-child a') as
      | HTMLElement
      | null;
    const firstOrbItemStyle = firstOrbItem ? window.getComputedStyle(firstOrbItem) : null;

    return {
      appliedVision: document.documentElement.getAttribute('data-vde-vision'),
      backgroundColor: rootStyle.backgroundColor,
      backdropFilter: rootStyle.backdropFilter || (rootStyle as CSSStyleDeclaration & { webkitBackdropFilter?: string }).webkitBackdropFilter || 'none',
      boxShadow: rootStyle.boxShadow,
      contentFilter: mediaContent?.filter ?? 'none',
      hasImmersiveLayer: Boolean(root.querySelector(':scope > span[style*="radial-gradient"]')),
      hasLightLeak: Boolean(root.querySelector(':scope > span[style*="vde-media-light-leak"]')),
      hasPaperOverlay: Boolean(root.querySelector(':scope > span[style*="vde-gallery-paper-overlay-opacity"]')),
      itemTransitionDuration: firstOrbItemStyle?.transitionDuration.split(',')[0]?.trim() ?? '',
      marginTop: rootStyle.marginTop,
      textShadow: rootStyle.textShadow,
      topLevelSpanCount: root.querySelectorAll(':scope > span').length,
    };
  }, selector);
}

test.describe('vision switch consistency', () => {
  test('EditorialHeader reacts to all core visions', async ({ page }) => {
    for (const vision of visions) {
      await page.goto(storyUrl('design-system-editorialheader--playground', vision), { waitUntil: 'networkidle' });
      const result = await probe(page, '[data-vde-component="editorial-header"]');

      expect(result.appliedVision).toBe(vision);

      if (vision === 'museum') {
        expect(result.marginTop).not.toBe('0px');
      } else if (vision === 'brutalist') {
        expect(result.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
      } else {
        expect(result.textShadow).not.toBe('none');
      }
    }
  });

  test('GalleryStage material ornaments shift by vision', async ({ page }) => {
    for (const vision of visions) {
      await page.goto(storyUrl('design-system-gallerystage--playground', vision), { waitUntil: 'networkidle' });
      const result = await probe(page, '[data-vde-component="gallery-stage"]');

      expect(result.appliedVision).toBe(vision);

      if (vision === 'museum') {
        expect(result.hasPaperOverlay).toBeTruthy();
      } else if (vision === 'brutalist') {
        expect(result.boxShadow).toContain('4px 4px');
      } else {
        expect(result.backdropFilter).toContain('blur(');
        expect(result.hasImmersiveLayer).toBeTruthy();
      }
    }
  });

  test('MediaFrame effects map to each vision', async ({ page }) => {
    for (const vision of visions) {
      await page.goto(storyUrl('design-system-mediaframe--playground', vision), { waitUntil: 'networkidle' });
      const result = await probe(page, '[data-vde-component="media-frame"]');

      expect(result.appliedVision).toBe(vision);

      if (vision === 'museum') {
        expect(result.boxShadow).toContain('inset');
      } else if (vision === 'brutalist') {
        expect(result.contentFilter).not.toBe('none');
      } else {
        expect(result.hasLightLeak).toBeTruthy();
      }
    }
  });

  test('AtmosphereProvider mode auto resolves archive vs nexus', async ({ page }) => {
    for (const vision of visions) {
      await page.goto(storyUrl('design-system-atmosphereprovider--playground', vision), { waitUntil: 'networkidle' });
      const result = await probe(page, '[data-vde-component="atmosphere-provider"]');

      expect(result.appliedVision).toBe(vision);

      if (vision === 'immersive') {
        expect(result.topLevelSpanCount).toBe(1);
      } else {
        expect(result.topLevelSpanCount).toBe(2);
      }
    }
  });

  test('NavigationOrb physics differ by vision', async ({ page }) => {
    for (const vision of visions) {
      await page.goto(storyUrl('design-system-navigationorb--playground', vision), { waitUntil: 'networkidle' });
      const result = await probe(page, '[data-vde-component="navigation-orb"]');

      expect(result.appliedVision).toBe(vision);

      if (vision === 'brutalist') {
        expect(result.itemTransitionDuration).toBe('0s');
      } else {
        expect(result.itemTransitionDuration).not.toBe('0s');
      }
    }
  });
});
