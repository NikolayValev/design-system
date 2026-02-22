import type { VisionTheme } from '../vde-core';

export const y2kChromeTheme: VisionTheme = {
  id: 'y2k_chrome',
  name: 'Y2K_Chrome',
  archetype: 'The Glitch',
  description: 'Brushed metallic surfaces with neon glow accents and retro-futurist scanline energy.',
  colors: {
    background: 'oklch(0.9 0.01 250)',
    foreground: 'oklch(0.2 0.02 250)',
    surface:
      'linear-gradient(115deg, rgba(255,255,255,0.92) 0%, rgba(225,230,238,0.96) 24%, rgba(189,198,212,0.95) 48%, rgba(240,243,248,0.97) 76%, rgba(180,190,205,0.93) 100%)',
    surfaceForeground: 'oklch(0.2 0.02 250)',
    accent: 'oklch(0.75 0.24 336)',
    accentForeground: 'oklch(0.18 0.03 255)',
    secondary: 'oklch(0.79 0.18 210)',
    secondaryForeground: 'oklch(0.18 0.03 255)',
    muted: 'oklch(0.87 0.03 245)',
    mutedForeground: 'oklch(0.44 0.04 250)',
    border: 'oklch(0.55 0.04 250)',
    input: 'oklch(0.92 0.02 245)',
    ring: 'oklch(0.75 0.24 336)',
    danger: 'oklch(0.66 0.24 25)',
    dangerForeground: 'oklch(0.95 0.02 250)',
    chart1: 'oklch(0.75 0.24 336)',
    chart2: 'oklch(0.79 0.18 210)',
    chart3: 'oklch(0.72 0.18 294)',
    chart4: 'oklch(0.8 0.2 76)',
    chart5: 'oklch(0.72 0.18 22)',
  },
  artisticPillars: {
    typographyArchitecture: {
      scale: { body: '1.02', display: '1.24' },
      lineHeight: { tight: '1.08', normal: '1.42', relaxed: '1.66' },
      fontStack: {
        body: '"Space Grotesk", "Trebuchet MS", sans-serif',
        display: '"Orbitron", "Eurostile", "Press Start 2P", sans-serif',
        mono: '"VT323", "JetBrains Mono", monospace',
      },
      letterSpacing: { tight: '-0.01em', normal: '0.01em', wide: '0.06em' },
    },
    surfacePhysics: {
      transparency: '0.92',
      blur: '4px',
      texture:
        'linear-gradient(180deg, rgba(255, 255, 255, 0.22), rgba(128, 138, 154, 0.14)), repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.04) 0 1px, transparent 1px 3px)',
      grain: '0.05',
    },
    boundaryLogic: {
      borderWeight: '1px',
      radius: '0.7rem',
      sharpness: '0.65',
    },
    shadowLightEngine: {
      hardOffset: '2px 2px 0 rgba(31, 39, 56, 0.3)',
      neonGlow: '0 0 32px rgba(255, 79, 206, 0.4), 0 0 26px rgba(94, 241, 255, 0.36)',
      ambientOcclusion: '0 18px 42px -22px rgba(31, 39, 56, 0.34)',
    },
    motionSignature: {
      duration: { fast: '120ms', normal: '190ms', slow: '320ms' },
      easing: { standard: 'cubic-bezier(0.2, 0.75, 0.2, 1)', emphatic: 'cubic-bezier(0.2, 1, 0.3, 1)' },
      physics: 'chrome-glitch',
    },
  },
  ornaments: {
    grain: true,
    glow: true,
    texture: true,
  },
};
