import type { VisionTheme } from '../vde-core';

export const claySoftTheme: VisionTheme = {
  id: 'clay_soft',
  name: 'Clay_Soft',
  archetype: 'Soft 3D',
  description: 'Playful volumetric clay surfaces with pastel tones and springy motion.',
  colors: {
    background: 'oklch(0.94 0.04 320)',
    foreground: 'oklch(0.31 0.04 320)',
    surface: 'oklch(0.97 0.03 320)',
    surfaceForeground: 'oklch(0.31 0.04 320)',
    accent: 'oklch(0.82 0.12 14)',
    accentForeground: 'oklch(0.28 0.03 320)',
    secondary: 'oklch(0.86 0.09 230)',
    secondaryForeground: 'oklch(0.28 0.03 320)',
    muted: 'oklch(0.9 0.05 315)',
    mutedForeground: 'oklch(0.45 0.04 320)',
    border: 'oklch(0.84 0.05 312)',
    input: 'oklch(0.95 0.03 315)',
    ring: 'oklch(0.81 0.12 14)',
    danger: 'oklch(0.67 0.2 23)',
    dangerForeground: 'oklch(0.98 0.02 320)',
    chart1: 'oklch(0.81 0.12 14)',
    chart2: 'oklch(0.83 0.1 220)',
    chart3: 'oklch(0.84 0.1 120)',
    chart4: 'oklch(0.8 0.1 70)',
    chart5: 'oklch(0.79 0.11 300)',
  },
  artisticPillars: {
    typographyArchitecture: {
      scale: { body: '1.04', display: '1.2' },
      lineHeight: { tight: '1.14', normal: '1.5', relaxed: '1.78' },
      fontStack: {
        body: '"Baloo 2", "Nunito Sans", sans-serif',
        display: '"Fredoka", "Baloo 2", sans-serif',
        mono: '"JetBrains Mono", "Consolas", monospace',
      },
      letterSpacing: { tight: '-0.01em', normal: '0.005em', wide: '0.035em' },
    },
    surfacePhysics: {
      transparency: '1',
      blur: '0px',
      texture: 'linear-gradient(180deg, rgba(255, 255, 255, 0.3), rgba(239, 224, 255, 0.22))',
      grain: '0.02',
    },
    boundaryLogic: {
      borderWeight: '1px',
      radius: '9999px',
      sharpness: '0.02',
    },
    shadowLightEngine: {
      hardOffset: '4px 4px 0 rgba(122, 93, 142, 0.24)',
      neonGlow: '0 0 0 rgba(0, 0, 0, 0)',
      ambientOcclusion:
        'inset 6px 6px 14px rgba(255, 255, 255, 0.65), inset -8px -8px 16px rgba(187, 153, 215, 0.32), 0 16px 34px -22px rgba(122, 93, 142, 0.26)',
    },
    motionSignature: {
      duration: { fast: '200ms', normal: '320ms', slow: '520ms' },
      easing: { standard: 'cubic-bezier(0.2, 1.2, 0.32, 1)', emphatic: 'cubic-bezier(0.16, 1.35, 0.3, 1)' },
      physics: 'spring-high-bounce',
    },
  },
  ornaments: {
    grain: false,
    glow: false,
    texture: true,
  },
};
