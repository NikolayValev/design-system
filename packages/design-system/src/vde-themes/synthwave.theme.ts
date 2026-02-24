import type { VisionTheme } from '../vde-core';

export const synthwaveTheme: VisionTheme = {
  id: 'synthwave',
  name: 'Synthwave',
  archetype: 'Retro Futurism',
  description: 'Neon gradients, electric glows, and dramatic cinematic pacing.',
  colors: {
    background: 'oklch(0.22 0.06 296)',
    foreground: 'oklch(0.95 0.02 270)',
    surface: 'oklch(0.28 0.08 300)',
    surfaceForeground: 'oklch(0.95 0.02 270)',
    accent: 'oklch(0.76 0.23 335)',
    accentForeground: 'oklch(0.18 0.05 295)',
    secondary: 'oklch(0.72 0.2 215)',
    secondaryForeground: 'oklch(0.18 0.05 295)',
    muted: 'oklch(0.3 0.05 292)',
    mutedForeground: 'oklch(0.82 0.05 270)',
    border: 'oklch(0.46 0.12 305)',
    input: 'oklch(0.33 0.07 295)',
    ring: 'oklch(0.79 0.23 334)',
    danger: 'oklch(0.7 0.24 20)',
    dangerForeground: 'oklch(0.19 0.05 295)',
    chart1: 'oklch(0.79 0.23 334)',
    chart2: 'oklch(0.72 0.2 215)',
    chart3: 'oklch(0.75 0.22 285)',
    chart4: 'oklch(0.78 0.2 120)',
    chart5: 'oklch(0.74 0.2 60)',
  },
  artisticPillars: {
    typographyArchitecture: {
      scale: { body: '1.01', display: '1.2' },
      lineHeight: { tight: '1.18', normal: '1.5', relaxed: '1.7' },
      fontStack: {
        body: '"Space Grotesk", "Avenir Next", sans-serif',
        display: '"Space Grotesk", "Avenir Next", sans-serif',
        mono: '"Fira Code", "Consolas", monospace',
      },
      letterSpacing: { tight: '0.03em', normal: '0.016em', wide: '0.065em' },
    },
    surfacePhysics: {
      transparency: '0.84',
      blur: '10px',
      texture:
        'linear-gradient(160deg, rgba(255, 73, 186, 0.2), rgba(51, 214, 255, 0.16)), radial-gradient(circle at 20% 100%, rgba(255, 149, 0, 0.17), transparent 48%)',
      grain: '0.02',
    },
    boundaryLogic: {
      borderWeight: '1px',
      radius: '0.75rem',
      sharpness: '0.4',
    },
    shadowLightEngine: {
      hardOffset: '2px 2px 0 rgba(16, 4, 34, 0.5)',
      neonGlow: '0 0 34px rgba(255, 74, 190, 0.45)',
      ambientOcclusion: '0 18px 44px -22px rgba(0, 0, 0, 0.6)',
    },
    motionSignature: {
      duration: { fast: '150ms', normal: '230ms', slow: '390ms' },
      easing: { standard: 'cubic-bezier(0.22, 0.7, 0.2, 1)', emphatic: 'cubic-bezier(0.25, 1, 0.35, 1)' },
      physics: 'neon-pulse',
    },
  },
  ornaments: {
    grain: true,
    glow: true,
    texture: true,
  },
};
