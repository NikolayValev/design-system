# Theming v2 — Profiles Removal + Light/Dark Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the legacy `profiles` / `@nikolayvalev/design-tokens` token system so the vision model is the single source of truth (Phase 1), then give every vision a hand-tuned light **and** dark palette switchable at runtime (Phase 2).

**Architecture:** The `vde-themes` vision system already emits both `--vde-*` and the shadcn-compatible aliases (`--primary`, `--background`, …) from each vision's colors, so `profiles` are pure duplication. Phase 1 deletes the duplicate system and rewires the CLI, build-css, MCP server, CI, and docs onto direct vision selection. Phase 2 changes `VisionTheme.colors` from a flat palette to `{ light, dark }` + `defaultMode`, threads a `mode` through `visionToCSSVariables` / `applyVisionToElement` / `VisionProvider`, and authors the second palette per theme.

**Tech Stack:** TypeScript, React 18, Tailwind v3.4 (arbitrary values + CSS vars), tsup, Storybook 8 + Playwright + test-runner, Node ESM build scripts, changesets, pnpm/turbo monorepo.

**Spec:** `docs/superpowers/specs/2026-06-06-theming-profiles-removal-darkmode-design.md`

**Testing reality:** the design-system package has **no jest/vitest**. "Tests" here are: the node assertion script `scripts/verify-expanded-visions.mjs` (run via `test:vision-registry`), the Playwright specs in `apps/storybook/tests/visual/`, the Storybook test-runner, `scripts/validate-exports.js`, and `pnpm typecheck` / `pnpm lint`. Steps below use those as the failing/passing gates.

**Working branch:** `feat/theming-profiles-removal-darkmode` (already created; the spec commit is on it).

---

## File map

**Phase 1 — deleted**
- `packages/design-tokens/**` (whole package)
- `packages/design-system/src/theme.ts`
- `packages/design-system/src/tailwind/preset.ts`, `src/tailwind/index.ts`
- `packages/design-system/src/styles/generator.ts`
- `packages/design-system/src/tokens/**` (profiles.ts, profile-names.ts, base.ts, types.ts, index.ts) — after confirming no remaining importers
- `packages/design-system/src/utils/chart-mapping.ts` — after confirming no remaining importers

**Phase 1 — modified**
- `packages/design-system/src/index.ts` (drop `./theme`, `./tokens`, `./utils/chart-mapping` re-exports)
- `packages/design-system/src/vde-themes/systems.ts` (delete profile/tier API), `catalog.ts` (drop `expandedVisionThemeIds`), `index.ts`
- `packages/design-system/scripts/build-css.js` (per-vision output)
- `packages/design-system/scripts/verify-expanded-visions.mjs` (assert curated catalog)
- `packages/design-system/scripts/validate-exports.js` (new export surface)
- `packages/design-system/package.json` (exports map), `tsup.config.ts` (entries)
- `packages/design-system/src/cli/init.ts` (vision picker)
- `packages/mcp-server/src/mcpServer.ts`, `src/tools/tokenThemeTools.ts`, `src/tools/designSystemTools.ts`, `api/docs.ts`
- `.github/workflows/monorepo-deploy.yml`
- `apps/storybook/tests/visual/vision-expanded.spec.ts`
- `pnpm-workspace.yaml`, root docs (`ARCHITECTURE.md`, `DESIGN_SYSTEM.md`, `README.md`, `QUICKSTART.md`, `CONTRIBUTING.md`, `.github/copilot-instructions.md`, `docs/MCP_INTEGRATION.md`), `packages/design-system/{USAGE.md,MIGRATION.md}`
- `.changeset/<new>.md`

**Phase 2 — modified**
- `packages/design-system/src/vde-core/types.ts`, `css.ts`, `context.tsx`, `index.ts`
- `packages/design-system/src/vde-themes/*.theme.ts` (all 12)
- `packages/design-system/scripts/build-css.js`, `scripts/verify-expanded-visions.mjs`
- `apps/storybook/.storybook/preview.tsx`, `apps/storybook/src/{ThemeGallery,VisionaryExplorer}.stories.tsx`, new `apps/storybook/src/ThemeModes.stories.tsx`
- `apps/storybook/tests/visual/vision-switch.spec.ts`
- docs (mode API)

