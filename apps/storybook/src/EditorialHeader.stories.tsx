import type { Meta, StoryObj } from '@storybook/react';
import { EditorialHeader } from '@nikolayvalev/design-system';

const meta = {
  title: 'Design System/EditorialHeader',
  component: EditorialHeader,
  tags: ['autodocs'],
  args: {
    as: 'h1',
    children: 'Designing Atmospheres, Not Interfaces',
    size: 'massive',
    writingMode: 'horizontal',
  },
  argTypes: {
    as: {
      control: 'radio',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg', 'massive'],
    },
    writingMode: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
    },
  },
  render: args => (
    <div className="mx-auto flex min-h-[340px] max-w-[960px] items-center justify-center">
      <EditorialHeader {...args} />
    </div>
  ),
} satisfies Meta<typeof EditorialHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Museum: Story = {
  parameters: {
    forcedVision: 'museum',
  },
};

export const Brutalist: Story = {
  parameters: {
    forcedVision: 'brutalist',
  },
};

export const Immersive: Story = {
  parameters: {
    forcedVision: 'immersive',
  },
};

export const VerticalMassive: Story = {
  args: {
    writingMode: 'vertical',
    size: 'massive',
  },
  render: args => (
    <div className="mx-auto flex min-h-[440px] max-w-[960px] items-center justify-center">
      <EditorialHeader {...args} />
    </div>
  ),
};
