import type { Meta, StoryObj } from '@storybook/react';
import { AtmosphereProvider } from '@nikolayvalev/design-system';

const meta = {
  title: 'Design System/AtmosphereProvider',
  component: AtmosphereProvider,
  tags: ['autodocs'],
  args: {
    fixedBackground: false,
    intensity: 'normal',
    mode: 'auto',
  },
  argTypes: {
    mode: {
      control: 'radio',
      options: ['auto', 'archive', 'nexus', 'none'],
    },
    intensity: {
      control: 'radio',
      options: ['soft', 'normal', 'strong'],
    },
  },
  render: args => (
    <AtmosphereProvider {...args} className="min-h-[380px]">
      <div className="mx-auto max-w-[760px] space-y-4 p-10">
        <h3 className="text-3xl [font-family:var(--vde-font-display)]">Global Atmosphere Layer</h3>
        <p className="[font-family:var(--vde-font-body)]">
          Archive mode renders grain/noise texture while Nexus mode injects a mesh-gradient field.
        </p>
      </div>
    </AtmosphereProvider>
  ),
} satisfies Meta<typeof AtmosphereProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
