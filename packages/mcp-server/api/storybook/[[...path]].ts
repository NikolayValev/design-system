import type { IncomingMessage, ServerResponse } from 'node:http';

const HOP_BY_HOP_HEADERS = new Set([
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
]);

function normalizeOrigin(value: string): string {
  return value.trim().replace(/\/+$/, '');
}

function getUpstreamPath(reqUrl: string): string {
  const url = new URL(reqUrl, 'http://localhost');
  const suffix = url.pathname.replace(/^\/api\/storybook\/?/, '');
  const normalizedPath = suffix.length > 0 ? `/${suffix}` : '/';
  return `${normalizedPath}${url.search}`;
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
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

  const method = req.method ?? 'GET';
  if (method !== 'GET' && method !== 'HEAD') {
    res.statusCode = 405;
    res.setHeader('content-type', 'application/json; charset=utf-8');
    res.end(
      JSON.stringify({
        error: 'method_not_allowed',
        message: 'Only GET and HEAD are supported for storybook proxy.',
      }),
    );
    return;
  }

  try {
    const upstreamOrigin = normalizeOrigin(originRaw);
    const upstreamUrl = `${upstreamOrigin}${getUpstreamPath(req.url ?? '/')}`;

    const upstream = await fetch(upstreamUrl, {
      method,
      redirect: 'follow',
    });

    res.statusCode = upstream.status;

    upstream.headers.forEach((value, key) => {
      if (!HOP_BY_HOP_HEADERS.has(key.toLowerCase())) {
        res.setHeader(key, value);
      }
    });

    if (method === 'HEAD') {
      res.end();
      return;
    }

    const body = Buffer.from(await upstream.arrayBuffer());
    res.end(body);
  } catch (error) {
    res.statusCode = 502;
    res.setHeader('content-type', 'application/json; charset=utf-8');
    res.end(
      JSON.stringify({
        error: 'storybook_proxy_failed',
        message: error instanceof Error ? error.message : 'Failed to proxy Storybook',
      }),
    );
  }
}
