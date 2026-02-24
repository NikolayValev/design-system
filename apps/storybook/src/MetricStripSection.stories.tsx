import type { Meta, StoryObj } from '@storybook/react';
import { MetricStripSection } from '@nikolayvalev/design-system';

const meta = {
  title: 'Design System/Sections/MetricStripSection',
  component: MetricStripSection,
  tags: ['autodocs', 'skip-visual'],
  args: {
    sectionEyebrow: 'Signal',
    sectionTitle: 'Impact metrics',
    sectionDescription: 'KPI strip designed to pair with launch and product pages.',
    items: [
      { id: 'm1', label: 'Install time', value: '< 5 min' },
      { id: 'm2', label: 'Token profiles', value: '10 styles' },
      { id: 'm3', label: 'Bundle mode', value: 'MCP install' },
    ],
  },
} satisfies Meta<typeof MetricStripSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
