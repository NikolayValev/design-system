import { expect, test } from '@playwright/test';
import { expandedVisionThemeIds } from '@nikolayvalev/design-system';

const expandedVisions = [...expandedVisionThemeIds];

function storyUrl(storyId: string, vision: string): string {
  return `/iframe.html?id=${storyId}&viewMode=story&globals=vision:${vision}`;
}

interface VisionVarProbe {
  archiveOpacity: string;
  atmosphereGradient: string;
  borderWidth: string;
  boundaryRadius: string;
  cardBobAnimation: string;
  componentTilt: string;
  motionDurationNormal: string;
  scanlineOpacity: string;
  shadowAmbient: string;
  surfaceBlur: string;
  surfaceTexture: string;
  tapeOpacity: string;
  tornClipPath: string;
  vdeAccent: string;
}

async function readVisionVars(page: Parameters<typeof test>[1]['page']): Promise<VisionVarProbe> {
  return page.evaluate(() => {
    const root = window.getComputedStyle(document.documentElement);

    const read = (name: string) => root.getPropertyValue(name).trim();

    return {
      archiveOpacity: read('--vde-atmosphere-archive-opacity'),
      atmosphereGradient: read('--vde-atmosphere-mesh-gradient'),
      borderWidth: read('--vde-border-width'),
      boundaryRadius: read('--vde-boundary-radius'),
      cardBobAnimation: read('--vde-card-bob-animation'),
      componentTilt: read('--vde-component-tilt'),
      motionDurationNormal: read('--vde-motion-duration-normal'),
      scanlineOpacity: read('--vde-media-scanline-opacity'),
      shadowAmbient: read('--vde-shadow-ambient'),
      surfaceBlur: read('--vde-surface-blur'),
      surfaceTexture: read('--vde-surface-texture'),
      tapeOpacity: read('--vde-gallery-tape-opacity'),
      tornClipPath: read('--vde-gallery-torn-clip-path'),
      vdeAccent: read('--vde-color-accent'),
    };
  });
}

test.describe('expanded vision integration', () => {
  test('all 10 expanded styles are selectable and expose expected token contract values', async ({ page }) => {
    test.setTimeout(Math.max(180000, expandedVisions.length * 10000));

    for (const vision of expandedVisions) {
      await page.goto(storyUrl('design-system-button--playground', vision), { waitUntil: 'networkidle' });
      await expect
        .poll(
          async () => page.evaluate(() => document.documentElement.getAttribute('data-vde-vision')),
          { timeout: 5000 },
        )
        .toBe(vision);

      const vars = await readVisionVars(page);
      expect(vars.surfaceTexture.length).toBeGreaterThan(0);
      expect(vars.atmosphereGradient.length).toBeGreaterThan(0);

      if (vision === 'swiss_international') {
        expect(vars.borderWidth).toBe('1px');
      }

      if (vision === 'raw_data') {
        expect(vars.vdeAccent.toLowerCase()).toBe('#ccff00');
      }

      if (vision === 'the_archive') {
        expect(vars.motionDurationNormal).toBe('800ms');
      }

      if (vision === 'the_ether') {
        expect(vars.surfaceBlur).toBe('20px');
      }

      if (vision === 'solarpunk') {
        expect(vars.boundaryRadius).toBe('40px');
      }

      if (vision === 'y2k_chrome') {
        expect(vars.scanlineOpacity).not.toBe('0');
      }

      if (vision === 'deconstruct') {
        expect(vars.componentTilt).toBe('-1deg');
      }

      if (vision === 'ma_minimalism') {
        expect(vars.borderWidth).toBe('0px');
        expect(vars.shadowAmbient).toBe('none');
      }

      if (vision === 'clay_soft') {
        expect(vars.cardBobAnimation).toContain('vde-card-bob');
      }

      if (vision === 'zine_collage') {
        expect(vars.tapeOpacity).not.toBe('0');
        expect(vars.tornClipPath).not.toBe('none');
      }

      expect(Number.parseFloat(vars.archiveOpacity || '0')).toBeGreaterThanOrEqual(0);
    }
  });

  test('section templates render for all 10 expanded styles', async ({ page }) => {
    const sectionStories = [
      { id: 'design-system-sections-herosection--playground', selector: '[data-vde-component="section-hero"]' },
      { id: 'design-system-sections-featuregridsection--playground', selector: '[data-vde-component="section-feature-grid"]' },
      { id: 'design-system-sections-metricstripsection--playground', selector: '[data-vde-component="section-metric-strip"]' },
    ] as const;

    for (const vision of expandedVisions) {
      for (const story of sectionStories) {
        await page.goto(storyUrl(story.id, vision), { waitUntil: 'networkidle' });
        await page.waitForSelector(story.selector);
        await expect
          .poll(
            async () => page.evaluate(() => document.documentElement.getAttribute('data-vde-vision')),
            { timeout: 5000 },
          )
          .toBe(vision);
      }
    }
  });

  test('page templates render for all 10 expanded styles', async ({ page }) => {
    const pageStories = [
      { id: 'design-system-pages-marketinglandingpage--playground', selector: '[data-vde-component="page-marketing-landing"]' },
      { id: 'design-system-pages-productshowcasepage--playground', selector: '[data-vde-component="page-product-showcase"]' },
    ] as const;

    for (const vision of expandedVisions) {
      for (const story of pageStories) {
        await page.goto(storyUrl(story.id, vision), { waitUntil: 'networkidle' });
        await page.waitForSelector(story.selector);
        await expect
          .poll(
            async () => page.evaluate(() => document.documentElement.getAttribute('data-vde-vision')),
            { timeout: 5000 },
          )
          .toBe(vision);
      }
    }
  });
});
