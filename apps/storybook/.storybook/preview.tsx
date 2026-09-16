import type { Decorator, Preview } from '@storybook/react';
import { VisionProvider, defaultVisionRegistry, visionThemes } from '@nikolayvalev/design-system';
import '../src/styles.css';

type StorybookVisionParameters = {
  forcedVision?: string;
  vdeFrame?: 'edge' | 'default' | 'editorial';
  storyCaption?: string;
};

const defaultVisionId = visionThemes[0]?.id ?? 'museum';

const visionToolbarItems = visionThemes.map(vision => ({
  value: vision.id,
  title: vision.name,
}));

const baseFrame =
  'min-h-screen bg-[var(--vde-color-background)] text-[var(--vde-color-foreground)] [transition-property:background-color,color] [transition-duration:var(--vde-motion-duration-normal)] [transition-timing-function:var(--vde-motion-easing-standard)] [font-family:var(--vde-font-body)]';

const withVisionProvider: Decorator = (Story, context) => {
  const parameters = context.parameters as typeof context.parameters & StorybookVisionParameters;
  const forcedVision = typeof parameters.forcedVision === 'string' ? parameters.forcedVision : undefined;
  const visionId = forcedVision ?? (typeof context.globals.vision === 'string' ? context.globals.vision : defaultVisionId);
  const frameMode = parameters.vdeFrame ?? 'default';

  const modeGlobal = typeof context.globals.mode === 'string' ? context.globals.mode as 'light' | 'dark' : undefined;

  if (frameMode === 'edge') {
    return (
      <VisionProvider registry={defaultVisionRegistry} visionId={visionId} mode={modeGlobal}>
        <div className={baseFrame}>
          <Story />
        </div>
      </VisionProvider>
    );
  }

  const caption = typeof parameters.storyCaption === 'string' ? parameters.storyCaption : undefined;
  const storyTitle = typeof context.title === 'string' ? context.title.split('/').pop() : undefined;
  const storyName = typeof context.name === 'string' ? context.name : undefined;

  return (
    <VisionProvider registry={defaultVisionRegistry} visionId={visionId} mode={modeGlobal}>
      {/*
        A decorative grid overlay used to sit behind every non-edge story. It was
        not a canvas, a map or an alignment aid — it was texture, and it sat
        underneath every component being reviewed, which is precisely when a
        background should be doing nothing.
      */}
      <div className={`${baseFrame} relative`}>
        <div className="relative mx-auto flex min-h-screen w-full max-w-[1180px] flex-col px-8 py-10 md:px-12 md:py-14">
          {(storyTitle || caption) && (
            <header className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b pb-5 [border-color:var(--vde-color-border)]">
              <div className="space-y-1">
                <p className="[font-size:var(--vde-font-size-caption)] [letter-spacing:var(--vde-letter-spacing-wide)] [color:var(--vde-color-muted-foreground)]">
                  {context.title?.split('/').slice(0, -1).join(' / ') || 'Showroom'}
                </p>
                <h2
                  className="text-2xl md:text-3xl [font-family:var(--vde-font-display)] [letter-spacing:var(--vde-letter-spacing-tight)]"
                >
                  {storyTitle}
                  {storyName && storyName !== 'Default' && storyName !== 'Playground' ? (
                    <span className="[color:var(--vde-color-muted-foreground)]"> · {storyName}</span>
                  ) : null}
                </h2>
              </div>
              {caption ? (
                <p className="max-w-[42ch] text-right [font-size:var(--vde-font-size-ui)] [line-height:var(--vde-line-height-relaxed)] [color:var(--vde-color-muted-foreground)]">{caption}</p>
              ) : (
                <p className="[font-size:var(--vde-font-size-caption)] [letter-spacing:var(--vde-letter-spacing-wide)] [color:var(--vde-color-muted-foreground)]">
                  Vision · {visionId}
                </p>
              )}
            </header>
          )}
          <div className="flex-1">
            <Story />
          </div>
        </div>
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
      defaultValue: defaultVisionId,
      toolbar: {
        icon: 'paintbrush',
        dynamicTitle: true,
        items: visionToolbarItems,
      },
    },
    mode: {
      name: 'Mode',
      description: 'Light or dark mode for the active vision',
      defaultValue: 'light',
      toolbar: {
        icon: 'circlehollow',
        dynamicTitle: true,
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
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
    options: {
      storySort: {
        order: [
          'Foundations',
          ['Overview'],
          'Themes',
          ['Gallery', 'Explorer'],
          'Components',
          ['Button', 'Input', 'Textarea', 'Checkbox', 'Form Controls', 'Badge', 'Card', 'Layout'],
          'Showcase',
          [
            'EditorialHeader',
            'NavigationOrb',
            'MediaFrame',
            'GalleryStage',
            'AtmosphereProvider',
            'Sections',
            'Pages',
          ],
        ],
      },
    },
  },
};

export default preview;
