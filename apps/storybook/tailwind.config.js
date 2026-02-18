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
        md: 'var(--spacing-md, 1rem)',
      },
      fontFamily: {
        sans: 'var(--font-family-sans, ui-sans-serif, system-ui)',
      },
    },
  },
};

export default config;
