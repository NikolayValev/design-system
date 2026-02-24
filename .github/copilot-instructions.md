# Copilot Instructions for AI Coding Agents

## Project Overview
- **Monorepo** for a configurable design system and related apps (see `apps/`, `packages/`, `infra/`).
- **Design System** (`packages/design-system`): Token-driven, themeable UI primitives for Vercel/Next.js projects.
- **Apps**: Example and production apps consume the design system via stable public APIs.
- **Infra**: Terraform for platform setup (see `infra/terraform`).

## Key Architectural Patterns
- **Design tokens** (OKLCH color, spacing, etc.) are the contract for all theming and component styling.
- **Theme profiles** (public, dashboard, experimental) define visual baselines; override via `createTheme()`.
- **Intent-based styles**: Use `getDesignStyle`/`getDesignStyleByIntent` for semantic, goal-driven classnames.
- **Tailwind v4**: All styling is via semantic Tailwind classes and custom presets (see `tailwind/`).
- **No deep imports**: Only import from documented entrypoints (see below).

## Developer Workflows
- **Install**: Use `pnpm install` at the repo root.
- **Build**: Use `pnpm build` (runs builds for all packages/apps via Turborepo).
- **Test**: Use `pnpm test` (runs all tests), or test individual packages/apps with `pnpm --filter <name> test`.
- **Storybook**: Run `pnpm --filter storybook dev` for component workbench.
- **Lint/Format**: Use `pnpm lint` and `pnpm format`.
- **Infra**: See `infra/terraform/README.md` for IaC workflows.

## Import/Usage Conventions
- **Stable entrypoints only**:
  - `@nikolayvalev/design-system` (components, theme utils)
  - `@nikolayvalev/design-system/tokens` (profiles, types)
  - `@nikolayvalev/design-system/tailwind` (preset factory)
  - `@nikolayvalev/design-system/styles/<profile>.css` (one per app)
- **Never import from**: `dist/*`, `src/*`, or undocumented deep paths.
- **One CSS profile per app** (avoid conflicts).
- **Override tokens** via `createTheme()` for per-app customization.

## Cross-Package Integration
- **Apps** consume design system via public API only.
- **No direct dependency on internal files** of other packages.
- **Shared config** (eslint, tailwind, tsconfig) lives in `packages/config`.

## References
- [README.md](../README.md) — full usage, architecture, and conventions
- [USAGE.md](../packages/design-system/USAGE.md) — component and theme usage
- [CONTRIBUTING.md](../CONTRIBUTING.md) — contribution and versioning rules
- [MIGRATION.md](../packages/design-system/MIGRATION.md) — upgrade guides
- [PLATFORM_PIPELINE.md](../docs/PLATFORM_PIPELINE.md) — CI/CD and deployment
- [infra/terraform/README.md](../infra/terraform/README.md) — infrastructure workflows

## Examples
- **Add a new theme profile**: Extend `profiles.ts` and update `createTailwindPreset`.
- **Create a custom button**: Compose from `Button` and override tokens via `createTheme()`.
- **Add a new app**: Scaffold in `apps/`, use documented imports only, configure Tailwind with a single profile.

---
For unclear or missing conventions, consult the referenced docs or ask for clarification.
