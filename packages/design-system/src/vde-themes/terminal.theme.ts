import type { VisionTheme } from '../vde-core';

export const terminalTheme: VisionTheme = {
  id: 'terminal',
  name: 'Terminal',
  archetype: 'CRT Utility',
  description: 'Monospaced command aesthetic with phosphor glow and rigid framing.',
  colors: {
    background: 'oklch(0.17 0.03 150)',
    foreground: 'oklch(0.87 0.12 150)',
    surface: 'oklch(0.2 0.03 150)',
    surfaceForeground: 'oklch(0.87 0.12 150)',
    accent: 'oklch(0.8 0.18 145)',
    accentForeground: 'oklch(0.14 0.03 150)',
    secondary: 'oklch(0.62 0.14 170)',
    secondaryForeground: 'oklch(0.14 0.03 150)',
    muted: 'oklch(0.25 0.03 150)',
    mutedForeground: 'oklch(0.72 0.09 150)',
    border: 'oklch(0.47 0.08 150)',
    input: 'oklch(0.23 0.03 150)',
    ring: 'oklch(0.81 0.18 145)',
    danger: 'oklch(0.65 0.2 30)',
    dangerForeground: 'oklch(0.14 0.03 150)',
    chart1: 'oklch(0.81 0.18 145)',
    chart2: 'oklch(0.74 0.15 170)',
    chart3: 'oklch(0.76 0.15 100)',
    chart4: 'oklch(0.71 0.16 60)',
    chart5: 'oklch(0.7 0.15 20)',
  },
  artisticPillars: {
    typographyArchitecture: {
      scale: { body: '0.98', display: '1.08' },
      lineHeight: { tight: '1.16', normal: '1.45', relaxed: '1.68' },
      fontStack: {
        body: '"JetBrains Mono", "Cascadia Code", monospace',
        display: '"VT323", "JetBrains Mono", monospace',
        mono: '"JetBrains Mono", "Cascadia Code", monospace',
      },
      letterSpacing: { tight: '0em', normal: '0.01em', wide: '0.06em' },
    },
    surfacePhysics: {
      transparency: '0.96',
      blur: '0px',
      texture: 'linear-gradient(180deg, rgba(95, 255, 171, 0.07), rgba(95, 255, 171, 0.02))',
      grain: '0.02',
    },
    boundaryLogic: {
      borderWeight: '2px',
      radius: '0.2rem',
      sharpness: '0.98',
    },
    shadowLightEngine: {
      hardOffset: '3px 3px 0 rgba(0, 0, 0, 0.6)',
      neonGlow: '0 0 24px rgba(96, 255, 179, 0.32)',
      ambientOcclusion: '0 8px 20px -12px rgba(0, 0, 0, 0.65)',
    },
    motionSignature: {
      duration: { fast: '80ms', normal: '120ms', slow: '200ms' },
      easing: { standard: 'cubic-bezier(0.2, 0.8, 0.2, 1)', emphatic: 'cubic-bezier(0.15, 0.95, 0.2, 1)' },
      physics: 'scanline-step',
    },
  },
  ornaments: {
    grain: true,
    glow: true,
    texture: true,
  },
};

