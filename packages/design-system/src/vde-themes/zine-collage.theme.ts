import type { VisionTheme } from '../vde-core';

export const zineCollageTheme: VisionTheme = {
  id: 'zine_collage',
  name: 'Zine_Collage',
  archetype: 'The Zine',
  description: 'Handmade collage energy with tape artifacts, rough cuts, and grain-heavy analog character.',
  colors: {
    background: 'oklch(0.93 0.03 78)',
    foreground: 'oklch(0.22 0.03 30)',
    surface: 'oklch(0.97 0.02 78)',
    surfaceForeground: 'oklch(0.22 0.03 30)',
    accent: 'oklch(0.62 0.2 348)',
    accentForeground: 'oklch(0.98 0.02 80)',
    secondary: 'oklch(0.84 0.12 210)',
    secondaryForeground: 'oklch(0.24 0.03 30)',
    muted: 'oklch(0.88 0.04 76)',
    mutedForeground: 'oklch(0.42 0.04 30)',
    border: 'oklch(0.28 0.03 34)',
    input: 'oklch(0.95 0.02 78)',
    ring: 'oklch(0.62 0.2 348)',
    danger: 'oklch(0.57 0.24 24)',
    dangerForeground: 'oklch(0.98 0.02 80)',
    chart1: 'oklch(0.62 0.2 348)',
    chart2: 'oklch(0.7 0.16 210)',
    chart3: 'oklch(0.72 0.16 78)',
    chart4: 'oklch(0.62 0.17 30)',
    chart5: 'oklch(0.58 0.17 320)',
  },
  artisticPillars: {
    typographyArchitecture: {
      scale: { body: '1.06', display: '1.24' },
      lineHeight: { tight: '1.1', normal: '1.48', relaxed: '1.72' },
      fontStack: {
        body: '"Special Elite", "Courier New", monospace',
        display: '"Caveat", "Bradley Hand", "Special Elite", cursive',
        mono: '"Special Elite", "Courier New", monospace',
      },
      letterSpacing: { tight: '-0.015em', normal: '0.01em', wide: '0.05em' },
    },
    surfacePhysics: {
      transparency: '0.97',
      blur: '0px',
      texture:
        'repeating-linear-gradient(15deg, rgba(0, 0, 0, 0.06) 0 1px, transparent 1px 4px), radial-gradient(circle at 20% 0%, rgba(201, 79, 142, 0.17), transparent 40%)',
      grain: '0.2',
    },
    boundaryLogic: {
      borderWeight: '1px',
      radius: '0.25rem',
      sharpness: '0.88',
    },
    shadowLightEngine: {
      hardOffset: '3px 3px 0 rgba(53, 40, 30, 0.3)',
      neonGlow: '0 0 0 rgba(0, 0, 0, 0)',
      ambientOcclusion: '0 14px 30px -18px rgba(53, 40, 30, 0.34)',
    },
    motionSignature: {
      duration: { fast: '140ms', normal: '220ms', slow: '340ms' },
      easing: { standard: 'cubic-bezier(0.24, 0.8, 0.2, 1)', emphatic: 'cubic-bezier(0.2, 1, 0.36, 1)' },
      physics: 'cut-and-paste',
    },
  },
  ornaments: {
    grain: true,
    glow: false,
    texture: true,
  },
};
