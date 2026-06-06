import { expandedVisionThemeIds, getVisionThemeById, getVisionThemeIds, visionToCSSVariables } from '../dist/index.js';

const requiredIds = [...expandedVisionThemeIds];

const failures = [];
const availableIds = getVisionThemeIds();

for (const id of requiredIds) {
  if (!availableIds.includes(id)) {
    failures.push(`Missing vision ID in registry: ${id}`);
  }
}

for (const id of requiredIds) {
  const theme = getVisionThemeById(id);
  if (!theme) {
    continue;
  }

  const vars = visionToCSSVariables(theme);
  const surfaceTexture = vars['--vde-surface-texture']?.trim() ?? '';
  const meshGradient = vars['--vde-atmosphere-mesh-gradient']?.trim() ?? '';

  if (!surfaceTexture) {
    failures.push(`${id}: missing --vde-surface-texture`);
  }

  if (!meshGradient) {
    failures.push(`${id}: missing --vde-atmosphere-mesh-gradient`);
  }

  if (id === 'swiss_international' && vars['--vde-border-width'] !== '1px') {
    failures.push(`${id}: expected --vde-border-width to be 1px`);
  }

  if (id === 'solarpunk' && vars['--vde-boundary-radius'] !== '40px') {
    failures.push(`${id}: expected --vde-boundary-radius to be 40px`);
  }

  if (id === 'y2k_chrome' && (vars['--vde-media-scanline-opacity'] ?? '0') === '0') {
    failures.push(`${id}: expected --vde-media-scanline-opacity to be non-zero`);
  }

  if (id === 'clay_soft' && !(vars['--vde-card-bob-animation'] ?? '').includes('vde-card-bob')) {
    failures.push(`${id}: expected --vde-card-bob-animation to include vde-card-bob`);
  }
}

if (failures.length > 0) {
  console.error('Expanded vision registry verification failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('Expanded vision registry verification passed.');
