# Contribution Guide: Design System

This guide must be referenced by all contributors and AI agents before submitting a PR that affects UI or styles.

## 1. Always Use the Core Design System
- Install tokens from `@nikolayvalev/design-tokens`.
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
- Propose new tokens/themes in `@nikolayvalev/design-tokens`.
- If component source structure changes, update MCP bundle resolution logic and docs.

## 5. Enforcement
- Custom ESLint rules and CI checks will block PRs that violate these rules.
- Violations must be fixed before merging.

---

**This guide is machine-readable and must be referenced by all AI agents and code generation tools.**
