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
      <span class="pill">Design System</span>
      <span class="pill">v${SERVER_VERSION}</span>
      <h1 class="hero-title">Production-grade design system.<br>AI-native from day one.</h1>
      <p class="hero-subtitle">
        OKLCH token system · 20 VDE visual themes · three CSS profiles ·
        hosted MCP server so AI agents can browse and install components directly.
      </p>
    </section>

    <section class="panel" style="margin-top:10px">
      <h2 style="margin-top:0">Where do you want to go?</h2>
      <div class="grid">
        <article class="card">
          <h3><a href="/engineers">Engineers</a></h3>
          <p>Install tokens, configure Tailwind, wire your AI client to MCP, scaffold components.</p>
        </article>
        <article class="card">
          <h3><a href="/docs">Architecture</a></h3>
          <p>Why OKLCH. How the token layers work. VDE themes. The MCP server internals.</p>
        </article>
        <article class="card">
          <h3><a href="/storybook">Storybook ↗</a></h3>
          <p>Live component playground. Switch all 20 VDE themes from the toolbar in real time.</p>
        </article>
        <article class="card">
          <h3><a href="/catalog">Component Catalog</a></h3>
          <p>Full inventory of components, sections, and page templates served by the MCP backend.</p>
        </article>
      </div>
    </section>

    <section class="panel" style="margin-top:10px">
      <h2 style="margin-top:0">Machine endpoints</h2>
      <div class="endpoints">
        <span class="endpoint">MCP &nbsp;&nbsp;&nbsp;https://designsystem.nikolayvalev.com/mcp</span>
        <span class="endpoint">Health  https://designsystem.nikolayvalev.com/healthz</span>
        <span class="endpoint">JSON &nbsp;&nbsp;https://designsystem.nikolayvalev.com/?format=json</span>
      </div>
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
