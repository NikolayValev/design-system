import type { Meta, StoryObj } from '@storybook/react';
import { FeatureGridSection } from '@nikolayvalev/design-system';

const meta = {
  title: 'Design System/Sections/FeatureGridSection',
  component: FeatureGridSection,
  tags: ['autodocs', 'skip-visual'],
  args: {
    sectionEyebrow: 'Capabilities',
    sectionTitle: 'Section-based architecture',
    sectionDescription: 'Reusable sections that can be installed and composed across repositories.',
    items: [
      { id: '1', title: 'Source ownership', description: 'Install section templates directly into your repository.' },
      { id: '2', title: 'Token semantics', description: 'Shared theme primitives keep every surface aligned.' },
      { id: '3', title: 'MCP delivery', description: 'Call tools to fetch components, sections, and page bundles.' },
    ],
  },
} satisfies Meta<typeof FeatureGridSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
