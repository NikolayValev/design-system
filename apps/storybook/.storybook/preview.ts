import type { Preview } from '@storybook/react-vite';
import { applyTheme, createTheme, publicProfile } from '@nikolayvalev/design-system';
import '../src/styles.css';

const theme = createTheme({ profile: publicProfile });
if (typeof document !== 'undefined') {
  applyTheme(document.documentElement, theme);
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'centered',
  },
};

export default preview;
