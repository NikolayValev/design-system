# Theming v2 — Retire Profiles + Light/Dark Per Theme

> Design spec. Status: approved for planning. Date: 2026-06-06.

## Context

The design system carries **two** token systems:

- **`vde-themes`** (live) — 12 curated `VisionTheme`s. Components consume the
  `--vde-*` CSS variables emitted by `VisionProvider`. Crucially, the vision
  layer **already emits the shadcn-compatible aliases** (`--primary`,
  `--background`, `--card`, `--ring`, `--chart-*`, …) derived from each vision's
  colors — see `vde-core/css.ts`.
- **`profiles`** (legacy) — `public`/`dashboard`/`experimental` token bundles in
  `tokens/profiles.ts` plus a parallel published package
  `@nikolayvalev/design-tokens`. Disconnected from the components.

Because the vision layer already provides the shadcn aliases, `profiles` are pure
duplication. This effort removes them so there is **one** token model, then adds
**per-theme light/dark** on the clean foundation.

**Verified internal blast radius:** none of the monorepo apps (`game`,
`second-brain`, `strata`) import `@nikolayvalev/design-tokens` or the profile API.
Internal consumers are limited to design-system internals, the MCP server,
`build-css`, the CLI, the CI deploy step, and docs. The only externally breaking
surface is the published `design-tokens` package → handled by a **major** bump.

## Goals

1. A single token model (vision-based); the `profiles` / `design-tokens` system
   removed.
2. Every vision ships a hand-tuned **light and dark** palette, switchable at
   runtime via a mode toggle, defaulting sensibly per theme / system preference.
3. No regressions: components stay token-driven and untouched; Storybook, tests,
   MCP, CLI, and CI remain green.

## Non-goals

- Re-art-directing the existing (native-mode) palettes — we add the *opposite*
  mode, we don't redesign what exists.
- Mode-specific **atmospherics** (grain/glow/mesh). v1 keeps the atmospheric
  overrides in `vde-core/css.ts` shared across modes; revisit later if a theme
  demands it.
- New components or showcase changes.

## Locked decisions

- **Sequence:** Phase 1 (retire profiles) → Phase 2 (light/dark). Phase 1 is
  independently shippable.
- **Dark mode authoring:** hand-tuned dual palettes per theme.
- **Profiles:** full removal (delete the `design-tokens` package), **major**
  version bump for `@nikolayvalev/design-system`.
- **Color model:** `VisionTheme.colors` becomes `{ light, dark }` + a per-theme
  `defaultMode`.
- **Initial mode resolution:** explicit prop → theme `defaultMode` →
  `prefers-color-scheme`.
- **build-css:** emit **per-vision** CSS (`<visionId>.css`), not per-profile.
- **CLI:** select a **vision** directly; the profile picker and `--vision-map`
  are removed.

---

## Phase 1 — Retire profiles

### 1. Delete the `@nikolayvalev/design-tokens` package
Remove `packages/design-tokens/` entirely and drop it from
`pnpm-workspace.yaml` / any references in release config and `DESIGN_SYSTEM.md`
governance ("install design tokens as a package dependency" → removed).

### 2. Remove profiles from `@nikolayvalev/design-system`
Delete / prune:
- `src/tokens/profiles.ts`, `src/tokens/profile-names.ts`
- `src/theme.ts` (`createTheme`, `applyTheme`, `ThemeConfig`, `Theme`)
- `src/tailwind/preset.ts` and the profile-preset surface of `src/tailwind/index.ts`
- `src/styles/generator.ts`
- `src/tokens/base.ts`, `src/tokens/types.ts`, `src/utils/chart-mapping.ts` —
  delete **only if unused** after the above (grep first; `chart-mapping` and
  `base` are profile-era helpers).
- Update `src/index.ts` and `src/tokens/index.ts` exports; update
  `scripts/validate-exports.js` expectations.

### 3. Decouple visions from profiles (`src/vde-themes/systems.ts`)
- Remove `ProfileVisionAssignments`, `DEFAULT_PROFILE_VISION_ASSIGNMENTS`,
  `resolveProfileVisionAssignments`, `getDefaultProfileVisionAssignments`, and
  the `Record<BuiltInProfileName, …>` typing.
