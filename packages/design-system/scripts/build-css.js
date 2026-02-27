import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { publicProfile, dashboardProfile, experimentalProfile } from '../dist/tokens/index.js';
import {
  DEFAULT_VISION_SYSTEM,
  getVisionThemeById,
  isVisionSystemId,
  resolveProfileVisionAssignments,
  tokenKeyToCSSVar,
  visionToCSSVariables,
} from '../dist/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generate CSS with injected CSS custom properties from a theme profile.
 */
function generateThemeCSS(profile) {
  const { tokens } = profile;
  const lines = [':root {'];

  Object.entries(tokens.colors).forEach(([key, value]) => {
    const cssKey = tokenKeyToCSSVar(key);
    lines.push(`  --${cssKey}: ${value};`);
  });

  Object.entries(tokens.spacing).forEach(([key, value]) => {
    lines.push(`  --spacing-${key}: ${value};`);
  });

  lines.push(`  --radius: ${tokens.radius.base};`);
  lines.push(`  --font-family-sans: ${tokens.typography.fontFamily.sans};`);
  lines.push(`  --font-family-mono: ${tokens.typography.fontFamily.mono};`);
  lines.push('}');
  return lines.join('\n');
}

/**
 * Generate dark mode variant dynamically from dashboardProfile.
 */
function generateDarkModeCSS() {
  const { tokens } = dashboardProfile;
  const lines = ['.dark {'];

  Object.entries(tokens.colors).forEach(([key, value]) => {
    const cssKey = tokenKeyToCSSVar(key);
    lines.push(`  --${cssKey}: ${value};`);
  });

  lines.push('}');
  return lines.join('\n');
}

/**
 * Parse profile vision overrides from env:
 * - DESIGN_SYSTEM_PROFILE_VISIONS=public=...,dashboard=...,experimental=...
 * - DESIGN_SYSTEM_VISION_PUBLIC=...
 * - DESIGN_SYSTEM_VISION_DASHBOARD=...
 * - DESIGN_SYSTEM_VISION_EXPERIMENTAL=...
 */
function parseProfileVisionOverridesFromEnv() {
  const overrides = {};
  const pairInput = process.env.DESIGN_SYSTEM_PROFILE_VISIONS?.trim();
  if (pairInput) {
    const pairs = pairInput.split(',').map(segment => segment.trim()).filter(Boolean);
    for (const pair of pairs) {
      const [rawProfile, rawVision] = pair.split('=').map(value => value.trim());
      if (!rawProfile || !rawVision) {
        throw new Error(
          `Invalid DESIGN_SYSTEM_PROFILE_VISIONS pair "${pair}". Use profile=visionId format.`,
        );
      }

      if (rawProfile !== 'public' && rawProfile !== 'dashboard' && rawProfile !== 'experimental') {
        throw new Error(
          `Unsupported profile "${rawProfile}" in DESIGN_SYSTEM_PROFILE_VISIONS. Use public, dashboard, experimental.`,
        );
      }

      overrides[rawProfile] = rawVision;
    }
  }

  if (process.env.DESIGN_SYSTEM_VISION_PUBLIC?.trim()) {
    overrides.public = process.env.DESIGN_SYSTEM_VISION_PUBLIC.trim();
  }

  if (process.env.DESIGN_SYSTEM_VISION_DASHBOARD?.trim()) {
    overrides.dashboard = process.env.DESIGN_SYSTEM_VISION_DASHBOARD.trim();
  }

  if (process.env.DESIGN_SYSTEM_VISION_EXPERIMENTAL?.trim()) {
    overrides.experimental = process.env.DESIGN_SYSTEM_VISION_EXPERIMENTAL.trim();
  }

  return overrides;
}

/**
 * Generate a :root block from VDE variables only.
 */
function generateVisionCSS(vision) {
  const variables = visionToCSSVariables(vision);
  const lines = [`/* compile-time vision: ${vision.id} (${vision.name}) */`, ':root {'];

  Object.entries(variables)
    .filter(([key]) => key.startsWith('--vde-'))
    .forEach(([key, value]) => {
      lines.push(`  ${key}: ${value};`);
    });

  lines.push('}');
  return lines.join('\n');
}

const distDir = path.join(__dirname, '../dist/styles');
const srcGlobalCSS = path.join(__dirname, '../src/styles/global.css');

const requestedVisionSystem = process.env.DESIGN_SYSTEM_VISION_SYSTEM?.trim() || DEFAULT_VISION_SYSTEM;
if (!isVisionSystemId(requestedVisionSystem)) {
  throw new Error(
    `Unsupported DESIGN_SYSTEM_VISION_SYSTEM "${requestedVisionSystem}". Use legacy, expanded, or all.`,
  );
}

const profileVisionAssignments = resolveProfileVisionAssignments(
  requestedVisionSystem,
  parseProfileVisionOverridesFromEnv(),
);

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

const globalCSS = fs.readFileSync(srcGlobalCSS, 'utf-8');
fs.writeFileSync(path.join(distDir, 'global.css'), globalCSS);

const profiles = [
  { name: 'public', profile: publicProfile },
  { name: 'dashboard', profile: dashboardProfile },
  { name: 'experimental', profile: experimentalProfile },
];

profiles.forEach(({ name, profile }) => {
  const visionId = profileVisionAssignments[name];
  const vision = getVisionThemeById(visionId);
  if (!vision) {
    throw new Error(`Vision "${visionId}" not found for profile "${name}".`);
  }

  const themeCSS = generateThemeCSS(profile);
  const visionCSS = generateVisionCSS(vision);
  const darkModeCSS = name === 'public' ? `\n\n${generateDarkModeCSS()}` : '';
  const fullCSS = `${globalCSS}\n\n${themeCSS}\n\n${visionCSS}${darkModeCSS}`;
  fs.writeFileSync(path.join(distDir, `${name}.css`), fullCSS);
});

const visionManifest = {
  system: requestedVisionSystem,
  profileVisions: profileVisionAssignments,
  generatedAt: new Date().toISOString(),
};

fs.writeFileSync(
  path.join(distDir, 'vision-assignments.json'),
  `${JSON.stringify(visionManifest, null, 2)}\n`,
);

console.log(`CSS files built successfully (vision system: ${requestedVisionSystem})`);
