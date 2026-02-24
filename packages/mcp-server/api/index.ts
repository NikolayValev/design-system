import type { IncomingMessage, ServerResponse } from 'node:http';
import { SERVER_NAME, SERVER_VERSION } from '../src/mcpServer.js';
import { renderSitePage, sendHtml, sendJson, wantsHtml } from './_lib/site.js';

const metadata = {
  service: SERVER_NAME,
  version: SERVER_VERSION,
  endpoints: {
    mcp: '/mcp',
    healthz: '/healthz',
    storybook: '/storybook',
    engineers: '/engineers',
    recruiters: '/recruiters',
    catalog: '/catalog',
    docs: '/docs',
  },
};

export default function handler(req: IncomingMessage, res: ServerResponse) {
  if (!wantsHtml(req)) {
    sendJson(res, metadata);
    return;
  }

  const body = `
    <section class="panel">
      <span class="pill">Public Portal</span>
      <span class="pill">${SERVER_NAME}</span>
      <span class="pill">v${SERVER_VERSION}</span>
      <h1 class="hero-title">Design System Platform</h1>
      <p class="hero-subtitle">
        This domain is the public hub for the complete design-system experience:
        interactive Storybook, MCP endpoint, integration docs, and artifact catalog.
      </p>
    </section>

    <section class="panel" style="margin-top: 16px;">
      <h2 style="margin-top: 0;">Choose your path</h2>
      <div class="grid">
        <article class="card">
          <h3><a href="/engineers">For Engineers</a></h3>
          <p>Install tokens, scaffold local source folders, wire MCP, and ship components fast.</p>
        </article>
        <article class="card">
          <h3><a href="/recruiters">For Recruiters</a></h3>
          <p>Review a clear demo narrative, live UI examples, and the architecture at a glance.</p>
        </article>
        <article class="card">
          <h3><a href="/storybook">Live Storybook</a></h3>
          <p>Explore component states, sections, pages, and visual design systems in one place.</p>
        </article>
        <article class="card">
          <h3><a href="/catalog">Artifact Catalog</a></h3>
          <p>See live component, section, and page inventory served by the same MCP backend.</p>
        </article>
      </div>
    </section>

    <section class="panel" style="margin-top: 16px;">
      <h2 style="margin-top: 0;">Machine endpoints</h2>
      <p class="hero-subtitle">
        MCP URL: <code>https://designsystem.nikolayvalev.com/mcp</code><br />
        Health check: <code>https://designsystem.nikolayvalev.com/healthz</code><br />
        JSON metadata: <code>https://designsystem.nikolayvalev.com/?format=json</code>
      </p>
    </section>
  `;

  sendHtml(
    res,
    renderSitePage({
      title: 'Design System Platform',
      description: 'Public portal for design-system demo, docs, and MCP integration.',
      pathname: '/',
      body,
    }),
  );
}
