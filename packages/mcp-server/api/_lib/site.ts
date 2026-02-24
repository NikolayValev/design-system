import type { IncomingMessage, ServerResponse } from 'node:http';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/engineers', label: 'Engineers' },
  { href: '/recruiters', label: 'Recruiters' },
  { href: '/catalog', label: 'Catalog' },
  { href: '/docs', label: 'Docs' },
  { href: '/storybook', label: 'Storybook' },
];

export function wantsHtml(req: IncomingMessage): boolean {
  const accept = String(req.headers.accept ?? '').toLowerCase();
  const url = new URL(req.url ?? '/', 'http://localhost');
  const format = url.searchParams.get('format');

  if (format === 'json') {
    return false;
  }

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

function renderNav(pathname: string): string {
  return NAV_LINKS.map(link => {
    const isActive = pathname === link.href;
    return `<a class="nav-link${isActive ? ' active' : ''}" href="${link.href}">${link.label}</a>`;
  }).join('');
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
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        font-family: "Segoe UI", "Inter", system-ui, -apple-system, sans-serif;
        background: radial-gradient(circle at 8% 6%, #1a2f4f, var(--bg) 44%) fixed;
        color: var(--text);
      }

      a {
        color: var(--brand);
      }

      .shell {
        max-width: 1080px;
        margin: 0 auto;
        padding: 24px 20px 40px;
      }

      .topbar {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-bottom: 24px;
      }

      .nav-link {
        border: 1px solid var(--line);
        border-radius: 999px;
        padding: 7px 13px;
        text-decoration: none;
        color: var(--muted);
        font-size: 14px;
      }

      .nav-link.active {
        color: #071217;
        background: linear-gradient(100deg, var(--brand), #7ef4dc);
        border-color: transparent;
        font-weight: 700;
      }

      .panel {
        background: linear-gradient(180deg, var(--panel), var(--panel-alt));
        border: 1px solid var(--line);
        border-radius: 18px;
        padding: 24px;
      }

      .hero-title {
        margin: 0 0 10px;
        font-size: clamp(28px, 4vw, 44px);
      }

      .hero-subtitle {
        margin: 0;
        color: var(--muted);
        max-width: 76ch;
        line-height: 1.5;
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 12px;
      }

      .card {
        border: 1px solid var(--line);
        border-radius: 14px;
        padding: 14px;
        background: rgba(9, 15, 29, 0.45);
      }

      .card h3 {
        margin: 0 0 8px;
      }

      .card p {
        margin: 0;
        color: var(--muted);
        line-height: 1.45;
      }

      .pill {
        display: inline-block;
        border-radius: 999px;
        border: 1px solid #34527f;
        color: #9fc2ff;
        padding: 4px 10px;
        font-size: 12px;
        margin: 0 8px 8px 0;
      }

      code {
        font-family: ui-monospace, "Cascadia Code", "Consolas", monospace;
      }

      @media (max-width: 760px) {
        .shell {
          padding: 18px 14px 28px;
        }

        .panel {
          padding: 16px;
        }
      }
    </style>
  </head>
  <body>
    <div class="shell">
      <nav class="topbar">${renderNav(pathname)}</nav>
      ${body}
    </div>
  </body>
</html>`;
}
