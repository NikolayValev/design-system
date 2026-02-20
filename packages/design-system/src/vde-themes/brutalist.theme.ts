import type { VisionTheme } from '../vde-core';

export const brutalistTheme: VisionTheme = {
  id: 'brutalist',
  name: 'Brutalist',
  archetype: 'Bold Utility',
  description: 'High-contrast blocks, sharp edges, and forceful movement.',
  colors: {
    background: 'oklch(0.98 0 0)',
    foreground: 'oklch(0.18 0 0)',
    surface: 'oklch(0.96 0 0)',
    surfaceForeground: 'oklch(0.18 0 0)',
    accent: 'oklch(0.64 0.27 29)',
    accentForeground: 'oklch(0.98 0 0)',
    secondary: 'oklch(0.22 0 0)',
    secondaryForeground: 'oklch(0.98 0 0)',
    muted: 'oklch(0.9 0 0)',
    mutedForeground: 'oklch(0.26 0 0)',
    border: 'oklch(0.18 0 0)',
    input: 'oklch(0.94 0 0)',
    ring: 'oklch(0.63 0.26 29)',
    danger: 'oklch(0.56 0.24 30)',
    dangerForeground: 'oklch(0.98 0 0)',
    chart1: 'oklch(0.64 0.27 29)',
    chart2: 'oklch(0.62 0.26 240)',
    chart3: 'oklch(0.73 0.23 87)',
    chart4: 'oklch(0.58 0.24 150)',
    chart5: 'oklch(0.52 0.21 335)',
  },
  artisticPillars: {
    typographyArchitecture: {
      scale: { body: '1.03', display: '1.22' },
      lineHeight: { tight: '1.08', normal: '1.32', relaxed: '1.58' },
      fontStack: {
        body: '"Space Grotesk", "Arial Black", sans-serif',
        display: '"Archivo Black", "Helvetica Neue", sans-serif',
        mono: '"JetBrains Mono", "Consolas", monospace',
      },
      letterSpacing: { tight: '-0.03em', normal: '-0.01em', wide: '0.04em' },
    },
    surfacePhysics: {
      transparency: '1',
      blur: '0px',
      texture: 'linear-gradient(0deg, rgba(0, 0, 0, 0.02), rgba(0, 0, 0, 0.02))',
      grain: '0',
    },
    boundaryLogic: {
      borderWeight: '2px',
      radius: '0.1rem',
      sharpness: '0.95',
    },
    shadowLightEngine: {
      hardOffset: '4px 4px 0 0 rgba(0, 0, 0, 1)',
      neonGlow: '0 0 0 rgba(0, 0, 0, 0)',
      ambientOcclusion: '0 1px 0 rgba(0, 0, 0, 0.25)',
    },
    motionSignature: {
      duration: { fast: '90ms', normal: '130ms', slow: '210ms' },
      easing: { standard: 'cubic-bezier(0.2, 0.8, 0.2, 1)', emphatic: 'cubic-bezier(0.1, 0.9, 0.2, 1)' },
      physics: 'snap-step',
    },
  },
  ornaments: {
    grain: false,
    glow: false,
    texture: false,
  },
};
