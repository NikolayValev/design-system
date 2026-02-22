import type { VisionTheme } from '../vde-core';

export const rawDataTheme: VisionTheme = {
  id: 'raw_data',
  name: 'RAW_DATA',
  archetype: 'The Rebel',
  description: 'Anti-corporate neo-brutalist system with acid accents, hard offsets, and raw digital grit.',
  colors: {
    background: 'oklch(0.98 0 0)',
    foreground: 'oklch(0.14 0 0)',
    surface: 'oklch(0.99 0 0)',
    surfaceForeground: 'oklch(0.14 0 0)',
    accent: '#CCFF00',
    accentForeground: 'oklch(0.11 0 0)',
    secondary: 'oklch(0.17 0 0)',
    secondaryForeground: 'oklch(0.98 0 0)',
    muted: 'oklch(0.91 0 0)',
    mutedForeground: 'oklch(0.24 0 0)',
    border: 'oklch(0.12 0 0)',
    input: 'oklch(0.95 0 0)',
    ring: '#CCFF00',
    danger: 'oklch(0.58 0.24 28)',
    dangerForeground: 'oklch(0.98 0 0)',
    chart1: '#CCFF00',
    chart2: 'oklch(0.62 0.24 250)',
    chart3: 'oklch(0.74 0.2 84)',
    chart4: 'oklch(0.6 0.23 20)',
    chart5: 'oklch(0.56 0.2 330)',
  },
  artisticPillars: {
    typographyArchitecture: {
      scale: { body: '1.02', display: '1.2' },
      lineHeight: { tight: '1.05', normal: '1.3', relaxed: '1.54' },
      fontStack: {
        body: '"Space Grotesk", "Arial Black", sans-serif',
        display: '"Archivo Black", "Impact", sans-serif',
        mono: '"JetBrains Mono", "Consolas", monospace',
      },
      letterSpacing: { tight: '-0.03em', normal: '-0.01em', wide: '0.04em' },
    },
    surfacePhysics: {
      transparency: '1',
      blur: '0px',
      texture:
        'repeating-linear-gradient(90deg, rgba(0, 0, 0, 0.07) 0 1px, transparent 1px 3px), repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.05) 0 1px, transparent 1px 2px)',
      grain: '0.24',
    },
    boundaryLogic: {
      borderWeight: '2px',
      radius: '0px',
      sharpness: '1',
    },
    shadowLightEngine: {
      hardOffset: '8px 8px 0 0 #000',
      neonGlow: '0 0 0 rgba(0, 0, 0, 0)',
      ambientOcclusion: '2px 2px 0 rgba(0, 0, 0, 0.15)',
    },
    motionSignature: {
      duration: { fast: '80ms', normal: '120ms', slow: '200ms' },
      easing: { standard: 'linear', emphatic: 'linear' },
      physics: 'snap-step-rebel',
    },
  },
  ornaments: {
    grain: true,
    glow: false,
    texture: true,
  },
};
