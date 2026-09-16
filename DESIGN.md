---
name: Visionary Design Engine
description: A neutral core that carries a floor, and 13 named visions that carry the identity.
colors:
  background: "oklch(0.992 0.004 75)"
  foreground: "oklch(0.21 0.012 55)"
  surface: "oklch(1 0.003 75)"
  surface-foreground: "oklch(0.21 0.012 55)"
  accent: "oklch(0.565 0.14 40)"
  accent-foreground: "oklch(0.985 0.01 75)"
  secondary: "oklch(0.96 0.01 70)"
  secondary-foreground: "oklch(0.27 0.012 55)"
  muted: "oklch(0.96 0.008 70)"
  muted-foreground: "oklch(0.52 0.018 55)"
  border: "oklch(0.9 0.011 65)"
  input: "oklch(0.9 0.011 65)"
  ring: "oklch(0.565 0.14 40)"
  danger: "oklch(0.55 0.21 27)"
  danger-foreground: "oklch(0.985 0.01 75)"
typography:
  display:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "3rem"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "2.25rem"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.025em"
  lead:
    fontFamily: "Inter, Helvetica Neue, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.75
    letterSpacing: "0em"
  body:
    fontFamily: "Inter, Helvetica Neue, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "0em"
  ui:
    fontFamily: "Inter, Helvetica Neue, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: "0em"
  caption:
    fontFamily: "IBM Plex Mono, Consolas, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: "0.14em"
rounded:
  control: "0.375rem"
  surface: "0.5rem"
  pill: "9999px"
spacing:
  2xs: "0.25rem"
  xs: "0.5rem"
  sm: "0.75rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
  2xl: "3rem"
  3xl: "4rem"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-foreground}"
    rounded: "{rounded.control}"
    padding: "0 {spacing.md}"
    height: "2.25rem"
    typography: "{typography.ui}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.foreground}"
    rounded: "{rounded.control}"
    padding: "0 {spacing.md}"
    height: "2.25rem"
    typography: "{typography.ui}"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.surface-foreground}"
    rounded: "{rounded.surface}"
    padding: "{spacing.md}"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.control}"
    padding: "0 {spacing.sm}"
    height: "2.5rem"
    typography: "{typography.ui}"
  badge:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-foreground}"
    rounded: "{rounded.pill}"
    padding: "{spacing.2xs} {spacing.xs}"
    typography: "{typography.ui}"
  feature-tile:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.surface-foreground}"
    rounded: "{rounded.surface}"
    padding: "{spacing.lg}"
---

# Design System: Visionary Design Engine

## Overview

This system does not have a look. It has a **contract** and a **floor**, and then it has 13 named visions that each have a look of their own.

That is the whole thesis, and `ARCHITECTURE.md` has stated it from the beginning: _shared vibe, not identical appearance_. Products built on this should feel related without being forced into one house style, and should be able to diverge visually without fighting the system. A vision can be Swiss and square, or neon and floating, or a warm unbleached workshop, and the same `Card` renders correctly in all three without a single per-theme branch inside it.

The corollary is the part that took longest to get right, and it is the reason this file exists. **Because the core carries no identity, it has to carry a floor.** A system that permits any aesthetic still owes every consumer legible type, sufficient contrast, reachable focus, and motion they can turn off. Range is the feature; the floor is what makes range safe rather than reckless.

The frontmatter above is the **core contract** — the default resolution of the scale, shown with the `quiet_workshop` palette because a single-valued schema has to pick one. The prose below documents what holds across _all_ visions. Per-vision values live in the theme files, which are the only source of truth for them.

**Key characteristics:**

- Two layers and no third: `vde-core/` owns the contract and the emitter, `vde-themes/` owns the values.
- Every colour is OKLCH, and every vision ships a hand-tuned light **and** dark palette. Neither mode is derived from the other.
- Components read `--vde-*` variables and nothing else. A component that needs to look different in one vision is a component missing a token.
- The floors are enforced by `pnpm validate` and by axe in the Storybook test runner, not by review.
- Fonts are self-hosted per vision. A vision that names a face and does not load it is not a vision, it is a fallback.

## Colors

Twenty semantic slots per mode. There is no primitive layer and no `blue-500` ramp — a token is named for what it _does_, so that changing how something looks never means touching application code.

### Structure

