# Docs Portal + Storybook Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade `designsystem.nikolayvalev.com` to a sidebar docs portal and reorganize the Storybook so engineers can orient themselves in under 2 minutes.

**Architecture:** Two independent commits. Commit 1 rewrites the HTML shell in `packages/mcp-server/api/_lib/site.ts` (horizontal pill nav → left sidebar) and refills three page handlers with real content. Commit 2 renames story groups, adds per-story descriptions, and expands the Overview story — no component code changes.

**Tech Stack:** Node.js HTTP handlers (no framework), inline HTML/CSS strings, TypeScript. Storybook v8 with `@storybook/react-vite`, `Meta`/`StoryObj` types.

---

## Commit 1 — Docs Portal

### Task 1: Sidebar layout in `_lib/site.ts`

**Files:**
- Modify: `packages/mcp-server/api/_lib/site.ts`

No automated tests exist for HTML output in this codebase. Verification is manual: `pnpm dev` inside `packages/mcp-server`, then open `http://localhost:3000`.

- [ ] **Step 1: Replace `renderNav` and the shell HTML in `renderSitePage`**

Open `packages/mcp-server/api/_lib/site.ts`. Replace the entire file with the following (keep `wantsHtml`, `sendJson`, `sendHtml`, `escapeHtml` unchanged — only touch `NAV_LINKS`, `renderNav`, and the HTML/CSS inside `renderSitePage`):

