# Contributing to @nikolayvalev/design-system

Thank you for considering contributing to this design system!

## Versioning Policy

This package follows **strict semantic versioning** with visual-first breaking change detection:

### Major Version (x.0.0)
**ANY visual change to existing components is breaking.** This includes:
- Token value changes (colors, spacing, typography, radii)
- Component markup or class name changes
- CSS output changes that affect rendering
- Profile token adjustments
- Dark mode behavior changes

**Rationale**: Consumer applications lock visual appearance. Any change that affects screenshots or visual regression tests is breaking.

### Minor Version (x.y.0)
Non-breaking additions:
- New components
- New token keys (without changing existing ones)
- New utility functions
- New profiles
- New export paths
- Documentation improvements

### Patch Version (x.y.z)
Pure fixes with zero visual impact:
- TypeScript type fixes
- Build configuration improvements
- Internal refactoring (no public API changes)
- Documentation typo fixes
- Dependency updates (no behavioral changes)

## Changesets Workflow

We use [Changesets](https://github.com/changesets/changesets) for version management:

### Adding a Changeset

When making a PR with changes that affect consumers:

```bash
pnpm changeset
```

Follow the prompts:
1. Select bump type (major/minor/patch) based on policy above
2. Write a clear summary for the changelog
3. Commit the generated `.changeset/*.md` file

### Examples

**Major (breaking)**:
```bash
pnpm changeset
# Select: major
# Summary: "Change primary color from blue to purple in publicProfile"
```

**Minor (feature)**:
```bash
pnpm changeset
# Select: minor
# Summary: "Add Toggle component with variants"
```

**Patch (fix)**:
```bash
pnpm changeset
# Select: patch
# Summary: "Fix TypeScript types for Button onClick prop"
```

### Release Process

On merge to `main`:
1. Changesets bot creates/updates a "Version Packages" PR
2. When merged, packages are automatically published to npm
3. GitHub release is created with changelog

### Release Pipeline Contract

- Publishing is handled only by `.github/workflows/release.yml`.
- Repository secret `NPM_TOKEN` is required for publish runs.
- The workflow validates npm auth (`npm whoami`) before `changeset publish`.
- If no changesets are present, the workflow attempts to publish any unpublished packages.

## Development

### Setup
```bash
pnpm install
```

### Build
```bash
pnpm build
```

### Type Checking
```bash
pnpm typecheck
```

### Watch Mode
```bash
pnpm dev
```

## Guidelines

### Do:
- ✅ Keep API surface minimal and stable
- ✅ Use semantic token names
- ✅ Document all public exports
- ✅ Add changesets for all consumer-facing changes
- ✅ Test changes against consumer scenarios

### Don't:
- ❌ Export internal utilities
- ❌ Change token values without major bump
- ❌ Add dependencies lightly
- ❌ Break backward compatibility in minors/patches
- ❌ Assume monorepo context in builds

## Questions?

Open an issue for discussion before starting work on major features.

## Core Platform Workflow

For app-level development across Game, Second Brain, and Strata:

- Read `docs/CORE_PROJECT_PLAYBOOK.md`
- Keep `app.manifest.json` current for each app
- Use `node scripts/apps/new-app.mjs` for new app scaffolding
- Validate app contracts with `node scripts/apps/validate-app.mjs`
