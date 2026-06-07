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

function visionRootBlock(vision) {
  const vars = visionToCSSVariables(vision);
  const lines = [`/* vision: ${vision.id} (${vision.name}) */`, ':root {'];
  for (const [key, value] of Object.entries(vars)) lines.push(`  ${key}: ${value};`);
  lines.push('}');
  return lines.join('\n');
}

if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });
const globalCSS = fs.readFileSync(srcGlobalCSS, 'utf-8');
fs.writeFileSync(path.join(distDir, 'global.css'), globalCSS);

const selected = getCompiledVisionIds(parseSelectedVisions());
for (const id of selected) {
  const vision = getVisionThemeById(id);
  if (!vision) throw new Error(`Vision "${id}" not found.`);
  fs.writeFileSync(path.join(distDir, `${id}.css`), `${globalCSS}\n\n${visionRootBlock(vision)}\n`);
}

fs.writeFileSync(
  path.join(distDir, 'visions.json'),
  `${JSON.stringify({ visions: selected, generatedAt: new Date().toISOString() }, null, 2)}\n`,
);
console.log(`CSS built for ${selected.length} vision(s): ${selected.join(', ')}`);
