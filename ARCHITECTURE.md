# Architecture Documentation

## Design Philosophy

**Shared vibe, not identical appearance.**

The design system provides infrastructure, not a rigid theme. Projects should feel related but are allowed to diverge visually without fighting the system.

## Token System

### OKLCH Color Space

All colors use **OKLCH** (Oklch color space) instead of HSL for:

- **Perceptual uniformity**: Equal numeric changes produce equal perceptual changes
- **Wider gamut**: Access to more vibrant colors
- **Better interpolation**: Smoother gradients and transitions

```css
/* OKLCH format: oklch(lightness chroma hue) */
--primary: oklch(0.6 0.25 280);
/* lightness: 0-1, chroma: 0-0.4, hue: 0-360 */
```

### Semantic Naming

All tokens use semantic names that describe **purpose**, not appearance:

- `primary` not `blue`
- `background` not `white`
- `destructive` not `red`

This allows visual changes without touching application code.

### Token Contract

The contract is `VisionTheme` in `packages/design-system/src/vde-core/types.ts`, validated
against `ThemeSchema.json` (`additionalProperties: false`). A theme supplies a palette
per mode plus five "artistic pillars":

```ts
interface VisionTheme {
  id: string;
  family: ThemeFamilyId; // editorial | minimal | technical | atmospheric | expressive
  defaultMode: "light" | "dark";
  colors: { light: VisionColors; dark: VisionColors }; // 20 semantic colours per mode
  artisticPillars: {
    typographyArchitecture; // scale multipliers, line heights, letter spacing, font stacks
    surfacePhysics; // transparency, blur, texture, grain
    boundaryLogic; // border weight, radius scale (surface / control / pill), sharpness
    shadowLightEngine; // hard offset, neon glow, ambient occlusion
    motionSignature; // durations, easings, physics
  };
  ornaments: { grain: boolean; glow: boolean; texture: boolean };
}
```

A theme does **not** author absolute type sizes or a spacing scale. It supplies multipliers,
and `vde-core/css.ts` resolves them against a core scale — clamping the result so no theme
can push interactive text below 14px or body copy below 16px.

The contract is versioned. Breaking changes require a major version bump.

### CSS Variables

`visionToCSSVariables()` emits roughly 120 custom properties per vision per mode. The
`--vde-*` namespace is the source; a shadcn-compatible alias layer is derived from it.

```css
:root {
  /* Colour — 20 semantic slots, mode-aware, OKLCH */
  --vde-color-background: oklch(0.992 0.004 75);
  --vde-color-accent: oklch(0.565 0.14 40);

  /* Type — resolved from the core scale by the theme's multipliers, then floored */
  --vde-font-size-caption: 0.8125rem;
  --vde-font-size-ui: 0.875rem; /* the interactive floor */
  --vde-font-size-body: 1rem;
  --vde-font-size-title: 1.5rem;
  --vde-font-size-headline: 2.25rem;
  --vde-font-size-display: 3rem;
  --vde-line-height-ui: 1.25;
  --vde-line-height-normal: 1.5; /* never below 1.5 */
  --vde-measure: 68ch;

  /* Space — structural, identical in every vision, 8-point */
  --vde-space-2xs: 0.25rem; /* … xs sm md lg xl 2xl 3xl */

  /* Shape — three steps, because one radius for everything turns cards into capsules */
  --vde-radius-surface: 0.5rem;
  --vde-radius-control: 0.375rem;
  --vde-radius-pill: 9999px;

  /* Type faces — self-hosted, emitted per vision alongside the tokens */
  --vde-font-body: "Inter", "Helvetica Neue", system-ui, sans-serif;
  --vde-font-display: "Playfair Display", Georgia, serif;
}

/* Tailwind's radius steps map onto the scale rather than calc()-ing off one value */
--radius-sm: var(--vde-radius-control);
--radius-lg: var(--vde-radius-surface);
--radius-full: var(--vde-radius-pill);
```

### Tailwind v4 Integration

Uses modern `@theme inline` syntax to bridge CSS variables to Tailwind utilities:

```css
@theme inline {
  --color-primary: var(--primary);
  --color-background: var(--background);
  --radius-lg: var(--radius);
}
```

Components reference variables, never raw values:

```tsx
// Good
<div className="bg-primary text-primary-foreground" />

// Bad
<div style={{ background: '#3b82f6' }} />
```

## Vision Themes

The design system ships **13 curated visions** across five families. Each vision provides a complete set of `--vde-*` CSS custom properties (colors, spacing, radius, typography motion) plus shadcn-compatible aliases (`--primary`, `--background`, `--foreground`, etc.).

Families and vision IDs:

- **Editorial & Print** — `editorial`, `museum`
- **Minimal & Structured** — `swiss_international`, `zen`, `clay_soft`
- **Technical & Utility** — `terminal`, `brutalist`
- **Atmospheric & Luminous** — `immersive`, `synthwave`, `noir`
- **Expressive & Statement** — `solarpunk`, `y2k_chrome`

### Selecting a Vision

Import the per-vision CSS in your root layout (one file per app):

```tsx
// app/layout.tsx
import "@nikolayvalev/design-system/styles/editorial.css";
```

Wrap the React tree in `VisionProvider` and supply a default vision:

```tsx
import {
  VisionProvider,
  defaultVisionRegistry,
} from "@nikolayvalev/design-system";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <VisionProvider
          registry={defaultVisionRegistry}
          defaultVisionId="editorial"
        >
          {children}
        </VisionProvider>
      </body>
    </html>
  );
}
```

Switch visions at runtime via the `useVision` hook:

