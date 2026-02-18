# Migration Guide

This document helps you upgrade between major versions of `@nikolayvalev/design-system`.

## Philosophy

Visual changes are treated as breaking. If upgrading changes how your app looks, we bump the major version. This lets you control when visual updates happen.

---

## Unreleased Breaking Changes

*None currently planned*

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

```ts
// Override specific tokens in your theme
const customTheme = createTheme({
  profile: publicProfile,
  tokens: {
    colors: {
      primary: 'oklch(0.55 0.20 250)' // Keep old value
    }
  }
});
```

### Staging Environment

Always test major upgrades in staging first. Check:
- Landing pages
- Dashboard views  
- Mobile responsive behavior
- Dark mode (if using publicProfile)
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
