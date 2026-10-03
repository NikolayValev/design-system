/**
 * Shared Tailwind CSS configuration.
 *
 * NOTE: this mapped every colour to `var(--color-*)`, a prefix the design system
 * has never emitted — the real aliases are `--background`, `--primary` and so on
 * — so every colour here resolved to nothing. It had no consumers, which is why
 * that went unnoticed. Fixed rather than deleted because it is a published
 * subpath of @repo/config.
 *
 * Usage in a package or app:
 * ```js
 * import sharedConfig from '@repo/config/tailwind';
 * export default { ...sharedConfig, content: ['./src/** /*.{ts,tsx}'] };
 * ```
 *
 * @type {import('tailwindcss').Config}
 */
const config = {
  content: [],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
};

export default config;
