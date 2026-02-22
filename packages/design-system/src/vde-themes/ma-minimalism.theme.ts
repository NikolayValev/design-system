import type { VisionTheme } from '../vde-core';

export const maMinimalismTheme: VisionTheme = {
  id: 'ma_minimalism',
  name: 'Ma_Minimalism',
  archetype: 'The Void',
  description: 'Silence-first composition with pure spacing, minimal strokes, and restrained Japanese typographic tension.',
  colors: {
    background: '#FCFCFC',
    foreground: 'oklch(0.2 0.01 235)',
    surface: 'oklch(0.995 0.003 240)',
    surfaceForeground: 'oklch(0.2 0.01 235)',
    accent: 'oklch(0.5 0.07 170)',
    accentForeground: 'oklch(0.98 0.004 240)',
    secondary: 'oklch(0.96 0.005 240)',
    secondaryForeground: 'oklch(0.2 0.01 235)',
    muted: 'oklch(0.98 0.004 240)',
    mutedForeground: 'oklch(0.42 0.01 235)',
    border: 'transparent',
    input: 'oklch(0.99 0.002 240)',
    ring: 'oklch(0.5 0.07 170)',
    danger: 'oklch(0.57 0.19 25)',
    dangerForeground: 'oklch(0.98 0.004 240)',
    chart1: 'oklch(0.5 0.07 170)',
    chart2: 'oklch(0.54 0.08 220)',
    chart3: 'oklch(0.58 0.07 90)',
    chart4: 'oklch(0.56 0.08 35)',
    chart5: 'oklch(0.52 0.08 300)',
  },
  artisticPillars: {
    typographyArchitecture: {
      scale: { body: '2', display: '1.12' },
      lineHeight: { tight: '1.22', normal: '1.72', relaxed: '2.05' },
      fontStack: {
        body: '"Noto Sans JP", "Hiragino Kaku Gothic ProN", "Yu Gothic", sans-serif',
        display: '"Noto Sans JP", "Hiragino Sans", sans-serif',
        mono: '"IBM Plex Mono", "Consolas", monospace',
      },
      letterSpacing: { tight: '0.02em', normal: '0.05em', wide: '0.14em' },
    },
    surfacePhysics: {
      transparency: '1',
      blur: '0px',
      texture: 'none',
      grain: '0',
    },
    boundaryLogic: {
      borderWeight: '0px',
      radius: '0px',
      sharpness: '1',
    },
    shadowLightEngine: {
      hardOffset: 'none',
      neonGlow: 'none',
      ambientOcclusion: 'none',
    },
    motionSignature: {
      duration: { fast: '220ms', normal: '360ms', slow: '540ms' },
      easing: { standard: 'cubic-bezier(0.33, 1, 0.68, 1)', emphatic: 'cubic-bezier(0.33, 1, 0.68, 1)' },
      physics: 'silent-space',
    },
  },
  ornaments: {
    grain: false,
    glow: false,
    texture: false,
  },
};
