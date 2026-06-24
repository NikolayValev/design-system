import type { Meta, StoryObj } from '@storybook/react';
import { BarChart } from '@nikolayvalev/design-system';

const data = [
  { label: 'A', value: 8 },
  { label: 'B', value: 16 },
  { label: 'C', value: 11 },
  { label: 'D', value: 22 },
  { label: 'E', value: 14 },
];

const meta = {
  title: 'Charts/BarChart',
  component: BarChart,
  tags: ['autodocs'],
  parameters: {
    storyCaption: 'Dependency-free SVG bar chart. Bars read --chart-1..5 and track the active vision.',
  },
  args: { data, colorIndex: 2 },
  argTypes: { colorIndex: { control: 'inline-radio', options: [1, 2, 3, 4, 5] } },
} satisfies Meta<typeof BarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