---

# PHASE 1 — Retire profiles

### Task 1: Drop profile exports from the package entry points

**Files:**
- Modify: `packages/design-system/src/index.ts`
- Delete: `packages/design-system/src/theme.ts`
- Delete: `packages/design-system/src/tailwind/preset.ts`, `packages/design-system/src/tailwind/index.ts`
- Delete: `packages/design-system/src/styles/generator.ts`

- [ ] **Step 1: Edit `src/index.ts`** — remove the profile/token re-exports. Final file:

```ts
export * from './components';
export * from './sections';
export * from './pages';
export * from './intent';
export * from './vde-core';
export * from './vde-themes';
```

(Removed: `./theme`, `./tokens`, `./utils/chart-mapping`.)

- [ ] **Step 2: Delete the files**

```bash
git rm packages/design-system/src/theme.ts \
       packages/design-system/src/tailwind/preset.ts \
       packages/design-system/src/tailwind/index.ts \
       packages/design-system/src/styles/generator.ts
```

- [ ] **Step 3: Find remaining importers**

Run: `rg -n "from '\.\./theme'|from './theme'|tailwind/preset|styles/generator|createTheme|applyTheme|createTailwindPreset|defaultPreset" packages/design-system/src`
Expected: no hits in `src` except the now-deleted files. Fix any stragglers.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "refactor(design-system): drop profile theme/tailwind/generator entry points"
```

---

### Task 2: Delete the token/profile modules

**Files:**
- Delete: `packages/design-system/src/tokens/` (whole dir), `packages/design-system/src/utils/chart-mapping.ts`

- [ ] **Step 1: Confirm no importers remain**

Run: `rg -n "tokens/(base|profiles|profile-names|types|index)|utils/chart-mapping|tokenKeyToCSSVar|baseTokens|ThemeProfile|DesignTokens|BuiltInProfileName" packages/design-system/src`
Expected: hits only in `cli/init.ts` and `vde-themes/systems.ts` (handled in Tasks 3 & 5) and `scripts/build-css.js` (Task 4). If `vde-core/*` references any, stop and resolve — vde-core must not depend on tokens.

- [ ] **Step 2: Delete**

```bash
git rm -r packages/design-system/src/tokens packages/design-system/src/utils/chart-mapping.ts
```

- [ ] **Step 3: Commit** (build will be red until Tasks 3–5; that's expected — these tasks form one mechanical group)

```bash
git add -A && git commit -m "refactor(design-system): remove token/profile modules"
```

---

### Task 3: Decouple visions from profiles in `vde-themes`

**Files:**
- Modify: `packages/design-system/src/vde-themes/systems.ts`, `catalog.ts`, `index.ts`

- [ ] **Step 1: Replace `systems.ts`** with a profile-free, tier-free module:

```ts
import { getVisionThemeIds } from './catalog';

/** Ids of the visions compiled into a build. Defaults to the full curated catalog. */
export function getCompiledVisionIds(selected?: readonly string[]): string[] {
  const all = getVisionThemeIds();
  if (!selected || selected.length === 0) return all;
  const allowed = new Set(all);
  const unknown = selected.filter(id => !allowed.has(id));
  if (unknown.length > 0) {
    throw new Error(`Unknown vision id(s): ${unknown.join(', ')}`);
  }
  return selected.filter(id => allowed.has(id));
}
```

- [ ] **Step 2: Edit `catalog.ts`** — delete the `expandedVisionThemeIds` export (lines defining the `as const` tuple). Leave `visionThemes`, `getVisionThemeById`, `getVisionThemeIds`, `getVisionThemeNames`, `isVisionThemeId`, `defaultVisionRegistry`.

- [ ] **Step 3: `index.ts`** stays `export * from './catalog'; export * from './families'; export * from './systems';` (now exports the new helper).

- [ ] **Step 4: Fix the two `expandedVisionThemeIds` consumers** (they break the moment the export is gone — both must be green for Phase 1).

In `packages/design-system/scripts/verify-expanded-visions.mjs`, stop importing the removed symbol and iterate the full catalog (interim Phase-1 version; Task 12 extends it for modes):

```js
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
```

In `apps/storybook/tests/visual/vision-expanded.spec.ts`, replace `import { expandedVisionThemeIds }` and `const expandedVisions = [...expandedVisionThemeIds]` with a representative one-per-family list:

```ts
const expandedVisions = ['editorial', 'swiss_international', 'terminal', 'immersive', 'solarpunk'];
```

- [ ] **Step 5: Verify the vde surface is clean**

Run: `rg -n "VisionSystemId|expandedVisionThemeIds|ProfileVisionAssignments|resolveProfileVisionAssignments" packages apps --glob '!**/dist/**'`
Expected: no hits.
Run: `pnpm --filter @nikolayvalev/design-system build && pnpm --filter @nikolayvalev/design-system test:vision-registry`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "refactor(design-system): vision selection without profiles or tiers"
```

