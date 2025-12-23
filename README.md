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

## Exports

```ts
// Components
import { Button, Card, Input } from '@nikolayvalev/design-system';

// Tokens
import { publicProfile, dashboardProfile } from '@nikolayvalev/design-system/tokens';

// Theme utilities
import { createTheme, applyTheme } from '@nikolayvalev/design-system';

// Tailwind preset
import { createTailwindPreset } from '@nikolayvalev/design-system/tailwind';

// Styles
import '@nikolayvalev/design-system/styles/public.css';
```

## Versioning

Follows semantic versioning. Breaking visual changes require major version bumps. Lock to major version to control visual updates.

See [USAGE.md](./USAGE.md) for detailed examples.
