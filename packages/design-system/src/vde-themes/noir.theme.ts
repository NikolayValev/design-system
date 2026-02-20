import type { VisionTheme } from '../vde-core';

export const noirTheme: VisionTheme = {
  id: 'noir',
  name: 'Noir',
  archetype: 'Cinematic Contrast',
  description: 'Monochrome palette with cold highlights and dramatic depth.',
  colors: {
    background: 'oklch(0.14 0.01 260)',
    foreground: 'oklch(0.93 0.01 255)',
    surface: 'oklch(0.2 0.01 260)',
    surfaceForeground: 'oklch(0.93 0.01 255)',
    accent: 'oklch(0.73 0.11 252)',
    accentForeground: 'oklch(0.14 0.01 260)',
    secondary: 'oklch(0.31 0.02 255)',
    secondaryForeground: 'oklch(0.92 0.01 255)',
    muted: 'oklch(0.25 0.01 255)',
    mutedForeground: 'oklch(0.68 0.02 255)',
    border: 'oklch(0.35 0.02 255)',
    input: 'oklch(0.26 0.02 255)',
    ring: 'oklch(0.74 0.12 252)',
    danger: 'oklch(0.62 0.2 26)',
    dangerForeground: 'oklch(0.94 0.01 255)',
    chart1: 'oklch(0.7 0.12 252)',
    chart2: 'oklch(0.72 0.15 180)',
    chart3: 'oklch(0.74 0.12 80)',
    chart4: 'oklch(0.64 0.15 22)',
    chart5: 'oklch(0.65 0.12 320)',
  },
  artisticPillars: {
    typographyArchitecture: {
      scale: { body: '1', display: '1.14' },
      lineHeight: { tight: '1.16', normal: '1.45', relaxed: '1.7' },
      fontStack: {
        body: '"Manrope", "Arial", sans-serif',
        display: '"Playfair Display", "Georgia", serif',
        mono: '"IBM Plex Mono", "Consolas", monospace',
      },
      letterSpacing: { tight: '-0.015em', normal: '0.005em', wide: '0.045em' },
    },
    surfacePhysics: {
      transparency: '0.9',
      blur: '8px',
      texture: 'linear-gradient(140deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0))',
      grain: '0.02',
    },
    boundaryLogic: {
      borderWeight: '1px',
      radius: '0.45rem',
      sharpness: '0.5',
    },
    shadowLightEngine: {
      hardOffset: '0 1px 0 rgba(255, 255, 255, 0.12)',
      neonGlow: '0 0 24px rgba(151, 179, 255, 0.22)',
      ambientOcclusion: '0 18px 42px -24px rgba(0, 0, 0, 0.8)',
    },
    motionSignature: {
      duration: { fast: '120ms', normal: '180ms', slow: '280ms' },
      easing: { standard: 'cubic-bezier(0.2, 0.65, 0.2, 1)', emphatic: 'cubic-bezier(0.16, 1, 0.3, 1)' },
      physics: 'filmic-cut',
    },
  },
  ornaments: {
    grain: true,
    glow: false,
    texture: true,
  },
};

