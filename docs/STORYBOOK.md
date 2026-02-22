# Storybook

Use Storybook as the component workbench for the design system.

## Start locally

```bash
pnpm storybook
```

Default URL: `http://localhost:6006`

## Build static docs

```bash
pnpm storybook:build
```

Build output: `apps/storybook/dist/storybook`

## Test loop (iterable)

Use these commands for repeatable validation:

```bash
# Smoke/interaction run against every story
pnpm --filter @apps/storybook test:stories:ci

# Vision-state behavior contract checks (archetype switching)
pnpm --filter @apps/storybook test:vision

# Visual regression check against committed baselines
pnpm --filter @apps/storybook test:visual

# Refresh visual baselines intentionally after approved design changes
pnpm --filter @apps/storybook test:visual:update
```

Visual snapshots live under `apps/storybook/tests/visual/*-snapshots`.

Story-level controls:
- Set `parameters.forcedVision` to pin a story to a specific vision.
- Add `tags: ['skip-visual']` to skip a story from visual regression (use sparingly).

Automation hooks:
- Atmospheric components expose `data-vde-component="..."` attributes for non-visual assertions.
- `apps/storybook/tests/visual/vision-switch.spec.ts` validates museum/brutalist/immersive behavior for all hero components.
- `packages/design-system/scripts/verify-expanded-visions.mjs` validates expanded registry IDs, token mappings, and Atmosphere variable generation.

Expanded Vision IDs:
- `swiss_international`
- `raw_data`
- `the_archive`
- `the_ether`
- `solarpunk`
- `y2k_chrome`
- `deconstruct`
- `ma_minimalism`
- `clay_soft`
- `zine_collage`

## What it covers

- `Button`
- `Card`
- `Input`
- `Layout`
- `EditorialHeader`
- `GalleryStage`
- `MediaFrame`
- `AtmosphereProvider`
- `NavigationOrb`
- `Visionary Explorer`

Add stories in `apps/storybook/src/*.stories.tsx` as the component library grows.
