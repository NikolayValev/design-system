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

# Visual regression check against committed baselines
pnpm --filter @apps/storybook test:visual

# Refresh visual baselines intentionally after approved design changes
pnpm --filter @apps/storybook test:visual:update
```

Visual snapshots live under `apps/storybook/tests/visual/*-snapshots`.

Story-level controls:
- Set `parameters.forcedVision` to pin a story to a specific vision.
- Add `tags: ['skip-visual']` to skip a story from visual regression (use sparingly).

## What it covers

- `Button`
- `Card`
- `Input`
- `Layout`
- `Visionary Explorer`

Add stories in `apps/storybook/src/*.stories.tsx` as the component library grows.
