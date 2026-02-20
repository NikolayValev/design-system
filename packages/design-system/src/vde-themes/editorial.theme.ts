import type { VisionTheme } from '../vde-core';

export const editorialTheme: VisionTheme = {
  id: 'editorial',
  name: 'Editorial',
  archetype: 'Print Modernism',
  description: 'Typographic rigor inspired by print grids and Swiss compositional logic.',
  colors: {
    background: 'oklch(0.99 0 0)',
    foreground: 'oklch(0.22 0.02 250)',
    surface: 'oklch(1 0 0)',
    surfaceForeground: 'oklch(0.22 0.02 250)',
    accent: 'oklch(0.56 0.19 22)',
    accentForeground: 'oklch(0.99 0 0)',
    secondary: 'oklch(0.9 0.01 250)',
    secondaryForeground: 'oklch(0.24 0.02 250)',
    muted: 'oklch(0.94 0.01 250)',
    mutedForeground: 'oklch(0.46 0.02 250)',
    border: 'oklch(0.84 0.01 250)',
    input: 'oklch(0.95 0.01 250)',
    ring: 'oklch(0.57 0.18 22)',
    danger: 'oklch(0.55 0.22 24)',
    dangerForeground: 'oklch(0.99 0 0)',
    chart1: 'oklch(0.57 0.18 22)',
    chart2: 'oklch(0.64 0.14 250)',
    chart3: 'oklch(0.65 0.16 110)',
    chart4: 'oklch(0.7 0.14 70)',
    chart5: 'oklch(0.63 0.14 315)',
  },
  artisticPillars: {
    typographyArchitecture: {
      scale: { body: '1', display: '1.28' },
      lineHeight: { tight: '1.08', normal: '1.42', relaxed: '1.65' },
      fontStack: {
        body: '"Inter", "Helvetica Neue", sans-serif',
        display: '"DM Serif Display", "Times New Roman", serif',
        mono: '"JetBrains Mono", "Consolas", monospace',
      },
      letterSpacing: { tight: '-0.02em', normal: '-0.005em', wide: '0.02em' },
    },
    surfacePhysics: {
      transparency: '1',
      blur: '0px',
      texture: 'linear-gradient(180deg, rgba(0, 0, 0, 0.01), rgba(0, 0, 0, 0.01))',
      grain: '0',
    },
    boundaryLogic: {
      borderWeight: '1px',
      radius: '0.3rem',
      sharpness: '0.8',
    },
    shadowLightEngine: {
      hardOffset: '2px 2px 0 rgba(12, 23, 41, 0.18)',
      neonGlow: '0 0 0 rgba(0, 0, 0, 0)',
      ambientOcclusion: '0 10px 24px -18px rgba(0, 0, 0, 0.2)',
    },
    motionSignature: {
      duration: { fast: '110ms', normal: '170ms', slow: '280ms' },
      easing: { standard: 'cubic-bezier(0.25, 0.7, 0.2, 1)', emphatic: 'cubic-bezier(0.17, 1, 0.3, 1)' },
      physics: 'grid-snap',
    },
  },
  ornaments: {
    grain: false,
    glow: false,
    texture: false,
  },
};

