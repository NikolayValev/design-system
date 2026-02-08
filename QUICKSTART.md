# Quick Start: Next.js App Router

Get `@nikolayvalev/design-system` working in a Next.js App Router project in 5 minutes.

## Prerequisites

- Next.js 14+ with App Router
- Node.js 18+
- Package manager: npm, pnpm, or yarn

## Step 1: Install Package

```bash
npm install @nikolayvalev/design-system
# or
pnpm add @nikolayvalev/design-system
```

The package has peer dependencies on React 18+, which Next.js already provides.

## Step 2: Import CSS in Root Layout

Choose a profile and import its CSS. The `public` profile is great for marketing sites:

```tsx
// app/layout.tsx
import '@nikolayvalev/design-system/styles/public.css';
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
      <body>{children}</body>
    </html>
  );
}
```

**Profile Options:**
- `public.css` - Light mode with dark variant, vibrant colors
- `dashboard.css` - Dark mode, compact spacing, muted palette  
- `experimental.css` - High contrast, zero border radius, bold

## Step 3: Configure Tailwind

Create or update your Tailwind config to use the design system preset:

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss';
import { createTailwindPreset, publicProfile } from '@nikolayvalev/design-system/tailwind';

const config: Config = {
  presets: [createTailwindPreset(publicProfile)],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
};

export default config;
```

The preset gives you semantic color classes like `bg-primary`, `text-foreground`, etc.

## Step 4: Use Components

Import and use components in your pages:

```tsx
// app/page.tsx
import { Button, Card } from '@nikolayvalev/design-system';

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

### Dark Mode Not Working (publicProfile)

**Problem:** Dark mode doesn't activate  
**Solution:** Add `dark` class to `<html>` element:

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

- **Customize:** Override tokens with `createTheme()` and `applyTheme()`
- **Extend:** Add your own components using design system tokens
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
