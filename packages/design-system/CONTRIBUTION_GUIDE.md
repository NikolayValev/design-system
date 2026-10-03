# Contribution Guide: Design System

This guide must be referenced by all contributors and AI agents before submitting a PR that affects UI or styles.

Two files in the repo root are normative and worth reading first: **PRODUCT.md**
(who this serves and the accessibility obligations it carries) and **DESIGN.md**
(the token contract, the named rules, and the floors that hold in every vision).

## 1. Always Use the Core Design System

- Install the design system: `@nikolayvalev/design-system` (vision themes + components). Wrap the app in `VisionProvider` and import **two** files per vision — the tokens
  (`@nikolayvalev/design-system/styles/<visionId>.css`, which sets both light and dark) and the self-hosted faces (`@nikolayvalev/design-system/styles/fonts/<visionId>.css`).
  Skipping the second one is why a vision renders in a system fallback instead of the face it names.
- **Never re-declare `--vde-*` in a consuming app.** A local override block is the drift this system exists to prevent; change the vision upstream and republish.
- Install UI components as source code via MCP `get_component_bundle` (shadcn-style), then commit the files in the target repo.
- Do not create local CSS/Sass files if a tokenized component pattern already exists.

## 2. Propose Before You Build

- If a component or style does not exist, propose it in the design system package first.
- Document new patterns in this package.

## 3. Forbidden Patterns

- Inline styles (`style={{ ... }}`) are not allowed except for rare, justified cases.
- Local component definitions that duplicate core components are forbidden.
- Local CSS/Sass files are forbidden unless explicitly approved.

## 4. Extension

- Extend source-installed components directly in the consuming repo while preserving token semantics.
- Propose new visions (`VisionTheme`s) in `src/vde-themes` of the design system package.
- If component source structure changes, update MCP bundle resolution logic and docs.

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

**This guide is machine-readable and must be referenced by all AI agents and code generation tools.**
