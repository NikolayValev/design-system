import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Zap, 
  Wind, 
  ArrowRight, 
  Maximize, 
  Minus, 
  Plus, 
  Hexagon,
  Play,
  Pause
} from 'lucide-react';

/**
 * EMOTIONAL DESIGN SYSTEM EXPLORER (VOL 2)
 * * This system demonstrates three advanced "emotional states":
 * 1. LAB (Precision/Competence) - Technical, grids, raw data.
 * 2. POP (Euphoria/Joy) - Bouncy, saturated, tactile.
 * 3. ZEN (Serenity/Peace) - Blurred, soft, organic.
 */

const THEMES = {
  LAB: 'laboratory',
  POP: 'playground',
  ZEN: 'sanctuary'
};

export default function App() {
  const [activeTheme, setActiveTheme] = useState(THEMES.LAB);
  const [mounted, setMounted] = useState(false);
  const [count, setCount] = useState(0); // For interaction demo

  useEffect(() => setMounted(true), []);

  // --- THEME STYLES CONFIGURATION ---
  const getThemeWrapperClasses = () => {
    switch (activeTheme) {
      case THEMES.LAB:
        // Technical, blueprint blue/grays, monospace
        return "bg-[#F0F4F8] text-[#0F172A] font-mono selection:bg-[#FF4500] selection:text-white";
      case THEMES.POP:
        // Warm yellow background, deep purple text, rounded font
        return "bg-[#FFFAEB] text-[#2E1065] font-sans selection:bg-[#D946EF] selection:text-white";
      case THEMES.ZEN:
        // Soft stone, warm gray text, serif/sans mix
        return "bg-[#EBE9E4] text-[#44403C] font-sans selection:bg-[#A8A29E] selection:text-white";
      default: return "";
    }
  };

  return (
    <div className={`min-h-screen w-full transition-colors duration-700 ease-in-out relative overflow-hidden ${getThemeWrapperClasses()}`}>
      
      {/* BACKGROUND FX LAYERS */}
      {activeTheme === THEMES.LAB && (
        <div className="fixed inset-0 pointer-events-none opacity-20" 
             style={{ backgroundImage: 'linear-gradient(#94A3B8 1px, transparent 1px), linear-gradient(90deg, #94A3B8 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>
      )}

      {activeTheme === THEMES.ZEN && (
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#E7CBA9] blur-[150px] opacity-40 animate-pulse duration-[10000ms]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#A9C8E7] blur-[150px] opacity-40 animate-pulse duration-[8000ms]"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/noise.png')] opacity-40 mix-blend-overlay"></div>
        </div>
      )}

      {/* MAIN CONTENT CONTAINER */}
      <div className={`relative z-10 max-w-6xl mx-auto px-6 py-12 flex flex-col gap-16 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        
        <Header activeTheme={activeTheme} setActiveTheme={setActiveTheme} />
        
        <Hero activeTheme={activeTheme} />

        {/* INTERACTIVE COMPONENT ROW */}
        <section className="grid md:grid-cols-3 gap-8">
          <CardWrapper theme={activeTheme} title="Data Input">
             <div className="space-y-4">
               <Label theme={activeTheme}>Frequency</Label>
               <input 
                 type="range" 
                 className={`w-full ${getRangeStyle(activeTheme)}`} 
               />
               <div className="flex gap-2">
                 <button className={`flex-1 ${getButtonStyle(activeTheme)}`}>Save</button>
                 <button className={`px-4 ${getSecondaryButtonStyle(activeTheme)}`}>Cancel</button>
               </div>
             </div>
          </CardWrapper>

          <CardWrapper theme={activeTheme} title="System Status">
             <div className="flex flex-col items-center justify-center h-full gap-4">
                <div className={`relative flex items-center justify-center ${getStatusIndicatorStyle(activeTheme)}`}>
                   <Activity size={32} />
                   {activeTheme === THEMES.POP && (
                     <div className="absolute -top-2 -right-2 bg-[#F43F5E] text-white text-[10px] font-bold px-2 py-1 rounded-full animate-bounce">
                       LOUD!
                     </div>
                   )}
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold">All Systems Go</h3>
                  <p className="opacity-60 text-sm mt-1">Operating at 98% efficiency</p>
                </div>
             </div>
          </CardWrapper>

          <CardWrapper theme={activeTheme} title="Counter">
            <div className="flex flex-col items-center justify-center h-full gap-6">
              <span className={`text-6xl font-bold tabular-nums ${activeTheme === THEMES.ZEN ? 'font-serif italic text-5xl' : ''}`}>
                {count.toString().padStart(2, '0')}
              </span>
              <div className="flex items-center gap-4">
                 <button 
                  onClick={() => setCount(Math.max(0, count - 1))}
                  className={`w-12 h-12 flex items-center justify-center ${getIconButtonStyle(activeTheme)}`}>
                   <Minus size={20} />
                 </button>
                 <button 
                  onClick={() => setCount(count + 1)}
                  className={`w-12 h-12 flex items-center justify-center ${getIconButtonStyle(activeTheme)}`}>
                   <Plus size={20} />
                 </button>
              </div>
            </div>
          </CardWrapper>
        </section>

        <FeatureSection theme={activeTheme} />

      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* SUB-COMPONENTS                                */
/* -------------------------------------------------------------------------- */

const Header = ({ activeTheme, setActiveTheme }) => (
  <header className="flex flex-col md:flex-row justify-between items-center gap-6">
    <div className="flex items-center gap-3">
       {/* LOGO MARK */}
       <div className={`w-10 h-10 flex items-center justify-center transition-all duration-500
         ${activeTheme === THEMES.LAB ? 'border border-[#94A3B8] bg-white text-[#0F172A]' : ''}
         ${activeTheme === THEMES.POP ? 'bg-[#F43F5E] rounded-xl rotate-3 shadow-[4px_4px_0px_#2E1065] text-white' : ''}
         ${activeTheme === THEMES.ZEN ? 'bg-[#D6D3CD] rounded-full text-white' : ''}
       `}>
         <Hexagon size={20} strokeWidth={activeTheme === THEMES.LAB ? 1 : 2.5} />
       </div>
       <div>
         <h1 className={`text-lg leading-none ${activeTheme === THEMES.LAB ? 'uppercase tracking-widest' : 'font-bold'}`}>
           {activeTheme === THEMES.LAB && "SYS.CONFIG_V2"}
           {activeTheme === THEMES.POP && "SuperFun UI"}
           {activeTheme === THEMES.ZEN && "Aura"}
         </h1>
       </div>
    </div>

    <div className={`flex p-1 gap-1 ${getNavContainerStyle(activeTheme)}`}>
      {[
        { id: THEMES.LAB, icon: <Activity size={14} />, label: "Precision" },
        { id: THEMES.POP, icon: <Zap size={14} />, label: "Euphoria" },
        { id: THEMES.ZEN, icon: <Wind size={14} />, label: "Serenity" }
      ].map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTheme(tab.id)}
          className={`flex items-center gap-2 px-4 py-2 text-sm transition-all duration-300
            ${activeTheme === tab.id ? getActiveTabStyle(tab.id) : 'opacity-50 hover:opacity-100'}
          `}
        >
          {tab.icon}
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  </header>
);

const Hero = ({ activeTheme }) => {
  return (
    <section className={`min-h-[400px] flex flex-col justify-center relative transition-all duration-700 ${activeTheme === THEMES.POP ? 'items-center text-center' : 'items-start'}`}>
      
      {/* HERO CONTENT: LAB */}
      {activeTheme === THEMES.LAB && (
        <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-8 border-t border-b border-[#94A3B8] py-12">
          <div className="col-span-12 md:col-span-8 space-y-6">
            <div className="flex items-center gap-4 text-xs font-mono text-[#64748B]">
              <span className="px-2 py-1 bg-[#E2E8F0]">FIG. 01</span>
              <span>// TECHNICAL PRECISION</span>
              <span className="animate-pulse">● LIVE</span>
            </div>
            <h2 className="text-5xl md:text-7xl tracking-tighter font-medium text-[#0F172A]">
              Information<br/>Architecture.
            </h2>
            <p className="max-w-xl text-[#475569] leading-relaxed border-l-2 border-[#FF4500] pl-4">
              A design system for complex data. Emphasizing clarity, high information density, and the beauty of raw engineering.
            </p>
          </div>
          <div className="col-span-12 md:col-span-4 border border-[#94A3B8] bg-white p-2 relative">
             {/* Decorative Grid Graphic */}
             <div className="h-full w-full bg-[#0F172A] p-4 flex flex-col justify-between">
                <div className="flex justify-between text-[#64748B] text-[10px] font-mono">
                  <span>X: 290.00</span>
                  <span>Y: 88.12</span>
                </div>
                <div className="w-full h-[1px] bg-[#334155]"></div>
                <div className="w-full h-[1px] bg-[#334155]"></div>
                <div className="w-full h-[1px] bg-[#334155]"></div>
                <div className="text-[#FF4500] text-xs font-mono mt-auto">AWAITING INPUT_</div>
             </div>
          </div>
        </div>
      )}

      {/* HERO CONTENT: POP */}
      {activeTheme === THEMES.POP && (
        <div className="relative py-12">
           <div className="absolute top-0 right-10 rotate-12 bg-[#F43F5E] text-white px-4 py-2 rounded-full font-bold shadow-lg animate-bounce">
             Ver 2.0!
           </div>
           <h2 className="text-7xl md:text-9xl font-black tracking-tight text-[#2E1065] mb-6 drop-shadow-[4px_4px_0px_rgba(255,255,255,1)]">
             Make It <span className="text-[#D946EF] inline-block hover:scale-110 transition-transform cursor-pointer">POP!</span>
           </h2>
           <p className="text-xl md:text-2xl font-medium text-[#2E1065]/70 max-w-2xl mx-auto mb-10">
             Optimism as an aesthetic. Big buttons, bright colors, and interactions that feel like toys. The internet should be fun again.
           </p>
           <button className="bg-[#4F46E5] text-white text-xl font-bold px-12 py-5 rounded-full shadow-[0px_10px_20px_rgba(79,70,229,0.3)] hover:shadow-[0px_15px_30px_rgba(79,70,229,0.4)] hover:-translate-y-1 transition-all active:scale-95 active:shadow-none">
             Start Playing
           </button>
        </div>
      )}

      {/* HERO CONTENT: ZEN */}
      {activeTheme === THEMES.ZEN && (
        <div className="w-full py-12 flex flex-col items-center text-center">
           <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#D6D3CD] to-white mb-8 blur-xl opacity-80"></div>
           <h2 className="text-5xl md:text-7xl font-serif text-[#44403C] mb-6 tracking-wide">
             The Quiet Web
           </h2>
           <p className="text-lg text-[#78716C] max-w-lg mx-auto leading-loose">
             A reaction to noise. Soft focus, organic shapes, and a palette drawn from stone and sand. Design that breathes with you.
           </p>
           <div className="mt-12 h-px w-24 bg-gradient-to-r from-transparent via-[#A8A29E] to-transparent"></div>
        </div>
      )}
    </section>
  );
};

const FeatureSection = ({ theme }) => {
  return (
    <div className={`p-8 md:p-12 transition-all duration-500 ${getFeatureContainerStyle(theme)}`}>
      <div className="flex flex-col md:flex-row gap-12 items-center">
        <div className="flex-1 space-y-6">
          <h3 className={`text-3xl ${theme === THEMES.LAB ? 'font-mono uppercase tracking-tighter' : theme === THEMES.POP ? 'font-black text-4xl' : 'font-serif italic'}`}>
            {theme === THEMES.LAB && "Structural Integrity"}
            {theme === THEMES.POP && "Dopamine Hits"}
            {theme === THEMES.ZEN && "Natural Flow"}
          </h3>
          <p className="opacity-70 leading-relaxed">
            {theme === THEMES.LAB && "The interface exposes its own construction. Borders are not hidden; they are celebrated. Every pixel is accounted for in the grid."}
            {theme === THEMES.POP && "Micro-interactions are exaggerated. Hover states don't just fade; they bounce, grow, and wiggle. Color is used to signal energy."}
            {theme === THEMES.ZEN && "Elements don't have hard edges; they have aversions to sharp corners. Shadows are diffused, creating a sense of floating weightlessness."}
          </p>
          <a href="#" className="inline-flex items-center gap-2 hover:gap-4 transition-all opacity-100 font-medium">
            Read Guidelines <ArrowRight size={16} />
          </a>
        </div>
        
        {/* VISUAL DEMO BLOCK */}
        <div className="flex-1 w-full aspect-video relative flex items-center justify-center">
           {theme === THEMES.LAB && (
             <div className="w-full h-full border border-[#94A3B8] bg-[#F8FAFC] relative overflow-hidden group">
                <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 divide-x divide-y divide-[#E2E8F0]">
                  {[...Array(24)].map((_, i) => <div key={i} className="group-hover:bg-[#E2E8F0] transition-colors duration-75 delay-[var(--delay)]" style={{'--delay': `${i * 20}ms`}}></div>)}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="bg-white border border-[#94A3B8] px-6 py-4 font-mono shadow-[4px_4px_0px_#0F172A]">
                      SYSTEM_READY
                   </div>
                </div>
             </div>
           )}

           {theme === THEMES.POP && (
             <div className="w-full h-full bg-[#E0E7FF] rounded-3xl relative overflow-hidden flex items-center justify-center">
                <div className="absolute w-32 h-32 bg-[#F43F5E] rounded-full top-[-20px] left-[-20px] animate-pulse"></div>
                <div className="absolute w-24 h-24 bg-[#FACC15] rounded-full bottom-[10%] right-[10%] animate-bounce"></div>
                <div className="relative z-10 bg-white px-8 py-6 rounded-2xl shadow-xl transform rotate-3 hover:rotate-0 transition-transform cursor-pointer">
                   <span className="text-4xl">🚀</span>
                </div>
             </div>
           )}

           {theme === THEMES.ZEN && (
             <div className="w-full h-full relative flex items-center justify-center">
                <div className="absolute inset-0 bg-white/40 backdrop-blur-md rounded-full scale-75 blur-3xl"></div>
                <div className="w-64 h-64 bg-gradient-to-b from-white to-[#E7CBA9]/20 rounded-full flex items-center justify-center border border-white/50 shadow-sm backdrop-blur-sm relative z-10">
                   <div className="w-32 h-32 bg-white rounded-full opacity-50 blur-xl animate-pulse"></div>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* STYLE UTILITIES                               */
/* -------------------------------------------------------------------------- */

const getNavContainerStyle = (theme) => {
  switch (theme) {
    case THEMES.LAB: return "bg-[#E2E8F0] rounded-none";
    case THEMES.POP: return "bg-white rounded-full shadow-sm border border-gray-100";
    case THEMES.ZEN: return "bg-[#E5E2DC] rounded-full";
    default: return "";
  }
};

const getActiveTabStyle = (theme) => {
  switch (theme) {
    case THEMES.LAB: 
      return "bg-[#0F172A] text-white shadow-none font-mono text-xs tracking-wider";
    case THEMES.POP: 
      return "bg-[#D946EF] text-white rounded-full shadow-md font-bold transform -translate-y-1";
    case THEMES.ZEN: 
      return "bg-white text-[#57534E] rounded-full shadow-sm";
    default: return "";
  }
};

const CardWrapper = ({ theme, title, children }) => {
  const styles = {
    [THEMES.LAB]: "bg-white border border-[#CBD5E1] shadow-none rounded-none relative",
    [THEMES.POP]: "bg-white rounded-3xl shadow-[8px_8px_0px_#E0E7FF] border-2 border-[#E0E7FF]",
    [THEMES.ZEN]: "bg-white/60 backdrop-blur-md rounded-2xl shadow-sm border border-white/40"
  };

  return (
    <div className={`p-6 min-h-[240px] flex flex-col ${styles[theme]}`}>
       <div className="mb-6 flex justify-between items-center">
         <Label theme={theme}>{title}</Label>
         {theme === THEMES.LAB && <div className="h-2 w-2 bg-[#10B981] rounded-full"></div>}
       </div>
       <div className="flex-1">
         {children}
       </div>
       {theme === THEMES.LAB && (
         <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#0F172A]"></div>
       )}
    </div>
  );
};

const Label = ({ theme, children }) => {
  const styles = {
    [THEMES.LAB]: "font-mono text-[10px] uppercase tracking-widest text-[#64748B]",
    [THEMES.POP]: "font-bold text-sm uppercase text-[#818CF8] tracking-wide",
    [THEMES.ZEN]: "font-serif italic text-sm text-[#78716C]"
  };
  return <h4 className={styles[theme]}>{children}</h4>;
};

const getButtonStyle = (theme) => {
  switch (theme) {
    case THEMES.LAB:
      return "bg-[#0F172A] text-white font-mono text-xs py-3 uppercase tracking-wider hover:bg-[#FF4500] transition-colors";
    case THEMES.POP:
      return "bg-[#8B5CF6] text-white font-bold py-3 rounded-xl shadow-[0_4px_0_#7C3AED] hover:translate-y-1 hover:shadow-none transition-all active:bg-[#6D28D9]";
    case THEMES.ZEN:
      return "bg-[#D6D3CD] text-[#44403C] py-3 rounded-lg hover:bg-[#C8C5BE] transition-colors duration-500";
    default: return "";
  }
};

const getSecondaryButtonStyle = (theme) => {
  switch (theme) {
    case THEMES.LAB:
      return "bg-transparent border border-[#94A3B8] text-[#475569] font-mono text-xs hover:border-[#0F172A] transition-colors";
    case THEMES.POP:
      return "bg-[#F3F4F6] text-[#4B5563] font-bold rounded-xl hover:bg-[#E5E7EB] transition-colors";
    case THEMES.ZEN:
      return "bg-transparent text-[#78716C] hover:text-[#44403C] transition-colors";
    default: return "";
  }
};

const getIconButtonStyle = (theme) => {
  switch (theme) {
    case THEMES.LAB: return "border border-[#CBD5E1] bg-white hover:border-[#0F172A] text-[#0F172A]";
    case THEMES.POP: return "bg-[#22D3EE] text-white rounded-full shadow-[0_4px_0_#0891B2] hover:translate-y-1 hover:shadow-none transition-all";
    case THEMES.ZEN: return "bg-white text-[#78716C] rounded-full shadow-sm hover:shadow-md transition-shadow";
    default: return "";
  }
};

const getRangeStyle = (theme) => {
  // Styling range inputs is complex in Tailwind, returning generic classes for demo
  switch (theme) {
    case THEMES.LAB: return "accent-[#FF4500] h-1 bg-gray-200 rounded-none appearance-none cursor-pointer";
    case THEMES.POP: return "accent-[#D946EF] h-4 bg-gray-100 rounded-full appearance-none cursor-pointer";
    case THEMES.ZEN: return "accent-[#A8A29E] h-1 bg-[#D6D3CD] rounded-full appearance-none cursor-pointer";
    default: return "";
  }
};

const getStatusIndicatorStyle = (theme) => {
  switch (theme) {
    case THEMES.LAB: return "w-16 h-16 border-2 border-[#0F172A] bg-white text-[#0F172A]";
    case THEMES.POP: return "w-16 h-16 bg-[#FACC15] text-[#2E1065] rounded-2xl shadow-[4px_4px_0px_#CA8A04] animate-pulse";
    case THEMES.ZEN: return "w-16 h-16 bg-gradient-to-br from-white to-[#E7CBA9] rounded-full shadow-inner text-[#78716C]";
    default: return "";
  }
};

const getFeatureContainerStyle = (theme) => {
  switch (theme) {
    case THEMES.LAB: return "bg-white border-y border-[#CBD5E1]";
    case THEMES.POP: return "bg-white m-4 rounded-3xl border-2 border-[#E0E7FF]";
    case THEMES.ZEN: return "bg-white/40 rounded-3xl";
    default: return "";
  }
};