import config from '@repo/config/eslint-design-system.config.cjs';

/*
 * Storybook opted out of the governance config entirely, which is why the
 * stories accumulated the things this rework had to undo: raw hex, 9px captions,
 * opacity stacked on muted text. `no-inline-styles` was defined in the plugin
 * and simply never applied where the violations were.
 */
export default [
  ...config,
  {
    rules: {
      // The Storybook app owns `src/styles.css`, its Tailwind entry point, and
      // stories import demo helpers from `./`. Neither is an app overriding the
      // system, which is what these two rules exist to catch.
      'design-system/no-local-css': 'off',
      'design-system/no-local-component': 'off',
    },
  },
  {
    /*
     * The manager theme styles Storybook's own chrome, not the preview. Its
     * `create()` API takes literal colour strings and is rendered outside the
     * iframe where the `--vde-*` tokens live, so it cannot read them.
     */
    files: ['.storybook/theme.ts'],
    rules: { 'design-system/no-raw-design-values': 'off' },
  },
  {
    /*
     * These four stories exist to render *other themes' palettes* — swatch grids,
     * side-by-side light/dark comparisons, the vision explorer. Their inline
     * styles are fed from theme objects (`colors.surface`, `colors.accent`), so
     * the value is only known at render time and there is no class that could
     * express it. This is the "dynamic edge case" DESIGN_SYSTEM.md carves out.
     *
     * The token rules stay ON here; only the inline-style rule is relaxed.
     */
    files: [
      'src/Overview.stories.tsx',
      'src/ThemeGallery.stories.tsx',
      'src/ThemeModes.stories.tsx',
      'src/VisionaryExplorer.stories.tsx',
    ],
    rules: { 'design-system/no-inline-styles': 'off' },
  },
];