---

### Task 4: Rewrite `build-css.js` to emit per-vision CSS

**Files:**
- Modify: `packages/design-system/scripts/build-css.js`
- Modify: `packages/design-system/package.json` (exports map), `packages/design-system/tsup.config.ts` (drop `tailwind`/`tokens` entries if present), `packages/design-system/scripts/validate-exports.js`

- [ ] **Step 1: Replace `build-css.js`** with a vision-only generator:

```js
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
```

- [ ] **Step 2: Update `package.json` `exports`** — remove `./styles/public.css`, `./styles/dashboard.css`, `./styles/experimental.css`, `./tailwind`, `./tokens`. Keep `.`, `./styles` (→ `./dist/styles/global.css`). Add a wildcard for per-vision CSS:

```jsonc
"./styles/*.css": "./dist/styles/*.css"
```

- [ ] **Step 3: Update `tsup.config.ts`** — remove `src/tailwind/index.ts` and `src/tokens/index.ts` from the `entry` array (keep `src/index.ts`, `src/cli/init.ts`).

- [ ] **Step 4: Rewrite `validate-exports.js`** — required files become `dist/index.js`, `dist/index.d.ts`, `dist/styles/global.css`, and at least one `dist/styles/<id>.css` (e.g. `editorial.css`). `expectedExports` = `'.'`, `'./styles'`, `'./styles/*.css'`. `dtsChecks` root must export `Button`, `Card`, `Input`, `VisionProvider`, `visionThemes` (drop `createTheme`/`applyTheme`/profile names). Remove the tailwind/tokens dts checks and the profile CSS content checks.

- [ ] **Step 5: Build + validate**

Run: `pnpm --filter @nikolayvalev/design-system build`
Expected: succeeds; `dist/styles/` contains `global.css`, `editorial.css`, … `y2k_chrome.css`, `visions.json`; no `public/dashboard/experimental.css`.
Run: `node packages/design-system/scripts/validate-exports.js`
Expected: all green.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "build(design-system): per-vision CSS output, drop profile exports"
```

---

### Task 5: Rework the CLI onto direct vision selection

**Files:**
- Modify: `packages/design-system/src/cli/init.ts`

- [ ] **Step 1: Remove the profile surface.** Delete: the `--profile` flag, `--list-profiles`, `profileDisplayList`, profile descriptions, `DEFAULT_PROFILE`/`BuiltInProfileName` usage, the `--vision-map` / `--vision-public|dashboard|experimental` options, the `--vision-system` option, `VISION_SYSTEM_*`, and all `resolveProfileVisionAssignments` / `getDefaultProfileVisionAssignments` calls and their imports.

- [ ] **Step 2: Add vision selection.** New options: `--vision <id>` (comma-separated allowed) and `--list-visions`. Source ids from `getVisionThemeIds()`; group the interactive picker by family using `themeFamilies` / `groupThemesByFamily` from `@nikolayvalev/design-system`. Default selection when omitted: all visions (or a sensible default like `editorial`). Update `--help` text and any printed summaries to say "vision(s)" not "profile".

- [ ] **Step 3: Typecheck the package**

Run: `pnpm --filter @nikolayvalev/design-system typecheck`
Expected: PASS (no profile symbols).

- [ ] **Step 4: CLI smoke**

Run: `pnpm --filter @nikolayvalev/design-system build && node packages/design-system/dist/cli/init.js --list-visions`
Expected: prints the 12 vision ids grouped by family, exits 0.
Run (temp dir): `node packages/design-system/dist/cli/init.js --modules themes,components --vision editorial --install-root .tmp-init-smoke --yes` (adapt flags to the actual non-interactive switches)
Expected: writes sources, exits 0. Then `rm -rf .tmp-init-smoke`.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat(design-system cli): select visions directly, remove profile flags"
```

