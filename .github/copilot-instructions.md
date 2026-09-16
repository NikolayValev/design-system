# Copilot Instructions for AI Coding Agents

## Project Overview

- **Monorepo** for a design system and its surfaces (see `apps/`, `packages/`, `infra/`).
- **Design system** (`packages/design-system`): token-driven, themeable UI primitives published as `@nikolayvalev/design-system`.
- **Portal + MCP** (`packages/mcp-server`): serves `designsystem.nikolayvalev.com` and the hosted MCP endpoint agents install components through.
- **Storybook** (`apps/storybook`): the component workbench and the home of the visual and accessibility tests.
- **Infra**: Terraform (see `infra/terraform`).

Start with `PRODUCT.md` (who this is for and what it owes them) and `DESIGN.md` (the token contract and the floors). Those two files are normative; this one is a map.

## Architecture

There are exactly two layers and it matters which one you are in.

- **`src/vde-core/`** owns the contract: `types.ts` (the `VisionTheme` shape), `ThemeSchema.json` (validated, `additionalProperties: false`), and `css.ts` (the single function that turns a theme object into ~120 CSS custom properties). Change the contract here and every theme must follow.
- **`src/vde-themes/`** owns the values: 13 `*.theme.ts` files, each with a hand-tuned light **and** dark palette.

Everything downstream reads `--vde-*` custom properties. Components must not branch on the active vision — `Button.tsx` states the rule and the rest of the library follows it. If a component needs to look different in one theme, that difference is a token.

### The token namespaces

- `--vde-color-*` — 20 semantic colours, mode-aware.
- `--vde-font-size-*` — the type scale. Themes apply a multiplier to a core scale; the emitter clamps the result, so no theme can push interactive text below 14px or body copy below 16px.
- `--vde-space-*` — an 8-point scale. Structural, identical in every vision, so it lives in `global.css` rather than in the theme contract.
- `--vde-radius-surface` / `-control` / `-pill` — three steps, because one radius for everything is how cards end up shaped like capsules.
- `--vde-line-height-*`, `--vde-letter-spacing-*`, `--vde-shadow-*`, `--vde-motion-*`, `--vde-measure`.
- A shadcn-compatible alias layer (`--background`, `--primary`, `--radius`, …) is emitted from the same source.

### The idiom

`[border-radius:var(--vde-radius-surface)]` — a Tailwind arbitrary _property_ whose value is a token. This is correct and the lint allows it. A raw hex, a raw `rgba()`, `text-[13px]` or `rounded-[18px]` is not, and `design-system/no-raw-design-values` will fail the build.

## Workflows

| Task                     | Command                                              |
| ------------------------ | ---------------------------------------------------- |
| Install                  | `pnpm install` (repo root)                           |
| Build / lint / typecheck | `pnpm build` \| `pnpm lint` \| `pnpm typecheck`      |
| Unit tests               | `pnpm --filter @nikolayvalev/design-system test`     |
| Token + floor validation | `pnpm --filter @nikolayvalev/design-system validate` |
| Design tests (all three) | `pnpm test:design`                                   |
| Storybook                | `pnpm storybook`                                     |
| Format                   | `pnpm format` \| `pnpm format:check`                 |

There is no root `pnpm test`.

## Imports

- `@nikolayvalev/design-system` — components, themes, `VisionProvider`.
- `@nikolayvalev/design-system/styles/<visionId>.css` — one per app. Sets every token for that vision in both modes.
- `@nikolayvalev/design-system/styles/fonts/<visionId>.css` — the self-hosted faces that vision needs.

Never import from `dist/*`, `src/*`, or undocumented deep paths. Never write a local override block re-declaring `--vde-*` in a consuming app — that is the drift this system exists to prevent, and it is what `PersonalRouter` had to do before v3 shipped dark palettes.

`src/intent/` (`getDesignStyle` / `getDesignStyleByIntent`) is **deprecated** as of v3 and frozen. It is a parallel token system built from raw hex with no focus styles. Do not extend it or copy from it.

## The floors

These hold in every vision without exception, and they are enforced, not suggested:

- WCAG AA contrast, checked per palette in both modes by `pnpm validate`.
- Body line-height ≥ 1.5.
- Interactive text ≥ 14px.
- A visible `focus-visible` ring on every control.
- `prefers-reduced-motion` honoured — no vision may express itself through motion a user cannot stop.
- Accessible names on graphics; charts require a `title`.

Storybook asserts the accessibility rules through axe in `.storybook/test-runner.ts`.

## Versioning

`CONTRIBUTING.md` governs: **any visual change to an existing component is breaking.** Token values, markup, CSS output, vision adjustments and dark-mode behaviour all count. Use a changeset.

## References

- [PRODUCT.md](../PRODUCT.md) — audience, purpose, accessibility contract
- [DESIGN.md](../DESIGN.md) — the token contract and the invariants
- [ARCHITECTURE.md](../ARCHITECTURE.md) — token system and component principles
- [CONTRIBUTING.md](../CONTRIBUTING.md) — versioning rules
- [USAGE.md](../packages/design-system/USAGE.md) — consumer usage
- [MIGRATION.md](../packages/design-system/MIGRATION.md) — upgrade guides
- [PLATFORM_PIPELINE.md](../docs/PLATFORM_PIPELINE.md) — CI/CD and deployment