```typescript
import type { IncomingMessage, ServerResponse } from 'node:http';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/engineers', label: 'Engineers' },
  { href: '/recruiters', label: 'Recruiters' },
  { href: '/catalog', label: 'Catalog' },
  { href: '/docs', label: 'Docs' },
];

const TOOL_LINKS = [
  { href: '/storybook', label: 'Storybook ↗', external: true },
  { href: '/mcp', label: '/mcp', external: false },
];

export function wantsHtml(req: IncomingMessage): boolean {
  const accept = String(req.headers.accept ?? '').toLowerCase();
  const url = new URL(req.url ?? '/', 'http://localhost');
  const format = url.searchParams.get('format');
  if (format === 'json') return false;
  return accept.includes('text/html') || accept.includes('application/xhtml+xml');
}

export function sendJson(res: ServerResponse, payload: unknown, statusCode = 200): void {
  res.statusCode = statusCode;
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

export function sendHtml(res: ServerResponse, html: string, statusCode = 200): void {
  res.statusCode = statusCode;
  res.setHeader('content-type', 'text/html; charset=utf-8');
  res.end(html);
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderSidebar(pathname: string): string {
  const navItems = NAV_LINKS.map(link => {
    const isActive = pathname === link.href;
    return `<a class="sidebar-link${isActive ? ' active' : ''}" href="${link.href}">${link.label}</a>`;
  }).join('');

  const toolItems = TOOL_LINKS.map(link => {
    const attrs = link.external ? ' target="_blank" rel="noreferrer"' : '';
    return `<a class="sidebar-link tool"${attrs} href="${link.href}">${link.label}</a>`;
  }).join('');

  return `
    <aside class="sidebar">
      <a class="sidebar-logo" href="/"><span>NV</span><span class="logo-slash">/</span><span>DS</span></a>
      <nav class="sidebar-nav">
        <p class="sidebar-section">Navigate</p>
        ${navItems}
        <p class="sidebar-section" style="margin-top:20px">Tools</p>
        ${toolItems}
      </nav>
    </aside>`;
}

export function renderSitePage({
  title,
  description,
  pathname,
  body,
}: {
  title: string;
  description: string;
  pathname: string;
  body: string;
}): string {
  const pageTitle = escapeHtml(title);
  const pageDescription = escapeHtml(description);

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${pageTitle}</title>
    <meta name="description" content="${pageDescription}" />
    <style>
      :root {
        --bg: #070b14;
        --panel: #0f1729;
        --panel-alt: #121f38;
        --text: #e9f0ff;
        --muted: #9fb3d6;
        --brand: #5de4c7;
        --brand-2: #ffb76f;
        --line: #1f3558;
        --sidebar-w: 200px;
      }

      * { box-sizing: border-box; }

      body {
        margin: 0;
        font-family: "Segoe UI", "Inter", system-ui, -apple-system, sans-serif;
        background: radial-gradient(circle at 8% 6%, #1a2f4f, var(--bg) 44%) fixed;
        color: var(--text);
        min-height: 100vh;
      }

      a { color: var(--brand); }

      /* ── Shell ── */
      .shell {
        display: flex;
        min-height: 100vh;
      }

      /* ── Sidebar ── */
      .sidebar {
        width: var(--sidebar-w);
        flex-shrink: 0;
        background: rgba(9,15,28,0.72);
        border-right: 1px solid var(--line);
        display: flex;
        flex-direction: column;
        padding: 24px 0 32px;
        position: sticky;
        top: 0;
        height: 100vh;
        overflow-y: auto;
      }

      .sidebar-logo {
        display: block;
        padding: 0 20px 20px;
        border-bottom: 1px solid var(--line);
        margin-bottom: 16px;
        font-size: 14px;
        font-weight: 800;
        letter-spacing: 2px;
        text-transform: uppercase;
        text-decoration: none;
        color: var(--text);
      }

      .logo-slash { color: var(--brand); }

      .sidebar-nav {
        display: flex;
        flex-direction: column;
        padding: 0 12px;
      }

      .sidebar-section {
        margin: 0 0 4px;
        padding: 0 8px;
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        color: #3a5a7a;
      }

      .sidebar-link {
        display: block;
        padding: 7px 10px;
        border-radius: 6px;
        font-size: 13px;
        color: var(--muted);
        text-decoration: none;
        margin-bottom: 2px;
        border-left: 2px solid transparent;
        transition: color 0.15s, background 0.15s;
      }

      .sidebar-link:hover {
        color: var(--text);
        background: rgba(255,255,255,0.05);
      }

      .sidebar-link.active {
        color: var(--text);
        background: rgba(93,228,199,0.08);
        border-left-color: var(--brand);
        font-weight: 600;
      }

      .sidebar-link.tool {
        color: #5a8aaa;
        font-size: 12px;
      }

      /* ── Main ── */
      .main {
        flex: 1;
        min-width: 0;
        padding: 32px 36px 48px;
        max-width: 860px;
      }

      /* ── Content primitives ── */
      .panel {
        background: linear-gradient(180deg, var(--panel), var(--panel-alt));
        border: 1px solid var(--line);
        border-radius: 18px;
        padding: 24px;
      }

      .hero-title {
        margin: 0 0 10px;
        font-size: clamp(26px, 3.5vw, 40px);
        line-height: 1.15;
      }

      .hero-subtitle {
        margin: 0;
        color: var(--muted);
        max-width: 76ch;
        line-height: 1.6;
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 12px;
      }

      .card {
        border: 1px solid var(--line);
        border-radius: 14px;
        padding: 16px;
        background: rgba(9,15,29,0.45);
      }

      .card h3 { margin: 0 0 8px; font-size: 15px; }
      .card p { margin: 0; color: var(--muted); line-height: 1.5; font-size: 14px; }

      .pill {
        display: inline-block;
        border-radius: 999px;
        border: 1px solid #34527f;
        color: #9fc2ff;
        padding: 4px 10px;
        font-size: 12px;
        margin: 0 8px 8px 0;
      }

      pre, code {
        font-family: ui-monospace, "Cascadia Code", "Consolas", monospace;
      }

      pre {
        background: #0a1628;
        border: 1px solid var(--line);
        border-radius: 8px;
        padding: 14px 16px;
        overflow-x: auto;
        font-size: 13px;
        color: #a5c8ff;
        margin: 10px 0;
      }

      code {
        font-size: 0.88em;
        background: rgba(93,228,199,0.08);
        color: var(--brand);
        padding: 1px 5px;
        border-radius: 3px;
      }

      pre code {
        background: none;
        color: inherit;
        padding: 0;
      }

      h2 { font-size: 18px; margin: 0 0 10px; }
      h3 { font-size: 15px; margin: 20px 0 6px; color: var(--text); }

      .step {
        display: flex;
        gap: 14px;
        margin-bottom: 20px;
      }

      .step-num {
        flex-shrink: 0;
        width: 26px;
        height: 26px;
        border-radius: 50%;
        background: rgba(93,228,199,0.12);
        border: 1px solid var(--brand);
        color: var(--brand);
        font-size: 11px;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 2px;
      }

      .step-body { flex: 1; }
      .step-body p { margin: 4px 0 0; color: var(--muted); font-size: 13px; line-height: 1.5; }
      .step-title { font-weight: 600; font-size: 14px; }

      .endpoints {
        display: flex;
        flex-direction: column;
        gap: 6px;
        margin-top: 8px;
      }

      .endpoint {
        font-family: ui-monospace, "Cascadia Code", monospace;
        font-size: 12px;
        color: #7aafcc;
        background: #0a1628;
        border: 1px solid var(--line);
        border-radius: 6px;
        padding: 6px 12px;
      }

      /* ── Mobile ── */
      @media (max-width: 768px) {
        .shell { flex-direction: column; }

        .sidebar {
          width: 100%;
          height: auto;
          position: static;
          flex-direction: row;
          flex-wrap: wrap;
          align-items: center;
          padding: 12px 16px;
          border-right: none;
          border-bottom: 1px solid var(--line);
          gap: 4px;
        }

        .sidebar-logo { padding: 0 16px 0 0; border-bottom: none; margin-bottom: 0; }
        .sidebar-nav { flex-direction: row; flex-wrap: wrap; padding: 0; gap: 2px; }
        .sidebar-section { display: none; }
        .sidebar-link { padding: 5px 9px; font-size: 12px; border-left: none; border-radius: 999px; }
        .sidebar-link.active { border-left: none; }

        .main { padding: 20px 18px 36px; }
      }
    </style>
  </head>
  <body>
    <div class="shell">
      ${renderSidebar(pathname)}
      <main class="main">
        ${body}
      </main>
    </div>
  </body>
</html>`;
}
```

- [ ] **Step 2: Verify the layout renders**

Run the MCP server dev mode:
```bash
cd packages/mcp-server
pnpm dev
```
Open `http://localhost:3000`. Expected: sidebar on the left with logo, Navigate section (Home · Engineers · Recruiters · Catalog · Docs), Tools section (Storybook ↗ · /mcp). Home link should be highlighted with a teal left border. All other pages should auto-pick up the new sidebar via `renderSitePage`.

