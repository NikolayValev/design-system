import type { Meta, StoryObj } from '@storybook/react';
import { AreaChart } from '@nikolayvalev/design-system';

const data = [
  { label: 'Mon', value: 5 },
  { label: 'Tue', value: 9 },
  { label: 'Wed', value: 7 },
  { label: 'Thu', value: 14 },
  { label: 'Fri', value: 11 },
  { label: 'Sat', value: 18 },
  { label: 'Sun', value: 13 },
];

const meta = {
  title: 'Charts/AreaChart',
  component: AreaChart,
  tags: ['autodocs'],
  parameters: {
    storyCaption: 'Dependency-free SVG area chart. Fill + line read --chart-1..5 and track the active vision.',
  },
  args: { data, colorIndex: 3 },
  argTypes: { colorIndex: { control: 'inline-radio', options: [1, 2, 3, 4, 5] } },
} satisfies Meta<typeof AreaChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
