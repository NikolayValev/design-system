# Design System Library

Configurable design system for Vercel projects. Provides a strong visual baseline with per-project adaptability through design tokens, theme profiles, and composition.

## Architecture

```
src/
├── components/          # Token-driven primitives (Button, Card, Input)
├── tokens/              # Design token definitions and types
│   ├── types.ts        # Core token contracts
│   ├── base.ts         # Shared foundation tokens
│   └── profiles.ts     # Theme profiles (public, dashboard, experimental)
├── tailwind/           # Tailwind preset with semantic naming
├── styles/             # Global CSS with minimal normalization
└── theme.ts            # Configuration API (createTheme, applyTheme)
```

## Installation

```bash
npm install @nikolayvalev/design-system
```

## Quick Start

### 1. Import theme styles

```tsx
// app/layout.tsx
import '@nikolayvalev/design-system/styles/public.css';
```

### 2. Configure Tailwind

```ts
// tailwind.config.ts
import { createTailwindPreset, publicProfile } from '@nikolayvalev/design-system/tailwind';

export default {
  presets: [createTailwindPreset(publicProfile)],
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
};
```

### 3. Use components

```tsx
import { Button, Card } from '@nikolayvalev/design-system';

<Card>
  <Button variant="default">Click me</Button>
</Card>
```

## Key Features

### Design Tokens as Contract

Colors, spacing, typography, radii defined as semantic tokens using **OKLCH color space** for perceptual uniformity. Expressed as CSS variables + TypeScript exports.

```ts
import { baseTokens } from '@nikolayvalev/design-system/tokens';
```

### Theme Profiles

Select from predefined profiles or create custom ones:

- `public` - Marketing sites (light with dark mode, vibrant)
- `dashboard` - Internal tools (dark mode, compact)
- `experimental` - Prototypes (high contrast, sharp edges)

### Modern CSS with Tailwind v4

Built on Tailwind CSS v4 with:
- `@import 'tailwindcss'` syntax
- `@theme inline` for CSS variable mapping
- `@custom-variant dark` for dark mode support
- OKLCH color space throughout

### Runtime Configuration

```tsx
import { createTheme, applyTheme, publicProfile } from '@nikolayvalev/design-system';

const theme = createTheme({
  profile: publicProfile,
  tokens: {
    colors: {
      primary: 'oklch(0.6 0.25 280)',
    },
  },
  density: 'compact',
});

applyTheme(document.documentElement, theme);
```

### Semantic Tailwind Classes

```tsx
<div className="bg-background text-foreground">
  <button className="bg-primary text-primary-foreground">Submit</button>
</div>
```

No hardcoded colors. Styles adapt to active theme profile.

## Components

Minimal primitive set. Extensible through composition, not exhaustive variants.

- `Button` - Variants: default, secondary, destructive, outline, ghost
- `Card` - Semantic container with CardHeader, CardTitle, CardContent
- `Input` - Form primitive

All components read from CSS variables.

## Extending Per Project

### Override tokens

```ts
const theme = createTheme({
  profile: publicProfile,
  tokens: {
    spacing: { md: '1.25rem' },
    radius: { lg: '2rem' },
  },
});
```

### Extend Tailwind theme

```ts
export default {
  presets: [createTailwindPreset(publicProfile)],
  theme: {
    extend: {
      colors: {
        brand: { coral: 'hsl(16 100% 66%)' },
      },
    },
  },
};
```

Extensions don't break the base system.

## Supported Import Paths

All public API is accessed through these stable entrypoints:

```ts
// Root - components and theme utilities
import { Button, Card, Input, createTheme, applyTheme } from '@nikolayvalev/design-system';

// Tokens - profiles and types
import { publicProfile, dashboardProfile, experimentalProfile } from '@nikolayvalev/design-system/tokens';
import type { ThemeProfile, ColorTokens } from '@nikolayvalev/design-system/tokens';

// Tailwind - preset factory and profiles
import { createTailwindPreset, publicProfile } from '@nikolayvalev/design-system/tailwind';

// Styles - choose one CSS file per app
import '@nikolayvalev/design-system/styles/public.css';      // Light + dark mode
import '@nikolayvalev/design-system/styles/dashboard.css';   // Dark mode, compact
import '@nikolayvalev/design-system/styles/experimental.css'; // High contrast
```

**Do NOT import from:**
- `@nikolayvalev/design-system/dist/*` (internals)
- `@nikolayvalev/design-system/src/*` (source files)
- Deep paths not listed above

## DO / DON'T

### ✅ DO

- **Use stable import paths** as documented above
- **Pick one CSS profile** per application
- **Override tokens** via `createTheme()` for customization
- **Lock major version** in package.json to control visual updates
- **Use semantic classes** like `bg-primary` instead of hardcoded colors
- **Import profiles** from `/tailwind` or `/tokens` entrypoints

### ❌ DON'T

- **Deep import** from `dist` or `src` folders
- **Import multiple CSS profiles** in the same app (causes conflicts)
- **Hardcode OKLCH values** in your code - use tokens instead
- **Rely on CSS class names** as API (implementation detail)
- **Modify node_modules** - use override patterns instead
- **Assume monorepo paths** in your Tailwind content globs

## Profile Details

### `public` Profile

**Use case:** Marketing sites, landing pages, public-facing apps

**Characteristics:**
- Light mode by default with dark mode support via `.dark` class
- Vibrant, accessible color palette
- Comfortable spacing (density: comfortable)
- Moderate border radius
- OKLCH colors optimized for wide gamut displays

**Import:**
```ts
import '@nikolayvalev/design-system/styles/public.css';
import { publicProfile } from '@nikolayvalev/design-system/tailwind';
```

### `dashboard` Profile

**Use case:** Internal tools, admin panels, data-heavy interfaces

**Characteristics:**
- Dark mode only
- Muted, professional palette
- Compact spacing (density: compact) for information density
- Reduced contrast for long sessions
- Sidebar theming included

**Import:**
```ts
import '@nikolayvalev/design-system/styles/dashboard.css';
import { dashboardProfile } from '@nikolayvalev/design-system/tailwind';
```

### `experimental` Profile

**Use case:** Prototypes, creative projects, unconventional designs

**Characteristics:**
- Pure black background
- High contrast colors
- Zero border radius (sharp corners)
- Bold, neon-like accent colors
- Comfortable spacing

**Import:**
```ts
import '@nikolayvalev/design-system/styles/experimental.css';
import { experimentalProfile } from '@nikolayvalev/design-system/tailwind';
```

## Versioning

Follows **strict semantic versioning** with visual-first breaking change policy:

- **Major (x.0.0):** Any visual change (token values, component rendering, CSS output)
- **Minor (0.x.0):** New features, new components, new profiles (backward compatible)  
- **Patch (0.0.x):** Fixes with zero visual impact (types, docs, internal refactoring)

Lock to major version to control when visual updates happen:

```json
{
  "dependencies": {
    "@nikolayvalev/design-system": "~0.1.0"
  }
}
```

See [MIGRATION.md](./MIGRATION.md) for upgrade guides and [CONTRIBUTING.md](./CONTRIBUTING.md) for versioning details.

## Getting Started

- **Next.js App Router:** See [QUICKSTART.md](./QUICKSTART.md) for 5-minute setup
- **Detailed examples:** See [USAGE.md](./USAGE.md)
- **Contributing:** See [CONTRIBUTING.md](./CONTRIBUTING.md)
