import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { publicProfile, dashboardProfile, experimentalProfile } from '../dist/tokens/index.js';
import { tokenKeyToCSSVar } from '../dist/index.js';

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
    const cssKey = tokenKeyToCSSVar(key);
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
 * Generate dark mode variant dynamically from dashboardProfile
 */
function generateDarkModeCSS() {
  const { tokens } = dashboardProfile;
  const lines = ['.dark {'];

  // Colors - dynamically generated from dashboardProfile
  Object.entries(tokens.colors).forEach(([key, value]) => {
    const cssKey = tokenKeyToCSSVar(key);
    lines.push(`  --${cssKey}: ${value};`);
  });

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
  const darkModeCSS = name === 'public' ? `\n\n${generateDarkModeCSS()}` : '';
  const fullCSS = `${globalCSS}\n\n${themeCSS}${darkModeCSS}`;
  fs.writeFileSync(path.join(distDir, `${name}.css`), fullCSS);
});

console.log('✅ CSS files built successfully');
