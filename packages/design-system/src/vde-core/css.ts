import type { VisionTheme } from './types';

function getAtmosphericVariables(vision: VisionTheme): Record<string, string> {
  if (vision.id === 'museum') {
    return {
      '--vde-editorial-massive-size': 'clamp(4.6rem, 11vw, 10.5rem)',
      '--vde-editorial-margin-block': 'clamp(2.5rem, 8vw, 7rem)',
      '--vde-editorial-margin-inline': 'clamp(1rem, 10vw, 9rem)',
      '--vde-editorial-glow': '0 0 0 rgba(0, 0, 0, 0)',
      '--vde-gallery-material-background': 'var(--vde-color-surface)',
      '--vde-gallery-paper-overlay-opacity': '0.58',
      '--vde-gallery-offset-shadow': 'var(--vde-shadow-ambient)',
      '--vde-gallery-backdrop-blur': '0px',
      '--vde-media-passpartout-shadow': 'inset 0 0 0 0.6rem rgba(255, 253, 246, 0.9), inset 0 0 2.3rem rgba(38, 28, 16, 0.2)',
      '--vde-media-contrast-filter': 'none',
      '--vde-media-light-leak': 'inset 0 0 0 rgba(0, 0, 0, 0)',
      '--vde-atmosphere-archive-opacity': '0.2',
      '--vde-atmosphere-noise-opacity': '0.1',
      '--vde-atmosphere-nexus-opacity': '0.24',
      '--vde-atmosphere-mesh-gradient':
        'radial-gradient(circle at 20% 20%, rgba(166, 130, 80, 0.2), transparent 52%), radial-gradient(circle at 84% 16%, rgba(120, 95, 68, 0.16), transparent 48%)',
      '--vde-nav-orb-bounce-duration': 'var(--vde-motion-duration-slow)',
      '--vde-nav-orb-bounce-easing': 'linear',
    };
  }

  if (vision.id === 'brutalist') {
    return {
      '--vde-editorial-massive-size': 'clamp(5rem, 12vw, 11rem)',
      '--vde-editorial-margin-block': 'clamp(1.2rem, 4vw, 3rem)',
      '--vde-editorial-margin-inline': '0rem',
      '--vde-editorial-glow': '0 0 0 rgba(0, 0, 0, 0)',
      '--vde-gallery-material-background': 'var(--vde-color-background)',
      '--vde-gallery-paper-overlay-opacity': '0',
      '--vde-gallery-offset-shadow': '4px 4px 0 0 #000',
      '--vde-gallery-backdrop-blur': '0px',
      '--vde-media-passpartout-shadow': 'var(--vde-shadow-ambient)',
      '--vde-media-contrast-filter': 'grayscale(1) contrast(2.2) saturate(0) brightness(1.05)',
      '--vde-media-light-leak': 'inset 0 0 0 rgba(0, 0, 0, 0)',
      '--vde-atmosphere-archive-opacity': '0.08',
      '--vde-atmosphere-noise-opacity': '0',
      '--vde-atmosphere-nexus-opacity': '0.12',
      '--vde-atmosphere-mesh-gradient':
        'radial-gradient(circle at 12% 8%, rgba(0, 0, 0, 0.12), transparent 42%), radial-gradient(circle at 84% 72%, rgba(0, 0, 0, 0.08), transparent 40%)',
      '--vde-nav-orb-bounce-duration': '0ms',
      '--vde-nav-orb-bounce-easing': 'linear',
    };
  }

  if (vision.id === 'immersive') {
    return {
      '--vde-editorial-massive-size': 'clamp(4.2rem, 10vw, 9.4rem)',
      '--vde-editorial-margin-block': 'clamp(1rem, 4vw, 2.8rem)',
      '--vde-editorial-margin-inline': '0rem',
      '--vde-editorial-glow': '0 0 32px rgba(157, 95, 255, 0.5), 0 0 18px rgba(87, 200, 255, 0.3)',
      '--vde-gallery-material-background': 'color-mix(in oklab, var(--vde-color-surface) 78%, transparent)',
      '--vde-gallery-paper-overlay-opacity': '0',
      '--vde-gallery-offset-shadow': 'var(--vde-shadow-ambient)',
      '--vde-gallery-backdrop-blur': '20px',
      '--vde-media-passpartout-shadow': 'var(--vde-shadow-ambient)',
      '--vde-media-contrast-filter': 'none',
      '--vde-media-light-leak': 'inset 0 0 2.8rem rgba(146, 92, 255, 0.45), inset 0 0 1.4rem rgba(80, 200, 255, 0.32)',
      '--vde-atmosphere-archive-opacity': '0.04',
      '--vde-atmosphere-noise-opacity': '0.04',
      '--vde-atmosphere-nexus-opacity': '0.9',
      '--vde-atmosphere-mesh-gradient':
        'radial-gradient(circle at 12% 8%, rgba(130, 88, 255, 0.46), transparent 42%), radial-gradient(circle at 86% 18%, rgba(74, 197, 255, 0.42), transparent 47%), radial-gradient(circle at 60% 100%, rgba(58, 255, 169, 0.2), transparent 55%)',
      '--vde-nav-orb-bounce-duration': '420ms',
      '--vde-nav-orb-bounce-easing': 'cubic-bezier(0.2, 1.1, 0.28, 1.28)',
    };
  }

  return {
    '--vde-editorial-massive-size': 'clamp(4rem, 10vw, 9rem)',
    '--vde-editorial-margin-block': 'clamp(1.2rem, 4vw, 3rem)',
    '--vde-editorial-margin-inline': '0rem',
    '--vde-editorial-glow': '0 0 0 rgba(0, 0, 0, 0)',
    '--vde-gallery-material-background': 'var(--vde-color-surface)',
    '--vde-gallery-paper-overlay-opacity': '0',
    '--vde-gallery-offset-shadow': 'var(--vde-shadow-ambient)',
    '--vde-gallery-backdrop-blur': '0px',
    '--vde-media-passpartout-shadow': 'var(--vde-shadow-ambient)',
    '--vde-media-contrast-filter': 'none',
    '--vde-media-light-leak': 'inset 0 0 0 rgba(0, 0, 0, 0)',
    '--vde-atmosphere-archive-opacity': '0.08',
    '--vde-atmosphere-noise-opacity': '0.04',
    '--vde-atmosphere-nexus-opacity': '0.35',
    '--vde-atmosphere-mesh-gradient':
      'radial-gradient(circle at 18% 14%, rgba(100, 100, 100, 0.2), transparent 45%), radial-gradient(circle at 84% 76%, rgba(140, 140, 140, 0.14), transparent 40%)',
    '--vde-nav-orb-bounce-duration': 'var(--vde-motion-duration-normal)',
    '--vde-nav-orb-bounce-easing': 'var(--vde-motion-easing-emphatic)',
  };
}

