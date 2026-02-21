import type { TestRunnerConfig } from '@storybook/test-runner';

const disableMotionStyles = `
  *, *::before, *::after {
    animation: none !important;
    transition: none !important;
    caret-color: transparent !important;
  }
`;

const config: TestRunnerConfig = {
  async preVisit(page) {
    await page.addStyleTag({ content: disableMotionStyles });
  },
};

export default config;