- [ ] **Step 3: Check all routes still work**

Navigate to each route in the browser: `/engineers`, `/recruiters`, `/catalog`, `/docs`. Each should render with the new sidebar, correct active link highlighted, and existing content. No 500 errors.

---

### Task 2: Rewrite home page (`api/index.ts`)

**Files:**
- Modify: `packages/mcp-server/api/index.ts`

- [ ] **Step 1: Replace the `body` string in the handler**

Open `packages/mcp-server/api/index.ts`. Replace the `body` template literal (everything assigned to `const body = \`...\``) with:

```typescript
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

    <section class="panel" style="margin-top:16px">
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

    <section class="panel" style="margin-top:16px">
      <h2 style="margin-top:0">Machine endpoints</h2>
      <div class="endpoints">
        <span class="endpoint">MCP &nbsp;&nbsp;&nbsp;https://designsystem.nikolayvalev.com/mcp</span>
        <span class="endpoint">Health  https://designsystem.nikolayvalev.com/healthz</span>
        <span class="endpoint">JSON &nbsp;&nbsp;https://designsystem.nikolayvalev.com/?format=json</span>
      </div>
    </section>
  `;
```

- [ ] **Step 2: Verify in browser**

Open `http://localhost:3000`. Expected: hero with tagline, 4 cards (Engineers, Architecture, Storybook, Component Catalog), machine endpoints strip. Architecture card now links to `/docs`.