---

### Task 6: Strip profiles from the MCP server

**Files:**
- Modify: `packages/mcp-server/src/mcpServer.ts`, `src/tools/tokenThemeTools.ts`, `src/tools/designSystemTools.ts`, `api/docs.ts`

- [ ] **Step 1: Remove tools/resources.** In `mcpServer.ts` delete the `list_token_profiles` tool (~482), `get_token_profile_source` tool (~499), the `token_profiles` resource (~658), and the `TOKEN_PROFILES` constant. In `tokenThemeTools.ts` delete the `profiles.ts` reader (~121) and any `getTokenProfile*` exports. Grep `designSystemTools.ts` for profile references and remove.

- [ ] **Step 2: Update `api/docs.ts`** — change the "base → profiles → themes" 3-layer narrative to the single vision model; delete the `list_token_profiles` / `get_token_profile_source` tool cards and the `token_profiles` resource entry; drop the "three OKLCH token profiles" copy.

- [ ] **Step 3: Verify**

Run: `rg -n "token_profile|TOKEN_PROFILES|profiles\.ts" packages/mcp-server`
Expected: no hits.
Run: `pnpm --filter @nikolayvalev/design-system-mcp build`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "refactor(mcp): remove token-profile tools, resource, and docs"
```

---

### Task 7: Fix the CI deploy bundling step

**Files:**
- Modify: `.github/workflows/monorepo-deploy.yml`

- [ ] **Step 1:** In the "Bundle design-system sources into MCP server" step (~71-81), remove the two lines copying `tokens/profiles.ts` and `tokens/base.ts` (and the `mkdir -p .../tokens`). Keep the copies of `vde-themes`, `components`, `sections`, `pages`, and `CONTRIBUTION_GUIDE.md`. Confirm `tokenThemeTools.ts` no longer reads `design-system-src/tokens`.

- [ ] **Step 2: Lint the YAML mentally / via actionlint if available**

Run (if installed): `actionlint .github/workflows/monorepo-deploy.yml` — else visually confirm valid YAML.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "ci: stop bundling token profiles into the MCP server"
```

---

### Task 8: Delete the `@nikolayvalev/design-tokens` package

**Files:**
- Delete: `packages/design-tokens/`
- Modify: `pnpm-workspace.yaml`, root `package.json` (`release`/`release:mcp` filters if they name it), `.changeset/config.json` if it lists it

- [ ] **Step 1: Confirm zero internal importers**

Run: `rg -n "@nikolayvalev/design-tokens" --glob '!**/dist/**' --glob '!docs/superpowers/**'`
Expected: only docs (handled in Task 9). No app or package code.

- [ ] **Step 2: Delete + deregister**

```bash
git rm -r packages/design-tokens
```
Remove any `packages/design-tokens` entry from `pnpm-workspace.yaml` (likely a glob `packages/*`, so no change needed — verify).

- [ ] **Step 3: Reinstall + build workspace**

