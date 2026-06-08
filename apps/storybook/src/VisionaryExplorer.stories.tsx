import type { Meta, StoryObj } from '@storybook/react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Layout,
  NavigationOrb,
  getThemeFamily,
  useVision,
  visionThemes,
  type VisionTheme,
} from '@nikolayvalev/design-system';

interface PillarFact {
  detail: string;
  title: string;
}

function primaryFont(fontStack: string): string {
  const first = fontStack.split(',')[0] ?? fontStack;
  return first.trim().replace(/"/g, '');
}

/** Facts derived directly from the theme's artistic pillars — no hand-authored copy. */
function pillarFacts(theme: VisionTheme): PillarFact[] {
  const { typographyArchitecture, surfacePhysics, boundaryLogic, motionSignature } = theme.artisticPillars;

  return [
    {
      title: 'Typography',
      detail: `${primaryFont(typographyArchitecture.fontStack.display)} display · ${primaryFont(
        typographyArchitecture.fontStack.body
      )} body · spacing ${typographyArchitecture.letterSpacing.normal}.`,
    },
    {
      title: 'Motion',
      detail: `${motionSignature.physics} · ${motionSignature.duration.fast}/${motionSignature.duration.normal}/${motionSignature.duration.slow} cadence.`,
    },
    {
      title: 'Material',
      detail: `${surfacePhysics.blur} blur · grain ${surfacePhysics.grain} · ${boundaryLogic.borderWeight} borders · ${boundaryLogic.radius} radius.`,
    },
  ];
}

function ThemeExplorer(): JSX.Element {
  const { activeVision, activeVisionId, setVision, mode, toggleMode } = useVision();
  const family = getThemeFamily(activeVision.family);
  const facts = pillarFacts(activeVision);
  const swatches = [
    { label: 'Background', value: activeVision.colors[mode].background },
    { label: 'Surface', value: activeVision.colors[mode].surface },
    { label: 'Accent', value: activeVision.colors[mode].accent },
    { label: 'Secondary', value: activeVision.colors[mode].secondary },
    { label: 'Chart 1', value: activeVision.colors[mode].chart1 },
    { label: 'Chart 2', value: activeVision.colors[mode].chart2 },
  ];

  return (
    <div className="min-h-screen bg-[var(--vde-color-background)] text-[var(--vde-color-foreground)]">
      <div className="mx-auto max-w-7xl space-y-8 p-6 md:p-10">
        <header className="space-y-4 rounded-2xl border p-6 [border-color:var(--vde-color-border)] [background:var(--vde-color-surface)] [color:var(--vde-color-surface-foreground)]">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs uppercase tracking-[0.2em] opacity-70">Theme Explorer</p>
              {family ? <Badge variant="outline">{family.name}</Badge> : null}
            </div>
            <button
              type="button"
              onClick={toggleMode}
              className="rounded-full border px-3 py-1.5 text-xs transition-all [background:var(--vde-color-surface)] [color:var(--vde-color-surface-foreground)] [border-color:var(--vde-color-border)] hover:opacity-80"
            >
              {mode === 'light' ? 'Light' : 'Dark'}
            </button>
          </div>
          <h1 className="text-4xl [font-family:var(--vde-font-display)]">{activeVision.name}</h1>
          <p className="max-w-[70ch] text-base font-medium">{activeVision.tagline}</p>
          <p className="max-w-[70ch] text-sm opacity-85">{activeVision.summary}</p>
          <div className="flex flex-wrap gap-2 pt-1">
            {activeVision.mood.map(word => (
              <span
                key={word}
                className="rounded-full border px-2 py-1 text-[11px] uppercase tracking-[0.08em] [border-color:var(--vde-color-border)]"
              >
                {word}
              </span>
            ))}
          </div>
          <p className="text-xs uppercase tracking-[0.12em] opacity-70">
            Archetype: {activeVision.archetype} · Vision ID: {activeVisionId}
          </p>
          <nav className="flex flex-wrap gap-2 pt-2">
            {visionThemes.map(theme => (
              <button
                key={theme.id}
                type="button"
                onClick={() => setVision(theme.id)}
                className={`rounded-full border px-3 py-1.5 text-xs transition-all ${
                  activeVisionId === theme.id
                    ? '[background:var(--vde-color-accent)] [color:var(--vde-color-accent-foreground)] [border-color:var(--vde-color-accent)]'
                    : '[background:var(--vde-color-surface)] [color:var(--vde-color-surface-foreground)] [border-color:var(--vde-color-border)] opacity-80 hover:opacity-100'
                }`}
              >
                {theme.name}
              </button>
            ))}
          </nav>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <aside className="space-y-4 rounded-2xl border p-6 [border-color:var(--vde-color-border)] [background:var(--vde-color-surface)] [color:var(--vde-color-surface-foreground)]">
            <h3 className="text-sm uppercase tracking-[0.12em] opacity-80">Best for</h3>
            <ul className="space-y-2 text-sm leading-relaxed">
              {activeVision.bestFor.map(item => (
                <li key={item} className="flex gap-2">
                  <span className="opacity-60">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <h3 className="border-t pt-4 text-sm uppercase tracking-[0.12em] opacity-80 [border-color:var(--vde-color-border)]">
              Ornaments
            </h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant={activeVision.ornaments.grain ? 'secondary' : 'outline'}>
                Grain {activeVision.ornaments.grain ? 'on' : 'off'}
              </Badge>
              <Badge variant={activeVision.ornaments.glow ? 'secondary' : 'outline'}>
                Glow {activeVision.ornaments.glow ? 'on' : 'off'}
              </Badge>
              <Badge variant={activeVision.ornaments.texture ? 'secondary' : 'outline'}>
                Texture {activeVision.ornaments.texture ? 'on' : 'off'}
              </Badge>
            </div>
          </aside>

          <aside className="space-y-4 rounded-2xl border p-5 [border-color:var(--vde-color-border)] [background:var(--vde-color-surface)] [color:var(--vde-color-surface-foreground)]">
            <h3 className="text-sm uppercase tracking-[0.12em] opacity-80">Visual fingerprint</h3>
            <div className="grid grid-cols-2 gap-3">
              {swatches.map(swatch => (
                <div key={swatch.label} className="space-y-1">
                  <div
                    className="h-10 w-full rounded-md border [border-color:var(--vde-color-border)]"
                    style={{ background: swatch.value }}
                  />
                  <p className="text-[11px] font-medium">{swatch.label}</p>
                  <p className="text-[10px] opacity-70">{swatch.value}</p>
                </div>
              ))}
            </div>
          </aside>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {facts.map(fact => (
            <article
              key={fact.title}
              className="rounded-2xl border p-5 [border-color:var(--vde-color-border)] [background:var(--vde-color-surface)] [color:var(--vde-color-surface-foreground)]"
            >
              <h3 className="text-xs uppercase tracking-[0.12em] opacity-75">{fact.title}</h3>
              <p className="mt-3 text-sm leading-relaxed">{fact.detail}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <Layout heading="Component preview" className="mx-0 max-w-none">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Interaction snapshot</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Button variant="default">Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="explorer-search">Search</Label>
                    <Input id="explorer-search" placeholder={`Search ${activeVision.name}…`} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Navigation rhythm</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative min-h-[200px] rounded-xl border p-4 [border-color:var(--vde-color-border)]">
                    <NavigationOrb
                      className="absolute bottom-3 right-3"
                      defaultOpen
                      floating={false}
                      items={[
                        { id: 'overview', label: 'Overview' },
                        { id: 'tokens', label: 'Tokens' },
                        { id: 'preview', label: 'Preview' },
                      ]}
                      label={`${activeVision.name} navigation`}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </Layout>

          <aside className="space-y-3 rounded-2xl border p-5 [border-color:var(--vde-color-border)] [background:var(--vde-color-surface)] [color:var(--vde-color-surface-foreground)]">
            <h3 className="text-sm uppercase tracking-[0.12em] opacity-80">In one line</h3>
            <p className="text-sm leading-relaxed">{activeVision.tagline}</p>
            <p className="text-xs leading-relaxed opacity-70">
              Same token contract as every other vision — switch the toolbar paintbrush to compare.
            </p>
          </aside>
        </section>
      </div>
    </div>
  );
}

const meta = {
  title: 'Themes/Explorer',
  component: ThemeExplorer,
  parameters: {
    vdeFrame: 'edge',
    docs: {
      description: {
        component:
          'Interactive guide to the curated visions. Every field — tagline, summary, best-for, mood, family, and the derived typography/motion/material facts — is read straight from the theme model.',
      },
    },
  },
} satisfies Meta<typeof ThemeExplorer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