---

### Task 3: Rewrite engineers page (`api/engineers.ts`)

**Files:**
- Modify: `packages/mcp-server/api/engineers.ts`

- [ ] **Step 1: Replace the handler body string**

Open `packages/mcp-server/api/engineers.ts`. Replace the entire `body` template literal with:

```typescript
  const body = `
    <section class="panel">
      <span class="pill">Engineer Quickstart</span>
      <h1 class="hero-title">Get running in 5 minutes</h1>
      <p class="hero-subtitle">
        Install the token package, pick a CSS profile, configure Tailwind, wire your AI client,
        then let MCP install components directly into your repo.
      </p>
    </section>

    <section class="panel" style="margin-top:16px">
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
            It calls <code>get_component_bundle(["Button", "Card"])</code>, returns the source files,
            and writes them under <code>src/design-system/</code>. Commit the result.
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

    <section class="panel" style="margin-top:16px">
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
```

- [ ] **Step 2: Verify in browser**

Open `http://localhost:3000/engineers`. Expected: 6 numbered steps with code blocks, key imports grid at the bottom. Sidebar shows Engineers as active.

---

### Task 4: Rewrite docs page (`api/docs.ts`)

**Files:**
- Modify: `packages/mcp-server/api/docs.ts`

- [ ] **Step 1: Replace the entire file**

Replace `packages/mcp-server/api/docs.ts` with:

```typescript
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
```

- [ ] **Step 2: Verify in browser**

Open `http://localhost:3000/docs`. Expected: 4 sections (Why OKLCH, Token system 3-layer diagram, VDE theme grid of 20 themes, MCP tools grid). Sidebar shows Docs as active.

---

### Task 5: Commit 1

- [ ] **Step 1: Stage and commit**

```bash
git add packages/mcp-server/api/_lib/site.ts \
        packages/mcp-server/api/index.ts \
        packages/mcp-server/api/engineers.ts \
        packages/mcp-server/api/docs.ts
git commit -m "feat(portal): sidebar layout + content rewrite for docs portal"
```

---

## Commit 2 — Storybook Cleanup

### Task 6: Rename story groups — primitives

**Files:**
- Modify: `apps/storybook/src/Button.stories.tsx`
- Modify: `apps/storybook/src/Card.stories.tsx`
- Modify: `apps/storybook/src/Input.stories.tsx`
- Modify: `apps/storybook/src/Layout.stories.tsx`
- Modify: `apps/storybook/src/EditorialHeader.stories.tsx`
- Modify: `apps/storybook/src/NavigationOrb.stories.tsx`
- Modify: `apps/storybook/src/MediaFrame.stories.tsx`
- Modify: `apps/storybook/src/GalleryStage.stories.tsx`
- Modify: `apps/storybook/src/AtmosphereProvider.stories.tsx`

In each file, change the `title` field in the `meta` object from `'Design System/<Name>'` to `'Primitives/<Name>'`. Also add `parameters.docs.description` to the `parameters` block. The exact changes for each file:

- [ ] **Step 1: Button** — change `title: 'Design System/Button'` to `title: 'Primitives/Button'`. Add to `parameters`:
  ```ts
  docs: { description: { component: 'Token-driven action primitive with five variants (default, secondary, destructive, outline, ghost) and three sizes. All visual properties derive from the active VDE theme.' } },
  ```

