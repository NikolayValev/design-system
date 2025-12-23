# Example Consumer Project

This demonstrates how to consume the design system in a Next.js application.

## Installation

```bash
npm install @nikolayvalev/design-system
```

## Setup

### 1. Import global styles

```tsx
// app/layout.tsx
import '@nikolayvalev/design-system/styles/public.css';
// or import '@nikolayvalev/design-system/styles/dashboard.css';
// or import '@nikolayvalev/design-system/styles/experimental.css';

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
import { createTailwindPreset, publicProfile } from '@nikolayvalev/design-system/tailwind';

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

### 3. Use components

```tsx
// app/page.tsx
import { Button, Card, CardHeader, CardTitle, CardContent, Input } from '@nikolayvalev/design-system';

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

## Runtime Configuration Override

Override specific tokens at runtime using OKLCH color values:

```tsx
// app/layout.tsx
'use client';

import { useEffect } from 'react';
import { createTheme, applyTheme, publicProfile } from '@nikolayvalev/design-system';

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
import { createTailwindPreset, publicProfile } from '@nikolayvalev/design-system/tailwind';

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
import '@nikolayvalev/design-system/styles/public.css';
import { createTailwindPreset, publicProfile } from '@nikolayvalev/design-system/tailwind';
```

### Dashboard (internal tools)

```tsx
import '@nikolayvalev/design-system/styles/dashboard.css';
import { createTailwindPreset, dashboardProfile } from '@nikolayvalev/design-system/tailwind';
```

### Experimental (prototypes)

```tsx
import '@nikolayvalev/design-system/styles/experimental.css';
import { createTailwindPreset, experimentalProfile } from '@nikolayvalev/design-system/tailwind';
```

## Custom Profile

Create a custom profile with OKLCH colors:

```ts
// lib/custom-theme.ts
import type { ThemeProfile } from '@nikolayvalev/design-system/tokens';
import { baseTokens } from '@nikolayvalev/design-system';

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
import { createTailwindPreset } from '@nikolayvalev/design-system/tailwind';
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
    "@nikolayvalev/design-system": "^1.0.0"
  }
}
```
