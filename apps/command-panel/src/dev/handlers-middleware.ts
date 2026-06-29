import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Plugin } from 'vite';
import { POST as chatPOST } from '../../api/chat';
import { POST as dataPOST } from '../../api/data';

export async function toWebRequest(req: IncomingMessage): Promise<Request> {
  const method = req.method ?? 'GET';
  const url = `http://localhost${req.url ?? '/'}`;
  const hasBody = method !== 'GET' && method !== 'HEAD';
  let body: Buffer | undefined;
  if (hasBody) {
    const chunks: Buffer[] = [];
    for await (const chunk of req) chunks.push(chunk as Buffer);
    body = chunks.length ? Buffer.concat(chunks) : undefined;
  }
  return new Request(url, {
    method,
    headers: req.headers as Record<string, string>,
    body: body ? (body.buffer.slice(body.byteOffset, body.byteOffset + body.byteLength) as ArrayBuffer) : undefined,
  });
}

export async function sendWebResponse(res: ServerResponse, web: Response): Promise<void> {
  res.statusCode = web.status;
  web.headers.forEach((value, key) => res.setHeader(key, value));
  if (!web.body) {
    res.end();
    return;
  }
  const reader = web.body.getReader();
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    res.write(Buffer.from(value));
  }
  res.end();
}

function mount(
  res: ServerResponse,
  handler: (req: Request) => Promise<Response>,
  webReq: Request,
  next: (err?: unknown) => void,
): void {
  handler(webReq)
    .then((webRes) => sendWebResponse(res, webRes))
    .catch((err) => next(err));
}

export function commandPanelDevApi(): Plugin {
  return {
    name: 'command-panel-dev-api',
    configureServer(server) {
      server.middlewares.use('/api/chat', (req, res, next) => {
        if (req.method !== 'POST') return next();
        toWebRequest(req as IncomingMessage)
          .then((webReq) => mount(res as ServerResponse, chatPOST, webReq, next))
          .catch(next);
      });
      server.middlewares.use('/api/data', (req, res, next) => {
        if (req.method !== 'POST') return next();
        toWebRequest(req as IncomingMessage)
          .then((webReq) => mount(res as ServerResponse, dataPOST, webReq, next))
          .catch(next);
      });
    },
  };
}
