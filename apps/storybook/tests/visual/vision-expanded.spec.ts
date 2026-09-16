import { expect, test } from "@playwright/test";

const expandedVisions = [
  "editorial",
  "swiss_international",
  "terminal",
  "immersive",
  "solarpunk",
];

function storyUrl(storyId: string, vision: string): string {
  return `/iframe.html?id=${storyId}&viewMode=story&globals=vision:${vision}`;
}

interface VisionVarProbe {
  archiveOpacity: string;
  atmosphereGradient: string;
  borderWidth: string;
  boundaryRadius: string;
  radiusSurface: string;
  radiusControl: string;
  cardBobAnimation: string;
  fontSizeUi: string;
  fontSizeBody: string;
  lineHeightNormal: string;
  measure: string;
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

async function readVisionVars(
  page: Parameters<typeof test>[1]["page"],
): Promise<VisionVarProbe> {
  return page.evaluate(() => {
    const root = window.getComputedStyle(document.documentElement);

    const read = (name: string) => root.getPropertyValue(name).trim();

    return {
      archiveOpacity: read("--vde-atmosphere-archive-opacity"),
      atmosphereGradient: read("--vde-atmosphere-mesh-gradient"),
      borderWidth: read("--vde-border-width"),
      boundaryRadius: read("--vde-boundary-radius"),
      radiusSurface: read("--vde-radius-surface"),
      radiusControl: read("--vde-radius-control"),
      cardBobAnimation: read("--vde-card-bob-animation"),
      fontSizeUi: read("--vde-font-size-ui"),
      fontSizeBody: read("--vde-font-size-body"),
      lineHeightNormal: read("--vde-line-height-normal"),
      measure: read("--vde-measure"),
      componentTilt: read("--vde-component-tilt"),
      motionDurationNormal: read("--vde-motion-duration-normal"),
      scanlineOpacity: read("--vde-media-scanline-opacity"),
      shadowAmbient: read("--vde-shadow-ambient"),
      surfaceBlur: read("--vde-surface-blur"),
      surfaceTexture: read("--vde-surface-texture"),
      tapeOpacity: read("--vde-gallery-tape-opacity"),
      tornClipPath: read("--vde-gallery-torn-clip-path"),
      vdeAccent: read("--vde-color-accent"),
    };
  });
}

test.describe("expanded vision integration", () => {
  test("all expanded styles are selectable and expose expected token contract values", async ({
    page,
  }) => {
    test.setTimeout(Math.max(180000, expandedVisions.length * 10000));

    for (const vision of expandedVisions) {
      await page.goto(storyUrl("components-button--playground", vision), {
        waitUntil: "networkidle",
      });
      await expect
        .poll(
          async () =>
            page.evaluate(() =>
              document.documentElement.getAttribute("data-vde-vision"),
            ),
          { timeout: 5000 },
        )
        .toBe(vision);

      const vars = await readVisionVars(page);
      expect(vars.surfaceTexture.length).toBeGreaterThan(0);
      expect(vars.atmosphereGradient.length).toBeGreaterThan(0);

      // The floors, asserted in the browser rather than only over theme source:
      // whatever a vision's character is, these hold in all of them. A custom
      // property reads back as its declared value, so these are rem, not px —
      // 0.875rem is the 14px interactive floor and 1rem is the 16px body floor.
      expect(vars.fontSizeUi).toMatch(/rem$/);
      expect(Number.parseFloat(vars.fontSizeUi)).toBeGreaterThanOrEqual(0.875);
      expect(vars.fontSizeBody).toMatch(/rem$/);
      expect(Number.parseFloat(vars.fontSizeBody)).toBeGreaterThanOrEqual(1);
      expect(Number.parseFloat(vars.lineHeightNormal)).toBeGreaterThanOrEqual(
        1.5,
      );
      expect(vars.radiusSurface.length).toBeGreaterThan(0);
      expect(vars.measure.length).toBeGreaterThan(0);

      if (vision === "swiss_international") {
        expect(vars.borderWidth).toBe("1px");
      }

      if (vision === "solarpunk") {
        // Was pinned to the old single 40px radius. The radius is a scale now,
        // and 40px on a card squeezed its content, so the organic softness lives
        // on surfaces while controls step down.
        expect(vars.radiusSurface).toBe("1.25rem");
        expect(vars.radiusControl).toBe("1rem");
      }

      if (vision === "y2k_chrome") {
        expect(vars.scanlineOpacity).not.toBe("0");
      }

      if (vision === "clay_soft") {
        // The bob used to run on every card, forever, with nothing to trigger it.
        expect(vars.cardBobAnimation).toBe("none");
      }

      expect(
        Number.parseFloat(vars.archiveOpacity || "0"),
      ).toBeGreaterThanOrEqual(0);
    }
  });

  test("section templates render for all expanded styles", async ({ page }) => {
    const sectionStories = [
      {
        id: "showcase-sections-herosection--playground",
        selector: '[data-vde-component="section-hero"]',
      },
      {
        id: "showcase-sections-featuregridsection--playground",
        selector: '[data-vde-component="section-feature-grid"]',
      },
      {
        id: "showcase-sections-metricstripsection--playground",
        selector: '[data-vde-component="section-metric-strip"]',
      },
    ] as const;

    for (const vision of expandedVisions) {
      for (const story of sectionStories) {
        await page.goto(storyUrl(story.id, vision), {
          waitUntil: "networkidle",
        });
        await page.waitForSelector(story.selector);
        await expect
          .poll(
            async () =>
              page.evaluate(() =>
                document.documentElement.getAttribute("data-vde-vision"),
              ),
            { timeout: 5000 },
          )
          .toBe(vision);
      }
    }
  });

  test("page templates render for all expanded styles", async ({ page }) => {
    const pageStories = [
      {
        id: "showcase-pages-marketinglandingpage--playground",
        selector: '[data-vde-component="page-marketing-landing"]',
      },
      {
        id: "showcase-pages-productshowcasepage--playground",
        selector: '[data-vde-component="page-product-showcase"]',
      },
    ] as const;

    for (const vision of expandedVisions) {
      for (const story of pageStories) {
        await page.goto(storyUrl(story.id, vision), {
          waitUntil: "networkidle",
        });
        await page.waitForSelector(story.selector);
        await expect
          .poll(
            async () =>
              page.evaluate(() =>
                document.documentElement.getAttribute("data-vde-vision"),
              ),
            { timeout: 5000 },
          )
          .toBe(vision);
      }
    }
  });
});
