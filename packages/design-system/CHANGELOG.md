# Migration to OKLCH Color System

## 3.0.0

### Major Changes

- f128948: Give the system a floor, real scales, and fonts that actually load.

  The architecture was already right — `vde-core` owns the contract, `vde-themes` owns the
  values — so this changes values and closes machinery holes rather than restructuring anything.

  **Foundations.** A real seven-step type scale, resolved from each theme's multipliers and
  clamped so no theme can push interactive text below 14px or body copy below 16px. The 8-point
  spacing scale `ARCHITECTURE.md` documented but that never existed in code. A `--vde-measure`
  token for prose. `boundaryLogic.radius` split into `surface` / `control` / `pill`, because one
  radius for every element is why `clay_soft` rendered cards as capsules. Self-hosted fonts,
  emitted per vision — all 12 visions named ~19 families and loaded none of them.
  `prefers-reduced-motion` honoured, which nothing did.

  **An enforced floor.** `validate-design-floors.mjs` checks contrast, line-height, tracking,
  radius, edge redundancy and motion across every vision in both modes, and runs in
  `pnpm validate`; it found 17 WCAG AA failures on button fills, all fixed by darkening the fill.
  axe now asserts per story in the Storybook test runner. A new `no-raw-design-values` ESLint rule
  covers raw colours, off-scale sizes and `text-xs`.

  **Character kept.** Expressive visions keep their neon, chrome, mesh and spring. What went was
  the unconsidered default: purple-to-cyan `rgba` literals hardcoded as fallbacks inside four
  components, firing in every vision regardless of palette.

  **Components.** Section eyebrows are opt-in and no longer ship placeholder marketing copy.
  `FeatureTile`'s icon is inline with its heading. `NavigationOrb` gained focus styles, the 14px
  floor, `inert`, Escape and focus restoration. Charts require a `title`.

  Adds `quiet_workshop` as a thirteenth vision. Deprecates and freezes `src/intent/`.

  See `MIGRATION_V3.md`.

## 2.1.0

### Minor Changes

- d1a9488: Add dependency-free, themeable SVG chart primitives: `LineChart`, `BarChart`, `AreaChart`, and `Donut`. Series colors are token-driven (`var(--chart-1..5)`) and adapt to the active vision theme — no charting library and no new runtime dependency. Each ships with Storybook stories and is exported from the package root.

## 2.0.0

### Major Changes

- 2439c98: Remove the legacy token-profile system. `createTheme`, `applyTheme`,
  `createTailwindPreset`, `publicProfile`/`dashboardProfile`/`experimentalProfile`,
  the profile token types, the `./tailwind` and `./tokens` entry points, and the
  `public/dashboard/experimental.css` files are gone. The `@nikolayvalev/design-tokens`
  package is discontinued. Use `VisionProvider` + the vision themes; import per-vision
  CSS from `@nikolayvalev/design-system/styles/<visionId>.css`.

## 1.2.0

### Minor Changes

- 8a6c3aa: portal + cli + docs rollout

## 1.1.0

### Minor Changes

- 183fe0c: Add new Vision theme discovery helpers:
  - `getVisionThemeById(themeId)`
  - `getVisionThemeIds()`
  - `getVisionThemeNames()`
  - `isVisionThemeId(themeId)`

## 1.0.0

### Major Changes

- Release `@nikolayvalev/design-system` as `1.0.0`.

  This major marks the first stable line for the visual-first versioning policy and includes the new intent-driven styling API (`goal` / `feeling` / `purpose`) with expanded design modes (`lab`, `pop`, `zen`, `museum`, `brutal`, `immersive`).

## Summary

The design system has been updated to use OKLCH color space and Tailwind CSS v4 modern syntax, providing better perceptual uniformity and access to wider color gamuts.

## Key Changes

### 1. Color Space Migration: HSL → OKLCH

**Before (HSL):**

```css
--primary: hsl(221.2 83.2% 53.3%);
```

**After (OKLCH):**

```css
--primary: oklch(0.205 0 0);
```

**Benefits:**

- Perceptually uniform (equal numeric changes = equal visual changes)
- Wider color gamut (more vibrant colors available)
- Better color interpolation for gradients and transitions

### 2. New Token Categories

Added support for:

