import type { VisionTheme } from '../vde-core';

export const theArchiveTheme: VisionTheme = {
  id: 'the_archive',
  name: 'The Archive',
  archetype: 'Museumcore',
  description: 'Editorial tactility with paper warmth, high-contrast serif typography, and archival texture.',
  colors: {
    background: '#F7F5F0',
    foreground: 'oklch(0.24 0.02 52)',
    surface: 'oklch(0.99 0.006 88)',
    surfaceForeground: 'oklch(0.23 0.02 52)',
    accent: '#8A3324',
    accentForeground: 'oklch(0.98 0.01 86)',
    secondary: 'oklch(0.9 0.03 74)',
    secondaryForeground: 'oklch(0.28 0.03 52)',
    muted: 'oklch(0.93 0.02 76)',
    mutedForeground: 'oklch(0.42 0.03 52)',
    border: 'oklch(0.85 0.03 72)',
    input: 'oklch(0.92 0.02 76)',
    ring: '#8A3324',
    danger: 'oklch(0.55 0.2 26)',
    dangerForeground: 'oklch(0.98 0.01 86)',
    chart1: '#8A3324',
    chart2: 'oklch(0.58 0.1 175)',
    chart3: 'oklch(0.46 0.06 229)',
    chart4: 'oklch(0.76 0.17 84)',
    chart5: 'oklch(0.71 0.15 60)',
  },
  artisticPillars: {
    typographyArchitecture: {
      scale: { body: '1.05', display: '1.2' },
      lineHeight: { tight: '1.18', normal: '1.56', relaxed: '1.8' },
      fontStack: {
        body: '"Source Serif 4", "Georgia", serif',
        display: '"Bodoni Moda", "Didot", "Times New Roman", serif',
        mono: '"IBM Plex Mono", "Consolas", monospace',
      },
      letterSpacing: { tight: '-0.012em', normal: '0em', wide: '0.03em' },
    },
    surfacePhysics: {
      transparency: '0.94',
      blur: '0px',
      texture:
        'radial-gradient(circle at 30% 20%, rgba(123, 97, 68, 0.09), transparent 54%), radial-gradient(circle at 82% 0%, rgba(106, 79, 56, 0.07), transparent 48%)',
      grain: '0.1',
    },
    boundaryLogic: {
      borderWeight: '1px',
      radius: '0.45rem',
      sharpness: '0.3',
    },
    shadowLightEngine: {
      hardOffset: '2px 2px 0 rgba(72, 56, 38, 0.16)',
      neonGlow: '0 0 0 rgba(0, 0, 0, 0)',
      ambientOcclusion: '0 12px 26px -16px rgba(46, 35, 25, 0.28)',
    },
    motionSignature: {
      duration: { fast: '400ms', normal: '800ms', slow: '800ms' },
      easing: { standard: 'cubic-bezier(0.42, 0, 0.58, 1)', emphatic: 'cubic-bezier(0.42, 0, 0.58, 1)' },
      physics: 'fade-lift',
    },
  },
  ornaments: {
    grain: true,
    glow: false,
    texture: true,
  },
};
