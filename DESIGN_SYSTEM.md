# DESIGN_SYSTEM.md

> **Source of Truth: Design System Governance**

This file defines the authoritative rules for using, extending, and contributing to the design system in this monorepo. **All contributors and AI agents must comply.**

## 1. Component Usage
- **Install design tokens as a package dependency:** `@nikolayvalev/design-tokens`.
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
- For new tokens or themes, propose them in `@nikolayvalev/design-tokens`.
- When adding or changing component source templates, update MCP install-bundle behavior and docs in `packages/mcp-server`.

## 5. Enforcement
- Custom ESLint rules and CI checks will block PRs that violate these rules.
- Violations must be fixed before merging.

---

## Contribution Guide (AI & Human)

- **Always check if a component or style exists in the design system before creating new UI.**
- If in doubt, ask for a review or open a discussion.
- Use only the shared tokens, themes, and Tailwind preset from the design system.
- All new UI patterns must be documented in the design system package.

---

**This file is machine-readable and must be referenced by all AI agents and code generation tools.**
