import type { IncomingMessage, ServerResponse } from 'node:http';
import { renderSitePage, sendHtml, sendJson, wantsHtml } from './_lib/site.js';

const RECRUITER_METADATA = {
  audience: 'recruiters',
  demoLinks: {
    storybook: '/storybook',
    catalog: '/catalog',
    engineers: '/engineers',
  },
  pitch: 'Production-grade installable component platform with OKLCH token system, 20 visual themes, MCP-native delivery, and three CSS profiles for different product contexts.',
};

export default function handler(req: IncomingMessage, res: ServerResponse) {
  if (!wantsHtml(req)) {
    sendJson(res, RECRUITER_METADATA);
    return;
  }

  const body = `
    <section class="panel">
      <span class="pill">Recruiter View</span>
      <h1 class="hero-title">Design System — Engineering Demo</h1>
      <p class="hero-subtitle">
        A production-grade component platform built to show system-level UI engineering:
        semantic token architecture, runtime visual themes, AI-native component delivery,
        and a hosted MCP server that lets AI agents install components directly into consuming repos.
      </p>
    </section>

    <section class="panel" style="margin-top:10px">
      <h2 style="margin-top:0">What to review</h2>
      <div class="grid">
        <article class="card">
          <h3><a href="/storybook">Storybook ↗</a></h3>
          <p>Live components, sections, and full-page templates. Switch all 20 visual themes from the toolbar in real time — no reloads, no recompile.</p>
        </article>
        <article class="card">
          <h3><a href="/catalog">Component Catalog</a></h3>
          <p>Full live inventory pulled directly from the MCP source layer — the same data AI tools query when browsing components.</p>
        </article>
        <article class="card">
          <h3><a href="/engineers">Engineer Guide</a></h3>
          <p>Step-by-step integration: token install, Tailwind preset, MCP config, and the source-install workflow.</p>
        </article>
        <article class="card">
          <h3><a href="/docs">Architecture</a></h3>
          <p>Why OKLCH. How the token layers work. The VDE theme system. MCP tool reference.</p>
        </article>
      </div>
    </section>

    <section class="panel" style="margin-top:10px">
      <h2 style="margin-top:0">Platform highlights</h2>
      <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:10px">
        <article class="card">
          <h3>OKLCH token system</h3>
          <p>All colors defined in OKLCH for perceptual uniformity and P3 gamut support. Three profiles (public, dashboard, experimental) map raw tokens to semantic roles. One import — all CSS variables set.</p>
        </article>
        <article class="card">
          <h3>20 runtime visual themes</h3>
          <p>Visionary Design Engine (VDE) themes swap the entire design language at runtime via a single context provider — typography, surface physics, motion, and ornament all change with no structural re-render.</p>
        </article>
        <article class="card">
          <h3>MCP-native component delivery</h3>
          <p>Components are installed as source files — not imported from npm. A hosted MCP server with 17 tools lets Claude, Cursor, or Windsurf browse and install components without leaving the IDE. shadcn-style bundles resolve transitive deps automatically.</p>
        </article>
        <article class="card">
          <h3>Designed for reuse across repos</h3>
          <p>The token package (<code>@nikolayvalev/design-tokens</code>) is the only runtime dependency. Components live in the consuming repo as first-class source. The <code>npx init</code> CLI scaffolds the full setup in under a minute.</p>
        </article>
      </div>
    </section>

    <section class="panel" style="margin-top:10px">
      <h2 style="margin-top:0">Technical summary</h2>
      <div class="endpoints">
        <span class="endpoint">Stack &nbsp;&nbsp;&nbsp;&nbsp;React · TypeScript · Tailwind · Vite · Turborepo monorepo</span>
        <span class="endpoint">Tokens &nbsp;&nbsp;&nbsp;OKLCH · 3 profiles · Tailwind preset + CSS variable output</span>
        <span class="endpoint">Themes &nbsp;&nbsp;&nbsp;20 VDE themes · runtime swap · VisionProvider context</span>
        <span class="endpoint">Delivery &nbsp;&nbsp;Hosted MCP server · 17 tools · shadcn-style install bundles</span>
        <span class="endpoint">Storybook &nbsp;v8 · autodocs · 16 story files · theme toolbar switcher</span>
        <span class="endpoint">CI/CD &nbsp;&nbsp;&nbsp;&nbsp;GitHub Actions · Vercel · Changesets for versioning</span>
      </div>
    </section>
  `;

  sendHtml(
    res,
    renderSitePage({
      title: 'Demo — Design System Platform',
      description: 'Recruiter-focused design-system overview with live Storybook, component catalog, and engineer integration guide.',
      pathname: '/recruiters',
      body,
    }),
  );
}
