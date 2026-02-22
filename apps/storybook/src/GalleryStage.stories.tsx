import type { Meta, StoryObj } from '@storybook/react';
import { GalleryStage } from '@nikolayvalev/design-system';

const meta = {
  title: 'Design System/GalleryStage',
  component: GalleryStage,
  tags: ['autodocs'],
  args: {
    children: null,
    material: 'adaptive',
  },
  argTypes: {
    material: {
      control: 'radio',
      options: ['adaptive', 'paper', 'slab', 'glass'],
    },
  },
  render: args => (
    <GalleryStage {...args} className="mx-auto max-w-[720px]">
      <div className="space-y-4 p-8">
        <h3 className="text-2xl [font-family:var(--vde-font-display)]">Material Narrative</h3>
        <p className="max-w-[58ch] [font-family:var(--vde-font-body)]">
          GalleryStage shifts surface treatment per archetype while preserving the same content payload.
        </p>
      </div>
    </GalleryStage>
  ),
} satisfies Meta<typeof GalleryStage>;

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
