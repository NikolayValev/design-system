import type { VisionTheme } from '../vde-core';

export const museumTheme: VisionTheme = {
  id: 'museum',
  name: 'Museum',
  archetype: 'Editorial Heritage',
  description: 'Warm archival palette with tactile paper texture and restrained motion.',
  colors: {
    background: 'oklch(0.97 0.01 80)',
    foreground: 'oklch(0.24 0.02 50)',
    surface: 'oklch(0.99 0.005 90)',
    surfaceForeground: 'oklch(0.23 0.02 50)',
    accent: 'oklch(0.53 0.13 42)',
    accentForeground: 'oklch(0.98 0.01 85)',
    secondary: 'oklch(0.9 0.03 72)',
    secondaryForeground: 'oklch(0.28 0.03 52)',
    muted: 'oklch(0.93 0.02 75)',
    mutedForeground: 'oklch(0.4 0.03 52)',
    border: 'oklch(0.85 0.03 70)',
    input: 'oklch(0.9 0.02 75)',
    ring: 'oklch(0.56 0.11 42)',
    danger: 'oklch(0.56 0.19 27)',
    dangerForeground: 'oklch(0.98 0.02 85)',
    chart1: 'oklch(0.62 0.14 41)',
    chart2: 'oklch(0.58 0.09 175)',
    chart3: 'oklch(0.43 0.06 230)',
    chart4: 'oklch(0.78 0.17 88)',
    chart5: 'oklch(0.73 0.16 65)',
  },
  artisticPillars: {
    typographyArchitecture: {
      scale: { body: '1', display: '1.16' },
      lineHeight: { tight: '1.2', normal: '1.5', relaxed: '1.75' },
      fontStack: {
        body: '"Source Serif 4", "Georgia", serif',
        display: '"Cormorant Garamond", "Times New Roman", serif',
        mono: '"IBM Plex Mono", "Consolas", monospace',
      },
      letterSpacing: { tight: '-0.01em', normal: '0em', wide: '0.03em' },
    },
    surfacePhysics: {
      transparency: '0.92',
      blur: '0px',
      texture:
        'radial-gradient(circle at 20% 20%, rgba(120, 96, 68, 0.08), transparent 55%), radial-gradient(circle at 80% 0%, rgba(84, 65, 45, 0.07), transparent 48%)',
      grain: '0.08',
    },
    boundaryLogic: {
      borderWeight: '1px',
      radius: '0.5rem',
      sharpness: '0.25',
    },
    shadowLightEngine: {
      hardOffset: '3px 3px 0 0 rgba(69, 54, 37, 0.18)',
      neonGlow: '0 0 0 rgba(0, 0, 0, 0)',
      ambientOcclusion: '0 8px 22px -14px rgba(37, 29, 20, 0.3)',
    },
    motionSignature: {
      duration: { fast: '130ms', normal: '190ms', slow: '320ms' },
      easing: { standard: 'cubic-bezier(0.2, 0.65, 0.2, 1)', emphatic: 'cubic-bezier(0.16, 1, 0.3, 1)' },
      physics: 'soft-fade',
    },
  },
  ornaments: {
    grain: true,
    glow: false,
    texture: true,
  },
};
