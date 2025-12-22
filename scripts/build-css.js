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
    const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    const hslValue = value.match(/hsl\((.*)\)/)?.[1] || value;
    lines.push(`  --color-${cssKey}: ${hslValue};`);
  });

  // Spacing
  Object.entries(tokens.spacing).forEach(([key, value]) => {
    lines.push(`  --spacing-${key}: ${value};`);
  });

  // Radius
  Object.entries(tokens.radius).forEach(([key, value]) => {
    lines.push(`  --radius-${key}: ${value};`);
  });

  // Typography
  lines.push(`  --font-sans: ${tokens.typography.fontFamily.sans};`);
  lines.push(`  --font-mono: ${tokens.typography.fontFamily.mono};`);

  lines.push('}');
  return lines.join('\n');
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
  const fullCSS = `${globalCSS}\n\n${themeCSS}`;
  fs.writeFileSync(path.join(distDir, `${name}.css`), fullCSS);
});

console.log('✅ CSS files built successfully');