Run: `pnpm install`
Expected: lockfile updates, no missing-dependency errors.
Run: `pnpm -w build`
Expected: all packages build.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "chore: remove @nikolayvalev/design-tokens package"
```

---

### Task 9: Docs + changeset

**Files:**
- Modify: `ARCHITECTURE.md`, `DESIGN_SYSTEM.md`, `README.md`, `QUICKSTART.md`, `CONTRIBUTING.md`, `.github/copilot-instructions.md`, `docs/MCP_INTEGRATION.md`, `packages/design-system/USAGE.md`, `packages/design-system/MIGRATION.md`
- Create: `.changeset/theming-v2-profiles-removal.md`

- [ ] **Step 1: Rewrite profile content.** In `ARCHITECTURE.md` replace the whole "Theme Profiles" + "Configuration API" + Tailwind preset sections with the vision model (VisionProvider, `--vde-*` + shadcn aliases, per-vision CSS). In `DESIGN_SYSTEM.md` remove "install design tokens as a package dependency: @nikolayvalev/design-tokens" and point to the vision system. Update `README.md`/`QUICKSTART.md`/`USAGE.md` install + usage snippets (drop `createTheme`/`createTailwindPreset`/profile CSS imports; show `VisionProvider` + `import '@nikolayvalev/design-system/styles/editorial.css'`). Update `CONTRIBUTING.md`, `.github/copilot-instructions.md`, `docs/MCP_INTEGRATION.md` (drop the two profile tools; "token profiles" → vision themes). Update `MIGRATION.md` with the v-major migration steps.

- [ ] **Step 2: Grep guard**

Run: `rg -n "design-tokens|publicProfile|dashboardProfile|experimentalProfile|createTheme|applyTheme|createTailwindPreset|list_token_profiles|--profile|vision-map" --glob '!**/dist/**' --glob '!docs/superpowers/**'`
Expected: no hits outside intentional migration notes.

- [ ] **Step 3: Changeset (major)**

```bash
cat > .changeset/theming-v2-profiles-removal.md <<'MD'
---
"@nikolayvalev/design-system": major
---

Remove the legacy token-profile system. `createTheme`, `applyTheme`,
`createTailwindPreset`, `publicProfile`/`dashboardProfile`/`experimentalProfile`,
the profile token types, the `./tailwind` and `./tokens` entry points, and the
`public/dashboard/experimental.css` files are gone. The `@nikolayvalev/design-tokens`
package is discontinued. Use `VisionProvider` + the vision themes; import
per-vision CSS from `@nikolayvalev/design-system/styles/<visionId>.css`.
MD
```

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "docs: rewrite theming docs for the vision-only model; add major changeset"
```

---

### Task 10: Phase 1 verification gate

- [ ] **Step 1: Full gates**

Run: `pnpm typecheck && pnpm lint`
Expected: all packages green.
Run: `pnpm --filter @nikolayvalev/design-system build && node packages/design-system/scripts/validate-exports.js`
Expected: green.
Run: `pnpm --filter @nikolayvalev/design-system test:vision-registry`
Expected: pass.
Run: `pnpm test:design`
Expected: stories + vision + visual pass (no visual changes expected in Phase 1; components untouched).

- [ ] **Step 2: Final grep guard**

Run: `rg -n "profiles|ProfileVision|VisionSystemId|@nikolayvalev/design-tokens" packages apps --glob '!**/dist/**'`
Expected: no live-code hits.

- [ ] **Step 3: Tag the phase**

```bash
git commit --allow-empty -m "chore: Phase 1 complete — single vision-based token model"
```

---

# PHASE 2 — Light/dark per theme

### Task 11: Dual-palette type + atomic mechanical migration

This task changes the contract and keeps everything compiling by temporarily
duplicating each theme's palette into both modes. Real opposite palettes are
authored in Task 14.

**Files:**
- Modify: `packages/design-system/src/vde-core/types.ts`, `css.ts`, `context.tsx`, `index.ts`
- Modify: all 12 `packages/design-system/src/vde-themes/*.theme.ts`

- [ ] **Step 1: Edit `types.ts`** — add the mode type and restructure colors:

```ts
export type ThemeMode = 'light' | 'dark';

export interface VisionTheme {
  id: string;
  name: string;
  archetype: string;
  description: string;
  family: ThemeFamilyId;
  tagline: string;
  summary: string;
  bestFor: string[];
  mood: string[];
  /** Native mode the theme was designed in. */
  defaultMode: ThemeMode;
  colors: { light: VisionColors; dark: VisionColors };
  artisticPillars: ArtisticPillars;
  ornaments: VisionOrnaments;
}
```

