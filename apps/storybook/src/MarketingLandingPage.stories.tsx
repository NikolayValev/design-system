import type { Meta, StoryObj } from '@storybook/react';
import { MarketingLandingPage } from '@nikolayvalev/design-system';

const meta = {
  title: 'Design System/Pages/MarketingLandingPage',
  component: MarketingLandingPage,
  tags: ['autodocs', 'skip-visual'],
  parameters: {
    vdeFrame: 'edge',
  },
  args: {
    heading: 'All 10 design styles, one installable system',
    subtitle: 'Page template composed from reusable sections and token-driven primitives.',
  },
} satisfies Meta<typeof MarketingLandingPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