- **Ground**: `background` / `foreground` — the page.
- **Raised**: `surface` / `surfaceForeground` — cards, popovers, panels. Also aliased to `--card` and `--popover`.
- **Accent**: `accent` / `accentForeground` — the primary action. Also aliased to `--primary`, because in this system they are the same decision.
- **Quiet**: `secondary`, `muted` and their foregrounds — recessed fills and secondary text.
- **Edges**: `border`, `input`, `ring`.
- **Status**: `danger` / `dangerForeground`.
- **Series**: `chart1` through `chart5`.

### Named Rules

**The Measured Pair Rule.** Seven foreground/background pairs are contrast-checked in both modes for every vision by `scripts/validate-design-floors.mjs`, and all seven must clear WCAG AA at 4.5:1. That check found 17 failures the first time it ran, every one of them on a button fill. It is a build step, not a review item.

**The Fill Darkens Rule.** When a light label on a coloured fill fails contrast, darken the fill — do not flip the label to near-black. The light knockout is the design intent; the lightness of the fill is the free variable.

**The Own Palette Rule.** Anything that paints a theme's colours inline — a swatch, a preview card, a gallery tile — must take _all_ of its colours from that same theme. Mixing one theme's surface with the active vision's `muted-foreground` token produces text whose contrast nobody chose. This is not hypothetical; it is what axe caught in the gallery.

**The Flat Colour Rule.** A colour slot holds a colour. `y2k_chrome.surface` holds a gradient, which works visually but makes that slot unmeasurable — the contrast checker has to skip it. It is a documented exception, not a pattern to copy.

## Typography

Seven steps. A theme does **not** author absolute sizes: it supplies `scale.body` and `scale.display` multipliers, and `vde-core/css.ts` resolves them against the core scale and clamps the result.

| Step       | Base      | Tier    | Floor        | For                               |
| ---------- | --------- | ------- | ------------ | --------------------------------- |
| `caption`  | 0.8125rem | body    | 0.75rem      | Non-interactive metadata only     |
| `ui`       | 0.875rem  | body    | **0.875rem** | Buttons, labels, nav, any control |
| `body`     | 1rem      | body    | **1rem**     | Prose                             |
| `lead`     | 1.125rem  | body    | 1rem         | Standfirst, section descriptions  |
| `title`    | 1.5rem    | display | 1.25rem      | Card and section titles           |
| `headline` | 2.25rem   | display | 1.5rem       | Page titles                       |
| `display`  | 3rem      | display | 2rem         | Once per page at most             |

Line heights come in four: `ui` (floored at 1.25), `tight` (display only), `normal` (**floored at 1.5**, body copy), `relaxed` (long prose).

### Named Rules

**The Floor Is Structural Rule.** The 14px interactive minimum and the 16px body minimum are enforced in the emitter, not in a style guide. A theme that sets `scale.body: 0.9` gets smaller captions and _the same_ 14px controls, because `Math.max` decides, not the theme. This is deliberate: a floor a theme can opt out of is a suggestion.

**The Tight Is For Display Rule.** `--vde-line-height-tight` goes as low as 1.05, which is correct for a 48px headline and unreadable on a button label that wraps. UI text uses `--vde-line-height-ui`. `Button` and `Label` used to use `tight` and got 1.05 in three visions.

**The Caption Is Not A Control Rule.** `caption` is the only step allowed below the interactive floor, and only for text nobody has to click. The moment a caption sits inside a link or a button it is `ui`.

**The Measure Rule.** Prose slots cap at `--vde-measure` (68ch). Unbounded paragraphs in a wide container produce 140-character lines; `CardContent`, `FeatureTile` and `SectionShell` all had them.

## Layout

Spacing is an 8-point scale and it is **identical in every vision**, which is why it lives in `global.css` and the emitter rather than in the theme contract. Spacing is structure, not identity — a theme expresses itself through colour, type, shape, depth and motion, and gets no say in whether a card's padding is 16px.

Sections are constrained to `max-w-6xl` by default (`SectionShell`), with `clamp()` gutters. Grids step 1, 2, 3.

### Named Rules

**The Structure Is Not Identity Rule.** If a proposed token would let one vision lay things out differently from another, it probably belongs in the consuming application, not here. `ARCHITECTURE.md` says it as a component principle — _no layout opinions_ — and the spacing scale is where that principle is enforced.

## Elevation & Depth

Three shadow tokens: `--vde-shadow-hard` (offset, no blur), `--vde-shadow-neon` (glow), `--vde-shadow-ambient` (the resting shadow).

### Named Rules

**The One Device Rule.** A hairline border and a wide drop shadow both drawing the same edge is redundant, and every surface component in this library used to apply both unconditionally. Each vision now commits to one:

