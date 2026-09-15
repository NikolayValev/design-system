import type { IncomingMessage, ServerResponse } from 'node:http';

// Vercel injects the rewrite's catch-all placeholder as a query parameter
// (e.g. `?[...path]=index.html`). It is plumbing, not something Storybook
// should receive, so it is stripped before going upstream.
const CATCH_ALL_PARAM = /^\[\[?\.\.\..+?\]\]?$/;

// A Vercel rewrite does not change `req.url`, so the incoming path can be
// either the public `/storybook/...` or the direct `/api/storybook/...` form.
// Both prefixes are stripped; the Storybook project serves its build at root.
const STORYBOOK_PREFIX = /^\/(?:api\/)?storybook\/?/;

// Headers that describe a single hop and must not be relayed, plus `host`,
// which has to be the upstream's own.
const HOP_BY_HOP = new Set([
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
  'host',
]);

// `fetch` decodes the upstream body, so relaying these would describe bytes
// the client never receives.
const RECOMPUTED = new Set(['content-encoding', 'content-length']);

function normalizeOrigin(value: string): string {
  return value.trim().replace(/\/+$/, '');
}

// The public entry point for the proxied Storybook.
const STORYBOOK_ENTRY = '/storybook/?path=/';

// Storybook's manager, loaded with no `path` query, resolves a default story and
// rewrites the URL to a root-anchored `/?path=/story/...` -- which on this domain
// is the portal home page, so /storybook/ appeared to bounce the visitor out of
// Storybook entirely. Any `path` query suppresses that rewrite, and `path=/` lets
// Storybook pick its own default rather than hard-coding a story id here.
function needsDefaultPath(reqUrl: string): boolean {
  const url = new URL(reqUrl, 'http://localhost');
  const isIndex = url.pathname.replace(STORYBOOK_PREFIX, '').length === 0;
  return isIndex && !url.searchParams.has('path');
}

export function getUpstreamPath(reqUrl: string): string {
  const url = new URL(reqUrl, 'http://localhost');
  const suffix = url.pathname.replace(STORYBOOK_PREFIX, '');
  const normalizedPath = suffix.length > 0 ? `/${suffix}` : '/';

  for (const key of [...url.searchParams.keys()]) {
    if (CATCH_ALL_PARAM.test(key)) {
      url.searchParams.delete(key);
    }
  }

  return `${normalizedPath}${url.search}`;
}

function forwardableRequestHeaders(req: IncomingMessage): Record<string, string> {
  const headers: Record<string, string> = {};
  for (const [key, value] of Object.entries(req.headers)) {
    if (HOP_BY_HOP.has(key) || key === 'accept-encoding') continue;
    if (typeof value === 'string') headers[key] = value;
  }
  return headers;
}

// Proxies rather than redirects, so Storybook is served under the portal
// domain as documented. The Storybook build references every asset relatively
// (`./sb-manager/...`, `./assets/...`), so those resolve against `/storybook/`
// and stay inside this proxy. Shared by `index.ts` (bare /api/storybook) and
// the catch-all: Vercel's file-based routing does not treat `[[...path]]` as
// optional outside Next.js, so the bare path needs its own route.
export async function proxyToStorybook(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const originRaw = process.env.STORYBOOK_ORIGIN;
  if (!originRaw) {
    res.statusCode = 503;
    res.setHeader('content-type', 'application/json; charset=utf-8');
    res.end(
      JSON.stringify({
        error: 'storybook_unavailable',
        message: 'Set STORYBOOK_ORIGIN in Vercel project environment variables.',
      }),
    );
    return;
  }

  if (needsDefaultPath(req.url ?? '/')) {
    res.statusCode = 302;
    res.setHeader('location', STORYBOOK_ENTRY);
    res.end();
    return;
  }

  const upstreamUrl = `${normalizeOrigin(originRaw)}${getUpstreamPath(req.url ?? '/')}`;

  let upstream: Response;
  try {
    // Storybook is a static build, so no request body is forwarded.
    upstream = await fetch(upstreamUrl, {
      method: req.method ?? 'GET',
      headers: forwardableRequestHeaders(req),
      redirect: 'follow',
    });
  } catch (error) {
    res.statusCode = 502;
    res.setHeader('content-type', 'application/json; charset=utf-8');
    res.end(
      JSON.stringify({
        error: 'storybook_unreachable',
        message: error instanceof Error ? error.message : String(error),
      }),
    );
    return;
  }

  res.statusCode = upstream.status;
  upstream.headers.forEach((value, key) => {
    if (HOP_BY_HOP.has(key) || RECOMPUTED.has(key)) return;
    res.setHeader(key, value);
  });

  const body = Buffer.from(await upstream.arrayBuffer());
  res.end(body);
}
