# DESIGN_SYSTEM.md

> **Source of Truth: Design System Governance**

This file defines the authoritative rules for using, extending, and contributing to the design system in this monorepo. **All contributors and AI agents must comply.**

## 1. Component Usage

- **Install the design system package:** `@nikolayvalev/design-system`. Import the vision's tokens (`styles/<visionId>.css`) **and** its faces (`styles/fonts/<visionId>.css`), then wrap the app in `VisionProvider`.
- **Install UI components as source files (shadcn-style) via MCP `get_component_bundle`**, then commit those files in the consuming repo.
- **Do NOT treat design-system components as runtime package dependencies for new app work.** Source-installed components are the default model.
- **Do NOT create local CSS/Sass outside token-driven patterns** if a system token or provided component source already covers the use case.

## 2. Contribution Workflow

- Before submitting a PR that adds or modifies UI, you **must**:
  1. Review the [CONTRIBUTING.md](CONTRIBUTING.md) and this file.
  2. Use the "Contribution Guide" tool (or section below) to check for existing patterns and requirements.
  3. Justify any new component or style in the PR description.

## 3. Prohibited Patterns

- **Inline styles** (e.g., `style={{ ... }}` in React) are forbidden except for dynamic layout edge cases (must be justified in PR).
- **Local component definitions** that duplicate or fork core design system components are not allowed.
- **Local CSS/Sass files** are forbidden unless explicitly approved in this file.

## 4. Extension & Customization

- Extend source-installed components locally inside your app/repo (while preserving token semantics).
- For new tokens or themes, propose them as vision themes in `src/vde-themes` of the `@nikolayvalev/design-system` package.
- When adding or changing component source templates, update MCP install-bundle behavior and docs in `packages/mcp-server`.

## 5. Enforcement

These are not review conventions. Each one fails a build:

| Check                                              | What it catches                                                                                                                                                                            |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `design-system/no-raw-design-values`               | Raw hex, raw `rgba()`, off-scale sizes, `text-xs` (12px, below the interactive floor)                                                                                                      |
| `design-system/no-inline-styles`                   | `style={{ ... }}` outside the narrow, justified exemptions                                                                                                                                 |
| `design-system/no-local-component`, `no-local-css` | Forking a core component, or a local stylesheet where a token exists                                                                                                                       |
| `pnpm validate`                                    | WCAG AA contrast on seven pairs across all 13 visions in both modes, body line-height, crushed tracking, the radius scale, border-plus-shadow redundancy, overshoot on the standard easing |
| `pnpm test:stories`                                | axe, per story                                                                                                                                                                             |
| `pnpm validate:mcp-bundles`                        | An install bundle that references a file the deploy does not ship                                                                                                                          |
| `pnpm test:visual`                                 | Unintended visual change                                                                                                                                                                   |

The `[prop:var(--vde-*)]` Tailwind arbitrary-property bridge is the library's own
idiom and is explicitly allowed. A raw value is not.

Two things are advisory rather than blocking, deliberately: the impeccable
detector (it reports one documented divergence and colour notes inherent to a
13-vision catalog) and `pnpm format:check` (the repo predates it).

---

## Contribution Guide (AI & Human)

- **Always check if a component or style exists in the design system before creating new UI.**
- If in doubt, ask for a review or open a discussion.
- Use only the shared tokens and visions. There is no Tailwind preset — `createTailwindPreset` was removed in v2; the `@theme inline` bridge in the vision CSS is what maps tokens to utilities.
- All new UI patterns must be documented in the design system package.

---

**This file is machine-readable and must be referenced by all AI agents and code generation tools.**
