import type { Meta, StoryObj } from '@storybook/react';
import { useVision, visionThemes, type VisionTheme } from '@nikolayvalev/design-system';

interface ThemeBlurb {
  motif: string;
  tone: string;
}

const BLURBS: Record<string, ThemeBlurb> = {
  museum: { motif: 'Curatorial Paper', tone: 'editorial / heritage' },
  swiss_international: { motif: 'Grid Discipline', tone: 'systemic / neutral' },
  raw_data: { motif: 'Anti-Polish', tone: 'shock / signal' },
  the_archive: { motif: 'Institutional Memory', tone: 'scholarly / warm' },
  the_ether: { motif: 'Frosted Glass', tone: 'ambient / spectral' },
  solarpunk: { motif: 'Civic Optimism', tone: 'eco / hopeful' },
  y2k_chrome: { motif: 'Reflective Pop', tone: 'flashy / nostalgic' },
  deconstruct: { motif: 'Controlled Disorder', tone: 'fragmented / loud' },
  ma_minimalism: { motif: 'Negative Space', tone: 'quiet / measured' },
  clay_soft: { motif: 'Tactile Softness', tone: 'rounded / friendly' },
  zine_collage: { motif: 'Paper Cuts', tone: 'handmade / playful' },
  brutalist: { motif: 'Steel Frame', tone: 'direct / structural' },
  immersive: { motif: 'Depth Field', tone: 'cinematic / fluid' },
  editorial: { motif: 'Column Rhythm', tone: 'narrative / polished' },
  zen: { motif: 'Still Frame', tone: 'calm / focused' },
  synthwave: { motif: 'Neon Horizon', tone: 'retro-future / electric' },
  aurora: { motif: 'Atmospheric Band', tone: 'ethereal / luminous' },
  noir: { motif: 'Spotlight Cut', tone: 'moody / dramatic' },
  parchment: { motif: 'Aged Sheet', tone: 'historic / textural' },
  terminal: { motif: 'Prompt Cursor', tone: 'code-native / utilitarian' },
};

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
  const blurb = BLURBS[theme.id] ?? { motif: theme.archetype, tone: 'token-driven' };
  const swatches = [
    theme.colors.background,
    theme.colors.surface,
    theme.colors.accent,
    theme.colors.secondary,
    theme.colors.chart1,
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
        background: theme.colors.surface,
        color: theme.colors.surfaceForeground,
        borderColor: isActive ? theme.colors.accent : theme.colors.border,
        borderWidth: isActive ? 2 : 1,
      }}
    >
      <div
        aria-hidden
        className="relative h-32 w-full overflow-hidden"
        style={{ background: theme.colors.background }}
      >
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${theme.colors.accent} 0%, transparent 55%), radial-gradient(120% 100% at 100% 100%, ${theme.colors.secondary} 0%, transparent 65%)`,
            opacity: 0.85,
          }}
        />
        <div className="absolute inset-x-4 top-4 flex items-center justify-between text-[10px] uppercase tracking-[0.22em]">
          <span
            className="rounded-full px-2 py-0.5"
            style={{
              background: theme.colors.surface,
              color: theme.colors.surfaceForeground,
              border: `1px solid ${theme.colors.border}`,
            }}
          >
            {theme.id}
          </span>
          {isActive ? (
            <span
              className="rounded-full px-2 py-0.5 text-[9px]"
              style={{
                background: theme.colors.accent,
                color: theme.colors.accentForeground,
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
            color: theme.colors.foreground,
            letterSpacing: theme.artisticPillars.typographyArchitecture.letterSpacing.tight,
          }}
        >
          Aa
        </div>
      </div>

      <div className="space-y-3 p-4">
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-[0.22em] opacity-60">{blurb.tone}</p>
          <h4
            className="text-lg leading-tight"
            style={{
              fontFamily: theme.artisticPillars.typographyArchitecture.fontStack.display,
              letterSpacing: theme.artisticPillars.typographyArchitecture.letterSpacing.tight,
            }}
          >
            {theme.name}
          </h4>
          <p className="text-[11px] leading-relaxed opacity-75">{blurb.motif}</p>
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
                  borderColor: theme.colors.border,
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
  const { activeVision, activeVisionId, setVision } = useVision();
  const counts = {
    themes: visionThemes.length,
    components: 12,
    sections: 3,
  };

  return (
    <div className="space-y-12">
      <section className="relative overflow-hidden rounded-[20px] border [border-color:var(--vde-color-border)] [background:var(--vde-color-surface)] [color:var(--vde-color-surface-foreground)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background: `radial-gradient(60% 80% at 0% 0%, ${activeVision.colors.accent}, transparent 60%), radial-gradient(70% 90% at 100% 100%, ${activeVision.colors.secondary}, transparent 65%)`,
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
              Twenty visions.
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
                <dd
                  className="text-3xl"
                  style={{ fontFamily: 'var(--vde-font-display)' }}
                >
                  {counts.themes}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.18em] opacity-55">Components</dt>
                <dd className="text-3xl" style={{ fontFamily: 'var(--vde-font-display)' }}>
                  {counts.components}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.18em] opacity-55">Sections</dt>
                <dd className="text-3xl" style={{ fontFamily: 'var(--vde-font-display)' }}>
                  {counts.sections}
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
            body: 'Colors, typography, motion, surface physics — every primitive consumes CSS variables emitted by the VisionProvider.',
          },
          {
            n: '02',
            title: 'Vision Switch',
            body: 'Swap the entire design language at runtime. No re-render of structure, no recompile — just a single context change.',
          },
          {
            n: '03',
            title: 'Composable Sections',
            body: 'Hero, FeatureGrid, MetricStrip and full Page templates compose primitives without locking you into a layout.',
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
        <article
          className="rounded-[14px] border [border-color:var(--vde-color-border)] [background:var(--vde-color-surface)] [color:var(--vde-color-surface-foreground)] p-6 space-y-4"
        >
          <p className="text-[10px] uppercase tracking-[0.28em] opacity-55">04 · Navigation Guide</p>
          <h3
            className="text-xl"
            style={{ fontFamily: 'var(--vde-font-display)', letterSpacing: 'var(--vde-letter-spacing-tight)' }}
          >
            What's in the sidebar
          </h3>
          <ul className="space-y-2 text-sm leading-relaxed opacity-80 list-none p-0 m-0">
            <li><strong>Introduction</strong> — you are here. Theme switcher and system overview.</li>
            <li><strong>Primitives</strong> — Button, Card, Input, Layout, EditorialHeader, NavigationOrb, MediaFrame, GalleryStage, AtmosphereProvider.</li>
            <li><strong>Sections</strong> — HeroSection, FeatureGridSection, MetricStripSection. Compose into pages.</li>
            <li><strong>Pages</strong> — MarketingLandingPage, ProductShowcasePage. Full page templates.</li>
            <li><strong>VDE</strong> — VisionaryExplorer. Deep dive into all 20 themes.</li>
          </ul>
        </article>

        <article
          className="rounded-[14px] border [border-color:var(--vde-color-border)] [background:var(--vde-color-surface)] [color:var(--vde-color-surface-foreground)] p-6 space-y-4"
        >
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
        <span>Sidebar ←  Visions, components, sections, pages</span>
      </footer>
    </div>
  );
}

const meta = {
  title: 'Introduction/Overview',
  component: OverviewContent,
  tags: ['autodocs'],
  parameters: {
    vdeFrame: 'edge',
    docs: { disable: true },
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
