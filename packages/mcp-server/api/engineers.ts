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
        Install the package, import one vision's tokens and fonts, wrap the app in the
        provider, wire your AI client, then let MCP install components into your repo.
      </p>
    </section>

    <section class="panel" style="margin-top:10px">
      <h2 style="margin-top:0">Step-by-step workflow</h2>

      <div class="step">
        <div class="step-num">1</div>
        <div class="step-body">
          <p class="step-title">Install the package</p>
          <p>This is the only runtime dependency. Components are source-installed.</p>
          <pre><code>npm install @nikolayvalev/design-system</code></pre>
        </div>
      </div>

      <div class="step">
        <div class="step-num">2</div>
        <div class="step-body">
          <p class="step-title">Import one vision, and its fonts</p>
          <p>
            One vision per app. The stylesheet sets every <code>--vde-*</code> variable for that
            vision in <em>both</em> light and dark, so you write no override block of your own.
            The companion font file self-hosts only the faces that vision uses.
          </p>
          <pre><code>// app/layout.tsx
import '@nikolayvalev/design-system/styles/quiet_workshop.css';
import '@nikolayvalev/design-system/styles/fonts/quiet_workshop.css';</code></pre>
        </div>
      </div>

      <div class="step">
        <div class="step-num">3</div>
        <div class="step-body">
          <p class="step-title">Wrap the app in VisionProvider</p>
          <p>
            Mode resolves in this order: an explicit <code>mode</code> prop, then the vision's
            <code>defaultMode</code>, then the user's <code>prefers-color-scheme</code>.
          </p>
          <pre><code>import { VisionProvider, defaultVisionRegistry } from '@nikolayvalev/design-system';

&lt;VisionProvider registry={defaultVisionRegistry} defaultVisionId="quiet_workshop"&gt;
  {children}
&lt;/VisionProvider&gt;</code></pre>
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
          <h3>Components &amp; provider</h3>
          <p><code>@nikolayvalev/design-system</code></p>
        </article>
        <article class="card">
          <h3>Vision tokens, both modes</h3>
          <p><code>@nikolayvalev/design-system/styles/[vision].css</code></p>
        </article>
        <article class="card">
          <h3>Self-hosted faces</h3>
          <p><code>@nikolayvalev/design-system/styles/fonts/[vision].css</code></p>
        </article>
        <article class="card">
          <h3>CSS variables</h3>
          <p><code>--vde-color-*</code>, <code>--vde-font-size-*</code>, <code>--vde-space-*</code>, <code>--vde-radius-*</code></p>
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
