export interface TypographyArchitecture {
  /**
   * Multipliers applied to the core type scale (see `coreTypeScale` in `css.ts`).
   * A theme tunes the overall size of body-tier and display-tier text; it does not
   * author absolute sizes. The emitted `--vde-font-size-*` values are the core
   * scale multiplied by these, with the interactive tier clamped to the 14px floor.
   */
  scale: {
    body: string;
    display: string;
  };
  lineHeight: {
    tight: string;
    normal: string;
    relaxed: string;
  };
  fontStack: {
    body: string;
    display: string;
    mono: string;
  };
  letterSpacing: {
    tight: string;
    normal: string;
    wide: string;
  };
}

export interface SurfacePhysics {
  transparency: string;
  blur: string;
  texture: string;
  grain: string;
}

/**
 * Corner radii, split by the kind of thing being rounded.
 *
 * A single radius for every element is what produces impeccable's
 * "extreme border-radius on cards": a pill radius that reads as playful on a
 * button squeezes the content of a card. Splitting the scale lets a theme be
 * round where roundness is character and restrained where it costs legibility.
 */
export interface RadiusScale {
  /** Cards, panels, wells, image frames. Never a pill — content needs corners. */
  surface: string;
  /** Buttons, inputs, selects, checkboxes. */
  control: string;
  /** Chips, badges, status dots, anything deliberately capsule-shaped. */
  pill: string;
}

export interface BoundaryLogic {
  borderWeight: string;
  radius: RadiusScale;
  sharpness: string;
}

export interface ShadowLightEngine {
  hardOffset: string;
  neonGlow: string;
  ambientOcclusion: string;
}

export interface MotionSignature {
  duration: {
    fast: string;
    normal: string;
    slow: string;
  };
  easing: {
    standard: string;
    emphatic: string;
  };
  physics: string;
}

export interface ArtisticPillars {
  typographyArchitecture: TypographyArchitecture;
  surfacePhysics: SurfacePhysics;
  boundaryLogic: BoundaryLogic;
  shadowLightEngine: ShadowLightEngine;
  motionSignature: MotionSignature;
}

export interface VisionColors {
  background: string;
  foreground: string;
  surface: string;
  surfaceForeground: string;
  accent: string;
  accentForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  input: string;
  ring: string;
  danger: string;
  dangerForeground: string;
  chart1: string;
  chart2: string;
  chart3: string;
  chart4: string;
  chart5: string;
}

export interface VisionOrnaments {
  grain: boolean;
  glow: boolean;
  texture: boolean;
}

/**
 * Theme families group the catalog into a small, legible taxonomy.
 * Each theme declares exactly one family; family copy lives in
 * `vde-themes/families.ts`.
 */
export const THEME_FAMILY_IDS = [
  "editorial",
  "minimal",
  "technical",
  "atmospheric",
  "expressive",
] as const;

export type ThemeFamilyId = (typeof THEME_FAMILY_IDS)[number];

export interface ThemeFamily {
  id: ThemeFamilyId;
  name: string;
  description: string;
}

export type ThemeMode = "light" | "dark";

export interface VisionTheme {
  id: string;
  name: string;
  archetype: string;
  description: string;
  /** Grouping key — see `themeFamilies`. */
  family: ThemeFamilyId;
  /** One crisp sentence; the canonical short description. */
  tagline: string;
  /** Two to three sentences of longer-form description. */
  summary: string;
  /** Concrete use cases this theme is suited to. */
  bestFor: string[];
  /** Adjective tags describing the theme's character. */
  mood: string[];
  defaultMode: ThemeMode;
  colors: { light: VisionColors; dark: VisionColors };
  artisticPillars: ArtisticPillars;
  ornaments: VisionOrnaments;
}

export interface VisionContextValue {
  availableVisions: VisionTheme[];
  activeVision: VisionTheme;
  activeVisionId: string;
  setVision: (visionId: string) => void;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}
