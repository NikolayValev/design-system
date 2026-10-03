import type { ThemeMode, VisionTheme } from "./types";

/**
 * The core type scale, in rem. Themes do not author absolute sizes — they apply
 * `scale.body` / `scale.display` multipliers to these, and the result is emitted
 * as `--vde-font-size-*`.
 *
 * `tier` decides which multiplier applies; `floor` is the smallest rem value the
 * tier may resolve to no matter what a theme multiplies by. The floors are the
 * accessibility contract in `PRODUCT.md` expressed as code: a theme cannot shrink
 * interactive text below 14px or body copy below 16px by tuning a multiplier.
 */
const coreTypeScale = {
  caption: { rem: 0.8125, tier: "body", floor: 0.75 },
  ui: { rem: 0.875, tier: "body", floor: 0.875 },
  body: { rem: 1, tier: "body", floor: 1 },
  lead: { rem: 1.125, tier: "body", floor: 1 },
  title: { rem: 1.5, tier: "display", floor: 1.25 },
  headline: { rem: 2.25, tier: "display", floor: 1.5 },
  display: { rem: 3, tier: "display", floor: 2 },
} as const satisfies Record<
  string,
  { rem: number; tier: "body" | "display"; floor: number }
>;

/**
 * Structural tokens: the same in every vision, because spacing and measure are
 * not identity. They are emitted anyway rather than left to `global.css` alone,
 * so that `applyVisionToElement` produces a complete surface on its own — a
 * consumer (or Storybook) that mounts VisionProvider without also importing the
 * stylesheet would otherwise resolve `var(--vde-space-md)` to nothing, silently.
 */
const structuralVariables: Record<string, string> = {
  "--vde-space-2xs": "0.25rem",
  "--vde-space-xs": "0.5rem",
  "--vde-space-sm": "0.75rem",
  "--vde-space-md": "1rem",
  "--vde-space-lg": "1.5rem",
  "--vde-space-xl": "2rem",
  "--vde-space-2xl": "3rem",
  "--vde-space-3xl": "4rem",
  "--vde-measure": "68ch",
};

/** Trim float noise so emitted CSS stays readable (1.0500000000000002rem -> 1.05rem). */
function rem(value: number): string {
  return `${parseFloat(value.toFixed(4))}rem`;
}

function typeScaleVariables(scale: {
  body: string;
  display: string;
}): Record<string, string> {
  const multipliers = {
    body: Number.parseFloat(scale.body) || 1,
    display: Number.parseFloat(scale.display) || 1,
  };

  const out: Record<string, string> = {};
  for (const [name, step] of Object.entries(coreTypeScale)) {
    out[`--vde-font-size-${name}`] = rem(
      Math.max(step.rem * multipliers[step.tier], step.floor),
    );
  }
  /** The enforced interactive minimum, exposed so components and lint can name it. */
  out["--vde-font-size-min-interactive"] = rem(coreTypeScale.ui.floor);
  return out;
}

/**
 * Line height for UI text — button labels, form labels, menu items.
 *
 * A theme's `lineHeight.tight` goes as low as 1.08, which is correct for a display
 * headline and unreadable on a wrapping button label. UI text gets its own value,
 * floored at 1.25.
 */
function uiLineHeight(tight: string): string {
  const value = Number.parseFloat(tight);
  return String(Number.isFinite(value) ? Math.max(value, 1.25) : 1.25);
}

const baseAtmosphericVariables: Record<string, string> = {
  "--vde-editorial-massive-size": "clamp(4rem, 10vw, 9rem)",
  "--vde-editorial-margin-block": "clamp(1.2rem, 4vw, 3rem)",
  "--vde-editorial-margin-inline": "0rem",
  "--vde-editorial-glow": "0 0 0 rgba(0, 0, 0, 0)",
  "--vde-editorial-color": "var(--vde-color-foreground)",
  "--vde-editorial-background": "transparent",
  "--vde-editorial-padding-inline": "0",
  "--vde-editorial-padding-block": "0",
  "--vde-editorial-text-transform": "none",
  "--vde-editorial-weight": "600",
  "--vde-editorial-tracking": "var(--vde-letter-spacing-tight)",
  "--vde-gallery-halo": "none",
  "--vde-gallery-material-background": "var(--vde-color-surface)",
  "--vde-gallery-paper-overlay-opacity": "0",
  "--vde-gallery-offset-shadow": "var(--vde-shadow-ambient)",
  "--vde-gallery-backdrop-blur": "0px",
  "--vde-gallery-torn-clip-path": "none",
  "--vde-gallery-tape-opacity": "0",
  "--vde-media-passpartout-shadow": "var(--vde-shadow-ambient)",
  "--vde-media-contrast-filter": "none",
  "--vde-media-light-leak": "inset 0 0 0 rgba(0, 0, 0, 0)",
  "--vde-media-scanline-opacity": "0",
  "--vde-atmosphere-archive-opacity": "0.08",
  "--vde-atmosphere-noise-opacity": "0.04",
  "--vde-atmosphere-nexus-opacity": "0.35",
  "--vde-atmosphere-mesh-gradient":
    "radial-gradient(circle at 18% 14%, rgba(100, 100, 100, 0.2), transparent 45%), radial-gradient(circle at 84% 76%, rgba(140, 140, 140, 0.14), transparent 40%)",
  "--vde-atmosphere-motion": "none",
  "--vde-card-bob-animation": "none",
  "--vde-component-tilt": "0deg",
  "--vde-nav-orb-bounce-duration": "var(--vde-motion-duration-normal)",
  "--vde-nav-orb-bounce-easing": "var(--vde-motion-easing-emphatic)",
};

