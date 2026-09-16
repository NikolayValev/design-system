import type { Meta, StoryObj } from '@storybook/react';
import { MediaFrame } from '@nikolayvalev/design-system';

/*
 * A neutral placeholder. The previous one was a fixed navy-to-violet gradient
 * with a mint blob — an image that looked identical in all 13 visions and
 * advertised the exact colour scheme the rest of this work removed.
 *
 * An SVG inside a data: URI is parsed as its own document and cannot read the
 * page's CSS custom properties, so a placeholder image has to carry literal
 * colours. They are deliberately neutral greys for that reason.
 */
/* eslint-disable design-system/no-raw-design-values */
const sampleImage = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">' +
    '<rect width="1280" height="720" fill="#d8d4cd"/>' +
    '<rect x="64" y="64" width="1152" height="592" fill="none" stroke="#8d8880" stroke-width="2"/>' +
    '<text x="96" y="648" fill="#5d5951" font-family="Georgia, serif" font-size="48">1280 x 720 placeholder</text>' +
    '</svg>'
)}`;
/* eslint-enable design-system/no-raw-design-values */

const meta = {
  title: 'Showcase/MediaFrame',
  component: MediaFrame,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'Vision-aware image and video wrapper with atmospheric overlay effects. Aspect ratio and frame style adapt to the active theme.' } },
  },
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