- **Chart colors**: `chartOne` through `chartFive` for data visualization (mapped to CSS variables like `--chart-1` through `--chart-5`)
- **Sidebar tokens**: Dedicated tokens for sidebar components
  - `sidebar`, `sidebarForeground`
  - `sidebarPrimary`, `sidebarPrimaryForeground`
  - `sidebarAccent`, `sidebarAccentForeground`
  - `sidebarBorder`, `sidebarRing`

### 3. Radius System Update

**Before:** Multiple fixed values

```ts
radius: {
  sm: '0.25rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
}
```

**After:** Base value with calculations

```ts
radius: {
  base: '0.625rem',
  sm: 'calc(var(--radius) - 4px)',
  md: 'calc(var(--radius) - 2px)',
  lg: 'var(--radius)',
  xl: 'calc(var(--radius) + 4px)',
}
```

### 4. Typography Update

**Font Family:** System fonts → Geist

```css
--font-family-sans: Geist, Geist Fallback;
--font-family-mono: Geist Mono, Geist Mono Fallback;
```

### 5. Tailwind CSS v4 Integration

**New global.css structure:**

```css
@import "tailwindcss";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-primary: var(--primary);
  --radius-lg: var(--radius);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
}
```

### 6. Dark Mode Support

Public profile now includes automatic dark mode variant using `.dark` class:

```css
.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  /* ... */
}
```

## Updated Profiles

### Public Profile (Light + Dark)

- Light mode with dark variant
- OKLCH colors for better perceptual consistency
- Geist font family
- Base radius: 0.625rem

### Dashboard Profile (Dark-first)

- Optimized for prolonged use
- Dark OKLCH palette
- Compact density mode
- Chart colors optimized for dark backgrounds

### Experimental Profile

- High contrast OKLCH colors
- Sharp corners (0 radius)
- Bold color choices

## API Changes

### Token Overrides

**Before:**

```ts
tokens: {
  colors: {
    primary: "hsl(280 100% 70%)";
  }
}
```

**After:**

```ts
tokens: {
  colors: {
    primary: "oklch(0.6 0.25 280)";
  }
}
```

### Radius Configuration

**Before:**

```ts
radius: {
  lg: "2rem";
}
```

**After:**

```ts
radius: {
  base: "2rem"; // All variants calculated from base
}
```

## Breaking Changes

⚠️ **Version Bump Required:** This is a breaking change requiring a major version update

1. Color format changed from HSL to OKLCH
2. Radius structure changed (base + calculations)
3. Font family changed to Geist
4. New required tokens (chart, sidebar)
5. Global CSS structure updated for Tailwind v4

## Migration Guide

### For Consuming Projects

1. **Update imports** (no change needed)
2. **Update custom colors** to OKLCH format:

   ```ts
   // Before
   primary: "hsl(220 80% 50%)";

   // After
   primary: "oklch(0.55 0.18 250)";
   ```

3. **Update radius overrides** to use base:

   ```ts
   // Before
   radius: {
     lg: "1rem";
   }

   // After
   radius: {
     base: "1rem";
   }
   ```

4. **Add Geist fonts** (optional but recommended)

### Converting HSL to OKLCH

Quick reference for common conversions:

- HSL `hsl(220 80% 50%)` ≈ OKLCH `oklch(0.55 0.18 250)`
- HSL `hsl(0 70% 50%)` ≈ OKLCH `oklch(0.55 0.22 25)`
- Use online converters for precise values

## Files Modified

- `src/tokens/types.ts` - Added chart/sidebar tokens, updated radius
- `src/tokens/base.ts` - OKLCH colors, Geist fonts
- `src/tokens/profiles.ts` - Updated all profiles with OKLCH
- `src/styles/global.css` - Tailwind v4 syntax
- `src/tailwind/preset.ts` - Simplified for v4
- `src/theme.ts` - Updated CSS variable generation
- `scripts/build-css.js` - OKLCH support, dark mode generation
- Documentation updated

## Testing

Build verified successfully:

```bash
pnpm build
✅ CSS files built successfully
```

Generated files:

- `dist/styles/public.css` - Light + dark mode
- `dist/styles/dashboard.css` - Dark-first
- `dist/styles/experimental.css` - High contrast
- All TypeScript types and exports
