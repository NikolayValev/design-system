import type { IncomingMessage, ServerResponse } from 'node:http';
import { renderSitePage, sendHtml, sendJson, wantsHtml } from './_lib/site.js';

export default function handler(req: IncomingMessage, res: ServerResponse) {
  if (!wantsHtml(req)) {
    sendJson(res, { section: 'docs' });
    return;
  }

  const body = `
    <section class="panel">
      <span class="pill">Architecture</span>
      <h1 class="hero-title">Design decisions</h1>
      <p class="hero-subtitle">
        Why each layer of the system exists, and how the layers relate to each other.
      </p>
    </section>

    <section class="panel" style="margin-top:16px">
      <h2 style="margin-top:0">Why OKLCH</h2>
      <p class="hero-subtitle" style="margin-bottom:12px">
        Every color token in this system uses the OKLCH color space instead of HSL or hex.
      </p>
      <div class="grid">
        <article class="card">
          <h3>Perceptual uniformity</h3>
          <p>Equal lightness steps look equal to the human eye. In HSL, <code>hsl(0 100% 50%)</code> and <code>hsl(200 100% 50%)</code> have the same <em>nominal</em> lightness but look drastically different. OKLCH fixes this — <code>L</code> maps to perceived brightness.</p>
        </article>
        <article class="card">
          <h3>Gamut independence</h3>
          <p>The same token value works across sRGB and P3 wide-gamut displays. The browser clips to what the display supports — no separate wide-gamut token set needed.</p>
        </article>
        <article class="card">
          <h3>Safe interpolation</h3>
          <p>Gradients and color mixing don't pass through muddy grey zones. OKLCH interpolation stays vivid across the range.</p>
        </article>
      </div>
    </section>

    <section class="panel" style="margin-top:16px">
      <h2 style="margin-top:0">Token system — three layers</h2>
      <div class="step">
        <div class="step-num">1</div>
        <div class="step-body">
          <p class="step-title">Base tokens (<code>base.ts</code>)</p>
          <p>Raw OKLCH values with no semantic meaning. Shared foundation across all profiles.</p>
        </div>
      </div>
      <div class="step">
        <div class="step-num">2</div>
        <div class="step-body">
          <p class="step-title">Profiles (<code>profiles.ts</code>)</p>
          <p>
            Map base tokens to semantic roles (<code>background</code>, <code>primary</code>, <code>foreground</code>…) for a specific context.<br />
            <strong>public</strong> — light + dark, vibrant, marketing sites.<br />
            <strong>dashboard</strong> — dark only, compact density, internal tools.<br />
            <strong>experimental</strong> — pure black, high contrast, zero radius, prototypes.
          </p>
        </div>
      </div>
      <div class="step">
        <div class="step-num">3</div>
        <div class="step-body">
          <p class="step-title">Tailwind preset + CSS variables (output)</p>
          <p>
            <code>createTailwindPreset(profile)</code> generates utility classes (<code>bg-primary</code>, <code>text-foreground</code>).<br />
            The CSS profile import (<code>styles/public.css</code>) emits CSS variables onto <code>:root</code>. Both outputs are derived from the same profile object — no duplication.
          </p>
        </div>
      </div>
    </section>

    <section class="panel" style="margin-top:16px">
      <h2 style="margin-top:0">VDE Themes — visual identity layer</h2>
      <p class="hero-subtitle" style="margin-bottom:16px">
        Profiles set <em>what values</em> the tokens hold. VDE themes set <em>what the UI feels like</em> — typography personality, surface physics, motion curves, ornamental elements.
      </p>
      <p class="hero-subtitle" style="margin-bottom:12px">
        Themes are applied via <code>&lt;VisionProvider theme="museum"&gt;</code>. Every child component reads from the active vision via <code>useVision()</code>. Nothing is hardcoded — swapping the theme swaps the entire design language at runtime with no recompile.
      </p>
      <div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(140px,1fr)); gap:8px">
        ${['aurora','brutalist','clay_soft','deconstruct','editorial','immersive','ma_minimalism','museum','noir','parchment','raw_data','solarpunk','swiss_international','synthwave','terminal','the_archive','the_ether','y2k_chrome','zen','zine_collage'].map(id => `<article class="card" style="padding:10px 12px"><p style="margin:0;font-family:monospace;font-size:11px;color:var(--brand)">${id}</p></article>`).join('')}
      </div>
    </section>

    <section class="panel" style="margin-top:16px">
      <h2 style="margin-top:0">MCP-native tooling</h2>
      <p class="hero-subtitle" style="margin-bottom:12px">
        The hosted MCP server exposes tools that AI agents (Claude, Cursor, Windsurf) call directly — no copy-paste, no manual file creation.
      </p>
      <div class="grid">
        <article class="card">
          <h3><code>list_components</code></h3>
          <p>Returns all available components, sections, and page templates with metadata.</p>
        </article>
        <article class="card">
          <h3><code>get_component_bundle</code></h3>
          <p>Returns source files for the requested components. Agent writes them to <code>src/design-system/</code>.</p>
        </article>
        <article class="card">
          <h3><code>list_themes</code></h3>
          <p>Lists all 20 VDE themes with their artistic personality and typography stack.</p>
        </article>
        <article class="card">
          <h3><code>get_token_theme</code></h3>
          <p>Returns the full token values for a named theme for programmatic use.</p>
        </article>
      </div>
      <div class="endpoints" style="margin-top:16px">
        <span class="endpoint">Hosted &nbsp;https://designsystem.nikolayvalev.com/mcp  (streamable HTTP)</span>
        <span class="endpoint">Local &nbsp;&nbsp;DESIGN_SYSTEM_SRC_DIR=/path/src npx @nikolayvalev/design-system-mcp --transport stdio</span>
      </div>
    </section>
  `;

  sendHtml(
    res,
    renderSitePage({
      title: 'Architecture — Design System',
      description: 'Design decisions: OKLCH tokens, profile layers, VDE themes, and MCP-native tooling.',
      pathname: '/docs',
      body,
    }),
  );
}
