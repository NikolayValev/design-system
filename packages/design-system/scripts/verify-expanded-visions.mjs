import { getVisionThemeById, getVisionThemeIds, visionToCSSVariables } from '../dist/index.js';
const failures = [];
for (const id of getVisionThemeIds()) {
  const theme = getVisionThemeById(id);
  const vars = visionToCSSVariables(theme);
  if (!String(vars['--vde-surface-texture'] ?? '').trim()) failures.push(`${id}: missing --vde-surface-texture`);
  if (!String(vars['--vde-atmosphere-mesh-gradient'] ?? '').trim()) failures.push(`${id}: missing --vde-atmosphere-mesh-gradient`);
}
if (failures.length) { console.error(failures.join('\n')); process.exit(1); }
console.log('Vision registry verification passed.');
