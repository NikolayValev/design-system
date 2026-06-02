import type { IncomingMessage, ServerResponse } from 'node:http';
import { renderSitePage, sendHtml, sendJson, wantsHtml } from './_lib/site.js';

const ENGINEER_METADATA = {
  audience: 'engineers',
  quickstart: {
    cli: 'npx @nikolayvalev/design-system@latest init',
    mcpUrl: 'https://designsystem.nikolayvalev.com/mcp',
    storybook: 'https://designsystem.nikolayvalev.com/storybook',
  },
  docs: ['/docs', '/catalog'],
};

export default function handler(req: IncomingMessage, res: ServerResponse) {
  if (!wantsHtml(req)) {
    sendJson(res, ENGINEER_METADATA);
    return;
  }

  const body = `
    <section class="panel">
      <span class="pill">Engineer Quickstart</span>
      <h1 class="hero-title">Get running in 5 minutes</h1>
      <p class="hero-subtitle">
        Install the token package, pick a CSS profile, configure Tailwind, wire your AI client,
        then let MCP install components directly into your repo.
      </p>
    </section>

    <section class="panel" style="margin-top:10px">
      <h2 style="margin-top:0">Step-by-step workflow</h2>

      <div class="step">
        <div class="step-num">1</div>
        <div class="step-body">
          <p class="step-title">Install the tokens package</p>
          <p>This is the only runtime dependency. Everything else is source-installed.</p>
          <pre><code>npm install @nikolayvalev/design-tokens</code></pre>
        </div>
      </div>

      <div class="step">
        <div class="step-num">2</div>
        <div class="step-body">
          <p class="step-title">Pick one CSS profile and import it</p>
          <p>One profile per app. It sets all CSS variables for the chosen context.</p>
          <pre><code>// Marketing site — light + dark mode, vibrant
import '@nikolayvalev/design-tokens/styles/public.css';

// Internal tool — dark only, compact density
import '@nikolayvalev/design-tokens/styles/dashboard.css';

// Prototype — pure black, high contrast, zero radius
import '@nikolayvalev/design-tokens/styles/experimental.css';</code></pre>
        </div>
      </div>

      <div class="step">
        <div class="step-num">3</div>
        <div class="step-body">
          <p class="step-title">Configure the Tailwind preset</p>
          <p>The preset maps every token to a semantic utility class (<code>bg-primary</code>, <code>text-foreground</code>, etc.).</p>
          <pre><code>// tailwind.config.ts
import { createTailwindPreset, publicProfile } from '@nikolayvalev/design-tokens/tailwind';

export default {
  presets: [createTailwindPreset(publicProfile)],
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
};</code></pre>
        </div>
      </div>

      <div class="step">
        <div class="step-num">4</div>
        <div class="step-body">
          <p class="step-title">Wire MCP to your AI client</p>
          <p>Add this to your Claude Desktop, Cursor, or Windsurf MCP config file.</p>
          <pre><code>{
  "mcpServers": {
    "design-system": {
      "url": "https://designsystem.nikolayvalev.com/mcp"
    }
  }
}</code></pre>
        </div>
      </div>

      <div class="step">
        <div class="step-num">5</div>
        <div class="step-body">
          <p class="step-title">Install components via MCP</p>
          <p>
            Ask your AI agent: <em>"Install the Button and Card components from the design system."</em><br />
            The agent calls <code>get_component_bundle(["Button", "Card"])</code>, receives source files
            with all transitive dependencies resolved, then writes them under <code>src/design-system/</code>.
            Commit the result — components are source, not runtime imports.
          </p>
          <p style="margin-top:6px">
            Browse first with <code>list_components()</code>, read one file with <code>get_component_source("Button")</code>,
            or install a full section template with <code>get_section_bundle(["HeroSection"])</code>.
            17 tools total — see <a href="/docs">/docs</a> for the full reference.
          </p>
        </div>
      </div>

      <div class="step">
        <div class="step-num">6</div>
        <div class="step-body">
          <p class="step-title">Optional: CLI scaffold</p>
          <p>Scaffolds folder structure, MCP config, and <code>design-system.config.json</code> automatically.</p>
          <pre><code>npx @nikolayvalev/design-system@latest init</code></pre>
        </div>
      </div>
    </section>

    <section class="panel" style="margin-top:10px">
      <h2 style="margin-top:0">Key imports reference</h2>
      <div class="grid">
        <article class="card">
          <h3>Runtime theming</h3>
          <p><code>@nikolayvalev/design-tokens</code></p>
        </article>
        <article class="card">
          <h3>Profiles &amp; types</h3>
          <p><code>@nikolayvalev/design-tokens/tokens</code></p>
        </article>
        <article class="card">
          <h3>Tailwind preset</h3>
          <p><code>@nikolayvalev/design-tokens/tailwind</code></p>
        </article>
        <article class="card">
          <h3>CSS variables</h3>
          <p><code>@nikolayvalev/design-tokens/styles/[profile].css</code></p>
        </article>
      </div>
    </section>
  `;

  sendHtml(
    res,
    renderSitePage({
      title: 'Engineers - Design System Platform',
      description: 'Engineer-facing setup and integration guide for the design-system platform.',
      pathname: '/engineers',
      body,
    }),
  );
}
