import type { VisionTheme } from '../vde-core';

export const immersiveTheme: VisionTheme = {
  id: 'immersive',
  name: 'Immersive',
  archetype: 'Atmospheric Glow',
  description: 'Deep space-inspired surfaces with subtle glow and layered blur.',
  colors: {
    background: 'oklch(0.21 0.04 260)',
    foreground: 'oklch(0.95 0.02 250)',
    surface: 'oklch(0.26 0.05 262)',
    surfaceForeground: 'oklch(0.95 0.02 250)',
    accent: 'oklch(0.74 0.23 290)',
    accentForeground: 'oklch(0.18 0.04 260)',
    secondary: 'oklch(0.37 0.07 252)',
    secondaryForeground: 'oklch(0.94 0.02 250)',
    muted: 'oklch(0.29 0.04 260)',
    mutedForeground: 'oklch(0.8 0.03 250)',
    border: 'oklch(0.41 0.07 265)',
    input: 'oklch(0.31 0.05 260)',
    ring: 'oklch(0.77 0.2 288)',
    danger: 'oklch(0.67 0.24 25)',
    dangerForeground: 'oklch(0.18 0.04 260)',
    chart1: 'oklch(0.74 0.23 290)',
    chart2: 'oklch(0.7 0.2 202)',
    chart3: 'oklch(0.75 0.2 138)',
    chart4: 'oklch(0.8 0.21 70)',
    chart5: 'oklch(0.7 0.2 18)',
  },
  artisticPillars: {
    typographyArchitecture: {
      scale: { body: '1', display: '1.12' },
      lineHeight: { tight: '1.18', normal: '1.48', relaxed: '1.72' },
      fontStack: {
        body: '"Manrope", "Inter", sans-serif',
        display: '"Sora", "Manrope", sans-serif',
        mono: '"IBM Plex Mono", "Consolas", monospace',
      },
      letterSpacing: { tight: '-0.015em', normal: '0em', wide: '0.02em' },
    },
    surfacePhysics: {
      transparency: '0.82',
      blur: '14px',
      texture:
        'radial-gradient(circle at 10% 0%, rgba(126, 87, 255, 0.3), transparent 48%), radial-gradient(circle at 95% 20%, rgba(59, 197, 255, 0.2), transparent 45%)',
      grain: '0.04',
    },
    boundaryLogic: {
      borderWeight: '1px',
      radius: '0.9rem',
      sharpness: '0.2',
    },
    shadowLightEngine: {
      hardOffset: '0 0 0 rgba(0, 0, 0, 0)',
      neonGlow: '0 0 32px rgba(157, 95, 255, 0.34)',
      ambientOcclusion: '0 16px 40px -18px rgba(0, 0, 0, 0.55)',
    },
    motionSignature: {
      duration: { fast: '180ms', normal: '260ms', slow: '420ms' },
      easing: { standard: 'cubic-bezier(0.2, 0.7, 0.2, 1)', emphatic: 'cubic-bezier(0.22, 1, 0.36, 1)' },
      physics: 'float-ease',
    },
  },
  ornaments: {
    grain: true,
    glow: true,
    texture: true,
  },
};
