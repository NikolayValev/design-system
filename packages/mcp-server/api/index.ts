import type { IncomingMessage, ServerResponse } from 'node:http';
import { SERVER_NAME, SERVER_VERSION } from '../src/mcpServer.js';

export default function handler(_req: IncomingMessage, res: ServerResponse) {
  res.statusCode = 200;
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.end(
    JSON.stringify({
      service: SERVER_NAME,
      version: SERVER_VERSION,
      endpoints: {
        mcp: '/mcp',
        healthz: '/healthz',
      },
    }),
  );
}
