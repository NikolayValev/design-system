import type { Meta, StoryObj } from '@storybook/react';
import { ProductShowcasePage } from '@nikolayvalev/design-system';

const meta = {
  title: 'Design System/Pages/ProductShowcasePage',
  component: ProductShowcasePage,
  tags: ['autodocs', 'skip-visual'],
  parameters: {
    vdeFrame: 'edge',
  },
  args: {
    heading: 'Product showcase template',
    mediaSrc: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
    mediaAlt: 'Product environment',
  },
} satisfies Meta<typeof ProductShowcasePage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
