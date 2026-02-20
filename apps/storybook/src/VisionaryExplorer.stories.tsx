import type { Meta, StoryObj } from '@storybook/react';
import { ArrowUpRight, Box, Eye, Maximize2, MoveRight, Type } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import { useVision } from '@nikolayvalev/design-system';

const THEMES = {
  MUSEUM: 'museum',
  BRUTAL: 'brutalist',
  IMMERSIVE: 'immersive',
} as const;

type ExplorerTheme = (typeof THEMES)[keyof typeof THEMES];

const ALL_THEMES: ExplorerTheme[] = [THEMES.MUSEUM, THEMES.BRUTAL, THEMES.IMMERSIVE];

function isExplorerTheme(value: string): value is ExplorerTheme {
  return ALL_THEMES.includes(value as ExplorerTheme);
}

function VisionaryExplorer(): JSX.Element {
  const { activeVisionId, setVision } = useVision();
  const [activeTheme, setActiveTheme] = useState<ExplorerTheme>(
    isExplorerTheme(activeVisionId) ? activeVisionId : THEMES.MUSEUM
  );
  const [animateKey, setAnimateKey] = useState(0);

  useEffect(() => {
    if (isExplorerTheme(activeVisionId)) {
      setActiveTheme(activeVisionId);
    }
  }, [activeVisionId]);

  useEffect(() => {
    setAnimateKey(previous => previous + 1);
  }, [activeTheme]);

  const onThemeChange = (theme: ExplorerTheme): void => {
    setActiveTheme(theme);
    setVision(theme);
  };

  return (
    <div className={`min-h-screen w-full transition-colors duration-700 ease-in-out ${getThemeWrapperClasses(activeTheme)}`}>
      {activeTheme === THEMES.IMMERSIVE ? (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] h-[50%] w-[50%] rounded-full bg-fuchsia-900/30 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-20%] right-[-10%] h-[50%] w-[50%] rounded-full bg-cyan-900/30 blur-[120px] animate-pulse [animation-delay:900ms]" />
          <div className="absolute top-[40%] left-[40%] h-[20%] w-[20%] rounded-full bg-blue-500/10 blur-[80px]" />
        </div>
      ) : null}

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-12">
        <Header activeTheme={activeTheme} onThemeChange={onThemeChange} />

        <main key={animateKey} className="mt-16 space-y-24">
          <HeroSection theme={activeTheme} />
          <ComponentShowcase theme={activeTheme} />
          <LayoutShowcase theme={activeTheme} />
        </main>

        <Footer theme={activeTheme} />
      </div>
    </div>
  );
}

interface HeaderProps {
  activeTheme: ExplorerTheme;
  onThemeChange: (theme: ExplorerTheme) => void;
}

