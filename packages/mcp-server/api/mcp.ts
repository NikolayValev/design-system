import type { IncomingMessage, ServerResponse } from 'node:http';
import { handleMcpHttpRequest } from '../src/mcpHttpHandler.js';

type RequestWithBody = IncomingMessage & {
  body?: unknown;
};

export default async function handler(req: RequestWithBody, res: ServerResponse) {
  await handleMcpHttpRequest(req, res);
}