- [ ] **Step 2: Card** — change `title: 'Design System/Card'` to `title: 'Primitives/Card'`. Add to `parameters`:
  ```ts
  docs: { description: { component: 'Surface container with semantic sub-components (CardHeader, CardTitle, CardContent). Background, border, and shadow inherit from the active vision.' } },
  ```

- [ ] **Step 3: Input** — change `title: 'Design System/Input'` to `title: 'Primitives/Input'`. Add to `parameters`:
  ```ts
  docs: { description: { component: 'Form input primitive. Surface, border, focus ring, and motion curves all derive from the active VDE theme.' } },
  ```

- [ ] **Step 4: Layout** — change `title: 'Design System/Layout'` to `title: 'Primitives/Layout'`. Add to `parameters` (Layout has no `storyCaption` yet):
  ```ts
  storyCaption: 'Token-driven section shell. Provides consistent max-width, padding, and heading slot across all layout contexts.',
  docs: { description: { component: 'Shared scaffold for building reusable sections. Accepts a heading prop and children.' } },
  ```

- [ ] **Step 5: EditorialHeader** — change `title: 'Design System/EditorialHeader'` to `title: 'Primitives/EditorialHeader'`. Add to `parameters`:
  ```ts
  docs: { description: { component: 'Vision-aware display heading with massive size variant and optional vertical writing mode. Font stack switches with the active VDE theme.' } },
  ```

- [ ] **Step 6: NavigationOrb** — change `title: 'Design System/NavigationOrb'` to `title: 'Primitives/NavigationOrb'`. Add to `parameters`:
  ```ts
  docs: { description: { component: 'Floating navigation component with vision-specific motion physics. Supports both inline and floating (fixed) positioning modes.' } },
  ```

- [ ] **Step 7: MediaFrame** — change `title: 'Design System/MediaFrame'` to `title: 'Primitives/MediaFrame'`. Add to `parameters`:
  ```ts
  docs: { description: { component: 'Vision-aware image and video wrapper with atmospheric overlay effects. Aspect ratio and frame style adapt to the active theme.' } },
  ```

- [ ] **Step 8: GalleryStage** — change `title: 'Design System/GalleryStage'` to `title: 'Primitives/GalleryStage'`. Add to `parameters`:
  ```ts
  docs: { description: { component: 'Material-shifting container with four surface presets (adaptive, paper, slab, glass) and archetype ornaments from the active vision.' } },
  ```

- [ ] **Step 9: AtmosphereProvider** — change `title: 'Design System/AtmosphereProvider'` to `title: 'Primitives/AtmosphereProvider'`. Add to `parameters`:
  ```ts
  docs: { description: { component: 'Global background utility. Renders archive (grain/noise) or nexus (mesh) atmospheric effects behind all page content.' } },
  ```

---

### Task 7: Rename story groups — sections, pages, VDE, overview

**Files:**
- Modify: `apps/storybook/src/HeroSection.stories.tsx`
- Modify: `apps/storybook/src/FeatureGridSection.stories.tsx`
- Modify: `apps/storybook/src/MetricStripSection.stories.tsx`
- Modify: `apps/storybook/src/MarketingLandingPage.stories.tsx`
- Modify: `apps/storybook/src/ProductShowcasePage.stories.tsx`
- Modify: `apps/storybook/src/VisionaryExplorer.stories.tsx`
- Modify: `apps/storybook/src/Overview.stories.tsx`

- [ ] **Step 1: HeroSection** — change `title: 'Design System/Sections/HeroSection'` to `title: 'Sections/HeroSection'`. Add to `parameters`:
  ```ts
  docs: { description: { component: 'Composable hero section. Accepts heading, subtitle, and action buttons. All colors and typography derive from the active VDE theme.' } },
  ```

- [ ] **Step 2: FeatureGridSection** — change `title: 'Design System/Sections/FeatureGridSection'` to `title: 'Sections/FeatureGridSection'`. Add to `parameters`:
  ```ts
  docs: { description: { component: 'Three-column feature grid section with eyebrow, title, description, and item list. Installs as source via MCP get_component_bundle.' } },
  ```

