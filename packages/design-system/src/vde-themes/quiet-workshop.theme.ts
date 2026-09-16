import type { VisionTheme } from "../vde-core";

/**
 * Quiet Workshop — ported from the design record that `PersonalRouter` had been
 * carrying locally (`PersonalRouter/DESIGN.md`). It lived there as an ~80-line
 * override block because v1 of this package shipped no dark palette; it belongs
 * here, as a vision, so the consumer can delete the override entirely.
 *
 * Its named rules, in the order they matter:
 *
 *   The One Ink Rule       Fired Clay is the only chromatic colour. It never
 *                          segments, categorises or decorates. A second hue
 *                          introduced to solve a hierarchy problem is the exact
 *                          failure this rule exists to prevent — use type,
 *                          weight, position or shape instead.
 *   The Warm Cast Rule     No neutral has zero chroma. Every background, border
 *                          and text colour carries 0.003–0.018 chroma at hue
 *                          55–75. A chroma-0 neutral looks correct in isolation
 *                          and grey and wrong next to everything around it.
 *   The Nothing Rises Rule Nothing lifts, floats or glows. Depth is a 1px seam.
 *                          State is expressed by border colour, not elevation.
 *   The Frame Not Fill     Containers are defined by their border, not a fill.
 *                          A surface differs from the page by ~1% lightness.
 *   Serif Is Structural    The display face marks headings and nothing else.
 *                          Seeing the serif is how a reader knows what a heading
 *                          is, so decorative use destroys the only structural
 *                          signal the type system has.
 */
export const quietWorkshopTheme: VisionTheme = {
  id: "quiet_workshop",
  name: "Quiet Workshop",
  archetype: "Unbleached Stock",
  description:
    "A warm, flat, typographic system where one fired-clay accent and a hairline rule do all the signalling.",
  family: "editorial",
  tagline:
    "A workshop, not a showroom — one accent, one seam, and type doing the rest.",
  summary:
    "Quiet Workshop treats the page as material rather than screen: unbleached paper neutrals that were never chemically whitened, and a single fired-clay accent that appears only where something must be signalled. It stays flat by design — a permanent 1px seam is the entire depth vocabulary — so hierarchy falls to typography and to the disciplined use of one colour.",
  bestFor: [
    "Personal sites and portfolios",
    "Case studies and written work",
    "Products that would rather be read than looked at",
  ],
  mood: ["warm", "restrained", "material", "deliberate"],
  defaultMode: "light",
  colors: {
    light: {
      background: "oklch(0.992 0.004 75)",
      foreground: "oklch(0.21 0.012 55)",
      surface: "oklch(1 0.003 75)",
      surfaceForeground: "oklch(0.21 0.012 55)",
      accent: "oklch(0.565 0.14 40)",
      accentForeground: "oklch(0.985 0.01 75)",
      secondary: "oklch(0.96 0.01 70)",
      secondaryForeground: "oklch(0.27 0.012 55)",
      muted: "oklch(0.96 0.008 70)",
      mutedForeground: "oklch(0.52 0.018 55)",
      border: "oklch(0.9 0.011 65)",
      input: "oklch(0.9 0.011 65)",
      ring: "oklch(0.59 0.14 40)",
      danger: "oklch(0.55 0.21 27)",
      dangerForeground: "oklch(0.985 0.01 75)",
      chart1: "oklch(0.59 0.14 40)",
      chart2: "oklch(0.7 0.11 46)",
      chart3: "oklch(0.47 0.12 38)",
      chart4: "oklch(0.79 0.07 52)",
      chart5: "oklch(0.36 0.09 36)",
    },
    dark: {
      background: "oklch(0.175 0.008 55)",
      foreground: "oklch(0.96 0.006 75)",
      surface: "oklch(0.205 0.009 55)",
      surfaceForeground: "oklch(0.96 0.006 75)",
      accent: "oklch(0.67 0.15 42)",
      accentForeground: "oklch(0.18 0.01 55)",
      secondary: "oklch(0.27 0.012 55)",
      secondaryForeground: "oklch(0.96 0.006 75)",
      muted: "oklch(0.27 0.012 55)",
      mutedForeground: "oklch(0.72 0.012 65)",
      border: "oklch(0.29 0.012 55)",
      input: "oklch(0.29 0.012 55)",
      ring: "oklch(0.67 0.15 42)",
      danger: "oklch(0.64 0.19 27)",
      dangerForeground: "oklch(0.18 0.01 55)",
      chart1: "oklch(0.67 0.15 42)",
      chart2: "oklch(0.78 0.11 48)",
      chart3: "oklch(0.56 0.14 40)",
      chart4: "oklch(0.87 0.07 56)",
      chart5: "oklch(0.45 0.12 38)",
    },
  },
  artisticPillars: {
    typographyArchitecture: {
      scale: { body: "1", display: "1.4" },
      lineHeight: { tight: "1.05", normal: "1.625", relaxed: "1.75" },
      fontStack: {
        body: '"Inter", "Helvetica Neue", system-ui, sans-serif',
        display: '"Playfair Display", Georgia, serif',
        mono: '"IBM Plex Mono", "Consolas", monospace',
      },
      letterSpacing: { tight: "-0.025em", normal: "0em", wide: "0.14em" },
    },
    surfacePhysics: {
      transparency: "1",
      blur: "0px",
      texture: "none",
      grain: "0",
    },
    boundaryLogic: {
      borderWeight: "1px",
      radius: {
        surface: "0.5rem",
        control: "0.375rem",
        pill: "9999px",
      },
      sharpness: "0.35",
    },
    shadowLightEngine: {
      hardOffset: "0 0 0 rgba(0, 0, 0, 0)",
      neonGlow: "0 0 0 rgba(0, 0, 0, 0)",
      ambientOcclusion: "0 1px 2px hsl(28 25% 12% / 0.12)",
    },
    motionSignature: {
      duration: { fast: "120ms", normal: "200ms", slow: "320ms" },
      easing: {
        standard: "cubic-bezier(0.2, 0.7, 0.2, 1)",
        emphatic: "cubic-bezier(0.17, 1, 0.3, 1)",
      },
      physics: "flat-settle",
    },
  },
  ornaments: {
    grain: false,
    glow: false,
    texture: false,
  },
};
