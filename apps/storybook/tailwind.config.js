/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{ts,tsx}', '../../packages/design-system/src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: 'var(--card)',
        'card-foreground': 'var(--card-foreground)',
        primary: 'var(--primary)',
        'primary-foreground': 'var(--primary-foreground)',
        secondary: 'var(--secondary)',
        'secondary-foreground': 'var(--secondary-foreground)',
        destructive: 'var(--destructive)',
        'destructive-foreground': 'var(--destructive-foreground)',
        accent: 'var(--accent)',
        'accent-foreground': 'var(--accent-foreground)',
        muted: 'var(--muted)',
        'muted-foreground': 'var(--muted-foreground)',
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
      },
      spacing: {
        // Was `var(--spacing-md, 1rem)` against a token that did not exist, so the
        // fallback always won. The 8-point scale is real now.
        '2xs': 'var(--vde-space-2xs)',
        xs: 'var(--vde-space-xs)',
        sm: 'var(--vde-space-sm)',
        md: 'var(--vde-space-md)',
        lg: 'var(--vde-space-lg)',
        xl: 'var(--vde-space-xl)',
        '2xl': 'var(--vde-space-2xl)',
        '3xl': 'var(--vde-space-3xl)',
      },
      fontFamily: {
        sans: 'var(--font-family-sans, ui-sans-serif, system-ui)',
      },
    },
  },
};

export default config;
