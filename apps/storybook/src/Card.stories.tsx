import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardContent, CardHeader, CardTitle } from '@nikolayvalev/design-system';

const meta = {
  title: 'Design System/Card',
  component: Card,
  tags: ['autodocs'],
  args: {
    children: null,
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: args => (
    <Card {...args} className="w-[360px]">
      <CardHeader>
        <CardTitle>Project Snapshot</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          This card uses design tokens and component composition from the shared library.
        </p>
      </CardContent>
    </Card>
  ),
};
