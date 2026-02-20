import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@nikolayvalev/design-system';

const meta = {
  title: 'Design System/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    children: 'Action',
    variant: 'default',
    size: 'md',
  },
  argTypes: {
    variant: {
      control: 'radio',
      options: ['default', 'secondary', 'destructive', 'outline', 'ghost'],
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof Button>;

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

export const VariantSet: Story = {
  render: args => (
    <div className="flex flex-wrap gap-3">
      <Button {...args} variant="default">
        Default
      </Button>
      <Button {...args} variant="secondary">
        Secondary
      </Button>
      <Button {...args} variant="destructive">
        Destructive
      </Button>
      <Button {...args} variant="outline">
        Outline
      </Button>
      <Button {...args} variant="ghost">
        Ghost
      </Button>
    </div>
  ),
};

export const VariantSetMuseum: Story = {
  ...VariantSet,
  parameters: {
    forcedVision: 'museum',
  },
};

export const VariantSetBrutalist: Story = {
  ...VariantSet,
  parameters: {
    forcedVision: 'brutalist',
  },
};

export const VariantSetImmersive: Story = {
  ...VariantSet,
  parameters: {
    forcedVision: 'immersive',
  },
};
