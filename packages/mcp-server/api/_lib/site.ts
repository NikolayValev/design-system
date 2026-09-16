import type { IncomingMessage, ServerResponse } from 'node:http';
import { getVisionThemeById, visionToCSSVariables } from '@nikolayvalev/design-system';

/*
 * The portal is the surface people judge this system by, and it used to be
 * styled by a second palette hand-rolled in this file — a near-black navy, a
 * mint brand, an amber secondary and a radial halo behind the whole page. None
 * of it came from the token layer, so the site advertising the design system was
 * the one place not using it.
 *
 * It now renders a real vision. `quiet_workshop` is the same identity the
 * author's own site runs, so the portal and nikolayvalev.com agree, and it
 * exercises both modes rather than hardcoding one.
 */
const PORTAL_VISION = 'quiet_workshop';

function portalTokens(mode: 'light' | 'dark'): string {
  const vision = getVisionThemeById(PORTAL_VISION);
  if (!vision) {
    throw new Error(`Portal vision "${PORTAL_VISION}" is not in the catalog`);
  }
  return Object.entries(visionToCSSVariables(vision, mode))
    .map(([name, value]) => `        ${name}: ${value};`)
    .join('\n');
}

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
${portalTokens('light')}
        /* The portal's own names, mapped onto the vision's tokens. */
        --bg: var(--vde-color-background);
        --panel: var(--vde-color-surface);
        --panel-alt: var(--vde-color-muted);
        --text: var(--vde-color-foreground);
        --muted: var(--vde-color-muted-foreground);
        --brand: var(--vde-color-accent);
        --brand-2: var(--vde-color-secondary-foreground);
        --line: var(--vde-color-border);
        --sidebar-w: 200px;
      }

      @media (prefers-color-scheme: dark) {
        :root {
${portalTokens('dark')}
        }
      }

      * { box-sizing: border-box; }

      body {
        margin: 0;
        /* Was a "Segoe UI" stack and a fixed radial halo behind every page. */
        font-family: var(--vde-font-body);
        font-size: var(--vde-font-size-body);
        line-height: var(--vde-line-height-normal);
        background: var(--bg);
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
        background: var(--vde-color-surface);
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
        color: var(--vde-color-muted-foreground);
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
        background: var(--vde-color-muted);
      }

      .sidebar-link.active {
        color: var(--text);
        background: color-mix(in oklab, var(--vde-color-accent) 8%, transparent);
        border-left-color: var(--brand);
        font-weight: 600;
      }

      .sidebar-link.tool {
        color: var(--vde-color-muted-foreground);
        font-size: 12px;
      }

      /* ── Main ── */
      .main {
        flex: 1;
        min-width: 0;
        padding: 20px 24px 36px;
        max-width: 860px;
      }

      /* ── Content primitives ── */
      .panel {
        background: var(--panel);
        border: 1px solid var(--line);
        border-radius: 14px;
        padding: 16px 20px;
      }

      .hero-title {
        margin: 0 0 8px;
        font-size: clamp(22px, 3vw, 34px);
        line-height: 1.15;
      }

      .hero-subtitle {
        margin: 0;
        color: var(--muted);
        max-width: 76ch;
        line-height: 1.55;
        font-size: 14px;
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 10px;
      }

      .card {
        border: 1px solid var(--line);
        border-radius: 10px;
        padding: 12px 14px;
        background: var(--vde-color-muted);
      }

      .card h3 { margin: 0 0 5px; font-size: 14px; }
      .card p { margin: 0; color: var(--muted); line-height: 1.45; font-size: 13px; }

      .pill {
        display: inline-block;
        border-radius: 999px;
        border: 1px solid var(--vde-color-border);
        color: var(--vde-color-foreground);
        padding: 3px 8px;
        font-size: 11px;
        margin: 0 6px 6px 0;
      }

      pre, code {
        font-family: ui-monospace, "Cascadia Code", "Consolas", monospace;
      }

      pre {
        background: var(--vde-color-muted);
        border: 1px solid var(--line);
        border-radius: 8px;
        padding: 14px 16px;
        overflow-x: auto;
        font-size: 13px;
        color: var(--vde-color-foreground);
        margin: 10px 0;
      }

      code {
        font-size: 0.88em;
        background: color-mix(in oklab, var(--vde-color-accent) 8%, transparent);
        color: var(--brand);
        padding: 1px 5px;
        border-radius: 3px;
      }

      pre code {
        background: none;
        color: inherit;
        padding: 0;
      }

      h2 { font-size: 16px; margin: 0 0 8px; }
      h3 { font-size: 14px; margin: 14px 0 5px; color: var(--text); }

      .step {
        display: flex;
        gap: 12px;
        margin-bottom: 14px;
      }

      .step-num {
        flex-shrink: 0;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: color-mix(in oklab, var(--vde-color-accent) 12%, transparent);
        border: 1px solid var(--brand);
        color: var(--brand);
        font-size: 10px;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 2px;
      }

      .step-body { flex: 1; }
      .step-body p { margin: 3px 0 0; color: var(--muted); font-size: 13px; line-height: 1.45; }
      .step-title { font-weight: 600; font-size: 13px; }

      .endpoints {
        display: flex;
        flex-direction: column;
        gap: 5px;
        margin-top: 6px;
      }

      .endpoint {
        font-family: ui-monospace, "Cascadia Code", monospace;
        font-size: 11px;
        color: var(--vde-color-muted-foreground);
        background: var(--vde-color-muted);
        border: 1px solid var(--line);
        border-radius: 5px;
        padding: 5px 10px;
      }

      /* ── Mobile ── */
      @media (max-width: 768px) {
        .shell { flex-direction: column; }

        .sidebar {
          width: 100%;
          height: auto;
          position: sticky;
          top: 0;
          z-index: 10;
          flex-direction: column;
          padding: 10px 16px 8px;
          border-right: none;
          border-bottom: 1px solid var(--line);
          overflow: hidden;
        }

        .sidebar-logo {
          padding: 0 0 8px;
          border-bottom: 1px solid var(--line);
          margin-bottom: 6px;
          font-size: 12px;
        }

        .sidebar-nav {
          flex-direction: row;
          flex-wrap: nowrap;
          padding: 0;
          gap: 3px;
          overflow-x: auto;
          scrollbar-width: none;
        }

        .sidebar-nav::-webkit-scrollbar { display: none; }

        .sidebar-section { display: none; }

        .sidebar-link {
          padding: 4px 10px;
          font-size: 12px;
          border-left: none;
          border-radius: 999px;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .sidebar-link.active {
          border-left: none;
          background: color-mix(in oklab, var(--vde-color-accent) 12%, transparent);
        }

        .main { padding: 16px 16px 32px; }

        pre { font-size: 12px; padding: 10px 12px; }
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
