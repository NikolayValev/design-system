# Migrating to v3

v3 is a major because almost everything in it is a visual change, and `CONTRIBUTING.md` treats
any visual change as breaking. Most of the work is in the tokens rather than in the API, so the
code changes below are small — the render changes are not.

## Why

The system had no documented type scale, no spacing scale, and loaded no fonts at all: all 12
visions named ~19 families and every one of them silently fell back to a system stack. There
was no contrast check, no accessibility assertion, and no lint against raw values, while
`DESIGN_SYSTEM.md` claimed CI enforced exactly those things. v3 closes that gap and adds a
floor that holds in every vision.

## Required changes

### 1. Import the font file for your vision

```diff
  import '@nikolayvalev/design-system/styles/editorial.css';
+ import '@nikolayvalev/design-system/styles/fonts/editorial.css';
```

Without it nothing breaks — you get the same system-stack fallback you were already getting.
With it, the vision renders as designed. The faces are self-hosted inside the package, so
this adds no external requests and no font dependencies to your project.

### 2. Charts now require a `title`

`role="img"` with no accessible name is announced as an unlabelled graphic.

```diff
- <LineChart data={data} />
+ <LineChart data={data} title="Weekly active users, January to June" />
```

`description` is optional, for a chart whose trend needs spelling out.

### 3. Section eyebrows no longer have defaults

`HeroSection`, `FeatureGridSection`, `MetricStripSection`, `MarketingLandingPage` and
`ProductShowcasePage` shipped placeholder strings — "Launch faster", "Capabilities", "Signal",
"Outcomes", "Template system" — which rendered as a small all-caps label above every heading.
If you were relying on one, pass it explicitly:

```diff
- <FeatureGridSection items={items} />
+ <FeatureGridSection items={items} sectionEyebrow="Capabilities" />
```

The eyebrow is also no longer forced to uppercase and renders at the caption step.

### 4. If you authored a custom `VisionTheme`

`boundaryLogic.radius` is now a three-step scale:

```diff
  boundaryLogic: {
    borderWeight: '1px',
-   radius: '0.75rem',
+   radius: {
+     surface: '0.75rem',   // cards, panels, wells — never a pill
+     control: '0.5rem',    // buttons, inputs, checkboxes
+     pill: '9999px',       // chips, badges, status dots
+   },
    sharpness: '0.4',
  },
```

`ThemeSchema.json` rejects the old shape. `--vde-boundary-radius` is kept as an alias for
`--vde-radius-surface`, so existing CSS that reads it still works.

Your theme must also clear the floors, which `pnpm validate` checks:

- `lineHeight.normal` at or above 1.5
- `letterSpacing.normal` not meaningfully negative
- `easing.standard` must not overshoot (a cubic-bezier control point above 1) — it drives every
  Button, Card and Input transition. Overshoot belongs on `easing.emphatic`.
- Seven foreground/background pairs at WCAG AA in both modes
- Either a border or a wide ambient shadow, not both

## What changes visually without any code change

- **Type.** A real seven-step scale (`--vde-font-size-caption` through `-display`), resolved from
  your theme's multipliers and clamped: interactive text never resolves below 14px, body below 16px.
- **Space.** An 8-point scale (`--vde-space-2xs` through `-3xl`), identical in every vision.
- **Measure.** Prose slots cap at `--vde-measure` (68ch). Card bodies were previously unbounded.
- **Radius.** `clay_soft` was a pill on every element, so its cards were capsules; it keeps the
  full pill on controls and takes 1.25rem on surfaces. `solarpunk` moved from a flat 40px the
  same way.
- **Line height.** Raised to 1.5 in the eight visions that were below it. UI text has its own
  value, so a wrapping button label no longer inherits 1.05.
- **Colour.** 17 button-fill contrast failures fixed by darkening the fill, which keeps the
  light-knockout intent. The largest move is about 0.12 lightness.
- **Depth.** Each vision commits to one edge device. `immersive` and `synthwave` drop the
  hairline and keep the wide shadow; the rest keep the hairline and tighten the shadow to a seam.
- **Motion.** `clay_soft`'s overshoot moved off `standard` onto `emphatic`; its infinite card
  bob is gone; the nav orb settles instead of bouncing. Everything ambient stops under
  `prefers-reduced-motion`.
- **Defaults.** The purple-to-cyan `rgba` literals hardcoded as fallbacks inside
  `AtmosphereProvider`, `GalleryStage`, `MediaFrame` and `EditorialHeader` are gone. They fired
  in every vision regardless of palette.
- **FeatureTile.** The icon sits inline with its heading rather than in a bordered tile above it.
- **Badge.** 12px to 14px, and it takes the pill radius step.

## New: `quiet_workshop`

A thirteenth vision — warm unbleached neutrals, a single fired-clay accent, flat with a 1px
seam, Playfair Display against Inter. It is the identity `PersonalRouter` had been carrying as
a local override block because v1 shipped no dark palette.

## Deprecated

`src/intent/` (`getDesignStyle`, `getDesignStyleByIntent`, `designVariants`) still works and is
frozen. It is a parallel token system built from ~55 raw hex literals with no focus styles, and
`ARCHITECTURE.md` lists exactly that as an anti-pattern. It is excluded from the token lint and
the design detector, and will be removed in v4. Use the vision themes.

## Verifying your upgrade

```bash
pnpm validate     # exports + the design floors across every vision
pnpm test:design  # stories (with axe), vision contract, visual snapshots
```

Then open the app in both modes and confirm in DevTools that the computed `font-family` resolves
to the family your vision names rather than to a fallback. That is the clearest single check
that step 1 worked.
