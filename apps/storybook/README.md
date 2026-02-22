# Storybook Workspace

This app documents and previews components from `@nikolayvalev/design-system`.

## Run

```bash
pnpm --filter @apps/storybook dev
```

## Build Static Storybook

```bash
pnpm --filter @apps/storybook build
```

Output is generated in `apps/storybook/dist/storybook`.

## Validation Commands

```bash
# Storybook interaction/smoke checks
pnpm --filter @apps/storybook test:stories:ci

# Vision propagation + registry behavior checks
pnpm --filter @apps/storybook test:vision

# Visual regression snapshots
pnpm --filter @apps/storybook test:visual
```