- [ ] **Step 3: MetricStripSection** — change `title: 'Design System/Sections/MetricStripSection'` to `title: 'Sections/MetricStripSection'`. Add to `parameters`:
  ```ts
  docs: { description: { component: 'KPI metric strip designed for launch and product pages. Accepts label/value pairs and adapts to the active vision typography.' } },
  ```

- [ ] **Step 4: MarketingLandingPage** — change `title: 'Design System/Pages/MarketingLandingPage'` to `title: 'Pages/MarketingLandingPage'`. Add to `parameters`:
  ```ts
  docs: { description: { component: 'Full marketing landing page template composed from HeroSection, FeatureGridSection, and MetricStripSection. Install as source via MCP.' } },
  ```

- [ ] **Step 5: ProductShowcasePage** — change `title: 'Design System/Pages/ProductShowcasePage'` to `title: 'Pages/ProductShowcasePage'`. Add to `parameters`:
  ```ts
  docs: { description: { component: 'Product showcase page template with media frame, feature list, and CTA section. All layout and color respond to the active VDE theme.' } },
  ```

- [ ] **Step 6: VisionaryExplorer** — change `title: 'Visionary/Explorer'` to `title: 'VDE/VisionaryExplorer'`. Add to `parameters`:
  ```ts
  docs: { description: { component: 'Interactive guide to all 20 VDE themes. Each theme shows its personality, typography stack, color palette, use cases, and a live component preview.' } },
  ```

- [ ] **Step 7: Overview** — change `title: 'Overview'` to `title: 'Introduction/Overview'`.

---

### Task 8: Expand the Overview story with navigation guide

**Files:**
- Modify: `apps/storybook/src/Overview.stories.tsx`

The current Overview story already has: hero with token contract explanation, theme tile grid, and three principle cards. Add a **Navigation Guide** section and an **Install via MCP** note before the footer.

- [ ] **Step 1: Add the navigation guide section**

In `Overview.stories.tsx`, find the `<footer>` element near the end of `OverviewContent`. Insert this JSX block immediately before it:

```tsx
      <section className="grid gap-6 lg:grid-cols-2">
        <article
          className="rounded-[14px] border [border-color:var(--vde-color-border)] [background:var(--vde-color-surface)] [color:var(--vde-color-surface-foreground)] p-6 space-y-4"
        >
          <p className="text-[10px] uppercase tracking-[0.28em] opacity-55">04 · Navigation Guide</p>
          <h3
            className="text-xl"
            style={{ fontFamily: 'var(--vde-font-display)', letterSpacing: 'var(--vde-letter-spacing-tight)' }}
          >
            What's in the sidebar
          </h3>
          <ul className="space-y-2 text-sm leading-relaxed opacity-80 list-none p-0 m-0">
            <li><strong>Introduction</strong> — you are here. Theme switcher and system overview.</li>
            <li><strong>Primitives</strong> — Button, Card, Input, Layout, EditorialHeader, NavigationOrb, MediaFrame, GalleryStage, AtmosphereProvider.</li>
            <li><strong>Sections</strong> — HeroSection, FeatureGridSection, MetricStripSection. Compose into pages.</li>
            <li><strong>Pages</strong> — MarketingLandingPage, ProductShowcasePage. Full page templates.</li>
            <li><strong>VDE</strong> — VisionaryExplorer. Deep dive into all 20 themes.</li>
          </ul>
        </article>

        <article
          className="rounded-[14px] border [border-color:var(--vde-color-border)] [background:var(--vde-color-surface)] [color:var(--vde-color-surface-foreground)] p-6 space-y-4"
        >
          <p className="text-[10px] uppercase tracking-[0.28em] opacity-55">05 · Install via MCP</p>
          <h3
            className="text-xl"
            style={{ fontFamily: 'var(--vde-font-display)', letterSpacing: 'var(--vde-letter-spacing-tight)' }}
          >
            Components install as source
          </h3>
          <p className="text-sm leading-relaxed opacity-80">
            Components are not imported from npm — they're installed as source files into your repo via MCP, then committed.
            Wire your AI client to the MCP server and ask it to install any component you see here.
          </p>
          <code
            className="block rounded-[8px] border [border-color:var(--vde-color-border)] [background:var(--vde-color-background)] p-3 text-[11px] leading-relaxed opacity-90"
            style={{ fontFamily: 'var(--vde-font-mono, monospace)' }}
          >
            {`{ "mcpServers": { "design-system": { "url": "https://designsystem.nikolayvalev.com/mcp" } } }`}
          </code>
        </article>
      </section>
```