Add to `VisionContextValue`: `mode: ThemeMode; setMode: (mode: ThemeMode) => void; toggleMode: () => void;`. Export `ThemeMode` from `vde-core/index.ts`.

- [ ] **Step 2: Edit `css.ts`** — make resolution mode-aware:

```ts
export function visionToCSSVariables(vision: VisionTheme, mode: ThemeMode = vision.defaultMode): Record<string, string> {
  const colors = vision.colors[mode];
  const { artisticPillars } = vision;
  // ...unchanged pillar/atmospheric destructuring...
  return {
    '--vde-color-background': colors.background,
    // ...rest identical, but every `colors.*` now reads from the selected mode...
  };
}

export function applyVisionToElement(element: HTMLElement, vision: VisionTheme, mode: ThemeMode = vision.defaultMode): void {
  const variables = visionToCSSVariables(vision, mode);
  for (const [property, value] of Object.entries(variables)) element.style.setProperty(property, value);
  element.setAttribute('data-vde-vision', vision.id);
  element.setAttribute('data-vde-archetype', vision.archetype);
  element.setAttribute('data-vde-mode', mode);
}
```

(The atmospheric override map keys on `vision.id` only — unchanged.)

- [ ] **Step 3: Migrate all 12 theme files mechanically.** For each `*.theme.ts`, wrap the existing flat `colors: { … }` as **both** modes and set `defaultMode` to the theme's native look (light: editorial, museum, swiss_international, zen, clay_soft, solarpunk, y2k_chrome; dark: terminal, brutalist, immersive, synthwave, noir):

```ts
// before:  colors: { background: '…', … },
// after:
  defaultMode: 'light',
  colors: {
    light: { background: '…', /* the existing palette */ },
    dark: { background: '…',  /* TEMP: identical copy, replaced in Task 14 */ },
  },
```

- [ ] **Step 4: Update `context.tsx`** to thread mode (full code in Task 13; for this task, the minimal change is to call `applyVisionToElement(root, activeVision, activeVision.defaultMode)` so it compiles).

- [ ] **Step 5: Typecheck + build**

Run: `pnpm --filter @nikolayvalev/design-system typecheck && pnpm --filter @nikolayvalev/design-system build`
Expected: PASS; both modes resolve (identical for now).

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat(design-system): dual-palette VisionTheme model (modes identical placeholder)"
```

---

### Task 12: Mode resolution test

**Files:**
- Modify: `packages/design-system/scripts/verify-expanded-visions.mjs`

- [ ] **Step 1: Extend the verify script** to iterate `getVisionThemeIds()` and assert **both** modes resolve a complete var set:

```js
import { getVisionThemeIds, getVisionThemeById, visionToCSSVariables } from '../dist/index.js';
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
```

(Keep/trim any per-theme assertions that still make sense; remove ones referencing cut themes.)

- [ ] **Step 2: Run it**

Run: `pnpm --filter @nikolayvalev/design-system build && pnpm --filter @nikolayvalev/design-system test:vision-registry`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "test(design-system): assert both modes resolve for every vision"
```

---

### Task 13: `VisionProvider` mode support

**Files:**
- Modify: `packages/design-system/src/vde-core/context.tsx`

- [ ] **Step 1: Add mode state + resolution.** Add props `mode?`, `defaultMode?`, `onModeChange?`. Resolve initial mode: `mode` prop → `defaultMode` prop → `activeVision.defaultMode` → `prefers-color-scheme` (guard `typeof window`). Maintain `internalMode` state; `activeMode = mode ?? internalMode`. `setMode`/`toggleMode` update state (controlled when `mode` provided) and call `onModeChange`. The apply effect becomes:

```tsx
useEffect(() => {
  if (!activeVision || typeof document === 'undefined') return;
  const root = targetElement ?? document.documentElement;
  applyVisionToElement(root, activeVision, activeMode);
}, [activeVision, activeMode, targetElement]);
```

