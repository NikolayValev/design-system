import type { IncomingMessage, ServerResponse } from 'node:http';

// Vercel injects the rewrite's catch-all placeholder as a query parameter
// (e.g. `?[...path]=index.html`). It is plumbing, not something Storybook
// should receive, so it is stripped before redirecting upstream.
const CATCH_ALL_PARAM = /^\[\[?\.\.\..+?\]\]?$/;

function normalizeOrigin(value: string): string {
  return value.trim().replace(/\/+$/, '');
}

// A Vercel rewrite does not change `req.url`, so the incoming path can be
// either the public `/storybook/...` or the direct `/api/storybook/...` form.
// Both prefixes are stripped; the Storybook project serves its build at root.
const STORYBOOK_PREFIX = /^\/(?:api\/)?storybook\/?/;

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

// Shared by `index.ts` (bare /api/storybook) and the catch-all. Vercel's
// file-based routing does not treat `[[...path]]` as optional outside Next.js,
// so the bare path needs its own route or it 404s before reaching a handler.
export function redirectToStorybook(req: IncomingMessage, res: ServerResponse) {
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

  const upstreamUrl = `${normalizeOrigin(originRaw)}${getUpstreamPath(req.url ?? '/')}`;

  res.statusCode = 302;
  res.setHeader('location', upstreamUrl);
  res.end();
}
