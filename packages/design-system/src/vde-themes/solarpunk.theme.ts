import type { VisionTheme } from '../vde-core';

export const solarpunkTheme: VisionTheme = {
  id: 'solarpunk',
  name: 'Solarpunk',
  archetype: 'Optimistic Ecology',
  description: 'Organic optimistic technology with curved super-ellipses and atmospheric living gradients.',
  colors: {
    background: 'oklch(0.95 0.03 120)',
    foreground: 'oklch(0.27 0.05 145)',
    surface: 'oklch(0.98 0.03 120)',
    surfaceForeground: 'oklch(0.27 0.05 145)',
    accent: 'oklch(0.56 0.11 145)',
    accentForeground: 'oklch(0.97 0.02 118)',
    secondary: 'oklch(0.72 0.12 50)',
    secondaryForeground: 'oklch(0.24 0.05 142)',
    muted: 'oklch(0.9 0.03 120)',
    mutedForeground: 'oklch(0.41 0.05 145)',
    border: 'oklch(0.76 0.08 138)',
    input: 'oklch(0.93 0.03 120)',
    ring: 'oklch(0.56 0.11 145)',
    danger: 'oklch(0.62 0.2 33)',
    dangerForeground: 'oklch(0.97 0.02 110)',
    chart1: 'oklch(0.56 0.11 145)',
    chart2: 'oklch(0.72 0.12 50)',
    chart3: 'oklch(0.74 0.13 215)',
    chart4: 'oklch(0.68 0.12 85)',
    chart5: 'oklch(0.66 0.14 22)',
  },
  artisticPillars: {
    typographyArchitecture: {
      scale: { body: '1', display: '1.15' },
      lineHeight: { tight: '1.2', normal: '1.52', relaxed: '1.75' },
      fontStack: {
        body: '"Source Sans 3", "Gill Sans", "Avenir Next", sans-serif',
        display: '"Fraunces", "Georgia", serif',
        mono: '"Fira Code", "Consolas", monospace',
      },
      letterSpacing: { tight: '-0.01em', normal: '0em', wide: '0.03em' },
    },
    surfacePhysics: {
      transparency: '0.88',
      blur: '8px',
      texture:
        'radial-gradient(45rem 40rem at 12% 10%, rgba(84, 156, 82, 0.3), transparent 65%), radial-gradient(36rem 30rem at 84% 18%, rgba(211, 124, 88, 0.26), transparent 58%), radial-gradient(30rem 26rem at 56% 96%, rgba(118, 193, 222, 0.24), transparent 60%)',
      grain: '0.03',
    },
    boundaryLogic: {
      borderWeight: '1px',
      radius: '40px',
      sharpness: '0.12',
    },
    shadowLightEngine: {
      hardOffset: '2px 3px 0 rgba(74, 110, 52, 0.22)',
      neonGlow: '0 0 28px rgba(130, 199, 114, 0.3)',
      ambientOcclusion: '0 16px 34px -20px rgba(58, 89, 39, 0.38)',
    },
    motionSignature: {
      duration: { fast: '180ms', normal: '320ms', slow: '520ms' },
      easing: { standard: 'cubic-bezier(0.2, 0.75, 0.2, 1)', emphatic: 'cubic-bezier(0.2, 1, 0.32, 1)' },
      physics: 'organic-blob-drift',
    },
  },
  ornaments: {
    grain: true,
    glow: true,
    texture: true,
  },
};