const atmosphericOverridesByVision: Record<string, Record<string, string>> = {
  museum: {
    "--vde-editorial-massive-size": "clamp(4.6rem, 11vw, 10.5rem)",
    "--vde-editorial-margin-block": "clamp(2.5rem, 8vw, 7rem)",
    "--vde-editorial-margin-inline": "clamp(1rem, 10vw, 9rem)",
    "--vde-gallery-paper-overlay-opacity": "0.58",
    "--vde-media-passpartout-shadow":
      "inset 0 0 0 0.6rem rgba(255, 253, 246, 0.9), inset 0 0 2.3rem rgba(38, 28, 16, 0.2)",
    "--vde-atmosphere-archive-opacity": "0.2",
    "--vde-atmosphere-noise-opacity": "0.1",
    "--vde-atmosphere-nexus-opacity": "0.24",
    "--vde-atmosphere-mesh-gradient":
      "radial-gradient(circle at 20% 20%, rgba(166, 130, 80, 0.2), transparent 52%), radial-gradient(circle at 84% 16%, rgba(120, 95, 68, 0.16), transparent 48%)",
    "--vde-nav-orb-bounce-duration": "var(--vde-motion-duration-slow)",
    "--vde-nav-orb-bounce-easing": "linear",
  },
  brutalist: {
    "--vde-editorial-massive-size": "clamp(5rem, 12vw, 11rem)",
    "--vde-editorial-color": "var(--vde-color-background)",
    "--vde-editorial-background": "var(--vde-color-foreground)",
    "--vde-editorial-padding-inline": "0.32em",
    "--vde-editorial-padding-block": "0.08em",
    "--vde-editorial-text-transform": "uppercase",
    "--vde-editorial-weight": "900",
    "--vde-editorial-tracking": "0.04em",
    "--vde-gallery-material-background": "var(--vde-color-background)",
    "--vde-gallery-offset-shadow": "4px 4px 0 0 var(--vde-color-foreground)",
    "--vde-media-contrast-filter":
      "grayscale(1) contrast(2.2) saturate(0) brightness(1.05)",
    "--vde-atmosphere-noise-opacity": "0",
    "--vde-atmosphere-nexus-opacity": "0.12",
    "--vde-atmosphere-mesh-gradient":
      "radial-gradient(circle at 12% 8%, rgba(0, 0, 0, 0.12), transparent 42%), radial-gradient(circle at 84% 72%, rgba(0, 0, 0, 0.08), transparent 40%)",
    "--vde-nav-orb-bounce-duration": "0ms",
    "--vde-nav-orb-bounce-easing": "linear",
  },
  immersive: {
    "--vde-editorial-massive-size": "clamp(4.2rem, 10vw, 9.4rem)",
    "--vde-editorial-glow":
      "0 0 32px rgba(157, 95, 255, 0.5), 0 0 18px rgba(87, 200, 255, 0.3)",
    "--vde-editorial-tracking": "var(--vde-letter-spacing-wide)",
    "--vde-gallery-halo":
      "radial-gradient(circle at 10% 0%, color-mix(in oklab, var(--vde-color-accent) 22%, transparent), transparent 50%), radial-gradient(circle at 100% 100%, color-mix(in oklab, var(--vde-color-secondary) 20%, transparent), transparent 48%)",
    "--vde-gallery-material-background":
      "color-mix(in oklab, var(--vde-color-surface) 78%, transparent)",
    "--vde-gallery-backdrop-blur": "20px",
    "--vde-media-light-leak":
      "inset 0 0 2.8rem rgba(146, 92, 255, 0.45), inset 0 0 1.4rem rgba(80, 200, 255, 0.32)",
    "--vde-atmosphere-nexus-opacity": "0.9",
    "--vde-atmosphere-mesh-gradient":
      "radial-gradient(circle at 12% 8%, rgba(130, 88, 255, 0.46), transparent 42%), radial-gradient(circle at 86% 18%, rgba(74, 197, 255, 0.42), transparent 47%), radial-gradient(circle at 60% 100%, rgba(58, 255, 169, 0.2), transparent 55%)",
    "--vde-nav-orb-bounce-duration": "360ms",
    "--vde-nav-orb-bounce-easing": "cubic-bezier(0.22, 1, 0.36, 1)",
  },
  swiss_international: {
    "--vde-gallery-offset-shadow": "none",
    "--vde-atmosphere-archive-opacity": "0.32",
    "--vde-atmosphere-noise-opacity": "0.01",
  },
  solarpunk: {
    "--vde-gallery-material-background":
      "color-mix(in oklab, var(--vde-color-surface) 82%, transparent)",
    "--vde-atmosphere-nexus-opacity": "0.88",
    "--vde-atmosphere-mesh-gradient":
      "radial-gradient(48rem 42rem at 12% 12%, rgba(84, 156, 82, 0.34), transparent 64%), radial-gradient(36rem 30rem at 84% 18%, rgba(211, 124, 88, 0.26), transparent 58%), radial-gradient(32rem 28rem at 52% 94%, rgba(118, 193, 222, 0.24), transparent 62%)",
    "--vde-atmosphere-motion":
      "vde-atmosphere-drift 28s ease-in-out infinite alternate",
  },
  y2k_chrome: {
    "--vde-editorial-glow":
      "0 0 24px rgba(255, 79, 206, 0.52), 0 0 20px rgba(94, 241, 255, 0.45)",
    "--vde-editorial-tracking": "var(--vde-letter-spacing-wide)",
    "--vde-gallery-material-background":
      "color-mix(in oklab, var(--vde-color-surface) 86%, transparent)",
    "--vde-media-light-leak":
      "inset 0 0 2.4rem rgba(255, 79, 206, 0.38), inset 0 0 1.6rem rgba(93, 240, 255, 0.32)",
    "--vde-media-scanline-opacity": "0.26",
    "--vde-atmosphere-nexus-opacity": "0.82",
    "--vde-atmosphere-mesh-gradient":
      "radial-gradient(circle at 15% 10%, rgba(255, 90, 210, 0.32), transparent 44%), radial-gradient(circle at 84% 14%, rgba(98, 246, 255, 0.3), transparent 45%), radial-gradient(circle at 52% 95%, rgba(255, 255, 255, 0.16), transparent 58%)",
  },
  clay_soft: {
    "--vde-gallery-material-background": "var(--vde-color-surface)",
    "--vde-atmosphere-nexus-opacity": "0.74",
    "--vde-atmosphere-mesh-gradient":
      "radial-gradient(circle at 18% 18%, rgba(255, 191, 217, 0.38), transparent 48%), radial-gradient(circle at 84% 22%, rgba(184, 218, 255, 0.35), transparent 46%), radial-gradient(circle at 52% 90%, rgba(196, 239, 206, 0.34), transparent 54%)",
    "--vde-atmosphere-motion":
      "vde-atmosphere-drift 22s ease-in-out infinite alternate",
  },
};

