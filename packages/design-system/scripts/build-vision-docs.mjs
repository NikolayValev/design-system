/*
 * Generates one Markdown record per vision, from the theme objects themselves.
 *
 * DESIGN.md carries the core contract and the rules that hold everywhere, but its
 * frontmatter is single-valued and cannot describe 13 palettes at once — which is
 * also why the design detector reports every non-default colour as "outside
 * DESIGN.md". The per-vision values need a record of their own, and the only way
 * that record stays true is if nobody writes it by hand.
 *
 * Run as part of `pnpm build`. The output is committed so it is reviewable in a
 * diff: a token change shows up as a documentation change in the same PR.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { visionThemes, themeFamilies } from '../dist/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '../../../docs/visions');

const familyName = new Map(themeFamilies.map(f => [f.id, f.name]));

const COLOR_ORDER = [
  'background',
  'foreground',
  'surface',
  'surfaceForeground',
  'accent',
  'accentForeground',
  'secondary',
  'secondaryForeground',
  'muted',
  'mutedForeground',
  'border',
  'input',
  'ring',
  'danger',
  'dangerForeground',
  'chart1',
  'chart2',
  'chart3',
  'chart4',
  'chart5',
];

/** Which device a vision uses to define an element's edge. See DESIGN.md, The One Device Rule. */
function edgeStrategy(pillars) {
  const width = Number.parseFloat(pillars.boundaryLogic.borderWeight);
  const outer = pillars.shadowLightEngine.ambientOcclusion
    .split(/,(?![^()]*\))/)
    .map(layer => layer.trim())
    .filter(layer => !layer.startsWith('inset'));
  const blur = Math.max(
    0,
    ...outer.flatMap(layer => [...layer.matchAll(/(-?\d+(?:\.\d+)?)px/g)].map(m => Math.abs(Number(m[1])))),
  );
  if (width === 0) return 'Float — the shadow defines the edge; there is no hairline.';
  if (blur === 0) return 'Neither — no shadow at all. The hairline is the only edge.';
  return 'Seam — the hairline defines the edge; the ambient shadow is a seam, not a second edge.';
}

function table(rows, headers) {
  const head = `| ${headers.join(' | ')} |`;
  const rule = `| ${headers.map(() => '---').join(' | ')} |`;
  return [head, rule, ...rows.map(r => `| ${r.join(' | ')} |`)].join('\n');
}

function renderVision(vision) {
  const { artisticPillars: p, colors } = vision;
  const t = p.typographyArchitecture;

  const colorRows = COLOR_ORDER.map(key => [
    `\`${key}\``,
    `\`${colors.light[key]}\``,
    `\`${colors.dark[key]}\``,
  ]);

  return `<!--
  GENERATED FILE — do not edit.
  Source: packages/design-system/src/vde-themes/${vision.id.replace(/_/g, '-')}.theme.ts
  Regenerate: pnpm --filter @nikolayvalev/design-system build
-->

# ${vision.name}

> ${vision.tagline}

**id** \`${vision.id}\` · **family** ${familyName.get(vision.family) ?? vision.family} · **archetype** ${vision.archetype} · **default mode** ${vision.defaultMode}

${vision.summary}

**Mood:** ${vision.mood.join(', ')}

**Best for:** ${vision.bestFor.join(' · ')}

## Import

\`\`\`ts
import '@nikolayvalev/design-system/styles/${vision.id}.css';
import '@nikolayvalev/design-system/styles/fonts/${vision.id}.css';
\`\`\`

## Colour

Both modes are hand-tuned; neither is derived from the other. Every pair that
carries text is contrast-checked at WCAG AA by \`pnpm validate\`.

${table(colorRows, ['Token', 'Light', 'Dark'])}

## Type

${table(
  [
    ['Body face', `\`${t.fontStack.body}\``],
    ['Display face', `\`${t.fontStack.display}\``],
    ['Mono face', `\`${t.fontStack.mono}\``],
    ['Scale multipliers', `body \`${t.scale.body}\` · display \`${t.scale.display}\``],
    ['Line height', `tight \`${t.lineHeight.tight}\` · normal \`${t.lineHeight.normal}\` · relaxed \`${t.lineHeight.relaxed}\``],
    ['Letter spacing', `tight \`${t.letterSpacing.tight}\` · normal \`${t.letterSpacing.normal}\` · wide \`${t.letterSpacing.wide}\``],
  ],
  ['Property', 'Value'],
)}

Sizes are the core scale multiplied by the values above and floored, so this
vision's interactive text is never below 14px and its body copy never below 16px
however it tunes the multipliers.

## Shape and depth

${table(
  [
    ['Radius', `surface \`${p.boundaryLogic.radius.surface}\` · control \`${p.boundaryLogic.radius.control}\` · pill \`${p.boundaryLogic.radius.pill}\``],
    ['Border weight', `\`${p.boundaryLogic.borderWeight}\``],
    ['Edge strategy', edgeStrategy(p)],
    ['Ambient shadow', `\`${p.shadowLightEngine.ambientOcclusion}\``],
    ['Hard shadow', `\`${p.shadowLightEngine.hardOffset}\``],
    ['Glow', `\`${p.shadowLightEngine.neonGlow}\``],
    ['Surface blur', `\`${p.surfacePhysics.blur}\``],
    ['Transparency', `\`${p.surfacePhysics.transparency}\``],
    ['Grain', `\`${p.surfacePhysics.grain}\``],
    ['Ornaments', `grain ${p.ornaments?.grain ?? vision.ornaments.grain} · glow ${vision.ornaments.glow} · texture ${vision.ornaments.texture}`],
  ],
  ['Property', 'Value'],
)}

## Motion

${table(
  [
    ['Durations', `fast \`${p.motionSignature.duration.fast}\` · normal \`${p.motionSignature.duration.normal}\` · slow \`${p.motionSignature.duration.slow}\``],
    ['Standard easing', `\`${p.motionSignature.easing.standard}\``],
    ['Emphatic easing', `\`${p.motionSignature.easing.emphatic}\``],
    ['Physics', `\`${p.motionSignature.physics}\``],
  ],
  ['Property', 'Value'],
)}

All ambient and looping motion stops under \`prefers-reduced-motion: reduce\`.
`;
}

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

for (const vision of visionThemes) {
  fs.writeFileSync(path.join(outDir, `${vision.id}.md`), renderVision(vision));
}

const grouped = themeFamilies
  .map(family => ({
    family,
    themes: visionThemes.filter(v => v.family === family.id),
  }))
  .filter(g => g.themes.length > 0);

const index = `<!--
  GENERATED FILE — do not edit.
  Regenerate: pnpm --filter @nikolayvalev/design-system build
-->

# Visions

${visionThemes.length} visions across ${grouped.length} families. Each ships a hand-tuned light
and dark palette and self-hosted faces, and each is held to the same floors — see
[DESIGN.md](../../DESIGN.md) for the rules that apply to all of them.

${grouped
  .map(
    ({ family, themes }) =>
      `## ${family.name}\n\n${family.description}\n\n${themes
        .map(v => `- [${v.name}](${v.id}.md) — ${v.tagline}`)
        .join('\n')}`,
  )
  .join('\n\n')}
`;

fs.writeFileSync(path.join(outDir, 'README.md'), index);
console.log(`Vision docs built: ${visionThemes.length} records + index in docs/visions/`);
