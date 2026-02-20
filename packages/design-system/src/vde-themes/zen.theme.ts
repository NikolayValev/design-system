import type { VisionTheme } from '../vde-core';

export const zenTheme: VisionTheme = {
  id: 'zen',
  name: 'Zen Garden',
  archetype: 'Calm Minimal',
  description: 'Quiet palette, soft boundaries, and smooth understated motion.',
  colors: {
    background: 'oklch(0.97 0.01 145)',
    foreground: 'oklch(0.29 0.03 160)',
    surface: 'oklch(0.99 0.01 150)',
    surfaceForeground: 'oklch(0.28 0.03 160)',
    accent: 'oklch(0.62 0.11 170)',
    accentForeground: 'oklch(0.98 0.01 150)',
    secondary: 'oklch(0.9 0.03 150)',
    secondaryForeground: 'oklch(0.31 0.03 160)',
    muted: 'oklch(0.93 0.02 150)',
    mutedForeground: 'oklch(0.46 0.03 160)',
    border: 'oklch(0.86 0.02 150)',
    input: 'oklch(0.95 0.01 150)',
    ring: 'oklch(0.6 0.11 170)',
    danger: 'oklch(0.6 0.17 26)',
    dangerForeground: 'oklch(0.98 0.01 150)',
    chart1: 'oklch(0.62 0.11 170)',
    chart2: 'oklch(0.66 0.12 140)',
    chart3: 'oklch(0.7 0.1 90)',
    chart4: 'oklch(0.58 0.09 200)',
    chart5: 'oklch(0.62 0.1 45)',
  },
  artisticPillars: {
    typographyArchitecture: {
      scale: { body: '0.98', display: '1.1' },
      lineHeight: { tight: '1.24', normal: '1.6', relaxed: '1.84' },
      fontStack: {
        body: '"Noto Sans", "Hiragino Sans", sans-serif',
        display: '"Noto Serif", "Georgia", serif',
        mono: '"IBM Plex Mono", "Consolas", monospace',
      },
      letterSpacing: { tight: '-0.005em', normal: '0.01em', wide: '0.05em' },
    },
    surfacePhysics: {
      transparency: '0.94',
      blur: '2px',
      texture: 'linear-gradient(180deg, rgba(164, 179, 169, 0.12), rgba(164, 179, 169, 0.02))',
      grain: '0.02',
    },
    boundaryLogic: {
      borderWeight: '1px',
      radius: '1rem',
      sharpness: '0.15',
    },
    shadowLightEngine: {
      hardOffset: '1px 1px 0 rgba(112, 126, 117, 0.14)',
      neonGlow: '0 0 0 rgba(0, 0, 0, 0)',
      ambientOcclusion: '0 10px 24px -18px rgba(88, 101, 94, 0.26)',
    },
    motionSignature: {
      duration: { fast: '170ms', normal: '250ms', slow: '380ms' },
      easing: { standard: 'cubic-bezier(0.2, 0.7, 0.2, 1)', emphatic: 'cubic-bezier(0.25, 1, 0.3, 1)' },
      physics: 'float-soft',
    },
  },
  ornaments: {
    grain: true,
    glow: false,
    texture: true,
  },
};

