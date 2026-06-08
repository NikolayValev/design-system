# Example Consumer Project

This demonstrates how to consume the design system in a Next.js application.

## Installation

```bash
npm install @nikolayvalev/design-system
```

Optional scaffold (recommended in new repos):

```bash
npx @nikolayvalev/design-system@latest init
```

In interactive terminals, the CLI shows an arrow-key module selector (`themes`, `components`, `pages`).
If `themes` is selected, it opens a vision picker with color swatches and vibe descriptions for all 12 visions.
For non-interactive runs, pass a vision directly:

```bash
npx @nikolayvalev/design-system@latest init --modules themes,components --vision editorial
```

This command scaffolds `src/design-system`, creates MCP config files, and links to
`https://designsystem.nikolayvalev.com/mcp` by default.

Install components separately as source files through MCP `get_component_bundle` and commit them into your repo.

## Setup

### 1. Import vision styles and add VisionProvider

```tsx
// app/layout.tsx
import '@nikolayvalev/design-system/styles/editorial.css';
// Choose one vision — see Vision IDs section below for all options
import { VisionProvider, defaultVisionRegistry } from '@nikolayvalev/design-system';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <VisionProvider registry={defaultVisionRegistry} defaultVisionId="editorial">
          {children}
        </VisionProvider>
      </body>
    </html>
  );
}
```

### 2. Use semantic Tailwind classes

The vision CSS emits `--primary`, `--background`, `--foreground`, and other shadcn-compatible aliases as CSS variables. Tailwind's semantic classes work without any preset configuration:

```tsx
<div className="bg-background text-foreground p-4">
  <button className="bg-primary text-primary-foreground px-4 py-2 rounded">
    Submit
  </button>
</div>
```

### 3. Use source-installed components

```tsx
// app/page.tsx
import { Button } from '@/design-system/components/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/design-system/components/Card';
import { Input } from '@/design-system/components/Input';

export default function HomePage() {
  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            This card uses semantic tokens from the design system.
          </p>
          <div className="flex gap-2">
            <Input placeholder="Enter text..." />
            <Button variant="default">Submit</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

### 4. Use Visionary atmospheric components (optional)

```tsx
// app/page.tsx
import { AtmosphereProvider } from '@/design-system/components/AtmosphereProvider';
import { EditorialHeader } from '@/design-system/components/EditorialHeader';
import { GalleryStage } from '@/design-system/components/GalleryStage';
import { MediaFrame } from '@/design-system/components/MediaFrame';
import { NavigationOrb } from '@/design-system/components/NavigationOrb';
import { VisionProvider } from '@/design-system/vde-core/context';
import { defaultVisionRegistry } from '@/design-system/vde-themes';

export default function VisionaryPage() {
  return (
    <VisionProvider registry={defaultVisionRegistry} defaultVisionId="museum">
      <AtmosphereProvider className="min-h-screen p-8">
        <EditorialHeader size="massive">Atmospheric Components</EditorialHeader>

        <GalleryStage className="mx-auto max-w-3xl p-6">
          <MediaFrame
            className="aspect-video"
            src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e"
            alt="Atmospheric sample"
          />
        </GalleryStage>

        <NavigationOrb
          items={[
            { id: 'intro', label: 'Intro' },
            { id: 'gallery', label: 'Gallery' },
            { id: 'contact', label: 'Contact' },
          ]}
        />
      </AtmosphereProvider>
    </VisionProvider>
  );
}
```

### 5. Use source-installed section and page templates

```tsx
// app/launch/page.tsx
import { MarketingLandingPage } from '@/design-system/pages/MarketingLandingPage';

export default function LaunchPage() {
  return (
    <MarketingLandingPage
      heading="Design tokens + installable UI source"
      subtitle="Drop page scaffolds in minutes, then customize in-repo."
    />
  );
}
```

Vision IDs for `setVision()`, by family:

- **Editorial & Print** — `editorial`, `museum`
- **Minimal & Structured** — `swiss_international`, `zen`, `clay_soft`
- **Technical & Utility** — `terminal`, `brutalist`
- **Atmospheric & Luminous** — `immersive`, `synthwave`, `noir`
- **Expressive & Statement** — `solarpunk`, `y2k_chrome`

## Overriding Tokens

Visions are token-driven, so you override by setting CSS variables — no build step or theme factory. Scope overrides to a wrapper element or `:root`:

```tsx
// Override a couple of tokens for a subtree
<div
  style={{
    ['--vde-color-accent' as string]: 'oklch(0.6 0.25 280)',
    ['--primary' as string]: 'oklch(0.6 0.25 280)',
  }}
>
  {children}
</div>
```

Or in global CSS:

```css
:root {
  --vde-color-accent: oklch(0.6 0.25 280);
  --primary: var(--vde-color-accent);
}
```

## Per-Project Tailwind Extension

No preset is required — the active vision's CSS emits the shadcn-compatible aliases (`--primary`, `--background`, …), so Tailwind's semantic classes resolve automatically. Add project-specific tokens with a normal `theme.extend`:

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: { coral: 'hsl(16 100% 66%)', navy: 'hsl(216 100% 12%)' },
      },
      spacing: { '128': '32rem' },
    },
  },
};

export default config;
```

## Switching Visions

Import a different per-vision CSS, or switch at runtime with `setVision`:

```tsx
// Compile-time: import the vision you want
import '@nikolayvalev/design-system/styles/terminal.css';
```

```tsx
// Runtime: switch via the hook — the active vision's variables update live
import { useVision } from '@nikolayvalev/design-system';

function VisionSwitcher() {
  const { setVision } = useVision();
  return <button onClick={() => setVision('synthwave')}>Synthwave</button>;
}
```

## Authoring a Custom Vision

Visions are `VisionTheme` objects defined in the design-system source (`src/vde-themes`). To add one to the shared catalog, propose it there (see CONTRIBUTING). Advanced consumers can build a `VisionTheme` and register it locally:

```ts
import { VisionRegistry, visionThemes, type VisionTheme } from '@nikolayvalev/design-system';

const myVision = {
  /* id, name, family, tagline, summary, bestFor, mood, colors, artisticPillars, ornaments */
} as VisionTheme;

const registry = new VisionRegistry([...visionThemes, myVision]);
// pass `registry` to <VisionProvider registry={registry} defaultVisionId={myVision.id}>
```

## Versioning Strategy

The design system follows semantic versioning:

- **Major**: Breaking changes to tokens, component APIs, or visual appearance
- **Minor**: New components, new visions, backwards-compatible changes
- **Patch**: Bug fixes, documentation updates

Lock to a specific major version to prevent unexpected visual changes:

```json
{
  "dependencies": {
    "@nikolayvalev/design-system": "^2.0.0"
  }
}
```

