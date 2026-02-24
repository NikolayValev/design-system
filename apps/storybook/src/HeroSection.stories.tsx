import type { Meta, StoryObj } from '@storybook/react';
import { HeroSection } from '@nikolayvalev/design-system';

const meta = {
  title: 'Design System/Sections/HeroSection',
  component: HeroSection,
  tags: ['autodocs', 'skip-visual'],
  args: {
    heading: 'Ship your design language fast',
    subtitle: 'Composable hero section with token-driven primitives and no hardcoded colors.',
    actions: [
      { label: 'Get started', variant: 'default' },
      { label: 'View docs', variant: 'outline' },
    ],
  },
} satisfies Meta<typeof HeroSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
