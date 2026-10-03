import type { TestRunnerConfig } from "@storybook/test-runner";
import { getStoryContext } from "@storybook/test-runner";
import { injectAxe, checkA11y, configureAxe } from "axe-playwright";

const disableMotionStyles = `
  *, *::before, *::after {
    animation: none !important;
    transition: none !important;
    caret-color: transparent !important;
  }
`;

/*
 * @storybook/addon-a11y has been installed for a long time, but it is a panel:
 * it shows findings to whoever happens to open that tab and asserts nothing.
 * `pnpm test:stories` therefore ran every story and checked no accessibility
 * rule at all — which is how a navigation component with zero focus styles and
 * four unlabelled `role="img"` charts stayed in the library.
 *
 * This runs the same engine as an assertion. A story can opt out through
 * `parameters.a11y.disable`, and individual rules through `parameters.a11y.config`,
 * but the default is now "checked" rather than "looked at if someone clicks".
 */
const config: TestRunnerConfig = {
  async preVisit(page) {
    await page.addStyleTag({ content: disableMotionStyles });
    await injectAxe(page);
  },

  async postVisit(page, context) {
    const storyContext = await getStoryContext(page, context);
    const a11y = storyContext.parameters?.a11y;

    if (a11y?.disable) {
      return;
    }

    if (a11y?.config) {
      await configureAxe(page, a11y.config);
    }

    /*
     * addon-a11y runs its own axe pass when a story renders, for the panel, and
     * axe refuses to start a second run while one is in flight. The two are not
     * coordinated, so this waits the addon's run out rather than disabling the
     * panel's live feedback to make the assertion convenient.
     */
    const maxAttempts = 20;
    for (let attempt = 1; ; attempt += 1) {
      try {
        await checkA11y(page, "#storybook-root", {
          detailedReport: true,
          detailedReportOptions: { html: true },
        });
        return;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        if (
          !message.includes("Axe is already running") ||
          attempt >= maxAttempts
        ) {
          throw error;
        }
        await page.waitForTimeout(250);
      }
    }
  },
};

export default config;
