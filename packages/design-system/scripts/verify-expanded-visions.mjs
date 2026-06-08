import { getVisionThemeById, getVisionThemeIds, visionToCSSVariables } from '../dist/index.js';
const REQUIRED = ['--vde-color-background', '--vde-color-accent', '--background', '--primary'];
const failures = [];
for (const id of getVisionThemeIds()) {
  const theme = getVisionThemeById(id);
  for (const mode of ['light', 'dark']) {
    const vars = visionToCSSVariables(theme, mode);
    for (const key of REQUIRED) {
      if (!vars[key] || !String(vars[key]).trim()) failures.push(`${id} [${mode}]: missing ${key}`);
    }
  }
}
if (failures.length) { console.error(failures.join('\n')); process.exit(1); }
console.log('Vision mode resolution verification passed.');
