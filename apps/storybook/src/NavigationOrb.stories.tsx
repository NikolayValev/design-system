import type { Meta, StoryObj } from '@storybook/react';
import { NavigationOrb } from '@nikolayvalev/design-system';

const meta = {
  title: 'Design System/NavigationOrb',
  component: NavigationOrb,
  tags: ['autodocs'],
  args: {
    defaultOpen: true,
    floating: false,
    items: [
      { id: 'overview', label: 'Overview' },
      { id: 'materials', label: 'Materials' },
      { id: 'motion', label: 'Motion' },
      { id: 'ornaments', label: 'Ornaments' },
    ],
    label: 'Section navigation',
  },
  render: args => (
    <div className="relative min-h-[380px] overflow-hidden rounded-xl border [border-color:var(--vde-color-border)] [background:var(--vde-color-surface)]">
      <div className="max-w-[58ch] space-y-4 p-8 [font-family:var(--vde-font-body)]">
        <h3 className="text-2xl [font-family:var(--vde-font-display)]">Floating Orb Navigation</h3>
        <p>Toggle the orb to expose radial items and compare timing behavior between the three primary archetypes.</p>
      </div>
      <NavigationOrb {...args} className="absolute bottom-6 right-6" />
    </div>
  ),
} satisfies Meta<typeof NavigationOrb>;

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
