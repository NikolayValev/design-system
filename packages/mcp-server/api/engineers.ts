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
      <span class="pill">Engineer Workflow</span>
      <h1 class="hero-title">Build and Integrate Fast</h1>
      <p class="hero-subtitle">
        Use the CLI to scaffold local design-system source folders, then connect your MCP client to
        <code>https://designsystem.nikolayvalev.com/mcp</code> for installable component bundles.
      </p>
    </section>

    <section class="panel" style="margin-top: 16px;">
      <h2 style="margin-top: 0;">CLI Bootstrap</h2>
      <div class="card">
        <p><code>npx @nikolayvalev/design-system@latest init</code></p>
        <p style="margin-top: 8px;">
          The command scaffolds <code>src/design-system</code> structure, creates MCP config files, and
          writes a project-level <code>design-system.config.json</code>.
        </p>
      </div>
    </section>

    <section class="panel" style="margin-top: 16px;">
      <h2 style="margin-top: 0;">Integration Endpoints</h2>
      <div class="grid">
        <article class="card">
          <h3>MCP</h3>
          <p><code>/mcp</code> for streamable HTTP tools and resources.</p>
        </article>
        <article class="card">
          <h3>Catalog</h3>
          <p><a href="/catalog">/catalog</a> lists live components, sections, and pages.</p>
        </article>
        <article class="card">
          <h3>Storybook</h3>
          <p><a href="/storybook">/storybook</a> is the visual source of truth.</p>
        </article>
        <article class="card">
          <h3>Health</h3>
          <p><code>/healthz</code> for uptime checks and automation probes.</p>
        </article>
      </div>
    </section>

    <section class="panel" style="margin-top: 16px;">
      <h2 style="margin-top: 0;">Docs</h2>
      <p class="hero-subtitle">
        Start at <a href="/docs">/docs</a> for implementation guides, runbooks, and architecture references.
      </p>
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
