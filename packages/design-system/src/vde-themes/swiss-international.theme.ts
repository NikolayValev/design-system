import type { VisionTheme } from '../vde-core';

export const swissInternationalTheme: VisionTheme = {
  id: 'swiss_international',
  name: 'Swiss International',
  archetype: 'The Grid',
  description: 'Objective Swiss precision with strict containers, visible structure, and linear rhythm.',
  colors: {
    background: 'oklch(0.985 0 0)',
    foreground: 'oklch(0.18 0 0)',
    surface: 'oklch(1 0 0)',
    surfaceForeground: 'oklch(0.18 0 0)',
    accent: 'oklch(0.58 0.18 29)',
    accentForeground: 'oklch(0.98 0 0)',
    secondary: 'oklch(0.93 0 0)',
    secondaryForeground: 'oklch(0.2 0 0)',
    muted: 'oklch(0.95 0 0)',
    mutedForeground: 'oklch(0.42 0 0)',
    border: 'oklch(0.16 0 0)',
    input: 'oklch(0.97 0 0)',
    ring: 'oklch(0.2 0 0)',
    danger: 'oklch(0.58 0.22 26)',
    dangerForeground: 'oklch(0.98 0 0)',
    chart1: 'oklch(0.58 0.18 29)',
    chart2: 'oklch(0.56 0.14 245)',
    chart3: 'oklch(0.65 0.15 100)',
    chart4: 'oklch(0.62 0.13 70)',
    chart5: 'oklch(0.58 0.14 330)',
  },
  artisticPillars: {
    typographyArchitecture: {
      scale: { body: '1', display: '1.22' },
      lineHeight: { tight: '1.08', normal: '1.4', relaxed: '1.62' },
      fontStack: {
        body: '"Inter", "Helvetica Neue", "Arial", sans-serif',
        display: '"Inter", "Helvetica Neue", "Arial Black", sans-serif',
        mono: '"IBM Plex Mono", "Consolas", monospace',
      },
      letterSpacing: { tight: '-0.03em', normal: '-0.01em', wide: '0.02em' },
    },
    surfacePhysics: {
      transparency: '1',
      blur: '0px',
      texture: 'repeating-radial-gradient(circle at 0 0, rgba(0, 0, 0, 0.08) 0 1px, transparent 1px 12px)',
      grain: '0.01',
    },
    boundaryLogic: {
      borderWeight: '1px',
      radius: '0px',
      sharpness: '1',
    },
    shadowLightEngine: {
      hardOffset: '0 0 0 rgba(0, 0, 0, 0)',
      neonGlow: '0 0 0 rgba(0, 0, 0, 0)',
      ambientOcclusion: '0 0 0 rgba(0, 0, 0, 0)',
    },
    motionSignature: {
      duration: { fast: '70ms', normal: '110ms', slow: '170ms' },
      easing: { standard: 'linear', emphatic: 'linear' },
      physics: 'linear-grid',
    },
  },
  ornaments: {
    grain: false,
    glow: false,
    texture: true,
  },
};