- **Float** — the shadow defines the edge, so `borderWeight` is `0px`. Used by `immersive` and `synthwave`, where depth is the thesis.
- **Seam** — the hairline defines the edge, so the ambient shadow is tightened to a true seam (6px blur or less). Used by the other eleven.

`swiss_international` picks neither and has no shadow at all, which is also a commitment. The validator fails any vision that has both a border and an ambient blur above 12px.

**The Inset Is Not An Edge Rule.** `clay_soft`'s inset light-and-shade pair is a surface treatment, not an edge definition, and is exempt from the rule above. Only outer shadow layers count.

## Shapes

Three radius steps, because one radius for everything is how a card ends up shaped like a capsule:

- `--vde-radius-surface` — cards, panels, wells, image frames. **Never a pill.**
- `--vde-radius-control` — buttons, inputs, selects, checkboxes.
- `--vde-radius-pill` — chips, badges, status dots.

### Named Rules

**The Content Needs Corners Rule.** `clay_soft` was `9999px` on every element, so its cards were capsules and text had nowhere to sit. It now keeps the full pill on _controls_ — which is where that character actually reads — and takes `1.25rem` on surfaces. `solarpunk` made the same move from a flat `40px`. The validator rejects a pill in the `surface` slot.

**The Square Is A Choice Rule.** `swiss_international` sets all three steps to `0px`, including chips and status dots. A capsule badge in a Swiss grid would be the system overriding the vision, so the pill step is not assumed to be round.

## Components

Every component reads `--vde-*` and branches on nothing. Four of them did branch — `EditorialHeader`, `GalleryStage`, `MediaFrame`, `NavigationOrb` — and each branch came with a hardcoded fallback that fired in visions that had never asked for it. Those are tokens now.

- **Button** — `control` radius, `ui` type and line height, `focus-visible` ring at 2px offset.
- **Card** — `surface` radius, `md` padding, content capped at `--vde-measure`.
- **Badge** — `pill` radius, `ui` type. It was 12px; badges carry status people have to read.
- **SectionShell** — `eyebrow`, then `heading`, then `description`. The eyebrow is **opt-in**: it used to render at 12px uppercase whenever present, and every section and page template supplied a default string, so the library shipped a small all-caps label above every heading.
- **FeatureTile** — the icon sits inline with its heading, not in a bordered tile stacked above it.
- **NavigationOrb** — `focus-visible` on the trigger and every item, `inert` when closed, Escape to close, focus restored to the trigger.
- **Charts** — `title` is a required prop. `role="img"` with no accessible name is a defect, not a variation.

## Do's and Don'ts

### Do

- **Do** express a per-vision difference as a token, and read it unconditionally.
- **Do** use `[prop:var(--vde-*)]` — the Tailwind arbitrary-property bridge is the library's idiom and the lint allows it.
- **Do** take every colour in a themed preview from that preview's own palette.
- **Do** give controls `--vde-font-size-ui` and `--vde-line-height-ui`, never the display steps.
- **Do** cap prose with `--vde-measure`.
- **Do** pick one edge device per vision — hairline or shadow, not both.
- **Do** run `pnpm validate` after touching any theme; it is faster than opening Storybook.
- **Do** hand-tune the dark palette. Neither mode is derived from the other.

### Don't

- **Don't** branch on `activeVision.id` inside a component.
- **Don't** hardcode a fallback inside `var(--vde-x, LITERAL)`. The token already has a base value, and the literal will fire in visions that never asked for it — which is how a purple-to-cyan mesh ended up in all 13.
- **Don't** write a raw hex, a raw `rgba()`, `text-[13px]` or `rounded-[18px]` outside the theme files. The lint will fail the build.
- **Don't** use `text-xs`. It is 12px, below the interactive floor; use `--vde-font-size-ui`, or `--vde-font-size-caption` for metadata nobody clicks.
- **Don't** stack `opacity-*` on muted text to make it quieter. Opacity over an unknown backdrop produces contrast nobody measured — use `--vde-color-muted-foreground`, which has been.
- **Don't** put a pill radius on a surface.
- **Don't** use `transition-all`; it animates layout properties and stutters.
- **Don't** add looping or ambient motion without checking it disappears under `prefers-reduced-motion`.
- **Don't** ship a placeholder string as a component default — "Launch faster" and "Capabilities" were generic marketing claims sitting in the library's own templates.
- **Don't** extend `src/intent/`. It is deprecated, frozen, and is the parallel token system `ARCHITECTURE.md` names as an anti-pattern.
