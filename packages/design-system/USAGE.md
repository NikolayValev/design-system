# Example Consumer Project

This demonstrates how to consume the design system in a Next.js application.

## Installation

```bash
npm install @nikolayvalev/design-tokens
```

Optional scaffold (recommended in new repos):

```bash
npx @nikolayvalev/design-system@latest init
```

In interactive terminals, the CLI shows an arrow-key module selector (`themes`, `components`, `pages`).
If `themes` is selected, it shows a style picker with color swatches and vibe descriptions.
It can also set compile-time vision assignments with `--vision-system` and profile-specific overrides.
For non-interactive runs:

```bash
npx @nikolayvalev/design-system@latest init --modules themes,components
# optionally: --vision-system expanded --vision-map public=swiss_international,dashboard=raw_data,experimental=y2k_chrome
```

This command scaffolds `src/design-system`, creates MCP config files, and links to
`https://designsystem.nikolayvalev.com/mcp` by default.

Install components separately as source files through MCP `get_component_bundle` and commit them into your repo.

## Setup

### 1. Import global styles

```tsx
// app/layout.tsx
import '@nikolayvalev/design-tokens/styles/public.css';
// or import '@nikolayvalev/design-tokens/styles/dashboard.css';
// or import '@nikolayvalev/design-tokens/styles/experimental.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

### 2. Configure Tailwind

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss';
import { createTailwindPreset, publicProfile } from '@nikolayvalev/design-tokens/tailwind';

const config: Config = {
  presets: [createTailwindPreset(publicProfile)],
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // Project-specific extensions go here
      // These will NOT break the design system base
    },
  },
};

export default config;
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

Common expanded IDs for `setVision()`:
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

## Runtime Configuration Override

Override specific tokens at runtime using OKLCH color values:

```tsx
// app/layout.tsx
'use client';

import { useEffect } from 'react';
import { createTheme, applyTheme, publicProfile } from '@nikolayvalev/design-tokens';

export default function RootLayout({ children }) {
  useEffect(() => {
    // Override specific tokens at runtime
    const customTheme = createTheme({
      profile: publicProfile,
      tokens: {
        colors: {
          primary: 'oklch(0.6 0.25 280)',
          primaryForeground: 'oklch(1 0 0)',
        },
        radius: {
          base: '1rem',
        },
      },
      density: 'compact',
    });

    applyTheme(document.documentElement, customTheme);
  }, []);

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

## Per-Project Tailwind Extension

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss';
import { createTailwindPreset, publicProfile } from '@nikolayvalev/design-tokens/tailwind';

const config: Config = {
  presets: [createTailwindPreset(publicProfile)],
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Project-specific colors that don't conflict with the system
      colors: {
        brand: {
          coral: 'hsl(16 100% 66%)',
          navy: 'hsl(216 100% 12%)',
        },
      },
      // Override spacing for this specific project
      spacing: {
        '128': '32rem',
      },
    },
  },
};

export default config;
```

## Switching Profiles

### Public Site (marketing)

```tsx
import '@nikolayvalev/design-tokens/styles/public.css';
import { createTailwindPreset, publicProfile } from '@nikolayvalev/design-tokens/tailwind';
```

### Dashboard (internal tools)

```tsx
import '@nikolayvalev/design-tokens/styles/dashboard.css';
import { createTailwindPreset, dashboardProfile } from '@nikolayvalev/design-tokens/tailwind';
```

### Experimental (prototypes)

```tsx
import '@nikolayvalev/design-tokens/styles/experimental.css';
import { createTailwindPreset, experimentalProfile } from '@nikolayvalev/design-tokens/tailwind';
```

## Custom Profile

Create a custom profile with OKLCH colors:

```ts
// lib/custom-theme.ts
import type { ThemeProfile } from '@nikolayvalev/design-tokens/tokens';
import { baseTokens } from '@nikolayvalev/design-tokens/tokens';

export const customProfile: ThemeProfile = {
  name: 'custom',
  tokens: {
    ...baseTokens,
    colors: {
      ...baseTokens.colors,
      primary: 'oklch(0.6 0.28 340)',
      secondary: 'oklch(0.55 0.22 290)',
    },
  },
  density: 'comfortable',
};

// Use in Tailwind config
import { createTailwindPreset } from '@nikolayvalev/design-tokens/tailwind';
import { customProfile } from './lib/custom-theme';

const config = {
  presets: [createTailwindPreset(customProfile)],
  // ...
};
```

## Versioning Strategy

The design system follows semantic versioning:

- **Major**: Breaking changes to tokens, component APIs, or visual appearance
- **Minor**: New components, new tokens, backwards-compatible changes
- **Patch**: Bug fixes, documentation updates

Lock to a specific major version to prevent unexpected visual changes:

```json
{
  "dependencies": {
    "@nikolayvalev/design-tokens": "^1.0.0"
  }
}
```

