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
  'min-h-screen bg-[var(--vde-color-background)] text-[var(--vde-color-foreground)] transition-all [transition-duration:var(--vde-motion-duration-normal)] [transition-timing-function:var(--vde-motion-easing-standard)] [font-family:var(--vde-font-body)]';

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
      <div className={`${baseFrame} relative`}>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(var(--vde-color-foreground) 1px, transparent 1px), linear-gradient(90deg, var(--vde-color-foreground) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            backgroundPosition: '-1px -1px',
          }}
        />
        <div className="relative mx-auto flex min-h-screen w-full max-w-[1180px] flex-col px-8 py-10 md:px-12 md:py-14">
          {(storyTitle || caption) && (
            <header className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b pb-5 [border-color:var(--vde-color-border)]">
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-[0.32em] opacity-60">
                  {context.title?.split('/').slice(0, -1).join(' / ') || 'Showroom'}
                </p>
                <h2
                  className="text-2xl md:text-3xl [font-family:var(--vde-font-display)] [letter-spacing:var(--vde-letter-spacing-tight)]"
                >
                  {storyTitle}
                  {storyName && storyName !== 'Default' && storyName !== 'Playground' ? (
                    <span className="opacity-50"> · {storyName}</span>
                  ) : null}
                </h2>
              </div>
              {caption ? (
                <p className="max-w-[42ch] text-right text-xs leading-relaxed opacity-70">{caption}</p>
              ) : (
                <p className="text-[10px] uppercase tracking-[0.28em] opacity-40">
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
