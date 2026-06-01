import { addons } from '@storybook/manager-api';
import { visionaryTheme } from './theme';

addons.setConfig({
  theme: visionaryTheme,
  sidebar: {
    showRoots: true,
  },
});
