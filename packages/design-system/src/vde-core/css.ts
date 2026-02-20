import type { VisionTheme } from './types';

export function visionToCSSVariables(vision: VisionTheme): Record<string, string> {
  const { colors, artisticPillars } = vision;
  const { typographyArchitecture, surfacePhysics, boundaryLogic, shadowLightEngine, motionSignature } =
    artisticPillars;

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
