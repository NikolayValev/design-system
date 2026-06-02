import type { IncomingMessage, ServerResponse } from 'node:http';

function normalizeOrigin(value: string): string {
  return value.trim().replace(/\/+$/, '');
}

function getUpstreamPath(reqUrl: string): string {
  const url = new URL(reqUrl, 'http://localhost');
  const suffix = url.pathname.replace(/^\/api\/storybook\/?/, '');
  const normalizedPath = suffix.length > 0 ? `/${suffix}` : '/';
  return `${normalizedPath}${url.search}`;
}

export default function handler(req: IncomingMessage, res: ServerResponse) {
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

  const upstreamOrigin = normalizeOrigin(originRaw);
  const upstreamUrl = `${upstreamOrigin}${getUpstreamPath(req.url ?? '/')}`;

  res.statusCode = 302;
  res.setHeader('location', upstreamUrl);
  res.end();
}
