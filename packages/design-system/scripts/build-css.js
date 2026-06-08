import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getVisionThemeById, getCompiledVisionIds, visionToCSSVariables } from '../dist/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, '../dist/styles');
const srcGlobalCSS = path.join(__dirname, '../src/styles/global.css');

function parseSelectedVisions() {
  const raw = process.env.DESIGN_SYSTEM_VISIONS?.trim();
  if (!raw) return undefined;
  return raw.split(',').map(s => s.trim()).filter(Boolean);
}

function blockFromVars(selector, vars) {
  const lines = [`${selector} {`];
  for (const [k, v] of Object.entries(vars)) if (k.startsWith('--')) lines.push(`  ${k}: ${v};`);
  lines.push('}');
  return lines.join('\n');
}

function visionCSS(vision) {
  const other = vision.defaultMode === 'light' ? 'dark' : 'light';
  return [
    `/* vision: ${vision.id} (${vision.name}) — default ${vision.defaultMode} */`,
    blockFromVars(':root', visionToCSSVariables(vision, vision.defaultMode)),
    blockFromVars(`[data-vde-mode="${other}"]`, visionToCSSVariables(vision, other)),
    blockFromVars(other === 'dark' ? '.dark' : '.light', visionToCSSVariables(vision, other)),
  ].join('\n\n');
}

if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });
const globalCSS = fs.readFileSync(srcGlobalCSS, 'utf-8');
fs.writeFileSync(path.join(distDir, 'global.css'), globalCSS);

const selected = getCompiledVisionIds(parseSelectedVisions());
for (const id of selected) {
  const vision = getVisionThemeById(id);
  if (!vision) throw new Error(`Vision "${id}" not found.`);
  fs.writeFileSync(path.join(distDir, `${id}.css`), `${globalCSS}\n\n${visionCSS(vision)}\n`);
}

fs.writeFileSync(
  path.join(distDir, 'visions.json'),
  `${JSON.stringify({ visions: selected, generatedAt: new Date().toISOString() }, null, 2)}\n`,
);
console.log(`CSS built for ${selected.length} vision(s): ${selected.join(', ')}`);
