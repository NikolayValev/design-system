# Quick Start: Next.js App Router

Get `@nikolayvalev/design-system` working in a Next.js App Router project in 5 minutes, with components installed as source files via MCP.

## Prerequisites

- Next.js 14+ with App Router
- Node.js 18+
- Package manager: npm, pnpm, or yarn

## Step 0: Scaffold local source + MCP config (recommended)

```bash
npx @nikolayvalev/design-system@latest init
```

In interactive terminals, the CLI shows an arrow-key selector for modules (`themes`, `components`, `pages`).
If `themes` is selected, it opens a vision picker with color swatches and vibe descriptions for all 12 visions.
For CI/non-interactive usage, pass a vision directly:

```bash
npx @nikolayvalev/design-system@latest init --modules themes,components --vision editorial
```

This creates:

- `src/design-system` folders for installable source files
- `.mcp.json` and `.cursor/mcp.json` with `https://designsystem.nikolayvalev.com/mcp`
- `DESIGN_SYSTEM_SETUP.md` and `design-system.config.json`

## Step 1: Install the Package

```bash
npm install @nikolayvalev/design-system
# or
pnpm add @nikolayvalev/design-system
```

For components, use MCP `get_component_bundle` and commit files into `src/design-system`.

## Step 2: Import Vision CSS and Add VisionProvider

Choose a vision and import its CSS. `editorial` is a great starting point for most sites:

```tsx
// app/layout.tsx
import '@nikolayvalev/design-system/styles/editorial.css';
import { VisionProvider, defaultVisionRegistry } from '@nikolayvalev/design-system';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My App',
  description: 'Built with design system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

**Vision options** (import exactly one):
- `editorial.css` — clean editorial, light with dark variant
- `museum.css` — refined, gallery-like atmosphere
- `swiss_international.css` — structured, typographic grid
- `zen.css` — minimal, calm, generous whitespace
- `clay_soft.css` — soft, organic, warm
- `terminal.css` — dark, monospaced, technical
- `brutalist.css` — high contrast, raw, structural
- `immersive.css` — atmospheric, luminous depth
- `synthwave.css` — neon gradients, retro-future
- `noir.css` — dark, moody, cinematic
- `solarpunk.css` — vivid, optimistic, green
- `y2k_chrome.css` — chrome gradients, expressive statement

## Step 3: Use Semantic Tailwind Classes

The vision CSS exposes `--primary`, `--background`, `--foreground`, etc. as CSS variables — Tailwind's semantic classes work without any preset configuration:

```tsx
<div className="bg-background text-foreground">
  <button className="bg-primary text-primary-foreground px-4 py-2 rounded">
    Submit
  </button>
</div>
```

## Step 4: Use Source-Installed Components (optional)

Install components through MCP (`get_component_bundle`) and use the generated local files:

```tsx
// app/page.tsx
import { Button } from '@/design-system/components/Button';
import { Card } from '@/design-system/components/Card';

export default function HomePage() {
  return (
    <main className="p-8">
      <Card>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Welcome</h1>
          <p className="text-muted-foreground mb-6">
            This page uses the design system.
          </p>
          <Button variant="default">Get Started</Button>
        </div>
      </Card>
    </main>
  );
}
```

## Step 5: Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` and you should see your styled components.

## Troubleshooting

### CSS Not Loading

**Problem:** Components appear unstyled  
**Solution:** Verify CSS import is in `app/layout.tsx`, not a page file

### Tailwind Classes Not Working  

**Problem:** `bg-primary` has no effect  
**Solution:** Check your `tailwind.config.ts` includes the preset and correct content paths

### TypeScript Errors

**Problem:** Import errors or type mismatches  
**Solution:** Ensure `@types/react` version matches your React version

### Dark Mode Not Working

**Problem:** Dark mode doesn't activate  
**Solution:** Add `dark` class to `<html>` element (supported by the `editorial` and other light-default visions):

```tsx
<html lang="en" className="dark">
```

Or toggle dynamically:

```tsx
'use client';

export function ThemeToggle() {
  const toggleDark = () => {
    document.documentElement.classList.toggle('dark');
  };
  
  return <button onClick={toggleDark}>Toggle Theme</button>;
}
```

## Next Steps

- **Switch visions at runtime:** Use `useVision().setVision(id)` inside a `VisionProvider`
- **Override tokens:** Add CSS variable overrides after the vision import
- **Extend:** Add your own components using the `--vde-*` and shadcn-alias variables
- **Learn:** Read `USAGE.md` for advanced patterns
- **Deploy:** The CSS is fully compiled, no PostCSS needed in production

## Turbopack Compatibility

This design system works with Next.js Turbopack. The CSS files are pre-compiled, so there's no dynamic CSS import patterns that would break Turbopack.

## App Router Specific Notes

- CSS imports work in Server Components (recommended in root layout)
- Components can be used in both Server and Client Components
- Theme toggling requires Client Components (`'use client'`)
- No `useEffect` needed for initial theme loading - CSS handles defaults

## More Examples

See `examples/next-app-router/` in the repository for a complete working example.
