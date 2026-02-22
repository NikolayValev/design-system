import type { VisionTheme } from '../vde-core';

export const deconstructTheme: VisionTheme = {
  id: 'deconstruct',
  name: 'Deconstruct',
  archetype: 'The Overlap',
  description: 'Avant-garde overlap language with tilted composition and intentionally unstable rhythm.',
  colors: {
    background: 'oklch(0.95 0.01 88)',
    foreground: 'oklch(0.18 0.02 20)',
    surface: 'oklch(0.99 0.008 80)',
    surfaceForeground: 'oklch(0.18 0.02 20)',
    accent: 'oklch(0.58 0.22 18)',
    accentForeground: 'oklch(0.98 0.01 86)',
    secondary: 'oklch(0.21 0.01 20)',
    secondaryForeground: 'oklch(0.97 0.01 86)',
    muted: 'oklch(0.9 0.015 70)',
    mutedForeground: 'oklch(0.34 0.03 24)',
    border: 'oklch(0.2 0.01 20)',
    input: 'oklch(0.95 0.01 80)',
    ring: 'oklch(0.6 0.21 18)',
    danger: 'oklch(0.56 0.23 24)',
    dangerForeground: 'oklch(0.97 0.01 86)',
    chart1: 'oklch(0.58 0.22 18)',
    chart2: 'oklch(0.62 0.2 240)',
    chart3: 'oklch(0.7 0.18 82)',
    chart4: 'oklch(0.56 0.2 152)',
    chart5: 'oklch(0.54 0.18 330)',
  },
  artisticPillars: {
    typographyArchitecture: {
      scale: { body: '1.12', display: '1.3' },
      lineHeight: { tight: '1.02', normal: '1.36', relaxed: '1.62' },
      fontStack: {
        body: '"Space Grotesk", "Helvetica Neue", sans-serif',
        display: '"Teko", "Bebas Neue", sans-serif',
        mono: '"JetBrains Mono", "Consolas", monospace',
      },
      letterSpacing: { tight: '-0.035em', normal: '-0.01em', wide: '0.05em' },
    },
    surfacePhysics: {
      transparency: '0.98',
      blur: '0px',
      texture:
        'linear-gradient(128deg, rgba(0, 0, 0, 0.04), transparent 36%), linear-gradient(74deg, rgba(190, 24, 24, 0.08), transparent 42%)',
      grain: '0.04',
    },
    boundaryLogic: {
      borderWeight: '1px',
      radius: '0.1rem',
      sharpness: '0.94',
    },
    shadowLightEngine: {
      hardOffset: '5px 5px 0 rgba(0, 0, 0, 0.55)',
      neonGlow: '0 0 0 rgba(0, 0, 0, 0)',
      ambientOcclusion: '0 14px 28px -18px rgba(0, 0, 0, 0.36)',
    },
    motionSignature: {
      duration: { fast: '180ms', normal: '260ms', slow: '430ms' },
      easing: { standard: 'cubic-bezier(0.7, -0.35, 0.25, 1.25)', emphatic: 'cubic-bezier(0.85, -0.45, 0.2, 1.25)' },
      physics: 'chaotic-slide',
    },
  },
  ornaments: {
    grain: true,
    glow: false,
    texture: true,
  },
};
