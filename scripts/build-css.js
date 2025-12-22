import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { publicProfile, dashboardProfile, experimentalProfile } from '../dist/tokens/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generate CSS with injected CSS custom properties from a theme profile
 */
function generateThemeCSS(profile) {
  const { tokens } = profile;
  const lines = [':root {'];

  // Colors
  Object.entries(tokens.colors).forEach(([key, value]) => {
    // Convert camelCase to kebab-case
    let cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    // Special handling for chartOne, chartTwo, etc. -> chart-1, chart-2
    cssKey = cssKey.replace(/chart-one/, 'chart-1');
    cssKey = cssKey.replace(/chart-two/, 'chart-2');
    cssKey = cssKey.replace(/chart-three/, 'chart-3');
    cssKey = cssKey.replace(/chart-four/, 'chart-4');
    cssKey = cssKey.replace(/chart-five/, 'chart-5');
    lines.push(`  --${cssKey}: ${value};`);
  });

  // Spacing
  Object.entries(tokens.spacing).forEach(([key, value]) => {
    lines.push(`  --spacing-${key}: ${value};`);
  });

  // Radius (base value)
  lines.push(`  --radius: ${tokens.radius.base};`);

  // Typography
  lines.push(`  --font-family-sans: ${tokens.typography.fontFamily.sans};`);
  lines.push(`  --font-family-mono: ${tokens.typography.fontFamily.mono};`);

  lines.push('}');
  return lines.join('\n');
}

/**
 * Generate dark mode variant
 */
function generateDarkModeCSS() {
  return `.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.145 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.145 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.985 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.396 0.141 25.723);
  --destructive-foreground: oklch(0.637 0.237 25.331);
  --border: oklch(0.269 0 0);
  --input: oklch(0.269 0 0);
  --ring: oklch(0.439 0 0);
  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);
  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.269 0 0);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(0.269 0 0);
  --sidebar-ring: oklch(0.439 0 0);
}`;
}

const distDir = path.join(__dirname, '../dist/styles');
const srcGlobalCSS = path.join(__dirname, '../src/styles/global.css');

// Ensure dist/styles directory exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copy base global.css
const globalCSS = fs.readFileSync(srcGlobalCSS, 'utf-8');
fs.writeFileSync(path.join(distDir, 'global.css'), globalCSS);

// Generate profile-specific CSS files
const profiles = [
  { name: 'public', profile: publicProfile },
  { name: 'dashboard', profile: dashboardProfile },
  { name: 'experimental', profile: experimentalProfile },
];

profiles.forEach(({ name, profile }) => {
  const themeCSS = generateThemeCSS(profile);
  const darkModeCSS = name === 'public' ? `\n\n${generateDarkModeCSS()}` : '';
  const fullCSS = `${globalCSS}\n\n${themeCSS}${darkModeCSS}`;
  fs.writeFileSync(path.join(distDir, `${name}.css`), fullCSS);
});

console.log('✅ CSS files built successfully');
