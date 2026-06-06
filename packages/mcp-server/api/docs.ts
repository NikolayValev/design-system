import type { IncomingMessage, ServerResponse } from 'node:http';
import { renderSitePage, sendHtml, sendJson, wantsHtml } from './_lib/site.js';

const DOCS_METADATA = {
  section: 'docs',
  topics: ['oklch', 'token-system', 'vde-themes', 'mcp-tooling'],
  mcpServer: {
    url: 'https://designsystem.nikolayvalev.com/mcp',
    transport: 'streamable-http',
    toolCount: 17,
    resourceCount: 6,
    tools: [
      { name: 'list_components', category: 'discovery', params: 'query?' },
      { name: 'list_sections', category: 'discovery', params: 'query?' },
      { name: 'list_pages', category: 'discovery', params: 'query?' },
      { name: 'list_artifacts', category: 'discovery', params: 'kind, query?' },
      { name: 'get_component_source', category: 'source', params: 'name' },
      { name: 'get_section_source', category: 'source', params: 'name' },
      { name: 'get_page_source', category: 'source', params: 'name' },
      { name: 'get_artifact_source', category: 'source', params: 'kind, name' },
      { name: 'get_component_bundle', category: 'bundle', params: 'names[]' },
      { name: 'get_section_bundle', category: 'bundle', params: 'names[]' },
      { name: 'get_page_bundle', category: 'bundle', params: 'names[]' },
      { name: 'get_artifact_bundle', category: 'bundle', params: 'kind, names[]' },
      { name: 'list_themes', category: 'tokens-themes', params: '' },
      { name: 'get_theme', category: 'tokens-themes', params: 'id' },
      { name: 'list_token_profiles', category: 'tokens-themes', params: '' },
      { name: 'get_token_profile_source', category: 'tokens-themes', params: '' },
      { name: 'get_contribution_guide', category: 'guide', params: '' },
    ],
    resources: [
      'design-system://components',
      'design-system://sections',
      'design-system://pages',
      'design-system://themes',
      'design-system://token-profiles',
      'design-system://contribution-guide',
    ],
  },
};

