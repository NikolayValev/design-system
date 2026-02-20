import type { VisionTheme } from '../vde-core';

export const auroraTheme: VisionTheme = {
  id: 'aurora',
  name: 'Aurora',
  archetype: 'Polar Spectrum',
  description: 'Cold luminous color shifts with glass-like surfaces and soft glow.',
  colors: {
    background: 'oklch(0.2 0.04 230)',
    foreground: 'oklch(0.95 0.02 230)',
    surface: 'oklch(0.26 0.05 230)',
    surfaceForeground: 'oklch(0.95 0.02 230)',
    accent: 'oklch(0.74 0.2 185)',
    accentForeground: 'oklch(0.16 0.04 230)',
    secondary: 'oklch(0.71 0.18 300)',
    secondaryForeground: 'oklch(0.16 0.04 230)',
    muted: 'oklch(0.31 0.05 230)',
    mutedForeground: 'oklch(0.81 0.04 230)',
    border: 'oklch(0.43 0.08 232)',
    input: 'oklch(0.34 0.06 230)',
    ring: 'oklch(0.75 0.2 185)',
    danger: 'oklch(0.66 0.22 24)',
    dangerForeground: 'oklch(0.16 0.04 230)',
    chart1: 'oklch(0.75 0.2 185)',
    chart2: 'oklch(0.74 0.2 300)',
    chart3: 'oklch(0.77 0.19 100)',
    chart4: 'oklch(0.72 0.2 45)',
    chart5: 'oklch(0.72 0.19 255)',
  },
  artisticPillars: {
    typographyArchitecture: {
      scale: { body: '1', display: '1.14' },
      lineHeight: { tight: '1.18', normal: '1.48', relaxed: '1.74' },
      fontStack: {
        body: '"Manrope", "Inter", sans-serif',
        display: '"Sora", "Manrope", sans-serif',
        mono: '"IBM Plex Mono", "Consolas", monospace',
      },
      letterSpacing: { tight: '-0.01em', normal: '0em', wide: '0.03em' },
    },
    surfacePhysics: {
      transparency: '0.8',
      blur: '16px',
      texture:
        'radial-gradient(circle at 15% 15%, rgba(61, 232, 255, 0.34), transparent 42%), radial-gradient(circle at 90% 0%, rgba(196, 97, 255, 0.3), transparent 48%)',
      grain: '0.03',
    },
    boundaryLogic: {
      borderWeight: '1px',
      radius: '1rem',
      sharpness: '0.2',
    },
    shadowLightEngine: {
      hardOffset: '0 0 0 rgba(0, 0, 0, 0)',
      neonGlow: '0 0 38px rgba(98, 224, 255, 0.4)',
      ambientOcclusion: '0 16px 40px -20px rgba(0, 0, 0, 0.62)',
    },
    motionSignature: {
      duration: { fast: '170ms', normal: '250ms', slow: '410ms' },
      easing: { standard: 'cubic-bezier(0.2, 0.7, 0.2, 1)', emphatic: 'cubic-bezier(0.21, 1, 0.35, 1)' },
      physics: 'spectral-float',
    },
  },
  ornaments: {
    grain: true,
    glow: true,
    texture: true,
  },
};

