# Design System

A production-grade design system and component library by [Nikolay Valev](https://github.com/NikolayValev) — built with OKLCH color tokens, 12 curated visual themes (each with hand-tuned light **and** dark palettes), composable React components, and a hosted MCP server so AI agents can browse and install components directly.

## Highlights

- **Token-driven theming** in the perceptually-uniform OKLCH color space — colors, spacing, type, and radii expressed as semantic `--vde-*` CSS variables with shadcn-compatible aliases.
- **12 curated visions across 5 families**, each shipping a native light and dark palette and switchable at runtime.
- **AI-native distribution** — a hosted Model Context Protocol (MCP) server lets agents like Claude, Cursor, and Windsurf browse, fetch, and install components.
- **Composable React components** that read entirely from CSS variables, so the same markup re-skins instantly across visions.
- **Monorepo engineering** — TurboRepo + pnpm workspaces, Storybook with visual regression tests, semantic-versioned releases, and Terraform IaC.

## Live Demo

The full platform is browsable online:

- **Home** — `https://designsystem.nikolayvalev.com/`
- **For engineers** — `https://designsystem.nikolayvalev.com/engineers`
- **For recruiters** — `https://designsystem.nikolayvalev.com/recruiters`
- **Component catalog** — `https://designsystem.nikolayvalev.com/catalog`
- **Docs** — `https://designsystem.nikolayvalev.com/docs`
- **Storybook** — `https://designsystem.nikolayvalev.com/storybook`

## Packages

| Package                           | npm                                                                                                                                   | Description                                          |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `@nikolayvalev/design-system`     | [![npm](https://img.shields.io/npm/v/@nikolayvalev/design-system)](https://www.npmjs.com/package/@nikolayvalev/design-system)         | React components, vision themes, per-vision CSS, CLI |
| `@nikolayvalev/design-system-mcp` | [![npm](https://img.shields.io/npm/v/@nikolayvalev/design-system-mcp)](https://www.npmjs.com/package/@nikolayvalev/design-system-mcp) | MCP server for AI agents                             |

## Quick Start

```bash
npm install @nikolayvalev/design-system
```

### 1. Import one vision's styles

```tsx
// app/layout.tsx
import "@nikolayvalev/design-system/styles/editorial.css";
```

### 2. Wrap the app in VisionProvider

```tsx
// app/layout.tsx
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

### 3. Install and use components (source files)

Component source is installed via MCP `get_component_bundle` and committed into your repo (shadcn-style):

```tsx
// after MCP get_component_bundle(["Button", "Card"])
import { Button } from "@/design-system/components/Button";
import { Card } from "@/design-system/components/Card";

<Card>
  <Button variant="default">Click me</Button>
</Card>;
```

### Optional CLI scaffold

```bash
npx @nikolayvalev/design-system@latest init
```

The CLI offers an arrow-key selector (`themes`, `components`, `pages`) in TTY terminals; selecting `themes` opens a vision picker with color swatches and vibe descriptions for all 12 visions. You can also run it non-interactively:

```bash
npx @nikolayvalev/design-system@latest init --modules themes,components --vision editorial
```

By default it links your MCP client config to `https://designsystem.nikolayvalev.com/mcp`.

## MCP Server (AI-native tooling)

AI agents (Claude, Cursor, Windsurf) can browse components, fetch source, and install them directly.

**Hosted endpoint:** `https://mcp-server-umber-six.vercel.app/mcp`

Add to your MCP client config:

```json
{
  "mcpServers": {
    "design-system": {
      "url": "https://mcp-server-umber-six.vercel.app/mcp"
    }
  }
}
```

Or run locally via stdio:

```bash
DESIGN_SYSTEM_SRC_DIR=/path/to/packages/design-system/src \
  npx @nikolayvalev/design-system-mcp --transport stdio
```

## Consumption Model

- `@nikolayvalev/design-system`: the single runtime dependency — vision themes, per-vision CSS, `VisionProvider`, and component source templates.
- Components: installed as source files via MCP `get_component_bundle` and committed per consuming repo.

## Architecture

```
src/
|-- components/          # Token-driven primitives (Button, Card, Input)
|-- intent/              # Goal/feeling/purpose style recipes (lab, pop, zen, museum, brutal, immersive)
|-- vde-themes/          # Vision theme definitions (12 themes across 5 families)
|-- vde-core/            # VisionProvider, useVision, registry types
|-- styles/              # Per-vision CSS files (one per vision ID)
```

## Key Features

### Design Tokens as Contract

Colors, spacing, typography, radii defined as semantic tokens using **OKLCH color space** for perceptual uniformity. Expressed as `--vde-*` CSS variables with shadcn-compatible aliases (`--primary`, `--background`, etc.).

### Vision Themes

12 curated visions across five families. Import one per-vision CSS file and wrap the tree in `VisionProvider`:

```tsx
import "@nikolayvalev/design-system/styles/synthwave.css";
import {
  VisionProvider,
  defaultVisionRegistry,
} from "@nikolayvalev/design-system";
```

Switch visions at runtime with `useVision().setVision(id)`.

### Runtime Vision Switching

```tsx
import { useVision } from "@nikolayvalev/design-system";

function VisionPicker() {
  const { setVision } = useVision();
  return <button onClick={() => setVision("noir")}>Switch to Noir</button>;
}
```

### Light & Dark Mode

Every vision ships a hand-tuned **light and dark** palette and declares a native `defaultMode`. The active mode resolves from: an explicit `mode` prop → a `defaultMode` prop → the browser's `prefers-color-scheme` (falling back to the vision's `defaultMode` during SSR). Toggle it at runtime:

```tsx
import { useVision } from "@nikolayvalev/design-system";

function ModeToggle() {
  const { mode, toggleMode } = useVision();
  return (
    <button onClick={toggleMode}>{mode === "dark" ? "Light" : "Dark"}</button>
  );
}
```

`VisionProvider` accepts `mode`, `defaultMode`, and `onModeChange`. The active mode is written to `data-vde-mode` on the target element, and each per-vision CSS file includes a default-mode `:root` block plus `[data-vde-mode="…"]` (and `.dark`/`.light`) overrides — so non-React consumers switch modes with the attribute or class.

### Modern CSS with Tailwind v4

Built on Tailwind CSS v4 with:

- `@import 'tailwindcss'` syntax
- `@theme inline` for CSS variable mapping
- `@custom-variant dark` for dark mode support
- OKLCH color space throughout

### Intent-Based Style Recipes

Use intent variants through explicit design intent: `goal + feeling + purpose`.
Supported modes: `lab`, `pop`, `zen`, `museum`, `brutal`, `immersive`.
Common purposes: `theme-wrapper`, `active-tab`, `card`, `button-primary`, `button-secondary`, `input-field`, `surface`, `layout-container`.

```ts
import {
  getDesignStyle,
  getDesignStyleByIntent,
} from "@nikolayvalev/design-system";

const cardClass = getDesignStyle("lab", "card");
const brutalInputClass = getDesignStyle("brutal", "input-field");

const primaryButtonClass = getDesignStyleByIntent({
  goal: "joy",
  feeling: "euphoria",
  purpose: "button-primary",
});
```

### Semantic Tailwind Classes

```tsx
<div className="bg-background text-foreground">
  <button className="bg-primary text-primary-foreground">Submit</button>
</div>
```

No hardcoded colors. Styles adapt to the active vision.

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

The registry ships **12 curated visions** across five families:

- **Editorial & Print** — `editorial`, `museum`
- **Minimal & Structured** — `swiss_international`, `zen`, `clay_soft`
- **Technical & Utility** — `terminal`, `brutalist`
- **Atmospheric & Luminous** — `immersive`, `synthwave`, `noir`
- **Expressive & Statement** — `solarpunk`, `y2k_chrome`

Each theme carries structured metadata — `family`, `tagline`, `summary`, `bestFor`, and `mood` — alongside its colors and artistic pillars. Family names and descriptions live in `themeFamilies`.

Runtime helpers:

```ts
import {
  getVisionThemeIds,
  getVisionThemeById,
  defaultVisionRegistry,
  themeFamilies,
  groupThemesByFamily,
  visionThemes,
} from "@nikolayvalev/design-system";

const allVisionIds = getVisionThemeIds();
const editorial = getVisionThemeById("editorial");
defaultVisionRegistry.get("terminal");
const byFamily = groupThemesByFamily(visionThemes);
```

## Extending Per Project

### Override CSS variables

After importing the per-vision CSS, override individual tokens in your own stylesheet:

```css
:root {
  --primary: oklch(0.6 0.25 280); /* project-level override */
  --radius: 1rem;
}
```

### Extend Tailwind theme

```ts
export default {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { coral: "hsl(16 100% 66%)" },
      },
    },
  },
};
```

Extensions don't break the base system.

## Supported Import Paths

All public API is accessed through these stable entrypoints:

```ts
// Vision API
import {
  VisionProvider,
  useVision,
  visionThemes,
  themeFamilies,
  getVisionThemeById,
  defaultVisionRegistry,
  groupThemesByFamily,
} from "@nikolayvalev/design-system";

// Styles — import exactly one per-vision CSS file per app
import "@nikolayvalev/design-system/styles/editorial.css";
// or: museum | swiss_international | zen | clay_soft | terminal | brutalist
//     immersive | synthwave | noir | solarpunk | y2k_chrome

// Components - source-installed in your app/repo via MCP get_component_bundle
import { Button } from "@/design-system/components/Button";
import { Card } from "@/design-system/components/Card";
```

**Do NOT import from:**

- `@nikolayvalev/design-system/dist/*` (internals)
- `@nikolayvalev/design-system/src/*` (source files)
- Deep paths not listed above

## DO / DON'T

### DO

- **Use stable import paths** as documented above
- **Import exactly one per-vision CSS file** per application
- **Override CSS variables** after the vision import for per-project customization
- **Lock major version** in package.json to control visual updates
- **Use semantic classes** like `bg-primary` instead of hardcoded colors
- **Install components as source** via MCP `get_component_bundle` and commit them in each consuming repo

### DON'T

- **Deep import** from `dist` or `src` folders
- **Import multiple vision CSS files** in the same app (causes conflicts)
- **Hardcode OKLCH values** in your code — use CSS variables instead
- **Rely on CSS class names** as API (implementation detail)
- **Modify node_modules** — use CSS variable overrides instead
- **Assume monorepo paths** in your Tailwind content globs

## Versioning

Follows **strict semantic versioning** with a visual-first breaking change policy:

- **Major (x.0.0):** Any visual change (token values, component rendering, CSS output)
- **Minor (x.y.0):** New features, new components, new vision themes (backward compatible)
- **Patch (x.y.z):** Fixes with zero visual impact (types, docs, internal refactoring)

Lock to a major version to control when visual updates happen:

```json
{
  "dependencies": {
    "@nikolayvalev/design-system": "^2.0.0"
  }
}
```

See [MIGRATION.md](./MIGRATION.md) for upgrade guides and [CONTRIBUTING.md](./CONTRIBUTING.md) for versioning details.

## Getting Started

- **Next.js App Router:** See [QUICKSTART.md](./QUICKSTART.md) for 5-minute setup
- **Detailed examples:** See [USAGE.md](./packages/design-system/USAGE.md)
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
