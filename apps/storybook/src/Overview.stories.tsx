import type { Meta, StoryObj } from '@storybook/react';
import { useVision, visionThemes, themeFamilies, type VisionTheme } from '@nikolayvalev/design-system';

function primary(stack: string): string {
  const first = stack.split(',')[0] ?? stack;
  return first.trim().replace(/"/g, '');
}

function ThemeTile({
  theme,
  isActive,
  onSelect,
}: {
  theme: VisionTheme;
  isActive: boolean;
  onSelect: () => void;
}): JSX.Element {
  // Each tile renders in its own default mode to show its true character.
  const colors = theme.colors[theme.defaultMode];
  const swatches = [
    colors.background,
    colors.surface,
    colors.accent,
    colors.secondary,
    colors.chart1,
  ];

  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        'group relative flex flex-col overflow-hidden rounded-[14px] border text-left transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--vde-color-ring)] focus-visible:ring-offset-2',
        isActive
          ? 'shadow-[0_24px_60px_-30px_rgba(0,0,0,0.45)] -translate-y-0.5'
          : 'hover:-translate-y-0.5 hover:shadow-[0_18px_44px_-30px_rgba(0,0,0,0.35)]',
      ].join(' ')}
      style={{
        background: colors.surface,
        color: colors.surfaceForeground,
        borderColor: isActive ? colors.accent : colors.border,
        borderWidth: isActive ? 2 : 1,
      }}
    >
      <div
        aria-hidden
        className="relative h-32 w-full overflow-hidden"
        style={{ background: colors.background }}
      >
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${colors.accent} 0%, transparent 55%), radial-gradient(120% 100% at 100% 100%, ${colors.secondary} 0%, transparent 65%)`,
            opacity: 0.85,
          }}
        />
        <div className="absolute inset-x-4 top-4 flex items-center justify-between text-[10px] uppercase tracking-[0.22em]">
          <span
            className="rounded-full px-2 py-0.5"
            style={{
              background: colors.surface,
              color: colors.surfaceForeground,
              border: `1px solid ${colors.border}`,
            }}
          >
            {theme.id}
          </span>
          {isActive ? (
            <span
              className="rounded-full px-2 py-0.5 text-[9px]"
              style={{
                background: colors.accent,
                color: colors.accentForeground,
              }}
            >
              active
            </span>
          ) : null}
        </div>
        <div
          className="absolute bottom-3 left-4 text-2xl"
          style={{
            fontFamily: theme.artisticPillars.typographyArchitecture.fontStack.display,
            color: colors.foreground,
            letterSpacing: theme.artisticPillars.typographyArchitecture.letterSpacing.tight,
          }}
        >
          Aa
        </div>
      </div>

      <div className="space-y-3 p-4">
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-[0.22em] opacity-60">{theme.mood.join(' · ')}</p>
          <h4
            className="text-lg leading-tight"
            style={{
              fontFamily: theme.artisticPillars.typographyArchitecture.fontStack.display,
              letterSpacing: theme.artisticPillars.typographyArchitecture.letterSpacing.tight,
            }}
          >
            {theme.name}
          </h4>
          <p className="text-[11px] leading-relaxed opacity-75">{theme.tagline}</p>
        </div>

        <div className="flex items-center justify-between gap-2 pt-2">
          <div className="flex">
            {swatches.map((swatch, idx) => (
              <span
                key={`${theme.id}-sw-${idx}`}
                className="-ml-1.5 h-5 w-5 rounded-full first:ml-0"
                style={{
                  background: swatch,
                  borderWidth: 1,
                  borderStyle: 'solid',
                  borderColor: colors.border,
                }}
              />
            ))}
          </div>
          <span className="text-[9px] uppercase tracking-[0.18em] opacity-55">
            {primary(theme.artisticPillars.typographyArchitecture.fontStack.display)}
          </span>
        </div>
      </div>
    </button>
  );
}

function OverviewContent(): JSX.Element {
  const { activeVision, activeVisionId, setVision, mode } = useVision();
  const counts = {
    themes: visionThemes.length,
    families: themeFamilies.length,
    primitives: 8,
  };

  return (
    <div className="space-y-12">
      <section className="relative overflow-hidden rounded-[20px] border [border-color:var(--vde-color-border)] [background:var(--vde-color-surface)] [color:var(--vde-color-surface-foreground)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background: `radial-gradient(60% 80% at 0% 0%, ${activeVision.colors[mode].accent}, transparent 60%), radial-gradient(70% 90% at 100% 100%, ${activeVision.colors[mode].secondary}, transparent 65%)`,
            mixBlendMode: 'multiply',
          }}
        />
        <div className="relative grid gap-10 p-8 md:grid-cols-[1.4fr_1fr] md:p-12">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--vde-color-accent)]" />
              <p className="text-[10px] uppercase tracking-[0.34em] opacity-70">
                Visionary Design Engine · v0.1
              </p>
            </div>
            <h1
              className="text-5xl leading-[1.02] md:text-6xl lg:text-7xl"
              style={{
                fontFamily: 'var(--vde-font-display)',
                letterSpacing: 'var(--vde-letter-spacing-tight)',
              }}
            >
              {counts.themes} visions, {counts.families} families.
              <br />
              <span style={{ color: 'var(--vde-color-accent)' }}>One contract.</span>
            </h1>
            <p className="max-w-[58ch] text-base leading-relaxed opacity-85 md:text-lg">
              A token-driven design system that swaps its entire identity — typography, surface physics, motion, ornament —
              from a single provider. Every component reads from the active vision; nothing is hardcoded.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="rounded-full border px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] [border-color:var(--vde-color-border)]">
                Active · {activeVision.name}
              </span>
              <span className="rounded-full border px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] [border-color:var(--vde-color-border)] opacity-70">
                Use the toolbar paintbrush ↑ to switch
              </span>
            </div>
          </div>
          <aside className="relative space-y-4 self-end rounded-[16px] border [border-color:var(--vde-color-border)] [background:var(--vde-color-background)] [color:var(--vde-color-foreground)] p-6">
            <p className="text-[10px] uppercase tracking-[0.28em] opacity-60">Counts</p>
            <dl className="grid grid-cols-3 gap-4">
              <div>
                <dt className="text-[10px] uppercase tracking-[0.18em] opacity-55">Visions</dt>
                <dd className="text-3xl" style={{ fontFamily: 'var(--vde-font-display)' }}>
                  {counts.themes}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.18em] opacity-55">Families</dt>
                <dd className="text-3xl" style={{ fontFamily: 'var(--vde-font-display)' }}>
                  {counts.families}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.18em] opacity-55">Primitives</dt>
                <dd className="text-3xl" style={{ fontFamily: 'var(--vde-font-display)' }}>
                  {counts.primitives}
                </dd>
              </div>
            </dl>
            <div className="space-y-2 border-t pt-4 [border-color:var(--vde-color-border)] text-xs leading-relaxed opacity-80">
              <p className="flex items-center justify-between">
                <span>Display</span>
                <span className="font-mono opacity-70">
                  {primary(activeVision.artisticPillars.typographyArchitecture.fontStack.display)}
                </span>
              </p>
              <p className="flex items-center justify-between">
                <span>Body</span>
                <span className="font-mono opacity-70">
                  {primary(activeVision.artisticPillars.typographyArchitecture.fontStack.body)}
                </span>
              </p>
              <p className="flex items-center justify-between">
                <span>Mono</span>
                <span className="font-mono opacity-70">
                  {primary(activeVision.artisticPillars.typographyArchitecture.fontStack.mono)}
                </span>
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.32em] opacity-60">02 · The Atlas</p>
            <h2
              className="mt-2 text-3xl md:text-4xl"
              style={{
                fontFamily: 'var(--vde-font-display)',
                letterSpacing: 'var(--vde-letter-spacing-tight)',
              }}
            >
              Pick a vision to make it the active context
            </h2>
          </div>
          <p className="max-w-[36ch] text-xs leading-relaxed opacity-70">
            Each tile previews its own typography and palette. Selecting one updates the entire Storybook below.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visionThemes.map(theme => (
            <ThemeTile
              key={theme.id}
              theme={theme}
              isActive={theme.id === activeVisionId}
              onSelect={() => setVision(theme.id)}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {[
          {
            n: '01',
            title: 'Token Contract',
            body: 'Colours, typography, motion, surface physics — every primitive consumes CSS variables emitted by the VisionProvider.',
          },
          {
            n: '02',
            title: 'Vision Switch',
            body: 'Swap the entire design language at runtime. No re-render of structure, no recompile — just a single context change.',
          },
          {
            n: '03',
            title: 'Grouped Families',
            body: 'Twelve visions organised into five families, each with its own description — a deliberate taxonomy, not a flat dump.',
          },
        ].map(point => (
          <article
            key={point.n}
            className="rounded-[14px] border [border-color:var(--vde-color-border)] [background:var(--vde-color-surface)] [color:var(--vde-color-surface-foreground)] p-6"
          >
            <p className="text-[10px] uppercase tracking-[0.28em] opacity-55">Principle {point.n}</p>
            <h3
              className="mt-2 text-xl"
              style={{
                fontFamily: 'var(--vde-font-display)',
                letterSpacing: 'var(--vde-letter-spacing-tight)',
              }}
            >
              {point.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed opacity-80">{point.body}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-[14px] border [border-color:var(--vde-color-border)] [background:var(--vde-color-surface)] [color:var(--vde-color-surface-foreground)] p-6 space-y-4">
          <p className="text-[10px] uppercase tracking-[0.28em] opacity-55">04 · Navigation Guide</p>
          <h3
            className="text-xl"
            style={{ fontFamily: 'var(--vde-font-display)', letterSpacing: 'var(--vde-letter-spacing-tight)' }}
          >
            What's in the sidebar
          </h3>
          <ul className="space-y-2 text-sm leading-relaxed opacity-80 list-none p-0 m-0">
            <li><strong>Foundations</strong> — you are here. System overview and the theme atlas.</li>
            <li><strong>Themes</strong> — the {counts.themes} visions grouped into {counts.families} families, plus an interactive explorer.</li>
            <li><strong>Components</strong> — core primitives: Button, Card, Input, Textarea, Checkbox, Label, Badge, Layout.</li>
            <li><strong>Showcase</strong> — expressive components, sections, and full page templates.</li>
          </ul>
        </article>

        <article className="rounded-[14px] border [border-color:var(--vde-color-border)] [background:var(--vde-color-surface)] [color:var(--vde-color-surface-foreground)] p-6 space-y-4">
          <p className="text-[10px] uppercase tracking-[0.28em] opacity-55">05 · Install via MCP</p>
          <h3
            className="text-xl"
            style={{ fontFamily: 'var(--vde-font-display)', letterSpacing: 'var(--vde-letter-spacing-tight)' }}
          >
            Components install as source
          </h3>
          <p className="text-sm leading-relaxed opacity-80">
            Components are not imported from npm — they're installed as source files into your repo via MCP, then committed.
            Wire your AI client to the MCP server and ask it to install any component you see here.
          </p>
          <code
            className="block rounded-[8px] border [border-color:var(--vde-color-border)] [background:var(--vde-color-background)] p-3 text-[11px] leading-relaxed opacity-90"
            style={{ fontFamily: 'var(--vde-font-mono, monospace)' }}
          >
            {`{ "mcpServers": { "design-system": { "url": "https://designsystem.nikolayvalev.com/mcp" } } }`}
          </code>
        </article>
      </section>

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t pt-6 [border-color:var(--vde-color-border)] text-[11px] uppercase tracking-[0.22em] opacity-60">
        <span>Visionary Design Engine</span>
        <span>Sidebar ←  Foundations · Themes · Components · Showcase</span>
      </footer>
    </div>
  );
}

const meta = {
  title: 'Foundations/Overview',
  component: OverviewContent,
  parameters: {
    vdeFrame: 'edge',
  },
} satisfies Meta<typeof OverviewContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Welcome: Story = {
  render: () => (
    <div className="mx-auto max-w-[1240px] px-8 py-12 md:px-12 md:py-16">
      <OverviewContent />
    </div>
  ),
};
