# Migration Guide

This document helps you upgrade between major versions of `@nikolayvalev/design-system`.

## Philosophy

Visual changes are treated as breaking. If upgrading changes how your app looks, we bump the major version. This lets you control when visual updates happen.

---

## Unreleased Breaking Changes

### Token profiles removed (next major)

The legacy token-profile system is gone. Removed exports / entry points:

- `createTheme`, `applyTheme`, `ThemeConfig`, `Theme`
- `publicProfile`, `dashboardProfile`, `experimentalProfile`, `ThemeProfile`, `DesignTokens`, `baseTokens`
- `createTailwindPreset` and the `./tailwind` entry point
- the `./tokens` entry point
- the `styles/public.css`, `styles/dashboard.css`, `styles/experimental.css` files
- the `@nikolayvalev/design-tokens` package (discontinued)

**Migrate:**

- Replace profile CSS imports with a per-vision import: `import '@nikolayvalev/design-system/styles/<visionId>.css'`.
- Replace `createTheme`/`applyTheme` + a profile with `<VisionProvider registry={defaultVisionRegistry} defaultVisionId="…">` and the `useVision()` hook.
- Drop `createTailwindPreset(profile)` — the active vision emits `--primary`/`--background`/… so Tailwind semantic classes resolve without a preset.
- Override tokens by pinning CSS variables (`--vde-color-*` / the shadcn aliases) instead of building a custom profile.
- CLI: use `--vision <id>` / `--list-visions` instead of `--profile` / `--vision-map`.

---

## Template for Future Releases

When we publish a major version, we'll add migration instructions here following this structure:

### Version X.0.0 (YYYY-MM-DD)

**What Changed:**
- List of visual changes
- List of API changes
- List of removed exports

**Migration Steps:**

1. **Update package version**
   ```bash
   npm install @nikolayvalev/design-system@X.0.0
   # or
   pnpm add @nikolayvalev/design-system@X.0.0
   ```

2. **Review visual changes**
   - Take screenshots before upgrading
   - Compare with new version
   - Adjust overrides if needed

3. **Update code patterns**
   - Search for deprecated imports
   - Replace with new patterns
   - Update type definitions if changed

4. **Test thoroughly**
   - Visual regression tests
   - Interaction tests
   - Accessibility checks

**Backward Compatibility:**
- What still works the same
- Deprecation warnings (if any)

**Need Help?**
Open an issue with your upgrade questions.

---

## Best Practices for Upgrades

### Lock Your Version

Control when visual changes happen:

```json
{
  "dependencies": {
    "@nikolayvalev/design-system": "~1.0.0"
  }
}
```

Use tilde (`~`) for patch updates only, or exact version for complete lock.

### Override Strategy

If a visual change doesn't work for you:

```css
/* Override specific tokens by pinning CSS variables */
:root {
  --vde-color-accent: oklch(0.55 0.20 250); /* keep the old value */
  --primary: var(--vde-color-accent);
}
```

### Staging Environment

Always test major upgrades in staging first. Check:
- Landing pages
- Dashboard views  
- Mobile responsive behavior
- Dark mode
- Print styles

### Gradual Rollout

For large apps, consider:
1. Update design system package
2. Keep old CSS imported alongside new
3. Migrate pages one by one
4. Remove old CSS when done

This requires careful CSS scoping but minimizes risk.

---

## Version History

### 1.0.0
- First major release
- Visual-first versioning policy now in stable major stream

### 0.1.1
- Initial stable release
- No breaking changes to migrate from

### 0.1.0
- Initial beta release
