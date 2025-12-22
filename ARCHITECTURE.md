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

```ts
interface DesignTokens {
  colors: ColorTokens;      // 32 semantic colors (includes chart + sidebar)
  spacing: SpacingTokens;   // 8-point scale
  radius: RadiusTokens;     // Base value + calculated variants
  typography: TypographyTokens;
}
```

The contract is versioned. Breaking changes require major version bump.

### CSS Variables

All tokens are exposed as CSS custom properties using OKLCH:

```css
:root {
  --primary: oklch(0.205 0 0);
  --background: oklch(1 0 0);
  --spacing-md: 1rem;
  --radius: 0.625rem;
  --font-family-sans: Geist, Geist Fallback;
}

/* Radius calculations */
--radius-sm: calc(var(--radius) - 4px);
--radius-md: calc(var(--radius) - 2px);
--radius-lg: var(--radius);
--radius-xl: calc(var(--radius) + 4px);
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

## Theme Profiles

Profiles are named token bundles representing different use cases:

### Public Profile
- **Use case**: Marketing sites, public-facing applications
- **Characteristics**: Clean, approachable, includes dark mode variant
- **Colors**: OKLCH light mode with `.dark` class support
- **Radius**: Comfortable (0.625rem base)
- **Density**: Comfortable
- **Typography**: Geist font family

### Dashboard Profile
- **Use case**: Internal tools, data-heavy interfaces
- **Characteristics**: Dark-first, efficient, high information density
- **Colors**: OKLCH dark palette optimized for prolonged use
- **Radius**: Comfortable (0.625rem base)
- **Density**: Compact (reduced spacing)
- **Typography**: Geist font family

### Experimental Profile
- **Use case**: Prototypes, creative projects
- **Characteristics**: Bold, unconventional, high contrast
- **Colors**: OKLCH black background with vibrant accents
- **Radius**: Zero (sharp corners)
- **Density**: Comfortable
- **Typography**: Geist font family

Profiles override **values**, not logic. Component behavior remains identical.

## Configuration API

### Static Configuration (Build Time)

Select profile in Tailwind config:

```ts
import { createTailwindPreset, dashboardProfile } from '@nikolayvalev/design-system/tailwind';

export default {
  presets: [createTailwindPreset(dashboardProfile)],
};
```

Import corresponding CSS:

```tsx
import '@nikolayvalev/design-system/styles/dashboard.css';
```

### Dynamic Configuration (Runtime)

Override tokens programmatically:

```ts
import { createTheme, applyTheme, publicProfile } from '@nikolayvalev/design-system';

const theme = createTheme({
  profile: publicProfile,
  tokens: {
    colors: { primary: 'oklch(0.6 0.25 280)' },
    spacing: { md: '1.25rem' },
  },
  density: 'compact',
});

applyTheme(document.documentElement, theme);
```

Changes apply immediately without rebuilding.

## Component Architecture

### Principles

1. **No hardcoded aesthetics** - All styling from CSS variables
2. **Composition over configuration** - Small surface area, compose for complexity
3. **Extensible variants** - Allow new variants, don't ship exhaustive ones
4. **No layout opinions** - Spacing/layout handled by consuming project

### Example: Button

```tsx
<Button 
  variant="default"  // semantic variant
  size="md"          // density-aware sizing
  className="..."    // project extensions allowed
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
        md: 'var(--spacing-md)',
      },
      borderRadius: {
        lg: 'var(--radius-lg)',
      },
    },
  },
}
```

### Fallback Values

CSS variables include fallback values from selected profile:

```ts
primary: `hsl(var(--color-primary, ${hslToTailwind(profile.colors.primary)}))`
```

Ensures styles work even if variables aren't injected.

### Extension Pattern

Projects extend theme **without** breaking the base:

```ts
export default {
  presets: [createTailwindPreset(publicProfile)],
  theme: {
    extend: {
      colors: {
        brand: { coral: 'hsl(16 100% 66%)' },  // Project-specific
      },
    },
  },
};
```

Semantic tokens remain unchanged. New tokens coexist.

## Density Modes

**Comfortable** - Standard spacing, relaxed
**Compact** - Reduced spacing, efficient

Applied via `data-density` attribute:

```css
[data-density='comfortable'] {
  --spacing-multiplier: 1;
}

[data-density='compact'] {
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
- Adding new theme profiles
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
├── index.js                    # Main entry (components + theme API)
├── index.d.ts
├── tokens/
│   ├── index.js               # Token exports
│   └── index.d.ts
├── tailwind/
│   ├── index.js               # Preset factory
│   └── index.d.ts
└── styles/
    ├── global.css             # Base normalization
    ├── public.css             # Public profile + global
    ├── dashboard.css          # Dashboard profile + global
    └── experimental.css       # Experimental profile + global
```

## Extension Points

### 1. Token Override

```ts
createTheme({
  tokens: { colors: { primary: '...' } }
})
```

### 2. Custom Profile

```ts
const customProfile: ThemeProfile = {
  name: 'custom',
  tokens: { ...baseTokens, colors: { ... } },
};
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
