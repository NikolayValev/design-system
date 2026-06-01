# Design: Docs Portal + Storybook Cleanup

**Date:** 2026-05-31  
**Status:** Approved — ready for implementation planning  
**Scope:** Two commits. Commit 1: docs portal redesign. Commit 2: storybook cleanup (visual theme demos are a third, separate commit).

---

## What We're Building

An engineer who lands on `https://designsystem.nikolayvalev.com/` should immediately understand what the system is, how it's structured, and how to use it — including the MCP server. The storybook should be a clean, well-organized companion they can navigate without confusion.

---

## Commit 1 — Docs Portal (`packages/mcp-server/api/`)

### Approach

Approach 2 was selected: **layout + targeted content fill**. Convert the horizontal pill nav to a left sidebar and rewrite the key pages (home, engineers, docs). Keep recruiters and catalog content unchanged, just restyled.

### Layout (`_lib/site.ts`)

Replace the `.topbar` horizontal pill nav with a left sidebar. Sidebar structure:

```
[NV/DS]           ← logo, links to /
──────────────────
Navigate
  Home            → /
  Engineers       → /engineers
  Recruiters      → /recruiters
  Catalog         → /catalog
  Docs            → /docs
──────────────────
Tools
  Storybook ↗     → /storybook  (external target)
  /mcp            → /mcp        (machine endpoint label)
```

- Active page highlighted with left border accent (`--brand` color) + white text
- Main content area: `display: flex`, sidebar ~200px fixed, main fills remaining width
- Mobile (< 768px): sidebar collapses to a horizontal top bar, same links, smaller font
- CSS variables, color palette, `.panel`, `.card`, `.grid`, `.pill` — all unchanged
- `renderSitePage()` signature stays the same; only `renderNav()` and the wrapping shell HTML change

### Page: `/` (Home — `api/index.ts`)

**Purpose:** Entry point for all audiences.

**Content:**
- Hero: system name + one-paragraph description covering OKLCH tokens, 20 VDE themes, MCP-native tooling
- 4 action cards: Engineers, Recruiters, Storybook, Catalog
- Machine endpoints strip: MCP URL, healthz, JSON metadata (`/?format=json`)

No structural change from today — just better copy and the new sidebar layout.

### Page: `/engineers` (`api/engineers.ts`)

**Purpose:** Full quickstart for an engineer integrating the system.

**Content — ordered workflow:**

1. **Install tokens**
   ```bash
   npm install @nikolayvalev/design-tokens
   ```

2. **Pick a CSS profile and import it** (one per app)
   ```ts
   import '@nikolayvalev/design-tokens/styles/public.css';    // marketing sites
   import '@nikolayvalev/design-tokens/styles/dashboard.css'; // internal tools
   import '@nikolayvalev/design-tokens/styles/experimental.css'; // prototypes
   ```

3. **Configure Tailwind preset**
   ```ts
   import { createTailwindPreset, publicProfile } from '@nikolayvalev/design-tokens/tailwind';
   export default { presets: [createTailwindPreset(publicProfile)] };
   ```

4. **Wire MCP to your AI client** (config snippet)
   ```json
   { "mcpServers": { "design-system": { "url": "https://designsystem.nikolayvalev.com/mcp" } } }
   ```
   Works with Claude Desktop, Cursor, Windsurf.

5. **Install components via MCP**
   - AI agent calls `get_component_bundle(["Button", "Card"])` → returns source files
   - Write them under `src/design-system/` and commit

6. **Optional CLI scaffold**
   ```bash
   npx @nikolayvalev/design-system@latest init
   ```
   Scaffolds folder structure, MCP config, and `design-system.config.json`.

### Page: `/docs` (`api/docs.ts`)

**Purpose:** Architecture decisions — the "why" behind the system.

**Content — four sections:**

