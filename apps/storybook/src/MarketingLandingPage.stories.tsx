import type { Meta, StoryObj } from '@storybook/react';
import { MarketingLandingPage } from '@nikolayvalev/design-system';

const meta = {
  title: 'Showcase/Pages/MarketingLandingPage',
  component: MarketingLandingPage,
  tags: ['autodocs', 'skip-visual'],
  parameters: {
    vdeFrame: 'edge',
    docs: { description: { component: 'Full marketing landing page template composed from HeroSection, FeatureGridSection, and MetricStripSection. Install as source via MCP.' } },
  },
  args: {
    heading: 'All 10 design styles, one installable system',
    subtitle: 'Page template composed from reusable sections and token-driven primitives.',
  },
} satisfies Meta<typeof MarketingLandingPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
