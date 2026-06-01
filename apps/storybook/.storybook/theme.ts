import { create } from '@storybook/theming';

export const visionaryTheme = create({
  base: 'light',
  brandTitle: 'Visionary Design Engine',
  brandUrl: 'https://github.com/nikolay-valev/design-system',
  brandTarget: '_self',

  // Surfaces
  colorPrimary: '#1f1b16',
  colorSecondary: '#7a3a1a',

  // UI
  appBg: '#f6f1e7',
  appContentBg: '#fbf7ee',
  appPreviewBg: '#fbf7ee',
  appBorderColor: 'rgba(31, 27, 22, 0.12)',
  appBorderRadius: 8,

  // Typography
  fontBase: '"Source Serif 4", "Georgia", serif',
  fontCode: '"IBM Plex Mono", "JetBrains Mono", "Consolas", monospace',

  // Text colors
  textColor: '#1f1b16',
  textInverseColor: '#fbf7ee',
  textMutedColor: 'rgba(31, 27, 22, 0.62)',

  // Toolbar default and active colors
  barTextColor: 'rgba(31, 27, 22, 0.72)',
  barHoverColor: '#7a3a1a',
  barSelectedColor: '#7a3a1a',
  barBg: '#fbf7ee',

  // Form colors
  inputBg: '#fbf7ee',
  inputBorder: 'rgba(31, 27, 22, 0.18)',
  inputTextColor: '#1f1b16',
  inputBorderRadius: 6,
});
