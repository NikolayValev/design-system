/*
 * Emits self-hosted @font-face CSS, one file per vision.
 *
 * Before v3 the themes named ~19 families and loaded none of them — no
 * @font-face, no next/font, no stylesheet link anywhere in the repo — so every
 * vision silently fell through to a system stack and none of them rendered as
 * designed. The identity layer was inert.
 *
 * The fontsource packages are devDependencies: this script copies the latin
 * woff2 files it needs into `dist/styles/fonts/files/` and writes CSS with
 * relative urls, so the published package is self-contained and a consumer
 * inherits no font dependencies of its own.
 */
import fs from "fs";
import path from "path";
import { createRequire } from "module";
import { fileURLToPath } from "url";
import { getVisionThemeById, getCompiledVisionIds } from "../dist/index.js";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fontsDir = path.join(__dirname, "../dist/styles/fonts");
const filesDir = path.join(fontsDir, "files");

const FONT_PACKAGES = [
  "@fontsource-variable/inter",
  "@fontsource-variable/playfair-display",
  "@fontsource-variable/source-serif-4",
  "@fontsource-variable/cormorant-garamond",
  "@fontsource-variable/noto-sans",
  "@fontsource-variable/noto-serif",
  "@fontsource-variable/baloo-2",
  "@fontsource-variable/fredoka",
  "@fontsource-variable/nunito-sans",
  "@fontsource-variable/jetbrains-mono",
  "@fontsource-variable/space-grotesk",
  "@fontsource-variable/manrope",
  "@fontsource-variable/sora",
  "@fontsource-variable/source-sans-3",
  "@fontsource-variable/fraunces",
  "@fontsource-variable/orbitron",
  "@fontsource-variable/fira-code",
  "@fontsource/dm-serif-display",
  "@fontsource/archivo-black",
  "@fontsource/vt323",
  "@fontsource/ibm-plex-mono",
];

/** Static families ship one file per weight; these are the ones worth shipping. */
const STATIC_WEIGHTS = [400, 500, 600, 700];
/** Variable axis files, in order of preference. */
const VARIABLE_AXES = ["wght", "standard", "full"];

function packageDir(pkg) {
  return path.dirname(require.resolve(`${pkg}/metadata.json`));
}

/** Collect the @font-face sources for one package, keyed by the family name. */
function facesForPackage(pkg) {
  const dir = packageDir(pkg);
  const meta = JSON.parse(
    fs.readFileSync(path.join(dir, "metadata.json"), "utf-8"),
  );
  const slug = pkg.split("/")[1];
  const available = new Set(fs.readdirSync(path.join(dir, "files")));
  const faces = [];

  // `metadata.variable` is an object keyed by axis (ital / opsz / wght / ...).
  const axes =
    meta.variable && typeof meta.variable === "object" ? meta.variable : null;
  if (axes) {
    const axis = VARIABLE_AXES.find((a) =>
      available.has(`${slug}-latin-${a}-normal.woff2`),
    );
    if (axis) {
      const wght = axes.wght ?? {};
      faces.push({
        file: `${slug}-latin-${axis}-normal.woff2`,
        // A variable face declares the whole range it can synthesise.
        weight: wght.min && wght.max ? `${wght.min} ${wght.max}` : "400",
      });
    }
  }

  if (faces.length === 0) {
    for (const weight of STATIC_WEIGHTS) {
      const file = `${slug}-latin-${weight}-normal.woff2`;
      if (available.has(file)) faces.push({ file, weight: String(weight) });
    }
  }

  if (faces.length === 0) {
    throw new Error(`No latin woff2 found for ${pkg}`);
  }

  return { family: meta.family, dir, faces };
}

function fontFaceCSS(family, faces) {
  return faces
    .map(
      ({ file, weight }) =>
        `@font-face {\n` +
        `  font-family: '${family}';\n` +
        `  font-style: normal;\n` +
        `  font-weight: ${weight};\n` +
        `  font-display: swap;\n` +
        `  src: url('./files/${file}') format('woff2');\n` +
        `}`,
    )
    .join("\n");
}

/** `'"Playfair Display", Georgia, serif'` -> `Playfair Display`. */
function primaryFamily(stack) {
  const first = stack.split(",")[0].trim();
  return first.replace(/^["']|["']$/g, "");
}

fs.rmSync(fontsDir, { recursive: true, force: true });
fs.mkdirSync(filesDir, { recursive: true });

const byFamily = new Map();
for (const pkg of FONT_PACKAGES) {
  const { family, dir, faces } = facesForPackage(pkg);
  for (const { file } of faces) {
    fs.copyFileSync(path.join(dir, "files", file), path.join(filesDir, file));
  }
  byFamily.set(family, fontFaceCSS(family, faces));
}

const visionIds = getCompiledVisionIds();
const missing = new Set();

for (const id of visionIds) {
  const vision = getVisionThemeById(id);
  const { fontStack } = vision.artisticPillars.typographyArchitecture;
  const families = [
    ...new Set(
      [fontStack.display, fontStack.body, fontStack.mono].map(primaryFamily),
    ),
  ];

  const blocks = [];
  for (const family of families) {
    const css = byFamily.get(family);
    if (css) blocks.push(css);
    // A system stack (system-ui, Georgia, monospace) needs no face and is not a gap.
    else if (/^[A-Z]/.test(family)) missing.add(`${id}: ${family}`);
  }

  fs.writeFileSync(
    path.join(fontsDir, `${id}.css`),
    `/* Self-hosted faces for the "${vision.name}" vision. Import alongside ${id}.css. */\n\n${blocks.join("\n\n")}\n`,
  );
}

fs.writeFileSync(
  path.join(fontsDir, "all.css"),
  `/* Every face the catalog uses. Prefer the per-vision file unless you switch visions at runtime. */\n\n${[...byFamily.values()].join("\n\n")}\n`,
);

if (missing.size > 0) {
  throw new Error(
    `Vision fonts with no self-hosted face:\n  ${[...missing].join("\n  ")}`,
  );
}

const fileCount = fs.readdirSync(filesDir).length;
console.log(
  `Fonts built: ${byFamily.size} families, ${fileCount} woff2 files, ${visionIds.length} vision stylesheets`,
);