export function visionToCSSVariables(vision: VisionTheme): Record<string, string> {
  const { colors, artisticPillars } = vision;
  const { typographyArchitecture, surfacePhysics, boundaryLogic, shadowLightEngine, motionSignature } =
    artisticPillars;
  const atmosphericVariables = getAtmosphericVariables(vision);

  return {
    '--vde-color-background': colors.background,
    '--vde-color-foreground': colors.foreground,
    '--vde-color-surface': colors.surface,
    '--vde-color-surface-foreground': colors.surfaceForeground,
    '--vde-color-accent': colors.accent,
    '--vde-color-accent-foreground': colors.accentForeground,
    '--vde-color-secondary': colors.secondary,
    '--vde-color-secondary-foreground': colors.secondaryForeground,
    '--vde-color-muted': colors.muted,
    '--vde-color-muted-foreground': colors.mutedForeground,
    '--vde-color-border': colors.border,
    '--vde-color-input': colors.input,
    '--vde-color-ring': colors.ring,
    '--vde-color-danger': colors.danger,
    '--vde-color-danger-foreground': colors.dangerForeground,
    '--vde-font-body': typographyArchitecture.fontStack.body,
    '--vde-font-display': typographyArchitecture.fontStack.display,
    '--vde-font-mono': typographyArchitecture.fontStack.mono,
    '--vde-typography-scale-body': typographyArchitecture.scale.body,
    '--vde-typography-scale-display': typographyArchitecture.scale.display,
    '--vde-line-height-tight': typographyArchitecture.lineHeight.tight,
    '--vde-line-height-normal': typographyArchitecture.lineHeight.normal,
    '--vde-line-height-relaxed': typographyArchitecture.lineHeight.relaxed,
    '--vde-letter-spacing-tight': typographyArchitecture.letterSpacing.tight,
    '--vde-letter-spacing-normal': typographyArchitecture.letterSpacing.normal,
    '--vde-letter-spacing-wide': typographyArchitecture.letterSpacing.wide,
    '--vde-surface-transparency': surfacePhysics.transparency,
    '--vde-surface-blur': surfacePhysics.blur,
    '--vde-surface-texture': surfacePhysics.texture,
    '--vde-surface-grain': surfacePhysics.grain,
    '--vde-border-width': boundaryLogic.borderWeight,
    '--vde-boundary-radius': boundaryLogic.radius,
    '--vde-boundary-sharpness': boundaryLogic.sharpness,
    '--vde-shadow-hard': shadowLightEngine.hardOffset,
    '--vde-shadow-neon': shadowLightEngine.neonGlow,
    '--vde-shadow-ambient': shadowLightEngine.ambientOcclusion,
    '--vde-motion-duration-fast': motionSignature.duration.fast,
    '--vde-motion-duration-normal': motionSignature.duration.normal,
    '--vde-motion-duration-slow': motionSignature.duration.slow,
    '--vde-motion-easing-standard': motionSignature.easing.standard,
    '--vde-motion-easing-emphatic': motionSignature.easing.emphatic,
    '--vde-motion-physics': motionSignature.physics,
    ...atmosphericVariables,
    '--background': colors.background,
    '--foreground': colors.foreground,
    '--card': colors.surface,
    '--card-foreground': colors.surfaceForeground,
    '--popover': colors.surface,
    '--popover-foreground': colors.surfaceForeground,
    '--primary': colors.accent,
    '--primary-foreground': colors.accentForeground,
    '--secondary': colors.secondary,
    '--secondary-foreground': colors.secondaryForeground,
    '--muted': colors.muted,
    '--muted-foreground': colors.mutedForeground,
    '--accent': colors.accent,
    '--accent-foreground': colors.accentForeground,
    '--destructive': colors.danger,
    '--destructive-foreground': colors.dangerForeground,
    '--border': colors.border,
    '--input': colors.input,
    '--ring': colors.ring,
    '--chart-1': colors.chart1,
    '--chart-2': colors.chart2,
    '--chart-3': colors.chart3,
    '--chart-4': colors.chart4,
    '--chart-5': colors.chart5,
    '--radius': boundaryLogic.radius,
    '--font-family-sans': typographyArchitecture.fontStack.body,
    '--font-family-mono': typographyArchitecture.fontStack.mono,
    '--sidebar': colors.surface,
    '--sidebar-foreground': colors.surfaceForeground,
    '--sidebar-primary': colors.accent,
    '--sidebar-primary-foreground': colors.accentForeground,
    '--sidebar-accent': colors.secondary,
    '--sidebar-accent-foreground': colors.secondaryForeground,
    '--sidebar-border': colors.border,
    '--sidebar-ring': colors.ring,
  };
}

export function applyVisionToElement(element: HTMLElement, vision: VisionTheme): void {
  const variables = visionToCSSVariables(vision);
  for (const [property, value] of Object.entries(variables)) {
    element.style.setProperty(property, value);
  }

  element.setAttribute('data-vde-vision', vision.id);
  element.setAttribute('data-vde-archetype', vision.archetype);
}