```tsx
import { useVision } from "@nikolayvalev/design-system";

function VisionPicker() {
  const { setVision } = useVision();
  return (
    <button onClick={() => setVision("synthwave")}>Switch to Synthwave</button>
  );
}
```

### CSS Variable Contract

All tokens are exposed under the `--vde-*` namespace. The vision layer also emits the shadcn-compatible aliases so components work without changes:

```css
:root {
  /* Vision layer */
  --vde-color-primary: oklch(0.6 0.25 280);
  --vde-radius-base: 0.625rem;

  /* shadcn aliases emitted by the vision */
  --primary: var(--vde-color-primary);
  --background: var(--vde-color-background);
  --foreground: var(--vde-color-foreground);
  --radius: var(--vde-radius-base);
}
```

Components reference `--primary`, `--background`, etc. and automatically reflect whichever vision is active.

### Runtime Helpers

```ts
import {
  visionThemes,
  themeFamilies,
  getVisionThemeById,
  defaultVisionRegistry,
  groupThemesByFamily,
} from "@nikolayvalev/design-system";

const editorial = getVisionThemeById("editorial");
const byFamily = groupThemesByFamily(visionThemes);
defaultVisionRegistry.get("terminal");
```

## Component Architecture

### Principles

1. **No hardcoded aesthetics** - All styling from CSS variables
2. **Composition over configuration** - Small surface area, compose for complexity
3. **Extensible variants** - Allow new variants, don't ship exhaustive ones
4. **No layout opinions** - Spacing/layout handled by consuming project

### Example: Button

```tsx
<Button
  variant="default" // semantic variant
  size="md" // density-aware sizing
  className="..." // project extensions allowed
>
  Submit
</Button>
```

Variants map to semantic tokens:

```ts
{
  default: 'bg-primary text-primary-foreground',
  destructive: 'bg-destructive text-destructive-foreground',
}
```

CSS variables resolve at runtime based on active theme.

## Tailwind Integration

### Preset Structure

```ts
{
  theme: {
    extend: {
      colors: {
        primary: 'hsl(var(--color-primary))',
        background: 'hsl(var(--color-background))',
      },
      spacing: {
        md: 'var(--vde-space-md)',
      },
      borderRadius: {
        lg: 'var(--radius-lg)',
      },
    },
  },
}
```

### Extension Pattern

Projects extend the Tailwind theme **without** breaking the base:

```ts
export default {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { coral: "hsl(16 100% 66%)" }, // Project-specific
      },
    },
  },
};
```

Semantic tokens (sourced from the active vision via CSS variables) remain unchanged. Project-specific tokens coexist.

## Density Modes

**Comfortable** - Standard spacing, relaxed
**Compact** - Reduced spacing, efficient

Applied via `data-density` attribute:

```css
[data-density="comfortable"] {
  --spacing-multiplier: 1;
}

[data-density="compact"] {
  --spacing-multiplier: 0.875;
}
```

Components can reference multiplier for density-aware sizing.

## Versioning Discipline

### Semantic Versioning

- **Major (1.0.0 → 2.0.0)**: Breaking changes to token names, component APIs, visual appearance
- **Minor (1.0.0 → 1.1.0)**: New tokens, new components, backwards-compatible additions
- **Patch (1.0.0 → 1.0.1)**: Bug fixes, documentation, internal refactors

### Visual Breaking Changes

Visual changes that affect user perception are **major**:

- Changing default color values
- Removing or renaming tokens
- Changing component default variants
- Altering spacing scales

### Non-Breaking Changes

- Adding new tokens (with new names)
- Adding new component variants
- Adding new vision themes
- Improving accessibility (if no visual change)

### Upgrade Strategy

Projects lock to major version:

```json
{
  "dependencies": {
    "@nikolayvalev/design-system": "^1.0.0"
  }
}
```

Visual updates are **intentional**, not automatic.

## Build Output

```
dist/
├── index.js                    # Main entry (components + vision API)
├── index.d.ts
└── styles/
    ├── global.css              # Base normalization
    ├── editorial.css           # Editorial vision
    ├── museum.css              # Museum vision
    ├── swiss_international.css # Swiss International vision
    ├── zen.css                 # Zen vision
    ├── clay_soft.css           # Clay Soft vision
    ├── terminal.css            # Terminal vision
    ├── brutalist.css           # Brutalist vision
    ├── immersive.css           # Immersive vision
    ├── synthwave.css           # Synthwave vision
    ├── noir.css                # Noir vision
    ├── solarpunk.css           # Solarpunk vision
    └── y2k_chrome.css          # Y2K Chrome vision
```

## Extension Points

### 1. Vision Selection

```tsx
import {
  VisionProvider,
  defaultVisionRegistry,
} from "@nikolayvalev/design-system";
// Wrap your tree; switch at runtime with useVision().setVision(id)
<VisionProvider registry={defaultVisionRegistry} defaultVisionId="zen">
  {children}
</VisionProvider>;
```

### 2. CSS Variable Override

Override individual `--vde-*` or shadcn-alias variables in your own CSS after the vision import:

```css
:root {
  --primary: oklch(0.6 0.25 280); /* project-level override */
}
```

### 3. Tailwind Extension

```ts
theme: { extend: { colors: { brand: {...} } } }
```

### 4. Component Composition

```tsx
function CustomButton({ children }) {
  return (
    <Button variant="default" className="shadow-lg">
      {children}
    </Button>
  );
}
```

All extension points preserve the base system.

## Anti-Patterns

❌ **Forking the library** - Use configuration, not forks  
❌ **Hardcoding colors in app code** - Use semantic tokens  
❌ **Overriding with !important** - Extend properly  
❌ **Creating parallel token systems** - Extend the contract  
❌ **Assuming identical appearance** - Projects should diverge naturally
