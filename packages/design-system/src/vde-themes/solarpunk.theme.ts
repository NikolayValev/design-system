import type { VisionTheme } from '../vde-core';

export const solarpunkTheme: VisionTheme = {
  id: 'solarpunk',
  name: 'Solarpunk',
  archetype: 'Optimistic Ecology',
  description: 'Organic greens, warm sunlight, and light kinetic transitions.',
  colors: {
    background: 'oklch(0.95 0.04 120)',
    foreground: 'oklch(0.28 0.05 145)',
    surface: 'oklch(0.98 0.03 120)',
    surfaceForeground: 'oklch(0.27 0.05 145)',
    accent: 'oklch(0.68 0.19 146)',
    accentForeground: 'oklch(0.2 0.04 145)',
    secondary: 'oklch(0.82 0.12 95)',
    secondaryForeground: 'oklch(0.28 0.05 130)',
    muted: 'oklch(0.9 0.04 120)',
    mutedForeground: 'oklch(0.4 0.05 145)',
    border: 'oklch(0.81 0.08 130)',
    input: 'oklch(0.93 0.04 120)',
    ring: 'oklch(0.69 0.19 146)',
    danger: 'oklch(0.62 0.2 33)',
    dangerForeground: 'oklch(0.97 0.02 110)',
    chart1: 'oklch(0.68 0.19 146)',
    chart2: 'oklch(0.72 0.16 112)',
    chart3: 'oklch(0.74 0.18 78)',
    chart4: 'oklch(0.68 0.15 53)',
    chart5: 'oklch(0.64 0.17 18)',
  },
  artisticPillars: {
    typographyArchitecture: {
      scale: { body: '1', display: '1.15' },
      lineHeight: { tight: '1.2', normal: '1.52', relaxed: '1.75' },
      fontStack: {
        body: '"Nunito Sans", "Avenir Next", sans-serif',
        display: '"Fraunces", "Georgia", serif',
        mono: '"Fira Code", "Consolas", monospace',
      },
      letterSpacing: { tight: '-0.01em', normal: '0em', wide: '0.03em' },
    },
    surfacePhysics: {
      transparency: '0.9',
      blur: '6px',
      texture:
        'radial-gradient(circle at 0% 100%, rgba(188, 232, 145, 0.25), transparent 46%), radial-gradient(circle at 100% 0%, rgba(255, 202, 121, 0.22), transparent 44%)',
      grain: '0.03',
    },
    boundaryLogic: {
      borderWeight: '1px',
      radius: '0.95rem',
      sharpness: '0.3',
    },
    shadowLightEngine: {
      hardOffset: '2px 3px 0 rgba(74, 110, 52, 0.22)',
      neonGlow: '0 0 28px rgba(130, 199, 114, 0.3)',
      ambientOcclusion: '0 16px 34px -20px rgba(58, 89, 39, 0.38)',
    },
    motionSignature: {
      duration: { fast: '140ms', normal: '220ms', slow: '360ms' },
      easing: { standard: 'cubic-bezier(0.17, 0.67, 0.2, 1)', emphatic: 'cubic-bezier(0.2, 1, 0.3, 1)' },
      physics: 'organic-bounce',
    },
  },
  ornaments: {
    grain: true,
    glow: true,
    texture: true,
  },
};

