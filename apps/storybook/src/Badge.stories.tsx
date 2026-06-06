import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '@nikolayvalev/design-system';

const meta = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: {
    storyCaption: 'Compact status/label chip. Four token-driven variants that track the active vision.',
    docs: {
      description: {
        component:
          'Small inline label with four variants (default, secondary, outline, destructive). Reads only --vde-* tokens.',
      },
    },
  },
  args: {
    children: 'Badge',
    variant: 'default',
  },
  argTypes: {
    variant: {
      control: 'radio',
      options: ['default', 'secondary', 'outline', 'destructive'],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="destructive">Destructive</Badge>
    </div>
  ),
};

export const InContext: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3 text-sm [color:var(--vde-color-foreground)]">
      <span className="inline-flex items-center gap-2">
        Build <Badge variant="default">passing</Badge>
      </span>
      <span className="inline-flex items-center gap-2">
        Plan <Badge variant="secondary">pro</Badge>
      </span>
      <span className="inline-flex items-center gap-2">
        Cache <Badge variant="outline">stale</Badge>
      </span>
      <span className="inline-flex items-center gap-2">
        Quota <Badge variant="destructive">exceeded</Badge>
      </span>
    </div>
  ),
};
