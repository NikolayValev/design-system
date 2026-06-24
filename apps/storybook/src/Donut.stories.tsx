import type { Meta, StoryObj } from '@storybook/react';
import { Donut } from '@nikolayvalev/design-system';

const data = [
  { label: 'Editorial', value: 4 },
  { label: 'Minimal', value: 3 },
  { label: 'Technical', value: 2 },
  { label: 'Atmospheric', value: 2 },
  { label: 'Expressive', value: 1 },
];

const meta = {
  title: 'Charts/Donut',
  component: Donut,
  tags: ['autodocs'],
  parameters: {
    storyCaption: 'Dependency-free SVG donut. Slices cycle --chart-1..5 and track the active vision.',
  },
  args: { data, size: 180, thickness: 28 },
} satisfies Meta<typeof Donut>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