Add `mode: activeMode`, `setMode`, `toggleMode` to the context value.

- [ ] **Step 2: Typecheck**

Run: `pnpm --filter @nikolayvalev/design-system typecheck`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat(design-system): VisionProvider light/dark mode with system-preference default"
```

---

### Task 14: Author the opposite palette per theme (repeat ×12)

**Files:**
- Modify: each `packages/design-system/src/vde-themes/<id>.theme.ts`

Do one theme per step+commit. Replace the TEMP-duplicated opposite-mode palette
with a real one: keep the accent hue/identity, invert lightness relationships
(swap background/foreground roles), keep chart hues, target WCAG-AA body
contrast. Worked example for `editorial` (native light) — author its `dark`:

```ts
// editorial.theme.ts → colors.dark
dark: {
  background: 'oklch(0.18 0.01 250)',
  foreground: 'oklch(0.96 0.01 250)',
  surface: 'oklch(0.22 0.015 250)',
  surfaceForeground: 'oklch(0.96 0.01 250)',
  accent: 'oklch(0.62 0.19 22)',
  accentForeground: 'oklch(0.16 0.02 250)',
  secondary: 'oklch(0.30 0.02 250)',
  secondaryForeground: 'oklch(0.95 0.01 250)',
  muted: 'oklch(0.26 0.02 250)',
  mutedForeground: 'oklch(0.72 0.02 250)',
  border: 'oklch(0.34 0.02 250)',
  input: 'oklch(0.26 0.02 250)',
  ring: 'oklch(0.62 0.18 22)',
  danger: 'oklch(0.62 0.21 24)',
  dangerForeground: 'oklch(0.97 0 0)',
  chart1: 'oklch(0.66 0.18 22)', chart2: 'oklch(0.70 0.14 250)',
  chart3: 'oklch(0.72 0.16 110)', chart4: 'oklch(0.74 0.14 70)', chart5: 'oklch(0.70 0.14 315)',
},
```

- [ ] **For each of the 12** (editorial, museum, swiss_international, zen, clay_soft, solarpunk, y2k_chrome → author `dark`; terminal, brutalist, immersive, synthwave, noir → author `light`):
  - Step A: Replace the TEMP palette with the authored one.
  - Step B: `pnpm --filter @nikolayvalev/design-system build && pnpm --filter @nikolayvalev/design-system test:vision-registry` → PASS.
  - Step C: `git commit -m "feat(themes): author <id> <mode> palette"`.

---

### Task 15: Per-vision CSS emits both modes

**Files:**
- Modify: `packages/design-system/scripts/build-css.js`

- [ ] **Step 1:** Emit a default-mode `:root` plus the opposite mode under both `[data-vde-mode]` and a `.dark`/`.light` alias:

```js
function visionCSS(vision) {
  const root = blockFromVars(':root', visionToCSSVariables(vision, vision.defaultMode));
  const other = vision.defaultMode === 'light' ? 'dark' : 'light';
  const otherSel = blockFromVars(`[data-vde-mode="${other}"]`, visionToCSSVariables(vision, other));
  const aliasSel = blockFromVars(other === 'dark' ? '.dark' : '.light', visionToCSSVariables(vision, other));
  return [root, otherSel, aliasSel].join('\n\n');
}
// blockFromVars(sel, vars) -> `${sel} {\n  --x: y;\n}` for keys starting with '--'
```

- [ ] **Step 2: Build + eyeball**

Run: `pnpm --filter @nikolayvalev/design-system build`
Expected: `dist/styles/editorial.css` contains `:root`, `[data-vde-mode="dark"]`, and `.dark` blocks.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "build(design-system): per-vision CSS emits light + dark blocks"
```

---

### Task 16: Storybook mode toggle + dual-mode views

**Files:**
- Modify: `apps/storybook/.storybook/preview.tsx`, `apps/storybook/src/ThemeGallery.stories.tsx`, `apps/storybook/src/VisionaryExplorer.stories.tsx`
- Create: `apps/storybook/src/ThemeModes.stories.tsx`

