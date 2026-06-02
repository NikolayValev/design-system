import { addons } from '@storybook/manager-api';
import { visionaryTheme } from './theme';

addons.setConfig({
  theme: visionaryTheme,
  sidebar: {
    showRoots: true,
  },
});

if (typeof window !== 'undefined' && !new URLSearchParams(window.location.search).has('path')) {
  window.location.replace('/?path=/story/introduction-overview--welcome');
}
