import type { VisionTheme } from '../vde-core';

export const theEtherTheme: VisionTheme = {
  id: 'the_ether',
  name: 'The Ether',
  archetype: 'Glassmorphism 2.0',
  description: 'Spatial glass surfaces, deep spectral fields, and luminous ambient atmosphere.',
  colors: {
    background: 'oklch(0.2 0.04 258)',
    foreground: 'oklch(0.95 0.02 248)',
    surface: 'color-mix(in oklab, oklch(0.28 0.06 256) 78%, transparent)',
    surfaceForeground: 'oklch(0.95 0.02 248)',
    accent: 'oklch(0.78 0.19 196)',
    accentForeground: 'oklch(0.16 0.04 258)',
    secondary: 'oklch(0.65 0.16 292)',
    secondaryForeground: 'oklch(0.16 0.04 258)',
    muted: 'oklch(0.31 0.05 256)',
    mutedForeground: 'oklch(0.82 0.03 248)',
    border: 'rgba(255, 255, 255, 0.2)',
    input: 'oklch(0.33 0.06 255)',
    ring: 'oklch(0.79 0.2 196)',
    danger: 'oklch(0.67 0.24 26)',
    dangerForeground: 'oklch(0.16 0.04 258)',
    chart1: 'oklch(0.79 0.2 196)',
    chart2: 'oklch(0.73 0.2 292)',
    chart3: 'oklch(0.75 0.18 140)',
    chart4: 'oklch(0.79 0.18 78)',
    chart5: 'oklch(0.72 0.19 22)',
  },
  artisticPillars: {
    typographyArchitecture: {
      scale: { body: '1', display: '1.16' },
      lineHeight: { tight: '1.14', normal: '1.46', relaxed: '1.72' },
      fontStack: {
        body: '"Manrope", "Inter", sans-serif',
        display: '"Sora", "Manrope", sans-serif',
        mono: '"IBM Plex Mono", "Consolas", monospace',
      },
      letterSpacing: { tight: '-0.015em', normal: '0em', wide: '0.03em' },
    },
    surfacePhysics: {
      transparency: '0.74',
      blur: '20px',
      texture:
        'radial-gradient(circle at 12% 10%, rgba(112, 230, 255, 0.36), transparent 44%), radial-gradient(circle at 88% 14%, rgba(171, 123, 255, 0.34), transparent 46%)',
      grain: '0.02',
    },
    boundaryLogic: {
      borderWeight: '1px',
      radius: '1.1rem',
      sharpness: '0.2',
    },
    shadowLightEngine: {
      hardOffset: '0 0 0 rgba(0, 0, 0, 0)',
      neonGlow: '0 0 38px rgba(112, 230, 255, 0.4)',
      ambientOcclusion: '0 22px 56px -24px rgba(62, 170, 255, 0.34)',
    },
    motionSignature: {
      duration: { fast: '170ms', normal: '250ms', slow: '420ms' },
      easing: { standard: 'cubic-bezier(0.2, 0.7, 0.2, 1)', emphatic: 'cubic-bezier(0.2, 1, 0.34, 1)' },
      physics: 'glass-float',
    },
  },
  ornaments: {
    grain: false,
    glow: true,
    texture: true,
  },
};