- Collapse the `legacy`/`expanded`/`all` tier system into a **single curated
  catalog** (all 12). "Which visions compile in" is now expressed directly as a
  vision-id list via the CLI/build-css selection (default: all 12) — no profile
  keying, no tiers. Remove `VisionSystemId`, `getVisionSystemThemeIds`,
  `expandedVisionThemeIds`, and `DEFAULT_VISION_SYSTEM`; update
  `scripts/verify-expanded-visions.mjs` and `vision-expanded.spec.ts` to assert
  against the curated catalog instead of the expanded subset.

### 4. Rework `scripts/build-css.js`
- Drop `generateThemeCSS` / `generateDarkModeCSS` (profile-based) and the
  `public/dashboard/experimental.css` outputs.
- For each selected vision, emit `dist/styles/<visionId>.css` =
  `global.css` + the vision's `:root` block (the `--vde-*` + shadcn-alias layer
  from `visionToCSSVariables`). (Phase 2 extends this with the dark block.)
- Replace `DESIGN_SYSTEM_PROFILE_VISIONS` env handling with a vision-selection
  env (e.g. `DESIGN_SYSTEM_VISIONS=editorial,terminal`). Update
  `vision-assignments.json` manifest shape accordingly.

### 5. Rework the CLI (`src/cli/init.ts`)
- Remove `--profile`, `--list-profiles`, profile descriptions/pickers, and the
  `--vision-map` / `--vision-public|dashboard|experimental` profile mapping.
- Add direct vision selection: `--vision <id>` (repeatable or comma list) and an
  interactive vision picker grouped by family. `--list-visions` replaces
  `--list-profiles`. The `themes` module still installs theme sources.

### 6. MCP server
- Remove tools `list_token_profiles`, `get_token_profile_source`; remove the
  `token_profiles` resource and `TOKEN_PROFILES`; remove the profile reader path
  in `src/tools/tokenThemeTools.ts`.
- Update `api/docs.ts`: the "3-layer (base → profiles → themes)" narrative
  becomes the single vision model; drop profile tool/resource cards.
- Keep `list_themes` / `get_theme` (already vision-based).

### 7. CI deploy workflow (`.github/workflows/monorepo-deploy.yml`)
- The "Bundle design-system sources into MCP server" step copies
  `tokens/profiles.ts` + `base.ts`. Update it to stop copying profiles (and
  `base.ts` if pruned); copy only what the MCP server still serves
  (`vde-themes`, `components`, `sections`, `pages`).

### 8. Docs + versioning
- Rewrite the profiles sections in `ARCHITECTURE.md` (replace, not just the
  legacy banner), `DESIGN_SYSTEM.md`, `README.md`, `QUICKSTART.md`,
  `USAGE.md`, `CONTRIBUTING.md`, `.github/copilot-instructions.md`,
  `packages/design-system/MIGRATION.md`, `docs/MCP_INTEGRATION.md`.
- Add a **major** changeset for `@nikolayvalev/design-system` documenting the
  removed exports (`createTheme`, `applyTheme`, `*Profile`,
  `createTailwindPreset`, profile token types) and the migration path
  (use `VisionProvider` + per-vision CSS). Note the `design-tokens` package is
  discontinued.

### Phase 1 verification
- `pnpm --filter @nikolayvalev/design-system build` (incl. `build:css`) — emits
  per-vision CSS, no profile outputs.
- `pnpm typecheck && pnpm lint` (workspace) — green; no dangling profile imports.
- `pnpm --filter @nikolayvalev/design-system test:vision-registry`.
- `pnpm test:design` (stories + vision + visual).
- CLI smoke: `node packages/design-system/dist/cli/init.js --list-visions` and a
  non-interactive `init --modules themes,components --vision editorial` into a
  temp dir.
- MCP build (`pnpm --filter @nikolayvalev/design-system-mcp build`) and a smoke
  of `list_themes`/`get_theme`.