- [ ] **Step 1: Add a `mode` global** in `preview.tsx` (`globalTypes.mode` with light/dark toolbar items) and pass it to `VisionProvider` (`mode={context.globals.mode}`). The decorator already wraps in `VisionProvider`; add the `mode` prop.

- [ ] **Step 2: Gallery/Explorer dual-mode.** In `ThemeGallery.stories.tsx`, render each card's swatches/preview for `colors.light` and `colors.dark` side by side (read both off the theme; don't rely on the active mode). In `VisionaryExplorer.stories.tsx`, show the active mode and a light/dark switch (call `setMode` from `useVision()`).

- [ ] **Step 3: New `Themes/Modes` story** that renders a small component set (Button/Card/Input/Badge) for one vision in light and dark next to each other — the single dual-mode visual baseline.

- [ ] **Step 4: Build Storybook**

Run: `pnpm --filter @apps/storybook build`
Expected: all stories compile.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat(storybook): light/dark mode toggle and dual-mode theme views"
```

---

### Task 17: Mode-switch integration assertion

**Files:**
- Modify: `apps/storybook/tests/visual/vision-switch.spec.ts`

- [ ] **Step 1: Add a test** that loads `components-button--playground` with `globals=mode:dark` then `mode:light` and asserts `document.documentElement` `data-vde-mode` flips and `--vde-color-background` changes between modes:

```ts
test('mode toggle swaps the active palette', async ({ page }) => {
  const read = (v: string) => page.evaluate(n => getComputedStyle(document.documentElement).getPropertyValue(n).trim(), v);
  await page.goto('/iframe.html?id=components-button--playground&viewMode=story&globals=mode:dark', { waitUntil: 'networkidle' });
  await expect.poll(() => page.evaluate(() => document.documentElement.getAttribute('data-vde-mode'))).toBe('dark');
  const darkBg = await read('--vde-color-background');
  await page.goto('/iframe.html?id=components-button--playground&viewMode=story&globals=mode:light', { waitUntil: 'networkidle' });
  await expect.poll(() => page.evaluate(() => document.documentElement.getAttribute('data-vde-mode'))).toBe('light');
  expect(await read('--vde-color-background')).not.toBe(darkBg);
});
```

- [ ] **Step 2: Run vision specs**

Run: `pnpm --filter @apps/storybook test:vision`
Expected: PASS (existing + new test).

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "test(storybook): assert mode toggle swaps the palette"
```

---

### Task 18: Regenerate baselines, docs, Phase 2 gate

**Files:**
- Modify: `README.md`, `packages/design-system/USAGE.md` (mode API), regenerate `apps/storybook/tests/visual/stories.visual.spec.ts-snapshots/`

- [ ] **Step 1: Document the mode API** — `VisionProvider` `mode`/`defaultMode`/`onModeChange`, `useVision().mode/setMode/toggleMode`, `data-vde-mode`, per-vision CSS dark block, and per-theme `defaultMode`.

- [ ] **Step 2: Regenerate visual baselines** (new `Themes/Modes` story + any intentional changes)

```bash
rm -f apps/storybook/tests/visual/stories.visual.spec.ts-snapshots/*.png
pnpm --filter @apps/storybook test:visual:update
```
Expected: writes fresh baselines; run completes green.

- [ ] **Step 3: Full gate**

Run: `pnpm typecheck && pnpm lint && pnpm --filter @nikolayvalev/design-system test:vision-registry && pnpm test:design`
Expected: all green.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "docs+test: document mode API and regenerate baselines (Phase 2 complete)"
```

---

## Final verification checklist
- [ ] No `profiles` / `design-tokens` / `createTheme` / `createTailwindPreset` in live code (grep guard).
- [ ] `pnpm -w build`, `pnpm typecheck`, `pnpm lint` green.
- [ ] `validate-exports.js`, `test:vision-registry`, `test:design` green.
- [ ] CLI `--list-visions` works; MCP builds without profile tools.
- [ ] Every vision resolves complete `light` and `dark` var sets; Storybook mode toggle flips the palette live.
- [ ] Major changeset present; migration documented.
