import type { Meta, StoryObj } from '@storybook/react';
import { LineChart } from '@nikolayvalev/design-system';

const data = [
  { label: 'Jan', value: 12 },
  { label: 'Feb', value: 28 },
  { label: 'Mar', value: 19 },
  { label: 'Apr', value: 34 },
  { label: 'May', value: 26 },
  { label: 'Jun', value: 41 },
];

const meta = {
  title: 'Charts/LineChart',
  component: LineChart,
  tags: ['autodocs'],
  parameters: {
    storyCaption: 'Dependency-free SVG line chart. Series color reads --chart-1..5 and tracks the active vision.',
  },
  args: { data, colorIndex: 1 },
  argTypes: { colorIndex: { control: 'inline-radio', options: [1, 2, 3, 4, 5] } },
} satisfies Meta<typeof LineChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