1. **Why OKLCH**
   - Perceptual uniformity: equal lightness steps look equal to the human eye (HSL doesn't guarantee this)
   - Gamut independence: same token values work across sRGB and P3 wide-gamut displays
   - Safe interpolation: color mixing and gradients don't pass through muddy grey zones

2. **Token System**
   - Three-layer model: `base.ts` (raw values) → `profiles.ts` (semantic mapping per context) → Tailwind preset (utility classes) + CSS variables (runtime)
   - Three profiles: `public` (light + dark, vibrant), `dashboard` (dark only, compact), `experimental` (pure black, high contrast, zero radius)
   - Import path: `@nikolayvalev/design-tokens` for runtime; `/tailwind` and `/tokens` entrypoints for build-time

3. **VDE Themes (Visual Design Engine)**
   - Themes define visual identity on top of the token system — typography personality, motion physics, ornamental elements
   - 20 built-in themes: aurora, brutalist, clay_soft, deconstruct, editorial, immersive, ma_minimalism, museum, noir, parchment, raw_data, solarpunk, swiss_international, synthwave, terminal, the_archive, the_ether, y2k_chrome, zen, zine_collage
   - Applied via `VisionProvider theme="museum"` — all child components read from it via `useVision`
   - Profiles and VDE themes are orthogonal: profiles set the token values, themes set the aesthetic

4. **MCP-Native Tooling**
   - The hosted MCP server exposes tools: `get_component_bundle`, `list_components`, `get_token_theme`, `list_themes`, and more
   - AI agents (Claude, Cursor, Windsurf) call these tools to browse and install components without leaving the IDE
   - Hosted at `https://designsystem.nikolayvalev.com/mcp` (streamable HTTP transport)
   - Local/stdio: `DESIGN_SYSTEM_SRC_DIR=/path/to/src npx @nikolayvalev/design-system-mcp --transport stdio`

### Pages: `/recruiters`, `/catalog`

Content unchanged. Only layout change: rendered inside new sidebar shell.

---

## Commit 2 — Storybook Cleanup (`apps/storybook/`)

### Approach

**Organize and document.** No stories removed. Better titles, descriptions, consistent grouping, and a real Overview story that orients a new engineer.

### Story Groups

```
Introduction
  └── Overview          ← rewritten as proper orientation page

Primitives
  ├── Button
  ├── Input
  ├── Card
  ├── Layout
  ├── EditorialHeader
  ├── NavigationOrb
  ├── MediaFrame
  ├── GalleryStage
  └── AtmosphereProvider

Sections
  ├── HeroSection
  ├── FeatureGridSection
  └── MetricStripSection

Pages
  ├── MarketingLandingPage
  └── ProductShowcasePage

VDE / Visual Design Engine
  └── VisionaryExplorer
```

### Overview Story Rewrite

The Overview story becomes the first thing an engineer sees. Content:

1. **What this is** — one paragraph on the system
2. **Navigation guide** — what each group in the sidebar contains
3. **Token contract** — explain that all components read from CSS variables, no hardcoded colors
4. **VDE theme switcher** — the toolbar at the top switches all components simultaneously; show how to use it
5. **How to install a component** — brief note on `get_component_bundle` via MCP

### Per-Story Improvements

- Each story file gets a `parameters.docs.description` (one sentence) explaining what the component does and when to use it
- Story names use Title Case consistently
- Variants named clearly: `Default`, `Disabled`, `WithLabel` — no `story1`, `Primary2`, etc.
- The toolbar theme switcher is labeled in the preview config (currently defaults to "museum" — this stays)

---

## Commit 3 (Separate, Not Planned Today)

Visual demos of all 20 VDE themes — a `ThemeShowcase.stories.tsx` that renders a representative component set under each theme for side-by-side comparison. Deferred.

---

## Files Affected

**Commit 1 (docs portal):**
- `packages/mcp-server/api/_lib/site.ts` — sidebar layout
- `packages/mcp-server/api/index.ts` — home page copy
- `packages/mcp-server/api/engineers.ts` — full content rewrite
- `packages/mcp-server/api/docs.ts` — full content rewrite (architecture decisions)
- `packages/mcp-server/api/recruiters.ts` — layout only (no content change)
- `packages/mcp-server/api/catalog.ts` — layout only (no content change)

**Commit 2 (storybook):**
- `apps/storybook/src/Overview.stories.tsx` — rewrite
- `apps/storybook/src/*.stories.tsx` — add descriptions, fix naming
- `apps/storybook/.storybook/preview.tsx` — verify group sort order matches new structure

---

## Success Criteria

- An engineer who has never seen the repo lands on `designsystem.nikolayvalev.com` and within 2 minutes knows: what the system is, how to install it, how to connect their AI client, and where to see it live
- The storybook sidebar shows clear groups; the Overview story is the first thing they read and it orients them
- All existing nav links work; no broken routes
