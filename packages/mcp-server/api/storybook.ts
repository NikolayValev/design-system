import type { IncomingMessage, ServerResponse } from 'node:http';
import { proxyToStorybook } from './_lib/storybook.js';

// A single plain function, not a filesystem catch-all: Vercel's zero-config
// builder did not match `api/storybook/[...path].ts` beyond one path segment,
// so `/storybook/sb-addons/<addon>/manager-bundle.js` 404'd before reaching a
// handler. Every /storybook/* path is rewritten here instead, and because a
// rewrite leaves `req.url` as the original path, the handler still sees the
// full path it needs to proxy.
export default async function handler(req: IncomingMessage, res: ServerResponse) {
  await proxyToStorybook(req, res);
}
