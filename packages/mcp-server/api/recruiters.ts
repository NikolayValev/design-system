import type { IncomingMessage, ServerResponse } from 'node:http';
import { renderSitePage, sendHtml, sendJson, wantsHtml } from './_lib/site.js';

const RECRUITER_METADATA = {
  audience: 'recruiters',
  demoLinks: {
    storybook: '/storybook',
    catalog: '/catalog',
    engineers: '/engineers',
  },
  pitch: 'Installable component platform with token package, MCP delivery, and visual governance.',
};

export default function handler(req: IncomingMessage, res: ServerResponse) {
  if (!wantsHtml(req)) {
    sendJson(res, RECRUITER_METADATA);
    return;
  }

  const body = `
    <section class="panel">
      <span class="pill">Recruiter View</span>
      <h1 class="hero-title">Design System Demo Hub</h1>
      <p class="hero-subtitle">
        This platform demonstrates product-level UI engineering: reusable design tokens, installable
        component source, automated visual testing, and MCP-enabled delivery across repositories.
      </p>
    </section>

    <section class="panel" style="margin-top: 16px;">
      <h2 style="margin-top: 0;">What to review</h2>
      <div class="grid">
        <article class="card">
          <h3><a href="/storybook">1. Storybook Demo</a></h3>
          <p>Live components, sections, and full pages with multiple visual design styles.</p>
        </article>
        <article class="card">
          <h3><a href="/catalog">2. Artifact Catalog</a></h3>
          <p>Real source artifacts exposed by the same backend used by MCP tooling.</p>
        </article>
        <article class="card">
          <h3><a href="/engineers">3. Engineer Integration</a></h3>
          <p>CLI bootstrap and MCP workflow that enables source installation in other repos.</p>
        </article>
      </div>
    </section>

    <section class="panel" style="margin-top: 16px;">
      <h2 style="margin-top: 0;">Platform highlights</h2>
      <div class="card">
        <p>Token package is distributed separately from installable component source.</p>
        <p>Developers pull components through MCP bundles and keep source in-repo for customization.</p>
        <p>Visual quality is enforced with Storybook interaction tests and snapshot regression checks.</p>
      </div>
    </section>
  `;

  sendHtml(
    res,
    renderSitePage({
      title: 'Recruiters - Design System Platform',
      description: 'Recruiter-focused design-system demo overview and live links.',
      pathname: '/recruiters',
      body,
    }),
  );
}
