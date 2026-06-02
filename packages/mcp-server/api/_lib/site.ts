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
        padding: 20px 24px 36px;
        max-width: 860px;
      }

      /* ── Content primitives ── */
      .panel {
        background: linear-gradient(180deg, var(--panel), var(--panel-alt));
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
        background: rgba(9,15,29,0.45);
      }

      .card h3 { margin: 0 0 5px; font-size: 14px; }
      .card p { margin: 0; color: var(--muted); line-height: 1.45; font-size: 13px; }

      .pill {
        display: inline-block;
        border-radius: 999px;
        border: 1px solid #34527f;
        color: #9fc2ff;
        padding: 3px 8px;
        font-size: 11px;
        margin: 0 6px 6px 0;
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
        background: rgba(93,228,199,0.12);
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
        color: #7aafcc;
        background: #0a1628;
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
          background: rgba(93,228,199,0.12);
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
