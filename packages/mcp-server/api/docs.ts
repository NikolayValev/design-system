import type { IncomingMessage, ServerResponse } from 'node:http';
import { renderSitePage, sendHtml, sendJson, wantsHtml } from './_lib/site.js';

const DOC_LINKS = [
  { label: 'Root README', href: 'https://github.com/NikolayValev/design-system#readme' },
  { label: 'Quickstart', href: 'https://github.com/NikolayValev/design-system/blob/main/QUICKSTART.md' },
  { label: 'Design System Usage', href: 'https://github.com/NikolayValev/design-system/blob/main/packages/design-system/USAGE.md' },
  { label: 'Storybook Guide', href: 'https://github.com/NikolayValev/design-system/blob/main/docs/STORYBOOK.md' },
  { label: 'Platform Pipeline', href: 'https://github.com/NikolayValev/design-system/blob/main/docs/PLATFORM_PIPELINE.md' },
  { label: 'MCP Server README', href: 'https://github.com/NikolayValev/design-system/blob/main/packages/mcp-server/README.md' },
];

export default function handler(req: IncomingMessage, res: ServerResponse) {
  if (!wantsHtml(req)) {
    sendJson(res, {
      section: 'docs',
      links: DOC_LINKS,
      internal: ['/engineers', '/recruiters', '/catalog', '/storybook'],
    });
    return;
  }

  const cards = DOC_LINKS.map(
    doc => `
      <article class="card">
        <h3><a href="${doc.href}" target="_blank" rel="noreferrer">${doc.label}</a></h3>
        <p>Open source reference in the repository.</p>
      </article>
    `,
  ).join('');

  const body = `
    <section class="panel">
      <span class="pill">Documentation</span>
      <h1 class="hero-title">Browse Docs and Guides</h1>
      <p class="hero-subtitle">
        Use this index to navigate implementation docs, pipeline docs, and package-level setup references.
      </p>
    </section>

    <section class="panel" style="margin-top: 16px;">
      <h2 style="margin-top: 0;">Repository Documents</h2>
      <div class="grid">${cards}</div>
    </section>

    <section class="panel" style="margin-top: 16px;">
      <h2 style="margin-top: 0;">Live Routes</h2>
      <div class="card">
        <p><a href="/engineers">/engineers</a> for setup and CLI flow.</p>
        <p><a href="/recruiters">/recruiters</a> for demonstration narrative.</p>
        <p><a href="/catalog">/catalog</a> for live artifact inventory.</p>
        <p><a href="/storybook">/storybook</a> for interactive visual UI docs.</p>
      </div>
    </section>
  `;

  sendHtml(
    res,
    renderSitePage({
      title: 'Docs - Design System Platform',
      description: 'Documentation index for engineers and reviewers.',
      pathname: '/docs',
      body,
    }),
  );
}
