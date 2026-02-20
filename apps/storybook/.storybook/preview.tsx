import type { Decorator, Preview } from '@storybook/react';
import { VisionProvider, defaultVisionRegistry, visionThemes } from '@nikolayvalev/design-system';
import '../src/styles.css';

const visionToolbarItems = visionThemes.map(vision => ({
  value: vision.id,
  title: vision.name,
}));

const withVisionProvider: Decorator = (Story, context) => {
  const forcedVision = typeof context.parameters?.forcedVision === 'string' ? context.parameters.forcedVision : undefined;
  const visionId = forcedVision ?? (typeof context.globals.vision === 'string' ? context.globals.vision : visionThemes[0]?.id);
  const isEdgeFrame = context.parameters?.vdeFrame === 'edge';
  const frameClasses = isEdgeFrame
    ? 'min-h-screen bg-[var(--vde-color-background)] text-[var(--vde-color-foreground)] transition-all [transition-duration:var(--vde-motion-duration-normal)] [transition-timing-function:var(--vde-motion-easing-standard)]'
    : 'min-h-screen p-8 bg-[var(--vde-color-background)] text-[var(--vde-color-foreground)] transition-all [transition-duration:var(--vde-motion-duration-normal)] [transition-timing-function:var(--vde-motion-easing-standard)]';

  return (
    <VisionProvider registry={defaultVisionRegistry} visionId={visionId}>
      <div className={frameClasses}>
        <Story />
      </div>
    </VisionProvider>
  );
};

const preview: Preview = {
  decorators: [withVisionProvider],
  globalTypes: {
    vision: {
      name: 'Vision',
      description: 'Active Visionary Design Engine archetype',
      defaultValue: visionThemes[0]?.id,
      toolbar: {
        icon: 'paintbrush',
        dynamicTitle: true,
        items: visionToolbarItems,
      },
    },
  },
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'fullscreen',
  },
};

export default preview;
