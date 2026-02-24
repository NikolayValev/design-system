# Design System Library

Configurable design system for Vercel projects. Provides a strong visual baseline with per-project adaptability through design tokens, theme profiles, and composition.

## Consumption Model

- `@nikolayvalev/design-tokens`: runtime dependency for tokens, profiles, Tailwind preset, and CSS profiles.
- Components: installed as source files via MCP `get_component_bundle` and committed per consuming repo.
- `@nikolayvalev/design-system`: compatibility package for existing consumers.

## Architecture

```
src/
|-- components/          # Token-driven primitives (Button, Card, Input)
|-- intent/              # Goal/feeling/purpose style recipes (lab, pop, zen, museum, brutal, immersive)
|-- tokens/              # Design token definitions and types
|   |-- types.ts         # Core token contracts
|   |-- base.ts          # Shared foundation tokens
|   `-- profiles.ts      # Theme profiles (public, dashboard, experimental)
|-- tailwind/            # Tailwind preset with semantic naming
|-- styles/              # Global CSS with minimal normalization
`-- theme.ts             # Configuration API (createTheme, applyTheme)
```

## Installation

```bash
npm install @nikolayvalev/design-tokens
```

Component source is installed separately via MCP (`get_component_bundle`) and committed into the consuming repo (shadcn-style).

## Quick Start

### 1. Import theme styles

```tsx
// app/layout.tsx
import '@nikolayvalev/design-tokens/styles/public.css';
```

### 2. Configure Tailwind

```ts
// tailwind.config.ts
import { createTailwindPreset, publicProfile } from '@nikolayvalev/design-tokens/tailwind';

export default {
  presets: [createTailwindPreset(publicProfile)],
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
};
```

### 3. Install and use components (source files)

```tsx
// after MCP get_component_bundle(["Button", "Card"])
import { Button } from '@/design-system/components/Button';
import { Card } from '@/design-system/components/Card';

<Card>
  <Button variant="default">Click me</Button>
</Card>
```

Use MCP `get_component_bundle` to fetch component source + support files, write them under `src/design-system`, and commit them in your repo.

### Optional CLI scaffold

Use the design-system CLI to scaffold source folders and MCP config in a consuming repo:

```bash
npx @nikolayvalev/design-system@latest init
```

By default it links your MCP client config to:

```txt
https://designsystem.nikolayvalev.com/mcp
```

## Public Domain Hub

The full platform is browsable from:

- `https://designsystem.nikolayvalev.com/`
- `https://designsystem.nikolayvalev.com/engineers`
- `https://designsystem.nikolayvalev.com/recruiters`
- `https://designsystem.nikolayvalev.com/catalog`
- `https://designsystem.nikolayvalev.com/docs`
- `https://designsystem.nikolayvalev.com/storybook`

## Key Features

### Design Tokens as Contract

Colors, spacing, typography, radii defined as semantic tokens using **OKLCH color space** for perceptual uniformity. Expressed as CSS variables + TypeScript exports.

```ts
import { baseTokens } from '@nikolayvalev/design-tokens/tokens';
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
import { createTheme, applyTheme, publicProfile } from '@nikolayvalev/design-tokens';

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

### Intent-Based Style Recipes

Use intent variants through explicit design intent: `goal + feeling + purpose`.
Supported modes: `lab`, `pop`, `zen`, `museum`, `brutal`, `immersive`.
Common purposes: `theme-wrapper`, `active-tab`, `card`, `button-primary`, `button-secondary`, `input-field`, `surface`, `layout-container`.

```ts
import { getDesignStyle, getDesignStyleByIntent } from '@nikolayvalev/design-system';

const cardClass = getDesignStyle('lab', 'card');
const brutalInputClass = getDesignStyle('brutal', 'input-field');

const primaryButtonClass = getDesignStyleByIntent({
  goal: 'joy',
  feeling: 'euphoria',
  purpose: 'button-primary',
});
```

### Semantic Tailwind Classes

```tsx
<div className="bg-background text-foreground">
  <button className="bg-primary text-primary-foreground">Submit</button>
</div>
```

No hardcoded colors. Styles adapt to active theme profile.

## Components

Core primitives and atmospheric components. Extensible through composition.

- `Button` - Variants: default, secondary, destructive, outline, ghost
- `Card` - Semantic container with CardHeader, CardTitle, CardContent
- `Input` - Form primitive
- `Layout` - Token-driven section shell
- `EditorialHeader` - Vision-aware display heading with `massive` size and writing mode support
- `GalleryStage` - Material-shifting container with archetype ornaments
- `MediaFrame` - Vision-aware image/video wrapper with atmospheric effects
- `AtmosphereProvider` - Global archive/noise or nexus/mesh background utility
- `NavigationOrb` - Floating navigation with vision-specific motion physics
- `SectionShell` - Shared scaffold for building reusable sections
- `FeatureTile` - Tokenized feature block for marketing/product grids
- `StatChip` - Compact metric primitive for KPI strips

Section templates:
- `HeroSection`
- `FeatureGridSection`
- `MetricStripSection`

Page templates:
- `MarketingLandingPage`
- `ProductShowcasePage`

All components read from CSS variables and update through `VisionProvider`/`useVision`.

## Vision Registry

The registry includes legacy and expanded archetypes. New expansion IDs:

- `swiss_international`
- `raw_data`
- `the_archive`
- `the_ether`
- `solarpunk`
- `y2k_chrome`
- `deconstruct`
- `ma_minimalism`
- `clay_soft`
- `zine_collage`

Runtime helpers:

```ts
import { getVisionThemeIds, getVisionThemeById, defaultVisionRegistry } from '@nikolayvalev/design-system';

