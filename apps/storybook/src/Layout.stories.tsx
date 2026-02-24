import type { Meta, StoryObj } from '@storybook/react';
import { Button, Card, CardContent, CardHeader, CardTitle, Layout } from '@nikolayvalev/design-system';

const meta = {
  title: 'Design System/Layout',
  component: Layout,
  tags: ['autodocs'],
  args: {
    children: undefined,
    heading: 'Visionary Workspace',
  },
} satisfies Meta<typeof Layout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: args => (
    <Layout {...args} className="mx-auto max-w-[920px]">
      <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]">
        <Card>
          <CardHeader>
            <CardTitle>Narrative Panel</CardTitle>
          </CardHeader>
          <CardContent>
            Active vision controls typography, surface physics, and motion signature for every component.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="default">Primary Action</Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  ),
};