export default function handler(req: IncomingMessage, res: ServerResponse) {
  if (!wantsHtml(req)) {
    sendJson(res, DOCS_METADATA);
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

    <section class="panel" style="margin-top:10px">
      <h2 style="margin-top:0">Why OKLCH</h2>
      <p style="color:var(--muted);font-size:13px;margin:0 0 12px;line-height:1.55">
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
          <p>Gradients and color mixing don't pass through muddy grey zones. OKLCH interpolation stays vivid across the range — critical for transitions between accent colors.</p>
        </article>
      </div>
    </section>

    <section class="panel" style="margin-top:10px">
      <h2 style="margin-top:0">Token system — three layers</h2>
      <div class="step">
        <div class="step-num">1</div>
        <div class="step-body">
          <p class="step-title">Base tokens (<code>base.ts</code>)</p>
          <p>Raw OKLCH values with no semantic meaning. Shared foundation across all profiles. Changes here ripple everywhere.</p>
        </div>
      </div>
      <div class="step">
        <div class="step-num">2</div>
        <div class="step-body">
          <p class="step-title">Profiles (<code>profiles.ts</code>)</p>
          <p>
            Map base tokens to semantic roles (<code>background</code>, <code>primary</code>, <code>foreground</code>, <code>border</code>…) for a specific context.<br />
            <strong>public</strong> — light + dark mode, vibrant palette, marketing sites.<br />
            <strong>dashboard</strong> — dark only, compact density, reduced motion, internal tools.<br />
            <strong>experimental</strong> — pure black background, maximum contrast, zero border-radius, prototypes.
          </p>
        </div>
      </div>
      <div class="step">
        <div class="step-num">3</div>
        <div class="step-body">
          <p class="step-title">Tailwind preset + CSS variables (output)</p>
          <p>
            <code>createTailwindPreset(profile)</code> generates utility classes (<code>bg-primary</code>, <code>text-foreground</code>, <code>border-border</code>).<br />
            The CSS profile import (<code>styles/public.css</code>) emits CSS variables onto <code>:root</code>. Both outputs are derived from the same profile object — no duplication.
          </p>
        </div>
      </div>
    </section>

    <section class="panel" style="margin-top:10px">
      <h2 style="margin-top:0">VDE Themes — visual identity layer</h2>
      <p style="color:var(--muted);font-size:13px;line-height:1.55;margin:0 0 8px">
        Profiles set <em>what values</em> the tokens hold. VDE themes set <em>what the UI feels like</em> — typography personality, surface physics, motion curves, ornamental elements.
        Applied via <code>&lt;VisionProvider theme="museum"&gt;</code>; every child component reads from the active vision via <code>useVision()</code>.
        Swapping the theme swaps the entire design language at runtime — no recompile.
      </p>
      <div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:6px">
        ${['editorial','museum','swiss_international','zen','clay_soft','terminal','brutalist','immersive','synthwave','noir','solarpunk','y2k_chrome'].map(id => `<article class="card" style="padding:8px 10px"><p style="margin:0;font-family:monospace;font-size:11px;color:var(--brand)">${id}</p></article>`).join('')}
      </div>
    </section>

    <section class="panel" style="margin-top:10px">
      <h2 style="margin-top:0">MCP tooling — 17 tools, 6 resources</h2>
      <p style="color:var(--muted);font-size:13px;line-height:1.55;margin:0 0 14px">
        AI agents (Claude, Cursor, Windsurf) call these tools directly. No copy-paste, no context switching.
        Connect at <code>https://designsystem.nikolayvalev.com/mcp</code> (streamable HTTP).
      </p>

      <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px;margin-bottom:14px">
        <article class="card">
          <h3>Discovery</h3>
          <p style="margin-bottom:8px;font-size:12px">Find what's available. Optional <code>query</code> filter on all.</p>
          <p style="margin:2px 0;font-size:12px"><code>list_components(query?)</code></p>
          <p style="margin:2px 0;font-size:12px"><code>list_sections(query?)</code></p>
          <p style="margin:2px 0;font-size:12px"><code>list_pages(query?)</code></p>
          <p style="margin:2px 0;font-size:12px"><code>list_artifacts(kind, query?)</code></p>
        </article>
        <article class="card">
          <h3>Install bundles</h3>
          <p style="margin-bottom:8px;font-size:12px">Source files + all transitive deps — shadcn-style. Agent writes to <code>src/design-system/</code> and commits.</p>
          <p style="margin:2px 0;font-size:12px"><code>get_component_bundle(names[])</code></p>
          <p style="margin:2px 0;font-size:12px"><code>get_section_bundle(names[])</code></p>
          <p style="margin:2px 0;font-size:12px"><code>get_page_bundle(names[])</code></p>
          <p style="margin:2px 0;font-size:12px"><code>get_artifact_bundle(kind, names[])</code></p>
        </article>
        <article class="card">
          <h3>Read source</h3>
          <p style="margin-bottom:8px;font-size:12px">One file at a time — inspect before installing.</p>
          <p style="margin:2px 0;font-size:12px"><code>get_component_source(name)</code></p>
          <p style="margin:2px 0;font-size:12px"><code>get_section_source(name)</code></p>
          <p style="margin:2px 0;font-size:12px"><code>get_page_source(name)</code></p>
          <p style="margin:2px 0;font-size:12px"><code>get_artifact_source(kind, name)</code></p>
        </article>
        <article class="card">
          <h3>Tokens &amp; themes</h3>
          <p style="margin-bottom:8px;font-size:12px">All 20 VDE themes and the three OKLCH token profiles.</p>
          <p style="margin:2px 0;font-size:12px"><code>list_themes()</code></p>
          <p style="margin:2px 0;font-size:12px"><code>get_theme(id)</code></p>
          <p style="margin:2px 0;font-size:12px"><code>list_token_profiles()</code></p>
          <p style="margin:2px 0;font-size:12px"><code>get_token_profile_source()</code></p>
        </article>
        <article class="card">
          <h3>Guide</h3>
          <p style="margin-bottom:8px;font-size:12px">Contribution patterns and conventions for extending the system.</p>
          <p style="margin:2px 0;font-size:12px"><code>get_contribution_guide()</code></p>
        </article>
      </div>

      <h3 style="margin-top:14px">MCP Resources (auto-read by supporting clients)</h3>
      <div class="endpoints" style="margin-top:6px">
        <span class="endpoint">design-system://components</span>
        <span class="endpoint">design-system://sections</span>
        <span class="endpoint">design-system://pages</span>
        <span class="endpoint">design-system://themes</span>
        <span class="endpoint">design-system://token-profiles</span>
        <span class="endpoint">design-system://contribution-guide</span>
      </div>

      <h3>Client configuration</h3>
      <p style="color:var(--muted);font-size:13px;margin:4px 0 8px">Add to your Claude Desktop, Cursor, or Windsurf MCP config:</p>
      <pre><code>{
  "mcpServers": {
    "design-system": {
      "url": "https://designsystem.nikolayvalev.com/mcp"
    }
  }
}</code></pre>

      <h3>Local / stdio mode</h3>
      <pre><code>DESIGN_SYSTEM_SRC_DIR=/path/to/packages/design-system/src \\
  npx @nikolayvalev/design-system-mcp --transport stdio</code></pre>
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
