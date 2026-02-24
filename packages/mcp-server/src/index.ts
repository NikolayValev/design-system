#!/usr/bin/env node

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { createMcpExpressApp } from '@modelcontextprotocol/sdk/server/express.js';
import { createMcpServer, SERVER_NAME } from './mcpServer.js';

type TransportMode = 'stdio' | 'http';

const argv = process.argv.slice(2);

const getArg = (flag: string) => {
  const index = argv.indexOf(flag);
  if (index === -1 || index === argv.length - 1) {
    return undefined;
  }
  return argv[index + 1];
};

const resolveTransportMode = (): TransportMode => {
  const value = (getArg('--transport') ?? process.env.MCP_TRANSPORT ?? 'stdio').toLowerCase();
  if (value !== 'stdio' && value !== 'http') {
    throw new Error(`Invalid transport "${value}". Use "stdio" or "http".`);
  }
  return value;
};

const resolvePort = (): number => {
  const value = getArg('--port') ?? process.env.PORT ?? process.env.MCP_PORT ?? '4100';
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 65535) {
    throw new Error(`Invalid port "${value}".`);
  }
  return parsed;
};

async function runStdio() {
  const server = createMcpServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  process.stderr.write(`[${SERVER_NAME}] listening on stdio\n`);

  const shutdown = async () => {
    await server.close();
    process.exit(0);
  };

  process.on('SIGINT', () => {
    void shutdown();
  });
  process.on('SIGTERM', () => {
    void shutdown();
  });
}

async function runHttp() {
  const port = resolvePort();
  const app = createMcpExpressApp();

  app.get('/healthz', (_req, res) => {
    res.status(200).json({ ok: true, server: SERVER_NAME });
  });

  app.post('/mcp', async (req, res) => {
    const server = createMcpServer();

    try {
      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
      });
      await server.connect(transport);
      await transport.handleRequest(req, res, req.body);

      res.on('close', () => {
        void transport.close();
        void server.close();
      });
    } catch (error) {
      if (!res.headersSent) {
        const message = error instanceof Error ? error.message : 'Internal server error';
        res.status(500).json({
          jsonrpc: '2.0',
          error: {
            code: -32603,
            message,
          },
          id: null,
        });
      }
    }
  });

  app.get('/mcp', (_req, res) => {
    res.status(405).json({
      jsonrpc: '2.0',
      error: {
        code: -32000,
        message: 'Method not allowed',
      },
      id: null,
    });
  });

  app.delete('/mcp', (_req, res) => {
    res.status(405).json({
      jsonrpc: '2.0',
      error: {
        code: -32000,
        message: 'Method not allowed',
      },
      id: null,
    });
  });

  app.listen(port, () => {
    process.stderr.write(`[${SERVER_NAME}] listening on http://127.0.0.1:${port}/mcp\n`);
  });
}

async function main() {
  const transportMode = resolveTransportMode();
  if (transportMode === 'stdio') {
    await runStdio();
    return;
  }
  await runHttp();
}

void main().catch(error => {
  process.stderr.write(`[${SERVER_NAME}] ${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
});