function Header({ activeTheme, onThemeChange }: HeaderProps): JSX.Element {
  return (
    <header className="flex flex-col items-center justify-between gap-6 border-b border-current/10 pb-6 md:flex-row">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center
            ${activeTheme === THEMES.MUSEUM ? 'rounded-full border-4 border-double border-current' : ''}
            ${activeTheme === THEMES.BRUTAL ? 'border-2 border-black bg-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]' : ''}
            ${activeTheme === THEMES.IMMERSIVE ? 'rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20' : ''}
          `}
        >
          <Box size={20} />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-[0.18em] opacity-60">System Name</span>
          <h1 className="text-xl font-bold leading-none">
            {activeTheme === THEMES.MUSEUM ? 'The Archive' : null}
            {activeTheme === THEMES.BRUTAL ? 'RAW_DATA_V1' : null}
            {activeTheme === THEMES.IMMERSIVE ? 'Nexus OS' : null}
          </h1>
        </div>
      </div>

      <nav className="flex items-center gap-2 rounded-full bg-black/5 p-1 md:rounded-lg">
        {[
          { id: THEMES.MUSEUM, label: 'Museum', icon: <Type size={14} /> },
          { id: THEMES.BRUTAL, label: 'Brutalist', icon: <Box size={14} /> },
          { id: THEMES.IMMERSIVE, label: 'Immersive', icon: <Eye size={14} /> },
        ].map(item => (
          <button
            key={item.id}
            type="button"
            onClick={() => onThemeChange(item.id)}
            className={`flex items-center gap-2 px-4 py-2 text-sm transition-all duration-300 ${
              activeTheme === item.id ? getActiveTabStyle(item.id) : 'opacity-60 hover:opacity-100'
            }`}
          >
            {item.icon}
            <span className="hidden sm:inline">{item.label}</span>
          </button>
        ))}
      </nav>
    </header>
  );
}

interface ThemeProps {
  theme: ExplorerTheme;
}

function HeroSection({ theme }: ThemeProps): JSX.Element {
  if (theme === THEMES.MUSEUM) {
    return (
      <section className="grid items-center gap-12 md:grid-cols-12">
        <div className="space-y-8 md:col-span-7">
          <span className="inline-block border-b border-black pb-1 text-xs uppercase tracking-[0.2em]">Est. 2025 • Editorial Collection</span>
          <h2 className="text-6xl leading-[0.9] tracking-tight md:text-8xl">
            The <span className="font-light italic text-[#8A3324]">Return</span> of
            <br />
            Permanence.
          </h2>
          <p className="max-w-xl text-xl font-light leading-relaxed opacity-80 md:text-2xl">
            Rejecting the ephemeral nature of the modern feed. A design system grounded in history, typography, and tactile warmth.
          </p>
          <div className="pt-4">
            <button
              type="button"
              className="px-8 py-3 text-xs uppercase tracking-[0.2em] border border-[#2C2825] transition-colors hover:bg-[#2C2825] hover:text-[#F7F5F0]"
            >
              Read The Journal
            </button>
          </div>
        </div>
        <div className="relative md:col-span-5">
          <div className="aspect-[3/4] border border-[#2C2825] p-2">
            <div className="museum-grain relative flex h-full w-full items-center justify-center overflow-hidden bg-[#E6E2D6]">
              <span className="text-9xl font-serif italic opacity-10">Ag</span>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 hidden max-w-xs border border-gray-200 bg-white p-6 shadow-xl md:block">
            <p className="font-serif text-sm italic">"Digital spaces should feel like libraries, not terminals."</p>
          </div>
        </div>
      </section>
    );
  }

  if (theme === THEMES.BRUTAL) {
    return (
      <section className="relative pb-24 pt-12">
        <div className="relative overflow-hidden border-4 border-black bg-[#CCFF00] p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] md:p-16">
          <div className="absolute right-4 top-4 bg-black px-2 py-1 font-mono text-xs font-bold uppercase text-white">SystemStatus: UNSTABLE</div>
          <h2 className="relative z-10 break-words text-5xl font-black uppercase leading-[0.85] tracking-tighter md:text-9xl">
            TRUTH
            <br />
            IS
            <br />
            <span className="bg-black px-2 text-white">UGLY</span>
          </h2>
          <p className="mt-8 inline-block max-w-2xl -rotate-1 border-2 border-black bg-white p-4 font-mono text-lg font-bold shadow-[4px_4px_0px_0px_black] md:text-xl">
            No rounded corners. No gradients. Just raw HTML and heavy strokes. This is the rebellion against corporate polish.
          </p>
          <div className="mt-12">
            <button
              type="button"
              className="border-4 border-black bg-[#FF3366] px-8 py-4 text-xl font-bold text-white shadow-[8px_8px_0px_0px_black] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[6px_6px_0px_0px_black] active:translate-x-[8px] active:translate-y-[8px] active:shadow-none"
            >
              START_REBELLION()
            </button>
          </div>
          <div className="absolute bottom-4 left-0 right-0 overflow-hidden whitespace-nowrap border-y-4 border-black bg-white py-2">
            <div className="animate-marquee inline-block font-mono text-xl font-bold">
              WARNING: HIGH CONTRAST AREA /// DO NOT SMOOTH /// RAW DATA ONLY /// WARNING: HIGH CONTRAST AREA ///
            </div>
            <div className="animate-marquee inline-block pl-8 font-mono text-xl font-bold">
              WARNING: HIGH CONTRAST AREA /// DO NOT SMOOTH /// RAW DATA ONLY /// WARNING: HIGH CONTRAST AREA ///
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative flex min-h-[60vh] flex-col justify-center">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20 blur-[100px]" />

      <div className="relative z-10 space-y-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-cyan-400 backdrop-blur-md">
          <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
          Hyper-Reality Engine v2.0
        </div>

        <h2 className="bg-gradient-to-b from-white to-white/40 bg-clip-text text-6xl font-bold tracking-tight text-transparent md:text-8xl">
          Beyond the
          <br />
          Screen
        </h2>

        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-white/60 md:text-xl">
          The interface dissolves. You are no longer viewing a page; you are inhabiting a simulation. Physics-based motion, depth, and light.
        </p>

        <div className="flex justify-center pt-8">
          <button
            type="button"
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/10 px-8 py-4 backdrop-blur-xl transition-all duration-500 hover:bg-white/20"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <span className="relative flex items-center gap-2 font-medium">
              Enter Environment <MoveRight className="transition-transform group-hover:translate-x-1" />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}

function ComponentShowcase({ theme }: ThemeProps): JSX.Element {
  return (
    <section className="space-y-12">
      <div className="border-t border-current/10 pt-12">
        <h3 className={`mb-8 text-2xl ${theme === THEMES.BRUTAL ? 'inline-block bg-black px-2 font-black uppercase text-white' : ''} ${theme === THEMES.MUSEUM ? 'font-serif italic' : ''} ${theme === THEMES.IMMERSIVE ? 'font-medium text-white/40' : ''}`}>
          System Primitives
        </h3>
      </div>

      <div className="grid gap-12 md:grid-cols-3">
        <div className="space-y-4">
          <Label theme={theme}>Typography</Label>
          <div className={`flex min-h-[300px] flex-col justify-between p-8 ${getCardStyle(theme)}`}>
            <div className="space-y-4">
              <div>
                <p className="mb-1 text-xs opacity-50">Display</p>
                <p className={`text-4xl leading-tight ${theme === THEMES.MUSEUM ? 'font-serif' : theme === THEMES.BRUTAL ? 'font-black' : 'font-bold'}`}>Aa</p>
              </div>
              <div>
                <p className="mb-1 text-xs opacity-50">Heading</p>
                <p className="text-2xl">The quick brown fox.</p>
              </div>
              <div>
                <p className="mb-1 text-xs opacity-50">Body</p>
                <p className="text-sm leading-relaxed opacity-80">Design is intelligence made visible. We shape our tools and thereafter our tools shape us.</p>
              </div>
            </div>
            <div className="flex items-end justify-between border-t border-current/10 pt-4">
              <span className="text-xs opacity-40">Font Family</span>
              <span className="text-xs font-mono">
                {theme === THEMES.MUSEUM ? 'Playfair Display / Inter' : null}
                {theme === THEMES.BRUTAL ? 'Space Mono / System' : null}
                {theme === THEMES.IMMERSIVE ? 'Inter / Geist' : null}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Label theme={theme}>Interaction</Label>
          <div className={`flex min-h-[300px] flex-col items-center justify-center gap-6 p-8 ${getCardStyle(theme)}`}>
            <button type="button" className={`w-full ${getButtonStyle(theme)}`}>
              Primary Action
            </button>
            <button type="button" className={`w-full ${getSecondaryButtonStyle(theme)}`}>
              Secondary Action
            </button>
            <div className="w-full">
              <input type="text" placeholder="Input field..." className={`w-full bg-transparent p-3 outline-none transition-all ${getInputStyle(theme)}`} />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Label theme={theme}>Surfaces & Depth</Label>
          <div className={`relative min-h-[300px] overflow-hidden p-8 ${getCardStyle(theme)}`}>
            <div className={`absolute left-1/2 top-1/2 flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 items-center justify-center ${getSurfaceStyle(theme)}`}>
              <Box size={32} />
            </div>

            {theme === THEMES.IMMERSIVE ? (
              <>
                <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-purple-500/20 blur-2xl" />
                <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-cyan-500/20 blur-2xl" />
              </>
            ) : null}

            <div className="absolute bottom-4 left-4 right-4 text-center text-xs opacity-60">
              {theme === THEMES.MUSEUM ? 'Natural paper textures, grain, subtle drop shadows.' : null}
              {theme === THEMES.BRUTAL ? 'Hard lines, flat colors, no transparency.' : null}
              {theme === THEMES.IMMERSIVE ? 'Glassmorphism, blurs, multi-layer depth.' : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function LayoutShowcase({ theme }: ThemeProps): JSX.Element {
  return (
    <section className="space-y-8 pb-24">
      <div className="flex items-end justify-between border-t border-current/10 pt-12">
        <h3 className={`text-2xl ${theme === THEMES.BRUTAL ? 'inline-block bg-black px-2 font-black uppercase text-white' : ''} ${theme === THEMES.MUSEUM ? 'font-serif italic' : ''} ${theme === THEMES.IMMERSIVE ? 'font-medium text-white/40' : ''}`}>
          Micro-Layout: The Article
        </h3>
        <button type="button" className="flex items-center gap-2 text-sm opacity-50 transition-opacity hover:opacity-100">
          View Full Page <ArrowUpRight size={14} />
        </button>
      </div>

      <div className={`min-h-[500px] w-full p-6 transition-all duration-500 md:p-12 ${getLayoutContainerStyle(theme)}`}>
        {theme === THEMES.MUSEUM ? (
          <article className="mx-auto grid max-w-3xl grid-cols-12 gap-6">
            <header className="col-span-12 mb-12 border-b border-[#2C2825] pb-8 text-center">
              <span className="mb-4 block font-serif italic text-[#8A3324]">Vol. 24 — Architecture</span>
              <h1 className="mb-4 text-5xl font-serif">The Silence of Stone</h1>
              <p className="text-sm uppercase tracking-[0.2em] opacity-60">By The Curator • Oct 2025</p>
            </header>
            <div className="col-span-12 space-y-4 md:col-span-4">
              <p className="text-lg font-bold leading-tight">A study in minimalism and the return to tangible interfaces in a digital age.</p>
              <div className="relative h-[200px] w-full bg-[#E6E2D6] grayscale">
                <div className="absolute inset-2 border border-[#2C2825] opacity-20" />
                <div className="absolute inset-0 flex items-center justify-center font-serif text-4xl italic opacity-30">Fig. 1</div>
              </div>
              <p className="text-xs italic opacity-60">Fig 1. The original sketch.</p>
            </div>
            <div className="col-span-12 md:col-span-8">
              <p className="mb-6 text-xl leading-relaxed font-serif first-letter:float-left first-letter:mr-2 first-letter:text-5xl first-letter:font-bold">
                History is not linear. It loops. The trends we see today are echoes of the past, reformatted for screens. The "Museumcore" aesthetic is not just a style; it is a plea for slowness.
              </p>
              <p className="text-base leading-loose opacity-80">
                When we strip away the gradients and the neon shadows, we are left with the skeleton of content: Type and Space. This layout utilizes a classic grid, serif typography, and ample whitespace to dignify the text.
              </p>
            </div>
          </article>
        ) : null}

        {theme === THEMES.BRUTAL ? (
          <article className="flex h-full flex-col">
            <div className="mb-4 flex items-end justify-between border-b-4 border-black pb-4">
              <h1 className="text-4xl font-black uppercase leading-none md:text-7xl">
                RAW_State
                <br />
                Manifesto
              </h1>
              <div className="hidden text-right font-mono text-xs md:block">
                <div>ID: #88291</div>
                <div>DATE: NOW()</div>
                <div>PRIORITY: CRITICAL</div>
              </div>
            </div>
            <div className="grid gap-0 border-4 border-black bg-white shadow-[8px_8px_0px_0px_black] md:grid-cols-2">
              <div className="flex items-center justify-center border-b-4 border-black bg-[#FF00FF] p-8 md:border-b-0 md:border-r-4">
                <span className="text-9xl font-black text-white mix-blend-hard-light">?</span>
              </div>
              <div className="space-y-6 p-8">
                <h3 className="inline-block bg-black px-2 text-xl font-bold uppercase text-white">Section_01</h3>
                <p className="font-mono text-sm font-medium leading-tight">
                  // THE CODE IS THE DESIGN
                  <br />
                  <br />
                  We reject the soft. We reject the fake depth. This layout is built on CSS Borders and native HTML inputs. It is fast, accessible, and impossible to ignore.
                </p>
                <button type="button" className="w-full border-2 border-black py-4 font-bold uppercase transition-colors hover:bg-black hover:text-white">
                  Download_Manifesto.pdf
                </button>
              </div>
            </div>
          </article>
        ) : null}

        {theme === THEMES.IMMERSIVE ? (
          <article className="relative z-10">
            <div className="absolute -left-20 top-0 h-full w-1 bg-gradient-to-b from-transparent via-cyan-500 to-transparent opacity-20" />

            <div className="space-y-12">
              <header className="space-y-4">
                <div className="flex items-center gap-4 text-xs uppercase tracking-[0.2em] text-cyan-400">
                  <span>01 / Introduction</span>
                  <div className="h-px w-24 bg-cyan-900" />
                  <span>Simulated Reality</span>
                </div>
                <h1 className="bg-gradient-to-r from-white via-white to-white/50 bg-clip-text text-5xl font-medium tracking-tight text-transparent md:text-6xl">
                  Fluid Interfaces
                </h1>
              </header>

              <div className="grid gap-16 md:grid-cols-2">
                <div className="space-y-6">
                  <p className="text-lg leading-relaxed text-white/70">The immersive web treats the viewport as a camera into a 3D world. Elements float, blur, and glow.</p>
                  <button
                    type="button"
                    className="group w-full cursor-pointer rounded-2xl border border-white/10 bg-white/5 p-6 text-left backdrop-blur-md transition-colors hover:bg-white/10"
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <div className="rounded-full bg-cyan-500/20 p-3 text-cyan-400 transition-transform group-hover:scale-110">
                        <Maximize2 size={20} />
                      </div>
                      <ArrowUpRight className="text-white/20 transition-colors group-hover:text-white" />
                    </div>
                    <h4 className="mb-2 text-xl font-medium">Spatial Audio</h4>
                    <p className="text-sm text-white/50">Soundscapes that react to user scroll position and interaction velocity.</p>
                  </button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 blur-xl" />
                  <div className="relative h-full rounded-2xl border border-white/10 bg-black/40 p-8 backdrop-blur-sm">
                    <div className="flex flex-col gap-4">
                      <div className="h-2 w-1/3 animate-pulse rounded-full bg-white/20" />
                      <div className="h-2 w-2/3 rounded-full bg-white/10" />
                      <div className="h-2 w-1/2 rounded-full bg-white/10" />
                    </div>
                    <div className="mt-8 flex gap-2">
                      <div className="h-8 w-8 rounded-full border border-white/20" />
                      <div className="-ml-4 h-8 w-8 rounded-full border border-white/20 bg-black" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        ) : null}
      </div>
    </section>
  );
}

function Footer({ theme }: ThemeProps): JSX.Element {
  return (
    <footer className="flex flex-col items-center justify-between gap-6 border-t border-current/10 py-12 opacity-60 md:flex-row">
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 bg-current" />
        <span className="text-sm">Storybook Visionary Prototype</span>
      </div>
      <div className="flex gap-8 text-sm">
        <button type="button" className="hover:underline">
          Research
        </button>
        <button type="button" className="hover:underline">
          Systems
        </button>
        <button type="button" className="hover:underline">
          Contact
        </button>
      </div>
      <div className="text-xs uppercase tracking-[0.15em]">
        <span>{theme}</span>
      </div>
    </footer>
  );
}

interface LabelProps {
  children: ReactNode;
  theme: ExplorerTheme;
}

function Label({ children, theme }: LabelProps): JSX.Element {
  return <h4 className={`text-xs uppercase tracking-[0.2em] opacity-50 ${theme === THEMES.BRUTAL ? 'font-mono font-bold' : ''}`}>{children}</h4>;
}

function getThemeWrapperClasses(theme: ExplorerTheme): string {
  switch (theme) {
    case THEMES.MUSEUM:
      return 'bg-[#F7F5F0] text-[#2C2825] font-serif selection:bg-[#8A3324] selection:text-white';
    case THEMES.BRUTAL:
      return 'bg-[#FFFDF5] text-black font-mono selection:bg-black selection:text-[#CCFF00]';
    case THEMES.IMMERSIVE:
      return 'bg-[#050505] text-white font-sans selection:bg-cyan-500 selection:text-black';
    default:
      return '';
  }
}

function getActiveTabStyle(theme: ExplorerTheme): string {
  switch (theme) {
    case THEMES.MUSEUM:
      return 'rounded-full bg-[#2C2825] font-serif italic text-[#F7F5F0]';
    case THEMES.BRUTAL:
      return 'bg-[#FF3366] text-white font-bold border-2 border-black shadow-[2px_2px_0px_0px_black] -translate-y-1';
    case THEMES.IMMERSIVE:
      return 'rounded-lg border border-white/10 bg-white/10 text-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.3)] backdrop-blur-md';
    default:
      return '';
  }
}

function getCardStyle(theme: ExplorerTheme): string {
  switch (theme) {
    case THEMES.MUSEUM:
      return 'border border-[#D1CDC7] bg-white shadow-sm';
    case THEMES.BRUTAL:
      return 'border-4 border-black bg-white shadow-[8px_8px_0px_0px_black]';
    case THEMES.IMMERSIVE:
      return 'rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-lg';
    default:
      return '';
  }
}

function getButtonStyle(theme: ExplorerTheme): string {
  switch (theme) {
    case THEMES.MUSEUM:
      return 'bg-[#2C2825] text-[#F7F5F0] py-3 px-6 text-sm tracking-[0.2em] uppercase hover:opacity-90 transition-opacity';
    case THEMES.BRUTAL:
      return 'bg-[#CCFF00] text-black border-2 border-black font-bold py-3 px-6 shadow-[4px_4px_0px_0px_black] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_black] active:shadow-none transition-all';
    case THEMES.IMMERSIVE:
      return 'rounded-full border border-cyan-500/50 bg-cyan-500/20 px-6 py-3 font-medium text-cyan-300 transition-all hover:bg-cyan-500/30 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]';
    default:
      return '';
  }
}

function getSecondaryButtonStyle(theme: ExplorerTheme): string {
  switch (theme) {
    case THEMES.MUSEUM:
      return 'bg-transparent text-[#2C2825] border border-[#2C2825] py-3 px-6 text-sm tracking-[0.2em] uppercase hover:bg-[#2C2825] hover:text-[#F7F5F0] transition-colors';
    case THEMES.BRUTAL:
      return 'bg-white text-black border-2 border-black font-bold py-3 px-6 shadow-[4px_4px_0px_0px_black] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_black] active:shadow-none transition-all';
    case THEMES.IMMERSIVE:
      return 'rounded-full border border-white/10 bg-white/5 px-6 py-3 font-medium text-white transition-all hover:bg-white/10';
    default:
      return '';
  }
}

function getInputStyle(theme: ExplorerTheme): string {
  switch (theme) {
    case THEMES.MUSEUM:
      return 'border-b border-[#2C2825] placeholder:italic placeholder:opacity-50 focus:border-b-2';
    case THEMES.BRUTAL:
      return 'bg-white border-2 border-black font-mono placeholder:uppercase placeholder:text-black/40 focus:bg-[#FFF0F5]';
    case THEMES.IMMERSIVE:
      return 'rounded-xl border border-white/10 bg-white/5 placeholder:text-white/30 focus:border-cyan-500/50 focus:bg-white/10 transition-colors';
    default:
      return '';
  }
}

function getSurfaceStyle(theme: ExplorerTheme): string {
  switch (theme) {
    case THEMES.MUSEUM:
      return 'bg-[#F0EEE6] border border-[#D1CDC7] shadow-inner';
    case THEMES.BRUTAL:
      return 'bg-[#0000FF] border-4 border-black text-white';
    case THEMES.IMMERSIVE:
      return 'rounded-2xl border border-white/20 bg-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] backdrop-blur-md';
    default:
      return '';
  }
}

function getLayoutContainerStyle(theme: ExplorerTheme): string {
  switch (theme) {
    case THEMES.MUSEUM:
      return 'border border-[#D1CDC7] bg-[#F2F0EB]';
    case THEMES.BRUTAL:
      return 'pattern-grid-lg border-4 border-black bg-white';
    case THEMES.IMMERSIVE:
      return 'relative overflow-hidden rounded-3xl border border-white/10 bg-black';
    default:
      return '';
  }
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
