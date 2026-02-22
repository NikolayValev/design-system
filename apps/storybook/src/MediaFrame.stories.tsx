import type { Meta, StoryObj } from '@storybook/react';
import { MediaFrame } from '@nikolayvalev/design-system';

const sampleImage = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720"><defs><linearGradient id="a" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#2f3d68"/><stop offset="100%" stop-color="#9f70ff"/></linearGradient></defs><rect width="1280" height="720" fill="url(#a)"/><circle cx="240" cy="200" r="180" fill="rgba(255,255,255,0.2)"/><circle cx="1040" cy="560" r="240" fill="rgba(63,244,201,0.24)"/><text x="72" y="660" fill="#ffffff" font-family="Arial, sans-serif" font-size="64" font-weight="700">MEDIA FRAME</text></svg>'
)}`;

const meta = {
  title: 'Design System/MediaFrame',
  component: MediaFrame,
  tags: ['autodocs'],
  args: {
    alt: 'Atmospheric media sample',
    kind: 'image',
    src: sampleImage,
  },
  argTypes: {
    kind: {
      control: 'radio',
      options: ['image', 'video'],
    },
  },
  render: args => (
    <MediaFrame {...args} className="mx-auto aspect-video max-w-[760px]">
      {args.kind === 'video' ? (
        <div className="flex h-full w-full items-center justify-center bg-black text-white [font-family:var(--vde-font-body)]">
          Video surface placeholder
        </div>
      ) : null}
    </MediaFrame>
  ),
} satisfies Meta<typeof MediaFrame>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Museum: Story = {
  parameters: {
    forcedVision: 'museum',
  },
};

export const Brutalist: Story = {
  parameters: {
    forcedVision: 'brutalist',
  },
};

export const Immersive: Story = {
  parameters: {
    forcedVision: 'immersive',
  },
};
