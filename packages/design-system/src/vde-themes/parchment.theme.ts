import type { VisionTheme } from '../vde-core';

export const parchmentTheme: VisionTheme = {
  id: 'parchment',
  name: 'Parchment',
  archetype: 'Analog Craft',
  description: 'A tactile bookish style with soft paper tones and ink-like contrast.',
  colors: {
    background: 'oklch(0.96 0.02 82)',
    foreground: 'oklch(0.27 0.03 52)',
    surface: 'oklch(0.98 0.01 85)',
    surfaceForeground: 'oklch(0.26 0.03 52)',
    accent: 'oklch(0.56 0.14 40)',
    accentForeground: 'oklch(0.97 0.01 82)',
    secondary: 'oklch(0.88 0.04 70)',
    secondaryForeground: 'oklch(0.3 0.03 52)',
    muted: 'oklch(0.92 0.03 74)',
    mutedForeground: 'oklch(0.45 0.03 52)',
    border: 'oklch(0.83 0.03 70)',
    input: 'oklch(0.94 0.02 76)',
    ring: 'oklch(0.57 0.12 40)',
    danger: 'oklch(0.58 0.19 26)',
    dangerForeground: 'oklch(0.97 0.01 82)',
    chart1: 'oklch(0.59 0.13 41)',
    chart2: 'oklch(0.57 0.09 167)',
    chart3: 'oklch(0.48 0.06 228)',
    chart4: 'oklch(0.72 0.15 84)',
    chart5: 'oklch(0.68 0.13 62)',
  },
  artisticPillars: {
    typographyArchitecture: {
      scale: { body: '1', display: '1.18' },
      lineHeight: { tight: '1.22', normal: '1.54', relaxed: '1.79' },
      fontStack: {
        body: '"Crimson Pro", "Georgia", serif',
        display: '"Libre Baskerville", "Times New Roman", serif',
        mono: '"IBM Plex Mono", "Consolas", monospace',
      },
      letterSpacing: { tight: '-0.01em', normal: '0em', wide: '0.03em' },
    },
    surfacePhysics: {
      transparency: '0.93',
      blur: '0px',
      texture:
        'radial-gradient(circle at 100% 0%, rgba(133, 94, 66, 0.08), transparent 50%), linear-gradient(180deg, rgba(94, 68, 47, 0.03), rgba(94, 68, 47, 0.01))',
      grain: '0.1',
    },
    boundaryLogic: {
      borderWeight: '1px',
      radius: '0.45rem',
      sharpness: '0.35',
    },
    shadowLightEngine: {
      hardOffset: '2px 2px 0 rgba(85, 59, 39, 0.16)',
      neonGlow: '0 0 0 rgba(0, 0, 0, 0)',
      ambientOcclusion: '0 12px 28px -16px rgba(58, 42, 30, 0.3)',
    },
    motionSignature: {
      duration: { fast: '130ms', normal: '200ms', slow: '330ms' },
      easing: { standard: 'cubic-bezier(0.2, 0.68, 0.2, 1)', emphatic: 'cubic-bezier(0.2, 1, 0.35, 1)' },
      physics: 'ink-flow',
    },
  },
  ornaments: {
    grain: true,
    glow: false,
    texture: true,
  },
};

