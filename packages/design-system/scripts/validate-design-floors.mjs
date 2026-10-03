/*
 * Asserts the floors that PRODUCT.md promises hold in every vision.
 *
 * The point of a system that permits any aesthetic is that it still owes every
 * consumer a legible baseline. These checks are what stop a theme from trading
 * readability for character: they run over the theme source, so a regression is
 * caught where it is authored rather than after it ships.
 */
import { visionThemes } from "../dist/index.js";

/* ---------- colour ---------- */

/** oklch(L C H) -> linear sRGB, via Oklab. */
function oklchToLinearSRGB(L, C, H) {
  const h = (H * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;

  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;

  return [
    +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

function hslToLinearSRGB(h, s, l) {
  const k = (n) => (n + h / 30) % 12;
  const aa = s * Math.min(l, 1 - l);
  const f = (n) =>
    l - aa * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0), f(8), f(4)].map((v) =>
    v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4,
  );
}

/** Returns linear-sRGB channels, or null for values that are not a flat colour. */
function parseColor(value) {
  const oklch = /^oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)$/i.exec(
    value.trim(),
  );
  if (oklch) {
    return oklchToLinearSRGB(
      Number(oklch[1]),
      Number(oklch[2]),
      Number(oklch[3]),
    );
  }
  const hsl = /^hsl\(\s*([\d.]+)\s+([\d.]+)%\s+([\d.]+)%\s*\)$/i.exec(
    value.trim(),
  );
  if (hsl) {
    return hslToLinearSRGB(
      Number(hsl[1]),
      Number(hsl[2]) / 100,
      Number(hsl[3]) / 100,
    );
  }
  return null;
}

function luminance(linear) {
  const [r, g, b] = linear.map((v) => Math.max(0, Math.min(1, v)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(fg, bg) {
  const a = luminance(fg);
  const b = luminance(bg);
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

/* ---------- checks ---------- */

/** Pairs that carry body-sized text, so all of them owe WCAG AA at 4.5:1. */
const TEXT_PAIRS = [
  ["foreground", "background"],
  ["mutedForeground", "background"],
  ["surfaceForeground", "surface"],
  ["mutedForeground", "surface"],
  ["accentForeground", "accent"],
  ["secondaryForeground", "secondary"],
  ["dangerForeground", "danger"],
];

const AA_NORMAL = 4.5;
const MIN_BODY_LINE_HEIGHT = 1.5;

const failures = [];
const skipped = [];

for (const vision of visionThemes) {
  const { id, artisticPillars: pillars } = vision;

  for (const mode of ["light", "dark"]) {
    const colors = vision.colors[mode];
    for (const [fgKey, bgKey] of TEXT_PAIRS) {
      const fg = parseColor(colors[fgKey]);
      const bg = parseColor(colors[bgKey]);
      if (!fg || !bg) {
        // y2k_chrome carries a gradient in its `surface` slot; nothing to measure.
        skipped.push(`${id} ${mode}: ${fgKey}/${bgKey} (non-flat colour)`);
        continue;
      }
      const ratio = contrast(fg, bg);
      if (ratio < AA_NORMAL) {
        failures.push(
          `${id} ${mode}: ${fgKey} on ${bgKey} is ${ratio.toFixed(2)}:1 (needs ${AA_NORMAL}:1)`,
        );
      }
    }
  }

  const { lineHeight, letterSpacing } = pillars.typographyArchitecture;
  if (Number(lineHeight.normal) < MIN_BODY_LINE_HEIGHT) {
    failures.push(
      `${id}: body line-height is ${lineHeight.normal} (needs >= ${MIN_BODY_LINE_HEIGHT})`,
    );
  }
  if (Number(lineHeight.relaxed) < Number(lineHeight.normal)) {
    failures.push(
      `${id}: relaxed line-height (${lineHeight.relaxed}) is tighter than normal (${lineHeight.normal})`,
    );
  }
  if (Number.parseFloat(letterSpacing.normal) < -0.006) {
    failures.push(
      `${id}: body letter-spacing is ${letterSpacing.normal} — crushed tracking on body text`,
    );
  }

  const { radius, borderWeight } = pillars.boundaryLogic;
  for (const step of ["surface", "control", "pill"]) {
    if (typeof radius?.[step] !== "string") {
      failures.push(`${id}: boundaryLogic.radius.${step} is missing`);
    }
  }
  if (/^\d{4,}px$/.test(radius?.surface ?? "")) {
    failures.push(
      `${id}: surface radius is a pill (${radius.surface}) — cards need corners content can sit inside`,
    );
  }

  // A hairline and a wide drop shadow both drawing the same edge is redundant.
  // Only outer layers count: an `inset` shadow is a surface treatment (clay_soft's
  // neumorphic light and shade), not a second definition of the element's edge.
  const ambient = pillars.shadowLightEngine.ambientOcclusion;
  const outerLayers = ambient
    .split(/,(?![^()]*\))/)
    .map((layer) => layer.trim())
    .filter((layer) => !layer.startsWith("inset"));
  const blur = Math.max(
    0,
    ...outerLayers.flatMap((layer) =>
      [...layer.matchAll(/(-?\d+(?:\.\d+)?)px/g)].map((m) =>
        Math.abs(Number(m[1])),
      ),
    ),
  );
  const hasBorder = Number.parseFloat(borderWeight) > 0;
  if (hasBorder && blur > 12) {
    failures.push(
      `${id}: ${borderWeight} border plus a ${blur}px-blur ambient shadow — pick one device to define the edge`,
    );
  }

  for (const [name, curve] of Object.entries(pillars.motionSignature.easing)) {
    const m =
      /cubic-bezier\(\s*[\d.-]+\s*,\s*([\d.-]+)\s*,\s*[\d.-]+\s*,\s*([\d.-]+)\s*\)/.exec(
        curve,
      );
    if (name === "standard" && m && (Number(m[1]) > 1 || Number(m[2]) > 1)) {
      failures.push(
        `${id}: standard easing overshoots (${curve}) — it drives every control transition`,
      );
    }
  }
}

if (skipped.length > 0) {
  console.log(`Skipped ${skipped.length} non-flat colour pair(s):`);
  for (const s of skipped) console.log(`  - ${s}`);
}

if (failures.length > 0) {
  console.error(`\nDesign floor violations (${failures.length}):`);
  for (const f of failures) console.error(`  x ${f}`);
  process.exit(1);
}

console.log(
  `Design floors OK across ${visionThemes.length} visions (contrast, line-height, tracking, radius, edge, motion).`,
);
