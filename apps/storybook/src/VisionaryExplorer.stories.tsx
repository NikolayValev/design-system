import type { Meta, StoryObj } from '@storybook/react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Layout,
  NavigationOrb,
  useVision,
  visionThemes,
  type VisionTheme,
} from '@nikolayvalev/design-system';

interface ThemePersonality {
  headline: string;
  mood: string[];
  motif: string;
  orbItems: string[];
  prompt: string;
  signatureUse: string;
  stageClass: string;
  strengths: string[];
  summary: string;
}

interface StrengthItem {
  detail: string;
  title: string;
}

const THEME_PERSONALITIES: Record<string, ThemePersonality> = {
  swiss_international: {
    headline: 'Clarity Through Grid Discipline',
    mood: ['ordered', 'neutral', 'precise'],
    motif: 'modular grid',
    orbItems: ['Grid', 'Ratios', 'System'],
    prompt: 'Search timetable or route',
    signatureUse: 'Enterprise dashboards and information-heavy systems that must stay legible at scale.',
    stageClass: 'bg-slate-50/80',
    strengths: [
      'Layouts stay coherent under dense content and complex hierarchies.',
      'Typographic rhythm favors readability before decoration.',
      'Interaction states stay restrained and deterministic.',
    ],
    summary: 'Swiss International turns complexity into structure with sober spacing, strict alignment, and low-noise contrast.',
  },
  raw_data: {
    headline: 'Radical Contrast, No Polishing',
    mood: ['raw', 'loud', 'confrontational'],
    motif: 'hard offset',
    orbItems: ['Signal', 'Edges', 'Shock'],
    prompt: 'Enter command payload',
    signatureUse: 'Brand activations and bold campaigns where visual force matters more than subtlety.',
    stageClass: 'bg-lime-100/70',
    strengths: [
      'High contrast states make hierarchy immediately obvious.',
      'Hard borders and offsets create aggressive visual affordances.',
      'Motion favors direct snaps over eased transitions.',
    ],
    summary: 'RAW_DATA is deliberately anti-polish, built to feel immediate, unapologetic, and impossible to ignore.',
  },
  the_archive: {
    headline: 'Institutional Memory In Interface Form',
    mood: ['scholarly', 'archival', 'timeless'],
    motif: 'paper grain',
    orbItems: ['Records', 'Catalog', 'Notes'],
    prompt: 'Find archival reference',
    signatureUse: 'Publishing, museums, and long-form editorial products with historical framing.',
    stageClass: 'bg-amber-100/60',
    strengths: [
      'Warm material cues make long reading sessions feel intentional.',
      'Serif-forward typography supports narrative authority.',
      'Subtle motion keeps attention on content rather than chrome.',
    ],
    summary: 'The Archive emphasizes continuity and provenance, turning digital surfaces into trustworthy reference spaces.',
  },
  the_ether: {
    headline: 'Luminous Glass With Spatial Depth',
    mood: ['ambient', 'floating', 'spectral'],
    motif: 'frosted pane',
    orbItems: ['Layers', 'Light', 'Depth'],
    prompt: 'Locate floating workspace',
    signatureUse: 'Premium immersive experiences and speculative UI concept work.',
    stageClass: 'bg-cyan-100/35',
    strengths: [
      'Blur and translucency separate foreground from atmospheric depth.',
      'Glow systems communicate interactive focus without hard outlines.',
      'Motion feels buoyant, not mechanical.',
    ],
    summary: 'The Ether is designed for depth-first interfaces where light and layering define orientation.',
  },
  solarpunk: {
    headline: 'Optimism Engineered Into UI',
    mood: ['hopeful', 'organic', 'clean-tech'],
    motif: 'sun grid',
    orbItems: ['Climate', 'Energy', 'Future'],
    prompt: 'Check community energy status',
    signatureUse: 'Civic tools, climate products, and futures-focused public platforms.',
    stageClass: 'bg-emerald-100/60',
    strengths: [
      'Eco-forward color language signals progress and trust.',
      'Soft contrast avoids alarm while staying informative.',
      'Compositions balance utility with warmth.',
    ],
    summary: 'Solarpunk frames digital tools as constructive systems for communities, sustainability, and shared agency.',
  },
  y2k_chrome: {
    headline: 'Reflective Pop Futurism',
    mood: ['flashy', 'synthetic', 'nostalgic-future'],
    motif: 'chrome flare',
    orbItems: ['Shine', 'Pop', 'Retro'],
    prompt: 'Open chrome profile card',
    signatureUse: 'Fashion, entertainment, and youth-centric products needing high visual energy.',
    stageClass: 'bg-sky-100/50',
    strengths: [
      'Specular accents create immediate visual signatures.',
      'Playful saturation differentiates key actions from body content.',
      'Strong ornamental identity supports campaign storytelling.',
    ],
    summary: 'Y2K Chrome amplifies spectacle with metallic highlights, hyper-clean gradients, and unapologetic pop cues.',
  },
  deconstruct: {
    headline: 'Controlled Disorder For Expressive Systems',
    mood: ['fragmented', 'experimental', 'asymmetric'],
    motif: 'broken frame',
    orbItems: ['Fragments', 'Offsets', 'Cutlines'],
    prompt: 'Inject fragmented module',
    signatureUse: 'Experimental portfolios and cultural products with anti-template direction.',
    stageClass: 'bg-rose-100/45',
    strengths: [
      'Asymmetry creates narrative tension without losing function.',
      'Layer collisions can emphasize editorial sequencing.',
      'Deliberate disruption makes ordinary components feel authored.',
    ],
    summary: 'Deconstruct abandons rigid regularity in favor of expressive composition and intentional rupture.',
  },
  ma_minimalism: {
    headline: 'Whitespace As Primary Interface',
    mood: ['quiet', 'measured', 'essential'],
    motif: 'negative space',
    orbItems: ['Calm', 'Rhythm', 'Pause'],
    prompt: 'Write short intentional note',
    signatureUse: 'Mindfulness, premium services, and products where calm clarity is a core value.',
    stageClass: 'bg-stone-100/70',
    strengths: [
      'Sparse composition increases perceptual breathing room.',
      'Low ornament allows content and intent to lead.',
      'Motion remains subtle and respectful.',
    ],
    summary: 'Ma Minimalism makes emptiness functional by treating spacing, pace, and silence as design primitives.',
  },
  clay_soft: {
    headline: 'Tactile Softness Without Losing Utility',
    mood: ['rounded', 'friendly', 'handcrafted'],
    motif: 'soft mound',
    orbItems: ['Touch', 'Softness', 'Warmth'],
    prompt: 'Describe your project tone',
    signatureUse: 'Consumer products and onboarding flows that prioritize approachability.',
    stageClass: 'bg-orange-100/55',
    strengths: [
      'Rounded surfaces reduce intimidation in first-use contexts.',
      'Material softness supports welcoming brand voice.',
      'UI still retains clear interaction boundaries.',
    ],
    summary: 'Clay Soft mixes tactile warmth with modern component rigor for inviting, low-friction experiences.',
  },
  zine_collage: {
    headline: 'Handmade Energy, Digital Medium',
    mood: ['cutout', 'editorial-chaos', 'playful'],
    motif: 'paper cut',
    orbItems: ['Clips', 'Layers', 'Paste'],
    prompt: 'Drop headline fragment',
    signatureUse: 'Creative communities, magazines, and cultural releases that need personality over polish.',
    stageClass: 'bg-fuchsia-100/45',
    strengths: [
      'Layered artifacts create distinct visual voice quickly.',
      'Imperfect rhythm adds human texture to digital layouts.',
      'Strong collage cues support expressive storytelling.',
    ],
    summary: 'Zine Collage embraces assembled imperfection to produce unmistakable authorial character.',
  },
  museum: {
    headline: 'Editorial Heritage, Refined Pace',
    mood: ['warm', 'curated', 'literary'],
    motif: 'curatorial panel',
    orbItems: ['Essays', 'Material', 'Index'],
    prompt: 'Search collection annotation',
    signatureUse: 'Museum-like storytelling, journals, and premium long-form reading products.',
    stageClass: 'bg-amber-50/80',
    strengths: [
      'Serif architecture lends gravity to headings and narratives.',
      'Archival warmth makes interfaces feel tangible.',
      'Measured timing improves reading-focused flows.',
    ],
    summary: 'Museum channels print-era discipline with modern token systems for trustworthy, cultivated experiences.',
  },
  brutalist: {
    headline: 'Function First, Decor Last',
    mood: ['direct', 'structural', 'assertive'],
    motif: 'steel frame',
    orbItems: ['Blocks', 'Weight', 'Signal'],
    prompt: 'Enter raw metric key',
    signatureUse: 'Internal tools, data terminals, and anti-marketing products with hard utility focus.',
    stageClass: 'bg-zinc-200/70',
    strengths: [
      'Hard geometry communicates boundaries instantly.',
      'No-frills states improve scan speed for repeated tasks.',
      'Contrast and weight reduce ambiguity in dense UIs.',
    ],
    summary: 'Brutalist strips styling to structural essentials so interaction intent is obvious at first glance.',
  },
  immersive: {
    headline: 'Cinematic Interface Depth',
    mood: ['atmospheric', 'fluid', 'high-fidelity'],
    motif: 'depth field',
    orbItems: ['Scene', 'Flow', 'Focus'],
    prompt: 'Launch immersive session',
    signatureUse: 'Media products, immersive onboarding, and premium storytelling canvases.',
    stageClass: 'bg-indigo-100/35',
    strengths: [
      'Layered backgrounds create strong spatial orientation.',
      'Glow and blur guide focus without harsh separators.',
      'Longer eased motion supports cinematic pacing.',
    ],
    summary: 'Immersive treats the page as a stage, using light, depth, and velocity to shape attention.',
  },
  editorial: {
    headline: 'Magazine Systems For Digital Narratives',
    mood: ['polished', 'authoritative', 'narrative'],
    motif: 'column rhythm',
    orbItems: ['Lead', 'Deck', 'Pullquote'],
    prompt: 'Draft editorial standfirst',
    signatureUse: 'Newsrooms, publishing suites, and productized long-form content.',
    stageClass: 'bg-neutral-100/75',
    strengths: [
      'Hierarchy-driven typography mirrors professional publishing.',
      'Balanced spacing supports scannable long-form layouts.',
      'Component vocabulary suits content-first teams.',
    ],
    summary: 'Editorial provides a publication-grade baseline where text hierarchy and story pacing remain central.',
  },
  zen: {
    headline: 'Low-Stimulus Focused Interaction',
    mood: ['calm', 'balanced', 'intentional'],
    motif: 'still frame',
    orbItems: ['Focus', 'Breath', 'Flow'],
    prompt: 'Capture your next mindful task',
    signatureUse: 'Productivity, wellness, and intentional-use applications.',
    stageClass: 'bg-emerald-50/75',
    strengths: [
      'Muted energy levels reduce cognitive overhead.',
      'Simple geometry keeps user attention on tasks.',
      'Soft pacing supports sustained concentration.',
    ],
    summary: 'Zen minimizes stimulus so interfaces feel steady, focused, and mentally lightweight.',
  },
  synthwave: {
    headline: 'Neon Drama With Clear Intent',
    mood: ['retro-future', 'electric', 'night-mode'],
    motif: 'neon horizon',
    orbItems: ['Pulse', 'Neon', 'Night'],
    prompt: 'Open after-dark mode',
    signatureUse: 'Entertainment interfaces, music tools, and expressive dark-theme products.',
    stageClass: 'bg-purple-100/40',
    strengths: [
      'Vivid glow signatures create memorable action points.',
      'Dark base plus neon accents maintains contrast hierarchy.',
      'Motion energy reinforces a live, energetic feel.',
    ],
    summary: 'Synthwave balances nostalgia and legibility through neon accents, dark fields, and rhythmic transitions.',
  },
  aurora: {
    headline: 'Atmospheric Gradients, Gentle Energy',
    mood: ['ethereal', 'luminous', 'fresh'],
    motif: 'aurora band',
    orbItems: ['Spectrum', 'Drift', 'Glow'],
    prompt: 'Start atmospheric workspace',
    signatureUse: 'Modern brand products needing softness without looking generic.',
    stageClass: 'bg-teal-100/45',
    strengths: [
      'Gradient-led surfaces add depth with low visual aggression.',
      'Color movement feels alive while staying professional.',
      'Balanced contrast keeps long-session usability intact.',
    ],
    summary: 'Aurora brings atmospheric motion and color drift into practical UI systems without sacrificing clarity.',
  },
  noir: {
    headline: 'Dark Precision, Editorial Tension',
    mood: ['moody', 'high-contrast', 'dramatic'],
    motif: 'spotlight cut',
    orbItems: ['Contrast', 'Shadow', 'Edge'],
    prompt: 'Query noir scenario',
    signatureUse: 'Premium dark products, creative tooling, and cinematic admin experiences.',
    stageClass: 'bg-slate-300/35',
    strengths: [
      'Tight dark/light relationships sharpen visual hierarchy.',
      'Reduced palette keeps attention on key interactions.',
      'Strong typographic contrast supports dramatic tone.',
    ],
    summary: 'Noir is a high-contrast dark system that privileges focus, mood, and selective emphasis.',
  },
  parchment: {
    headline: 'Scholarly Warmth And Text Fidelity',
    mood: ['historic', 'quiet', 'textural'],
    motif: 'aged sheet',
    orbItems: ['Manuscript', 'Annotations', 'Marginalia'],
    prompt: 'Find passage and citation',
    signatureUse: 'Documentation, knowledge repositories, and reader-first environments.',
    stageClass: 'bg-yellow-100/65',
    strengths: [
      'Warm paper tones reduce sterile digital feel.',
      'Typography favors reading endurance over spectacle.',
      'Material texture adds context without distraction.',
    ],
    summary: 'Parchment is optimized for reading gravity, scholarly pacing, and durable text presentation.',
  },
  terminal: {
    headline: 'Command-Line Certainty In UI Form',
    mood: ['utilitarian', 'code-native', 'deterministic'],
    motif: 'prompt cursor',
    orbItems: ['Command', 'Logs', 'Output'],
    prompt: 'Enter shell command',
    signatureUse: 'Developer tools, infra consoles, and operational control surfaces.',
    stageClass: 'bg-green-100/50',
    strengths: [
      'Monospace hierarchy improves parameter and data alignment.',
      'Binary visual language reduces ambiguity in system actions.',
      'Minimal decoration keeps throughput high for expert users.',
    ],
    summary: 'Terminal prioritizes speed, precision, and semantic clarity for technical workflows.',
  },
};