- Grep guard: no `publicProfile|dashboardProfile|experimentalProfile|createTheme|
  applyTheme|createTailwindPreset|@nikolayvalev/design-tokens|ProfileVision`
  outside `docs/superpowers/*` history.

---

## Phase 2 — Light/dark per theme

### 1. Color model (`vde-core/types.ts`)
- `VisionTheme.colors: { light: VisionColors; dark: VisionColors }`.
- Add `defaultMode: 'light' | 'dark'` to `VisionTheme` (its native mode).
- Add `export type ThemeMode = 'light' | 'dark';`. `VisionColors` shape unchanged.

### 2. CSS resolution (`vde-core/css.ts`)
- `visionToCSSVariables(vision, mode: ThemeMode)` selects `colors[mode]` for both
  the `--vde-color-*` set and the shadcn aliases. Pillar/atmospheric vars are
  mode-independent (unchanged).
- `applyVisionToElement(el, vision, mode)` writes vars for `mode` and sets
  `data-vde-mode` (alongside existing `data-vde-vision` / `data-vde-archetype`).

### 3. Provider + context (`vde-core/context.tsx`, `types.ts`)
- `VisionProvider` gains `mode?`, `defaultMode?`, `onModeChange?`. Initial mode =
  `mode` prop → `defaultMode` prop → active vision's `defaultMode` →
  `prefers-color-scheme` (guarded for SSR). Re-applies vars on vision *or* mode
  change.
- `VisionContextValue` gains `mode: ThemeMode` and `setMode(mode)` /
  `toggleMode()`. `useVision()` exposes them. Components need **no** change.

### 4. Authoring the palettes (12 theme files)
- Each theme's existing palette becomes `colors.light` or `colors.dark`
  according to its native look; set `defaultMode` to match. Hand-author the
  opposite palette per theme, preserving accent identity and WCAG-reasonable
  contrast. Native modes (proposed): light = editorial, museum,
  swiss_international, zen, clay_soft, solarpunk, y2k_chrome; dark = terminal,
  brutalist, immersive, synthwave, noir.

### 5. build-css (Phase 2 extension)
- Each `<visionId>.css` emits `:root` for `defaultMode` plus a
  `[data-vde-mode="dark"]` (and, when defaultMode is dark, a
  `[data-vde-mode="light"]`) block. Also emit a `.dark` alias block mapping to
  the dark mode for shadcn compatibility.

### 6. Storybook
- Add a `mode` toolbar global (light/dark) and apply it in the preview decorator
  via `applyVisionToElement(root, vision, mode)`.
- `Themes/Gallery` and `Themes/Explorer` render light + dark side by side
  (read from `colors.light` / `colors.dark`).
- Visual tests: keep per-story baselines at the default mode; add **one**
  `Themes/Modes` story that shows the matrix, rather than doubling every
  baseline. Regenerate baselines.

### Phase 2 verification
- Build/typecheck/lint green; `visionToCSSVariables(v,'dark')` and `'light'` both
  return complete var sets for all 12 (extend `verify-expanded-visions.mjs` to
  assert both modes resolve).
- New integration assertion: toggling `data-vde-mode` swaps `--vde-color-*` and
  `--background`/`--primary` live (extend `vision-switch.spec.ts`).
- `pnpm test:design` with regenerated baselines; manual Storybook check of the
  mode toggle across a few visions.

---

## Risks & mitigations
- **External `design-tokens` consumers break.** Mitigation: major bump +
  changeset migration note; apps in this repo are unaffected.
- **CLI surface change** (profiles → visions) may break scripted `init` calls.
  Mitigation: documented in the changeset; `--list-visions` + clear errors on
  removed flags.
- **Palette authoring volume** (12 new palettes). Mitigation: Phase 2 is separate
  from Phase 1; can land themes incrementally behind the model once it exists.
- **Atmospherics not mode-aware** may look off for a theme in its non-native
  mode. Accepted for v1; flagged as follow-up.

## Sequencing
Phase 1 ships first (clean single model, no profiles). Phase 2 builds on it. Each
phase ends green and is independently reviewable; a single major release can
carry both, or Phase 1 can release first.