const allVisionIds = getVisionThemeIds();
const archive = getVisionThemeById('the_archive');
defaultVisionRegistry.get('raw_data');
```

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
// Tokens/runtime theming
import { createTheme, applyTheme } from '@nikolayvalev/design-tokens';

// Tokens - profiles and types
import { publicProfile, dashboardProfile, experimentalProfile } from '@nikolayvalev/design-tokens/tokens';
import type { ThemeProfile, ColorTokens } from '@nikolayvalev/design-tokens/tokens';

// Tailwind - preset factory and profiles
import { createTailwindPreset, publicProfile } from '@nikolayvalev/design-tokens/tailwind';

// Styles - choose one CSS file per app
import '@nikolayvalev/design-tokens/styles/public.css'; // Light + dark mode
import '@nikolayvalev/design-tokens/styles/dashboard.css'; // Dark mode, compact
import '@nikolayvalev/design-tokens/styles/experimental.css'; // High contrast

// Components - source-installed in your app/repo via MCP get_component_bundle
import { Button } from '@/design-system/components/Button';
import { Card } from '@/design-system/components/Card';
```

**Do NOT import from:**
- `@nikolayvalev/design-tokens/dist/*` (internals)
- `@nikolayvalev/design-tokens/src/*` (source files)
- `@nikolayvalev/design-system` for new runtime component dependencies in app repos
- Deep paths not listed above

## DO / DON'T

### DO

- **Use stable import paths** as documented above
- **Pick one CSS profile** per application
- **Override tokens** via `createTheme()` for customization
- **Lock major version** in package.json to control visual updates
- **Use semantic classes** like `bg-primary` instead of hardcoded colors
- **Install components as source** via MCP `get_component_bundle` and commit them in each consuming repo
- **Import profiles** from `/tailwind` or `/tokens` entrypoints

### DON'T

- **Deep import** from `dist` or `src` folders
- **Import multiple CSS profiles** in the same app (causes conflicts)
- **Hardcode OKLCH values** in your code - use tokens instead
- **Rely on CSS class names** as API (implementation detail)
- **Modify node_modules** - use override patterns instead
- **Assume monorepo paths** in your Tailwind content globs
- **Use `@nikolayvalev/design-system` as a new runtime component dependency** in app repos

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
import '@nikolayvalev/design-tokens/styles/public.css';
import { publicProfile } from '@nikolayvalev/design-tokens/tailwind';
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
import '@nikolayvalev/design-tokens/styles/dashboard.css';
import { dashboardProfile } from '@nikolayvalev/design-tokens/tailwind';
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
import '@nikolayvalev/design-tokens/styles/experimental.css';
import { experimentalProfile } from '@nikolayvalev/design-tokens/tailwind';
```

## Versioning

Follows **strict semantic versioning** with visual-first breaking change policy:

- **Major (x.0.0):** Any visual change (token values, component rendering, CSS output)
- **Minor (x.y.0):** New features, new components, new profiles (backward compatible)  
- **Patch (x.y.z):** Fixes with zero visual impact (types, docs, internal refactoring)

Lock to major version to control when visual updates happen:

```json
{
  "dependencies": {
    "@nikolayvalev/design-tokens": "~1.0.0"
  }
}
```

See [MIGRATION.md](./MIGRATION.md) for upgrade guides and [CONTRIBUTING.md](./CONTRIBUTING.md) for versioning details.

## Getting Started

- **Next.js App Router:** See [QUICKSTART.md](./QUICKSTART.md) for 5-minute setup
- **Detailed examples:** See [USAGE.md](./USAGE.md)
- **Contributing:** See [CONTRIBUTING.md](./CONTRIBUTING.md)

## Platform Ops

- **Unified pipeline + deploy setup:** See [docs/PLATFORM_PIPELINE.md](./docs/PLATFORM_PIPELINE.md)
- **Public domain route map:** See [docs/PUBLIC_PORTAL.md](./docs/PUBLIC_PORTAL.md)
- **Terraform IaC for frontend/backend:** See [infra/terraform/README.md](./infra/terraform/README.md)
- **Core project operating model:** See [docs/CORE_PROJECT_PLAYBOOK.md](./docs/CORE_PROJECT_PLAYBOOK.md)
- **Roadmap:** See [docs/CORE_ROADMAP.md](./docs/CORE_ROADMAP.md)
- **App bootstrap:** See [docs/APP_BOOTSTRAP.md](./docs/APP_BOOTSTRAP.md)
- **Operating metrics:** See [docs/OPERATING_METRICS.md](./docs/OPERATING_METRICS.md)
- **Component workbench:** See [docs/STORYBOOK.md](./docs/STORYBOOK.md)
