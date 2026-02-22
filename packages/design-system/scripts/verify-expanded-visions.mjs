import { getVisionThemeById, getVisionThemeIds, visionToCSSVariables } from '../dist/index.js';

const requiredIds = [
  'swiss_international',
  'raw_data',
  'the_archive',
  'the_ether',
  'solarpunk',
  'y2k_chrome',
  'deconstruct',
  'ma_minimalism',
  'clay_soft',
  'zine_collage',
];

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

  if (id === 'raw_data' && vars['--vde-color-accent'].toLowerCase() !== '#ccff00') {
    failures.push(`${id}: expected --vde-color-accent to be #CCFF00`);
  }

  if (id === 'the_archive' && vars['--vde-motion-duration-normal'] !== '800ms') {
    failures.push(`${id}: expected --vde-motion-duration-normal to be 800ms`);
  }

  if (id === 'the_ether' && vars['--vde-surface-blur'] !== '20px') {
    failures.push(`${id}: expected --vde-surface-blur to be 20px`);
  }

  if (id === 'solarpunk' && vars['--vde-boundary-radius'] !== '40px') {
    failures.push(`${id}: expected --vde-boundary-radius to be 40px`);
  }

  if (id === 'y2k_chrome' && (vars['--vde-media-scanline-opacity'] ?? '0') === '0') {
    failures.push(`${id}: expected --vde-media-scanline-opacity to be non-zero`);
  }

  if (id === 'deconstruct' && vars['--vde-component-tilt'] !== '-1deg') {
    failures.push(`${id}: expected --vde-component-tilt to be -1deg`);
  }

  if (id === 'ma_minimalism') {
    if (vars['--vde-border-width'] !== '0px') {
      failures.push(`${id}: expected --vde-border-width to be 0px`);
    }
    if (vars['--vde-shadow-ambient'] !== 'none') {
      failures.push(`${id}: expected --vde-shadow-ambient to be none`);
    }
  }

  if (id === 'clay_soft' && !(vars['--vde-card-bob-animation'] ?? '').includes('vde-card-bob')) {
    failures.push(`${id}: expected --vde-card-bob-animation to include vde-card-bob`);
  }

  if (id === 'zine_collage') {
    if ((vars['--vde-gallery-tape-opacity'] ?? '0') === '0') {
      failures.push(`${id}: expected --vde-gallery-tape-opacity to be non-zero`);
    }
    if ((vars['--vde-gallery-torn-clip-path'] ?? 'none') === 'none') {
      failures.push(`${id}: expected --vde-gallery-torn-clip-path to be defined`);
    }
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