const FALLBACK_PERSONALITY: ThemePersonality = {
  headline: 'Token-Driven Design Identity',
  mood: ['consistent', 'adaptive', 'systemic'],
  motif: 'semantic contract',
  orbItems: ['Theme', 'Tokens', 'Traits'],
  prompt: 'Enter value',
  signatureUse: 'General-purpose product interfaces.',
  stageClass: 'bg-slate-100/70',
  strengths: [
    'Consistent semantics across components.',
    'Predictable interactions under theme changes.',
    'Composable styles for scalable systems.',
  ],
  summary: 'This theme is rendered from the same token contract and remains interoperable with all core components.',
};

function getPersonality(themeId: string): ThemePersonality {
  return THEME_PERSONALITIES[themeId] ?? FALLBACK_PERSONALITY;
}

function primaryFont(fontStack: string): string {
  const first = fontStack.split(',')[0] ?? fontStack;
  return first.trim().replace(/"/g, '');
}

function summarizeStrengths(theme: VisionTheme, personality: ThemePersonality): StrengthItem[] {
  const { typographyArchitecture, surfacePhysics, boundaryLogic, motionSignature } = theme.artisticPillars;

  return [
    {
      title: 'Signature Strength',
      detail: personality.strengths[0] ?? '',
    },
    {
      title: 'Secondary Strength',
      detail: personality.strengths[1] ?? '',
    },
    {
      title: 'Experience Edge',
      detail: personality.strengths[2] ?? '',
    },
    {
      title: 'Typography System',
      detail: `${primaryFont(typographyArchitecture.fontStack.display)} display, ${primaryFont(typographyArchitecture.fontStack.body)} body, letter spacing ${typographyArchitecture.letterSpacing.normal}.`,
    },
    {
      title: 'Motion Profile',
      detail: `${motionSignature.physics} physics with ${motionSignature.duration.fast}/${motionSignature.duration.normal}/${motionSignature.duration.slow} duration cadence.`,
    },
    {
      title: 'Material Profile',
      detail: `${surfacePhysics.blur} blur, grain ${surfacePhysics.grain}, ${boundaryLogic.borderWeight} borders, ${boundaryLogic.radius} radius.`,
    },
  ];
}

function VisionaryExplorer(): JSX.Element {
  const { activeVision, activeVisionId, setVision } = useVision();
  const personality = getPersonality(activeVisionId);
  const strengths = summarizeStrengths(activeVision, personality);
  const swatches = [
    { label: 'Background', value: activeVision.colors.background },
    { label: 'Surface', value: activeVision.colors.surface },
    { label: 'Accent', value: activeVision.colors.accent },
    { label: 'Secondary', value: activeVision.colors.secondary },
    { label: 'Chart 1', value: activeVision.colors.chart1 },
    { label: 'Chart 2', value: activeVision.colors.chart2 },
  ];

  return (
    <div className="min-h-screen bg-[var(--vde-color-background)] text-[var(--vde-color-foreground)]">
      <div className="mx-auto max-w-7xl space-y-8 p-6 md:p-10">
        <header className="space-y-4 rounded-2xl border p-6 [border-color:var(--vde-color-border)] [background:var(--vde-color-surface)] [color:var(--vde-color-surface-foreground)]">
          <p className="text-xs uppercase tracking-[0.2em] opacity-70">Visionary Explorer</p>
          <h1 className="text-4xl [font-family:var(--vde-font-display)]">{activeVision.name}</h1>
          <p className="max-w-[70ch] text-sm md:text-base">{activeVision.description}</p>
          <p className="text-xs uppercase tracking-[0.12em] opacity-70">
            Archetype: {activeVision.archetype} | Vision ID: {activeVisionId}
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
          <article
            className={`space-y-5 rounded-2xl border p-6 [border-color:var(--vde-color-border)] [color:var(--vde-color-surface-foreground)] ${personality.stageClass}`}
          >
            <p className="text-xs uppercase tracking-[0.18em] opacity-70">Theme Signature: {personality.motif}</p>
            <h2 className="text-3xl [font-family:var(--vde-font-display)]">{personality.headline}</h2>
            <p className="max-w-[64ch] text-sm md:text-base">{personality.summary}</p>
            <div className="flex flex-wrap gap-2">
              {personality.mood.map(word => (
                <span
                  key={word}
                  className="rounded-full border px-2 py-1 text-[11px] uppercase tracking-[0.08em] [border-color:var(--vde-color-border)] [background:var(--vde-color-surface)]"
                >
                  {word}
                </span>
              ))}
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {personality.strengths.map(strength => (
                <div
                  key={strength}
                  className="rounded-xl border p-3 text-xs leading-relaxed [border-color:var(--vde-color-border)] [background:var(--vde-color-surface)]"
                >
                  {strength}
                </div>
              ))}
            </div>
          </article>

          <aside className="space-y-4 rounded-2xl border p-5 [border-color:var(--vde-color-border)] [background:var(--vde-color-surface)] [color:var(--vde-color-surface-foreground)]">
            <h3 className="text-sm uppercase tracking-[0.12em] opacity-80">Best Use</h3>
            <p className="text-sm leading-relaxed">{personality.signatureUse}</p>
            <h3 className="border-t pt-4 text-sm uppercase tracking-[0.12em] opacity-80 [border-color:var(--vde-color-border)]">
              Ornament Toggles
            </h3>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border px-2 py-1 text-[11px] [border-color:var(--vde-color-border)]">
                Grain: {activeVision.ornaments.grain ? 'On' : 'Off'}
              </span>
              <span className="rounded-full border px-2 py-1 text-[11px] [border-color:var(--vde-color-border)]">
                Glow: {activeVision.ornaments.glow ? 'On' : 'Off'}
              </span>
              <span className="rounded-full border px-2 py-1 text-[11px] [border-color:var(--vde-color-border)]">
                Texture: {activeVision.ornaments.texture ? 'On' : 'Off'}
              </span>
            </div>
          </aside>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {strengths.map(item => (
            <article
              key={item.title}
              className="rounded-2xl border p-5 [border-color:var(--vde-color-border)] [background:var(--vde-color-surface)] [color:var(--vde-color-surface-foreground)]"
            >
              <h3 className="text-xs uppercase tracking-[0.12em] opacity-75">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed">{item.detail}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <Layout heading="Component Preview" className="mx-0 max-w-none">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Interaction Snapshot</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Button variant="default">Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                  </div>
                  <Input placeholder={personality.prompt} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Navigation Rhythm</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative min-h-[200px] rounded-xl border p-4 [border-color:var(--vde-color-border)]">
                    <NavigationOrb
                      className="absolute bottom-3 right-3"
                      defaultOpen
                      floating={false}
                      items={personality.orbItems.map(item => ({ id: item.toLowerCase(), label: item }))}
                      label={`${activeVision.name} navigation`}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </Layout>

          <aside className="space-y-4 rounded-2xl border p-5 [border-color:var(--vde-color-border)] [background:var(--vde-color-surface)] [color:var(--vde-color-surface-foreground)]">
            <h3 className="text-sm uppercase tracking-[0.12em] opacity-80">Visual Fingerprint</h3>
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
      </div>
    </div>
  );
}

const meta = {
  title: 'Visionary/Explorer',
  component: VisionaryExplorer,
  tags: ['autodocs'],
  parameters: {
    vdeFrame: 'edge',
  },
} satisfies Meta<typeof VisionaryExplorer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
