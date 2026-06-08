import type { Meta, StoryObj } from '@storybook/react';
import { groupThemesByFamily, visionThemes, type VisionTheme } from '@nikolayvalev/design-system';

function primaryFont(stack: string): string {
  const first = stack.split(',')[0] ?? stack;
  return first.trim().replace(/"/g, '');
}

function SwatchRow({ colors, label }: { colors: VisionTheme['colors']['light']; label: string }): JSX.Element {
  const swatches = [
    colors.background,
    colors.surface,
    colors.accent,
    colors.secondary,
    colors.chart1,
  ];

  return (
    <div
      className="flex items-center gap-2 rounded-md px-3 py-2"
      style={{ background: colors.background, border: `1px solid ${colors.border}` }}
    >
      <span
        className="text-[9px] uppercase tracking-[0.14em]"
        style={{ color: colors.mutedForeground, minWidth: '2.8rem' }}
      >
        {label}
      </span>
      <div className="flex">
        {swatches.map((swatch, idx) => (
          <span
            key={idx}
            className="-ml-1 h-4 w-4 rounded-full first:ml-0"
            style={{ background: swatch, border: `1px solid ${colors.border}` }}
          />
        ))}
      </div>
    </div>
  );
}

function GalleryCard({ theme }: { theme: VisionTheme }): JSX.Element {
  const light = theme.colors.light;
  const dark = theme.colors.dark;

  return (
    <article
      className="flex flex-col overflow-hidden rounded-[14px] border"
      style={{
        background: light.surface,
        color: light.surfaceForeground,
        borderColor: light.border,
      }}
    >
      <div
        aria-hidden
        className="relative h-28 w-full overflow-hidden"
        style={{ background: light.background }}
      >
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${light.accent} 0%, transparent 55%), radial-gradient(120% 100% at 100% 100%, ${light.secondary} 0%, transparent 65%)`,
            opacity: 0.85,
          }}
        />
        <span
          className="absolute left-4 top-3 rounded-full px-2 py-0.5 text-[10px] uppercase tracking-[0.22em]"
          style={{
            background: light.surface,
            color: light.surfaceForeground,
            border: `1px solid ${light.border}`,
          }}
        >
          {theme.id}
        </span>
        <div
          className="absolute bottom-2 left-4 text-2xl"
          style={{
            fontFamily: theme.artisticPillars.typographyArchitecture.fontStack.display,
            color: light.foreground,
            letterSpacing: theme.artisticPillars.typographyArchitecture.letterSpacing.tight,
          }}
        >
          Aa
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="space-y-1">
          <h4
            className="text-lg leading-tight"
            style={{
              fontFamily: theme.artisticPillars.typographyArchitecture.fontStack.display,
              letterSpacing: theme.artisticPillars.typographyArchitecture.letterSpacing.tight,
            }}
          >
            {theme.name}
          </h4>
          <p className="text-[12px] font-medium leading-snug opacity-90">{theme.tagline}</p>
        </div>

        <p className="text-[12px] leading-relaxed opacity-75">{theme.summary}</p>

        <div className="flex flex-wrap gap-1.5">
          {theme.mood.map(word => (
            <span
              key={word}
              className="rounded-full px-2 py-0.5 text-[10px] uppercase tracking-[0.1em]"
              style={{ border: `1px solid ${light.border}` }}
            >
              {word}
            </span>
          ))}
        </div>

        <ul className="mt-auto space-y-1 pt-1 text-[11px] leading-relaxed opacity-80">
          {theme.bestFor.map(item => (
            <li key={item} className="flex gap-1.5">
              <span className="opacity-50">·</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-1.5 pt-1">
          <SwatchRow colors={light} label="Light" />
          <SwatchRow colors={dark} label="Dark" />
        </div>

        <div className="flex items-center justify-end pt-0.5">
          <span className="text-[9px] uppercase tracking-[0.16em] opacity-55">
            {primaryFont(theme.artisticPillars.typographyArchitecture.fontStack.display)}
          </span>
        </div>
      </div>
    </article>
  );
}

function ThemeGallery(): JSX.Element {
  const groups = groupThemesByFamily(visionThemes);

  return (
    <div className="min-h-screen bg-[var(--vde-color-background)] text-[var(--vde-color-foreground)]">
      <div className="mx-auto max-w-7xl space-y-12 p-6 md:p-10">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.24em] opacity-60">Theme Gallery</p>
          <h1 className="text-4xl [font-family:var(--vde-font-display)] [letter-spacing:var(--vde-letter-spacing-tight)]">
            {visionThemes.length} visions, {groups.length} families
          </h1>
          <p className="max-w-[70ch] text-sm leading-relaxed opacity-80">
            Every vision belongs to one family. Each card renders in its own colours and type so you can
            compare them side by side, then switch a project to any one with a single provider.
          </p>
        </header>

        {groups.map(({ family, themes }) => (
          <section key={family.id} className="space-y-5">
            <div className="flex flex-col gap-1 border-b pb-4 [border-color:var(--vde-color-border)]">
              <div className="flex flex-wrap items-baseline gap-3">
                <h2 className="text-2xl [font-family:var(--vde-font-display)] [letter-spacing:var(--vde-letter-spacing-tight)]">
                  {family.name}
                </h2>
                <span className="text-xs uppercase tracking-[0.18em] opacity-55">
                  {themes.length} {themes.length === 1 ? 'vision' : 'visions'}
                </span>
              </div>
              <p className="max-w-[70ch] text-sm leading-relaxed opacity-75">{family.description}</p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {themes.map(theme => (
                <GalleryCard key={theme.id} theme={theme} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

const meta = {
  title: 'Themes/Gallery',
  component: ThemeGallery,
  parameters: {
    vdeFrame: 'edge',
    docs: {
      description: {
        component:
          'The full catalogue, grouped into five families. Each family carries its own description; each card is rendered in the theme’s own colours and typography, driven entirely by the theme model.',
      },
    },
  },
} satisfies Meta<typeof ThemeGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Gallery: Story = {};