function getAtmosphericVariables(vision: VisionTheme): Record<string, string> {
  return {
    ...baseAtmosphericVariables,
    ...(atmosphericOverridesByVision[vision.id] ?? {}),
  };
}

export function visionToCSSVariables(
  vision: VisionTheme,
  mode: ThemeMode = vision.defaultMode,
): Record<string, string> {
  const colors = vision.colors[mode];
  const { artisticPillars } = vision;
  const {
    typographyArchitecture,
    surfacePhysics,
    boundaryLogic,
    shadowLightEngine,
    motionSignature,
  } = artisticPillars;
  const atmosphericVariables = getAtmosphericVariables(vision);

  return {
    "--vde-color-background": colors.background,
    "--vde-color-foreground": colors.foreground,
    "--vde-color-surface": colors.surface,
    "--vde-color-surface-foreground": colors.surfaceForeground,
    "--vde-color-accent": colors.accent,
    "--vde-color-accent-foreground": colors.accentForeground,
    "--vde-color-secondary": colors.secondary,
    "--vde-color-secondary-foreground": colors.secondaryForeground,
    "--vde-color-muted": colors.muted,
    "--vde-color-muted-foreground": colors.mutedForeground,
    "--vde-color-border": colors.border,
    "--vde-color-input": colors.input,
    "--vde-color-ring": colors.ring,
    "--vde-color-danger": colors.danger,
    "--vde-color-danger-foreground": colors.dangerForeground,
    "--vde-font-body": typographyArchitecture.fontStack.body,
    "--vde-font-display": typographyArchitecture.fontStack.display,
    "--vde-font-mono": typographyArchitecture.fontStack.mono,
    "--vde-typography-scale-body": typographyArchitecture.scale.body,
    "--vde-typography-scale-display": typographyArchitecture.scale.display,
    ...typeScaleVariables(typographyArchitecture.scale),
    ...structuralVariables,
    "--vde-line-height-ui": uiLineHeight(
      typographyArchitecture.lineHeight.tight,
    ),
    "--vde-line-height-tight": typographyArchitecture.lineHeight.tight,
    "--vde-line-height-normal": typographyArchitecture.lineHeight.normal,
    "--vde-line-height-relaxed": typographyArchitecture.lineHeight.relaxed,
    "--vde-letter-spacing-tight": typographyArchitecture.letterSpacing.tight,
    "--vde-letter-spacing-normal": typographyArchitecture.letterSpacing.normal,
    "--vde-letter-spacing-wide": typographyArchitecture.letterSpacing.wide,
    "--vde-surface-transparency": surfacePhysics.transparency,
    "--vde-surface-blur": surfacePhysics.blur,
    "--vde-surface-texture": surfacePhysics.texture,
    "--vde-surface-grain": surfacePhysics.grain,
    "--vde-border-width": boundaryLogic.borderWeight,
    "--vde-radius-surface": boundaryLogic.radius.surface,
    "--vde-radius-control": boundaryLogic.radius.control,
    "--vde-radius-pill": boundaryLogic.radius.pill,
    // Retained alias: `--vde-boundary-radius` was the single pre-v3 radius token.
    // It resolves to the surface step, which is what it always meant in practice.
    "--vde-boundary-radius": boundaryLogic.radius.surface,
    "--vde-boundary-sharpness": boundaryLogic.sharpness,
    "--vde-shadow-hard": shadowLightEngine.hardOffset,
    "--vde-shadow-neon": shadowLightEngine.neonGlow,
    "--vde-shadow-ambient": shadowLightEngine.ambientOcclusion,
    "--vde-motion-duration-fast": motionSignature.duration.fast,
    "--vde-motion-duration-normal": motionSignature.duration.normal,
    "--vde-motion-duration-slow": motionSignature.duration.slow,
    "--vde-motion-easing-standard": motionSignature.easing.standard,
    "--vde-motion-easing-emphatic": motionSignature.easing.emphatic,
    "--vde-motion-physics": motionSignature.physics,
    ...atmosphericVariables,
    "--background": colors.background,
    "--foreground": colors.foreground,
    "--card": colors.surface,
    "--card-foreground": colors.surfaceForeground,
    "--popover": colors.surface,
    "--popover-foreground": colors.surfaceForeground,
    "--primary": colors.accent,
    "--primary-foreground": colors.accentForeground,
    "--secondary": colors.secondary,
    "--secondary-foreground": colors.secondaryForeground,
    "--muted": colors.muted,
    "--muted-foreground": colors.mutedForeground,
    "--accent": colors.accent,
    "--accent-foreground": colors.accentForeground,
    "--destructive": colors.danger,
    "--destructive-foreground": colors.dangerForeground,
    "--border": colors.border,
    "--input": colors.input,
    "--ring": colors.ring,
    "--chart-1": colors.chart1,
    "--chart-2": colors.chart2,
    "--chart-3": colors.chart3,
    "--chart-4": colors.chart4,
    "--chart-5": colors.chart5,
    "--radius": boundaryLogic.radius.surface,
    "--font-family-sans": typographyArchitecture.fontStack.body,
    "--font-family-mono": typographyArchitecture.fontStack.mono,
    "--sidebar": colors.surface,
    "--sidebar-foreground": colors.surfaceForeground,
    "--sidebar-primary": colors.accent,
    "--sidebar-primary-foreground": colors.accentForeground,
    "--sidebar-accent": colors.secondary,
    "--sidebar-accent-foreground": colors.secondaryForeground,
    "--sidebar-border": colors.border,
    "--sidebar-ring": colors.ring,
  };
}

export function applyVisionToElement(
  element: HTMLElement,
  vision: VisionTheme,
  mode: ThemeMode = vision.defaultMode,
): void {
  const variables = visionToCSSVariables(vision, mode);
  for (const [property, value] of Object.entries(variables)) {
    element.style.setProperty(property, value);
  }

  element.setAttribute("data-vde-vision", vision.id);
  element.setAttribute("data-vde-archetype", vision.archetype);
  element.setAttribute("data-vde-mode", mode);
}