- [ ] **Step 2: Verify in Storybook**

Run the Storybook dev server:
```bash
cd apps/storybook
pnpm storybook
```
Open `http://localhost:6006`. Expected: Overview story is under `Introduction > Overview` in the sidebar. New section with "Navigation Guide" and "Install via MCP" cards visible below the principles section.

---

### Task 9: Update story sort order in `preview.tsx`

**Files:**
- Modify: `apps/storybook/.storybook/preview.tsx`

- [ ] **Step 1: Replace `storySort.order`**

Find the `options.storySort.order` array in `preview.tsx` and replace it with:

```typescript
order: [
  'Introduction',
  ['Overview'],
  'Primitives',
  ['Button', 'Input', 'Card', 'Layout', 'EditorialHeader', 'NavigationOrb', 'MediaFrame', 'GalleryStage', 'AtmosphereProvider'],
  'Sections',
  ['HeroSection', 'FeatureGridSection', 'MetricStripSection'],
  'Pages',
  ['MarketingLandingPage', 'ProductShowcasePage'],
  'VDE',
  ['VisionaryExplorer'],
],
```

- [ ] **Step 2: Verify sidebar order in Storybook**

Hard-reload Storybook (`http://localhost:6006`). Expected sidebar order:
```
Introduction
  └─ Overview
Primitives
  ├─ Button
  ├─ Input
  ├─ Card
  ├─ Layout
  ├─ EditorialHeader
  ├─ NavigationOrb
  ├─ MediaFrame
  ├─ GalleryStage
  └─ AtmosphereProvider
Sections
  ├─ HeroSection
  ├─ FeatureGridSection
  └─ MetricStripSection
Pages
  ├─ MarketingLandingPage
  └─ ProductShowcasePage
VDE
  └─ VisionaryExplorer
```

---

### Task 10: Commit 2

- [ ] **Step 1: Stage and commit all storybook changes**

```bash
git add apps/storybook/src/Overview.stories.tsx \
        apps/storybook/src/Button.stories.tsx \
        apps/storybook/src/Card.stories.tsx \
        apps/storybook/src/Input.stories.tsx \
        apps/storybook/src/Layout.stories.tsx \
        apps/storybook/src/EditorialHeader.stories.tsx \
        apps/storybook/src/NavigationOrb.stories.tsx \
        apps/storybook/src/MediaFrame.stories.tsx \
        apps/storybook/src/GalleryStage.stories.tsx \
        apps/storybook/src/AtmosphereProvider.stories.tsx \
        apps/storybook/src/HeroSection.stories.tsx \
        apps/storybook/src/FeatureGridSection.stories.tsx \
        apps/storybook/src/MetricStripSection.stories.tsx \
        apps/storybook/src/MarketingLandingPage.stories.tsx \
        apps/storybook/src/ProductShowcasePage.stories.tsx \
        apps/storybook/src/VisionaryExplorer.stories.tsx \
        apps/storybook/.storybook/preview.tsx
git commit -m "feat(storybook): reorganize story groups and add per-story documentation"
```
