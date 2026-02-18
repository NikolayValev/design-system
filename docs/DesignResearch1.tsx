import React, { useState, useEffect } from 'react';
import { 
  Type, 
  Layout, 
  MousePointer2, 
  MoveRight, 
  Box, 
  Palette, 
  Eye, 
  Maximize2, 
  ArrowUpRight 
} from 'lucide-react';

/**
 * VISIONARY DESIGN SYSTEM EXPLORER
 * * This application demonstrates the "Themeable Architecture" proposed in the research.
 * It uses a "semantic token" approach where the underlying structure remains similar,
 * but the visual skin (typography, spacing, borders, physics) changes completely.
 */

const THEMES = {
  MUSEUM: 'museumcore',
  BRUTAL: 'neo-brutalist',
  IMMERSIVE: 'immersive'
};

export default function App() {
  const [activeTheme, setActiveTheme] = useState(THEMES.MUSEUM);
  const [animateKey, setAnimateKey] = useState(0);

  // Trigger re-animation on theme switch
  useEffect(() => {
    setAnimateKey(prev => prev + 1);
  }, [activeTheme]);

  // Dynamic Base Styles based on Theme
  const getThemeWrapperClasses = () => {
    switch (activeTheme) {
      case THEMES.MUSEUM:
        return "bg-[#F7F5F0] text-[#2C2825] font-serif selection:bg-[#8A3324] selection:text-white";
      case THEMES.BRUTAL:
        return "bg-[#FFFDF5] text-black font-mono selection:bg-black selection:text-[#CCFF00]";
      case THEMES.IMMERSIVE:
        return "bg-[#050505] text-white font-sans selection:bg-cyan-500 selection:text-black";
      default:
        return "";
    }
  };

  return (
    <div className={`min-h-screen w-full transition-colors duration-700 ease-in-out ${getThemeWrapperClasses()}`}>
      {/* BACKGROUND ELEMENTS FOR IMMERSIVE THEME */}
      {activeTheme === THEMES.IMMERSIVE && (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/30 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-900/30 blur-[120px] animate-pulse delay-1000" />
          <div className="absolute top-[40%] left-[40%] w-[20%] h-[20%] rounded-full bg-blue-500/10 blur-[80px]" />
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <Header activeTheme={activeTheme} setActiveTheme={setActiveTheme} />
        
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

/* -------------------------------------------------------------------------- */
/* COMPONENTS                                 */
/* -------------------------------------------------------------------------- */

const Header = ({ activeTheme, setActiveTheme }) => {
  return (
    <header className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-current/10 pb-6">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 flex items-center justify-center 
          ${activeTheme === THEMES.MUSEUM ? 'border-double border-4 border-current rounded-full' : ''}
          ${activeTheme === THEMES.BRUTAL ? 'bg-black text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]' : ''}
          ${activeTheme === THEMES.IMMERSIVE ? 'bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-xl shadow-lg shadow-cyan-500/20' : ''}
        `}>
          <Box size={20} />
        </div>
        <div className="flex flex-col">
          <span className="text-sm opacity-60 uppercase tracking-widest text-[10px]">System Name</span>
          <h1 className="text-xl font-bold leading-none">
            {activeTheme === THEMES.MUSEUM && "The Archive"}
            {activeTheme === THEMES.BRUTAL && "RAW_DATA_V1"}
            {activeTheme === THEMES.IMMERSIVE && "Nexus OS"}
          </h1>
        </div>
      </div>

      <nav className="flex items-center gap-2 p-1 bg-black/5 dark:bg-white/5 rounded-full md:rounded-lg">
        {[
          { id: THEMES.MUSEUM, label: 'Museum', icon: <Type size={14} /> },
          { id: THEMES.BRUTAL, label: 'Brutalist', icon: <Box size={14} /> },
          { id: THEMES.IMMERSIVE, label: 'Immersive', icon: <Eye size={14} /> },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTheme(item.id)}
            className={`
              flex items-center gap-2 px-4 py-2 text-sm transition-all duration-300
              ${activeTheme === item.id 
                ? getActiveTabStyle(item.id) 
                : 'hover:opacity-100 opacity-60'
              }
            `}
          >
            {item.icon}
            <span className="hidden sm:inline">{item.label}</span>
          </button>
        ))}
      </nav>
    </header>
  );
};

const getActiveTabStyle = (theme) => {
  switch (theme) {
    case THEMES.MUSEUM: return "bg-[#2C2825] text-[#F7F5F0] rounded-full font-serif italic";
    case THEMES.BRUTAL: return "bg-[#FF3366] text-white font-bold border-2 border-black shadow-[2px_2px_0px_0px_black] -translate-y-1";
    case THEMES.IMMERSIVE: return "bg-white/10 text-cyan-400 backdrop-blur-md rounded-lg shadow-[0_0_15px_rgba(0,255,255,0.3)] border border-white/10";
    default: return "";
  }
};

/* -------------------------------------------------------------------------- */
/* HERO SECTIONS                               */
/* -------------------------------------------------------------------------- */

const HeroSection = ({ theme }) => {
  if (theme === THEMES.MUSEUM) {
    return (
      <section className="grid md:grid-cols-12 gap-12 items-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="md:col-span-7 space-y-8">
          <span className="inline-block border-b border-black pb-1 text-xs tracking-[0.2em] uppercase">Est. 2025 • Editorial Collection</span>
          <h2 className="text-6xl md:text-8xl leading-[0.9] tracking-tight">
            The <span className="italic font-light text-[#8A3324]">Return</span> of<br/>Permanence.
          </h2>
          <p className="text-xl md:text-2xl leading-relaxed opacity-80 max-w-xl font-light">
            Rejecting the ephemeral nature of the modern feed. A design system grounded in history, typography, and tactile warmth.
          </p>
          <div className="flex gap-4 pt-4">
            <button className="px-8 py-3 border border-[#2C2825] hover:bg-[#2C2825] hover:text-[#F7F5F0] transition-colors uppercase tracking-widest text-xs">
              Read The Journal
            </button>
          </div>
        </div>
        <div className="md:col-span-5 relative">
          <div className="aspect-[3/4] border border-[#2C2825] p-2">
            <div className="w-full h-full bg-[#E6E2D6] flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]"></div>
               <span className="font-serif italic text-9xl opacity-10">Ag</span>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 bg-white p-6 border border-gray-200 shadow-xl max-w-xs hidden md:block">
            <p className="font-serif text-sm italic">"Digital spaces should feel like libraries, not terminals."</p>
          </div>
        </div>
      </section>
    );
  }

  if (theme === THEMES.BRUTAL) {
    return (
      <section className="relative pt-12 pb-24 animate-in zoom-in-95 duration-300">
        <div className="bg-[#CCFF00] border-4 border-black p-8 md:p-16 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
          <div className="absolute top-4 right-4 bg-black text-white px-2 py-1 font-mono text-xs font-bold uppercase">
            SystemStatus: UNSTABLE
          </div>
          <h2 className="text-5xl md:text-9xl font-black uppercase tracking-tighter leading-[0.85] break-words relative z-10">
            TRUTH<br/>IS<br/><span className="bg-black text-white px-2">UGLY</span>
          </h2>
          <p className="mt-8 font-mono text-lg md:text-xl font-bold max-w-2xl bg-white border-2 border-black p-4 inline-block transform -rotate-1 shadow-[4px_4px_0px_0px_black]">
            No rounded corners. No gradients. Just raw HTML and heavy strokes. 
            This is the rebellion against corporate polish.
          </p>
           <div className="mt-12 flex flex-wrap gap-4">
            <button className="bg-[#FF3366] text-white text-xl font-bold px-8 py-4 border-4 border-black shadow-[8px_8px_0px_0px_black] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[6px_6px_0px_0px_black] transition-all active:translate-x-[8px] active:translate-y-[8px] active:shadow-none">
              START_REBELLION()
            </button>
          </div>
          {/* Marquee decorative element */}
          <div className="absolute bottom-4 left-0 right-0 overflow-hidden whitespace-nowrap border-y-4 border-black bg-white py-2">
            <div className="animate-marquee inline-block font-mono font-bold text-xl">
              WARNING: HIGH CONTRAST AREA /// DO NOT SMOOTH /// RAW DATA ONLY /// WARNING: HIGH CONTRAST AREA ///
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Immersive Theme
  return (
    <section className="min-h-[60vh] flex flex-col justify-center relative animate-in fade-in duration-1000">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
      
      <div className="relative z-10 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs font-medium text-cyan-400">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          Hyper-Reality Engine v2.0
        </div>
        
        <h2 className="text-6xl md:text-8xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
          Beyond the<br/>Screen
        </h2>
        
        <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
          The interface dissolves. You are no longer viewing a page; you are inhabiting a simulation. 
          Physics-based motion, depth, and light.
        </p>

        <div className="pt-8 flex justify-center gap-6">
          <button className="group relative px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-2xl border border-white/10 transition-all duration-500 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <span className="relative flex items-center gap-2 font-medium">
              Enter Environment <MoveRight className="group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

/* -------------------------------------------------------------------------- */
/* COMPONENT SHOWCASE                             */
/* -------------------------------------------------------------------------- */

const ComponentShowcase = ({ theme }) => {
  return (
    <section className="space-y-12">
      <div className="border-t border-current/10 pt-12">
         <h3 className={`text-2xl mb-8 ${theme === THEMES.BRUTAL ? 'font-black uppercase bg-black text-white inline-block px-2' : ''} ${theme === THEMES.MUSEUM ? 'italic font-serif' : ''} ${theme === THEMES.IMMERSIVE ? 'text-white/40 font-medium' : ''}`}>
           System Primitives
         </h3>
      </div>

      <div className="grid md:grid-cols-3 gap-12">
        {/* TYPOGRAPHY CARD */}
        <div className="space-y-4">
          <Label theme={theme}>Typography</Label>
          <div className={`p-8 min-h-[300px] flex flex-col justify-between ${getCardStyle(theme)}`}>
             <div className="space-y-4">
               <div>
                 <p className="text-xs opacity-50 mb-1">Display</p>
                 <p className={`text-4xl leading-tight ${theme === THEMES.MUSEUM ? 'font-serif' : theme === THEMES.BRUTAL ? 'font-black' : 'font-bold'}`}>
                   Aa
                 </p>
               </div>
               <div>
                 <p className="text-xs opacity-50 mb-1">Heading</p>
                 <p className="text-2xl">The quick brown fox.</p>
               </div>
               <div>
                 <p className="text-xs opacity-50 mb-1">Body</p>
                 <p className="text-sm opacity-80 leading-relaxed">
                   Design is intelligence made visible. We shape our tools and thereafter our tools shape us.
                 </p>
               </div>
             </div>
             <div className="pt-4 border-t border-current/10 flex justify-between items-end">
                <span className="text-xs opacity-40">Font Family</span>
                <span className="text-xs font-mono">
                  {theme === THEMES.MUSEUM && "Playfair Display / Inter"}
                  {theme === THEMES.BRUTAL && "Space Mono / System"}
                  {theme === THEMES.IMMERSIVE && "Inter / Geist"}
                </span>
             </div>
          </div>
        </div>

        {/* INTERACTION CARD */}
        <div className="space-y-4">
          <Label theme={theme}>Interaction</Label>
          <div className={`p-8 min-h-[300px] flex flex-col items-center justify-center gap-6 ${getCardStyle(theme)}`}>
             
             {/* Primary Button */}
             <button className={`w-full ${getButtonStyle(theme)}`}>
               Primary Action
             </button>

             {/* Secondary Button */}
             <button className={`w-full ${getSecondaryButtonStyle(theme)}`}>
               Secondary Action
             </button>

             {/* Input Field */}
             <div className="w-full relative group">
                <input 
                  type="text" 
                  placeholder="Input field..."
                  className={`w-full bg-transparent outline-none p-3 transition-all ${getInputStyle(theme)}`}
                />
             </div>
          </div>
        </div>

        {/* SURFACE CARD */}
        <div className="space-y-4">
          <Label theme={theme}>Surfaces & Depth</Label>
          <div className={`p-8 min-h-[300px] relative overflow-hidden ${getCardStyle(theme)}`}>
             <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 flex items-center justify-center ${getSurfaceStyle(theme)}`}>
                <Box size={32} />
             </div>
             
             {theme === THEMES.IMMERSIVE && (
               <>
                 <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 blur-2xl rounded-full"></div>
                 <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/20 blur-2xl rounded-full"></div>
               </>
             )}
             
             <div className="absolute bottom-4 left-4 right-4 text-xs opacity-60 text-center">
                {theme === THEMES.MUSEUM && "Natural paper textures, grain, subtle drop shadows."}
                {theme === THEMES.BRUTAL && "Hard lines, flat colors, no transparency."}
                {theme === THEMES.IMMERSIVE && "Glassmorphism, blurs, multi-layer depth."}
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* -------------------------------------------------------------------------- */
/* LAYOUT PREVIEW                               */
/* -------------------------------------------------------------------------- */

const LayoutShowcase = ({ theme }) => {
  return (
    <section className="space-y-8 pb-24">
       <div className="border-t border-current/10 pt-12 flex justify-between items-end">
         <h3 className={`text-2xl ${theme === THEMES.BRUTAL ? 'font-black uppercase bg-black text-white inline-block px-2' : ''} ${theme === THEMES.MUSEUM ? 'italic font-serif' : ''} ${theme === THEMES.IMMERSIVE ? 'text-white/40 font-medium' : ''}`}>
           Micro-Layout: The Article
         </h3>
         <button className="text-sm opacity-50 hover:opacity-100 flex items-center gap-2">
           View Full Page <ArrowUpRight size={14} />
         </button>
      </div>

      {/* This section demonstrates how the same HTML structure 
        renders radically different layouts 
      */}
      <div className={`w-full min-h-[500px] p-6 md:p-12 transition-all duration-500 ${getLayoutContainerStyle(theme)}`}>
        
        {/* MUSEUM LAYOUT */}
        {theme === THEMES.MUSEUM && (
          <article className="max-w-3xl mx-auto grid grid-cols-12 gap-6">
            <header className="col-span-12 text-center mb-12 border-b border-[#2C2825] pb-8">
              <span className="font-serif italic text-[#8A3324] mb-4 block">Vol. 24 — Architecture</span>
              <h1 className="text-5xl font-serif mb-4">The Silence of Stone</h1>
              <p className="text-sm tracking-widest uppercase opacity-60">By The Curator • Oct 2025</p>
            </header>
            
            <div className="col-span-12 md:col-span-4 space-y-4">
               <p className="font-bold text-lg leading-tight">A study in minimalism and the return to tangible interfaces in a digital age.</p>
               <div className="h-[200px] w-full bg-[#E6E2D6] grayscale relative">
                  <div className="absolute inset-2 border border-[#2C2825] opacity-20"></div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-30 font-serif italic text-4xl">Fig. 1</div>
               </div>
               <p className="text-xs opacity-60 italic">Fig 1. The original sketch.</p>
            </div>

            <div className="col-span-12 md:col-span-8">
               <p className="text-xl leading-relaxed font-serif mb-6 first-letter:text-5xl first-letter:float-left first-letter:mr-2 first-letter:font-bold">
                 History is not linear. It loops. The trends we see today are echoes of the past, reformatted for screens. 
                 The "Museumcore" aesthetic is not just a style; it is a plea for slowness. 
               </p>
               <p className="text-base leading-loose opacity-80 mb-6 columns-1">
                 When we strip away the gradients and the neon shadows, we are left with the skeleton of content: Type and Space. 
                 This layout utilizes a classic grid, serif typography, and ample whitespace to dignify the text.
               </p>
            </div>
          </article>
        )}

        {/* BRUTALIST LAYOUT */}
        {theme === THEMES.BRUTAL && (
          <article className="h-full flex flex-col">
            <div className="border-b-4 border-black pb-4 mb-4 flex justify-between items-end">
              <h1 className="text-4xl md:text-7xl font-black uppercase leading-none">
                RAW_State<br/>Manifesto
              </h1>
              <div className="hidden md:block text-right font-mono text-xs">
                <div>ID: #88291</div>
                <div>DATE: NOW()</div>
                <div>PRIORITY: CRITICAL</div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-0 border-4 border-black bg-white shadow-[8px_8px_0px_0px_black]">
               <div className="p-8 border-b-4 md:border-b-0 md:border-r-4 border-black bg-[#FF00FF] flex items-center justify-center">
                  <span className="text-9xl font-black text-white mix-blend-hard-light">?</span>
               </div>
               <div className="p-8 space-y-6">
                  <h3 className="bg-black text-white inline-block px-2 text-xl font-bold uppercase">Section_01</h3>
                  <p className="font-mono text-sm leading-tight font-medium">
                    // THE CODE IS THE DESIGN
                    <br/><br/>
                    We reject the soft. We reject the fake depth. 
                    This layout is built on CSS Borders and native HTML inputs. 
                    It is fast, accessible, and impossible to ignore.
                  </p>
                  <button className="w-full py-4 border-2 border-black font-bold hover:bg-black hover:text-white transition-colors uppercase">
                    Download_Manifesto.pdf
                  </button>
               </div>
            </div>
          </article>
        )}

        {/* IMMERSIVE LAYOUT */}
        {theme === THEMES.IMMERSIVE && (
          <article className="relative z-10">
            <div className="absolute -left-20 top-0 w-1 bg-gradient-to-b from-transparent via-cyan-500 to-transparent h-full opacity-20"></div>
            
            <div className="space-y-12">
               <header className="space-y-4">
                 <div className="flex items-center gap-4 text-cyan-400 text-xs tracking-widest uppercase">
                   <span>01 / Introduction</span>
                   <div className="h-px w-24 bg-cyan-900"></div>
                   <span>Simulated Reality</span>
                 </div>
                 <h1 className="text-5xl md:text-6xl font-medium tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/50">
                   Fluid Interfaces
                 </h1>
               </header>

               <div className="grid md:grid-cols-2 gap-16">
                 <div className="space-y-6">
                   <p className="text-lg text-white/70 leading-relaxed">
                     The immersive web treats the viewport as a camera into a 3D world. Elements float, blur, and glow.
                   </p>
                   <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors cursor-pointer group">
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-full bg-cyan-500/20 text-cyan-400 group-hover:scale-110 transition-transform">
                          <Maximize2 size={20} />
                        </div>
                        <ArrowUpRight className="text-white/20 group-hover:text-white transition-colors" />
                      </div>
                      <h4 className="text-xl font-medium mb-2">Spatial Audio</h4>
                      <p className="text-sm text-white/50">Soundscapes that react to user scroll position and interaction velocity.</p>
                   </div>
                 </div>
                 
                 <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 rounded-2xl blur-xl"></div>
                    <div className="relative h-full bg-black/40 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                       <div className="flex flex-col gap-4">
                          <div className="h-2 w-1/3 bg-white/20 rounded-full animate-pulse"></div>
                          <div className="h-2 w-2/3 bg-white/10 rounded-full"></div>
                          <div className="h-2 w-1/2 bg-white/10 rounded-full"></div>
                       </div>
                       <div className="mt-8 flex gap-2">
                          <div className="w-8 h-8 rounded-full border border-white/20"></div>
                          <div className="w-8 h-8 rounded-full border border-white/20 -ml-4 bg-black"></div>
                       </div>
                    </div>
                 </div>
               </div>
            </div>
          </article>
        )}

      </div>
    </section>
  );
};

const Footer = ({ theme }) => {
  return (
    <footer className="border-t border-current/10 py-12 flex flex-col md:flex-row justify-between items-center gap-6 opacity-60">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-current"></div>
        <span className="text-sm">Generated by Gemini 2.0 Flash</span>
      </div>
      <div className="flex gap-8 text-sm">
        <a href="#" className="hover:underline">Research</a>
        <a href="#" className="hover:underline">Systems</a>
        <a href="#" className="hover:underline">Contact</a>
      </div>
    </footer>
  );
};

/* -------------------------------------------------------------------------- */
/* HELPER FUNCTIONS                              */
/* -------------------------------------------------------------------------- */

const Label = ({ children, theme }) => (
  <h4 className={`text-xs uppercase tracking-widest opacity-50 ${theme === THEMES.BRUTAL ? 'font-mono font-bold' : ''}`}>
    {children}
  </h4>
);

const getCardStyle = (theme) => {
  switch (theme) {
    case THEMES.MUSEUM:
      return "bg-white border border-[#D1CDC7] shadow-sm";
    case THEMES.BRUTAL:
      return "bg-white border-4 border-black shadow-[8px_8px_0px_0px_black]";
    case THEMES.IMMERSIVE:
      return "bg-white/5 border border-white/10 backdrop-blur-lg rounded-3xl shadow-2xl";
    default: return "";
  }
};

const getButtonStyle = (theme) => {
  switch (theme) {
    case THEMES.MUSEUM:
      return "bg-[#2C2825] text-[#F7F5F0] py-3 px-6 text-sm tracking-widest uppercase hover:opacity-90 transition-opacity";
    case THEMES.BRUTAL:
      return "bg-[#CCFF00] text-black border-2 border-black font-bold py-3 px-6 shadow-[4px_4px_0px_0px_black] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_black] active:shadow-none transition-all";
    case THEMES.IMMERSIVE:
      return "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 py-3 px-6 rounded-full font-medium hover:bg-cyan-500/30 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all";
    default: return "";
  }
};

const getSecondaryButtonStyle = (theme) => {
  switch (theme) {
    case THEMES.MUSEUM:
      return "bg-transparent text-[#2C2825] border border-[#2C2825] py-3 px-6 text-sm tracking-widest uppercase hover:bg-[#2C2825] hover:text-[#F7F5F0] transition-colors";
    case THEMES.BRUTAL:
      return "bg-white text-black border-2 border-black font-bold py-3 px-6 shadow-[4px_4px_0px_0px_black] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_black] active:shadow-none transition-all";
    case THEMES.IMMERSIVE:
      return "bg-white/5 text-white border border-white/10 py-3 px-6 rounded-full font-medium hover:bg-white/10 transition-all";
    default: return "";
  }
};

const getInputStyle = (theme) => {
  switch (theme) {
    case THEMES.MUSEUM:
      return "border-b border-[#2C2825] focus:border-b-2 placeholder:italic placeholder:opacity-50";
    case THEMES.BRUTAL:
      return "bg-white border-2 border-black font-mono focus:bg-[#FFF0F5] placeholder:uppercase placeholder:text-black/40";
    case THEMES.IMMERSIVE:
      return "bg-white/5 border border-white/10 rounded-xl focus:bg-white/10 focus:border-cyan-500/50 transition-colors placeholder:text-white/30";
    default: return "";
  }
};

const getSurfaceStyle = (theme) => {
  switch (theme) {
    case THEMES.MUSEUM:
      return "bg-[#F0EEE6] border border-[#D1CDC7] shadow-inner";
    case THEMES.BRUTAL:
      return "bg-[#0000FF] border-4 border-black text-white";
    case THEMES.IMMERSIVE:
      return "bg-white/10 border border-white/20 backdrop-blur-md rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]";
    default: return "";
  }
};

const getLayoutContainerStyle = (theme) => {
  switch (theme) {
    case THEMES.MUSEUM:
      return "bg-[#F2F0EB] border border-[#D1CDC7]";
    case THEMES.BRUTAL:
      return "bg-white border-4 border-black pattern-grid-lg";
    case THEMES.IMMERSIVE:
      return "bg-black border border-white/10 rounded-3xl overflow-hidden relative";
    default: return "";
  }
};