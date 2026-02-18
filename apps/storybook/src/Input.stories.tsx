import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '@nikolayvalev/design-system';

const meta = {
  title: 'Design System/Input',
  component: Input,
  tags: ['autodocs'],
  args: {
    placeholder: 'Type here...',
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: 'Read-only preview',
  },
};
