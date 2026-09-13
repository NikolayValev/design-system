#!/usr/bin/env node
// End-to-end smoke check for the design-system prod domain.
// Verifies portal, Storybook proxy, and MCP endpoint are reachable and
// return the expected shape. Wired into release.yml so a broken prod
// integration blocks the release (see NIK-21).
//
// Usage:
//   node scripts/smoke/prod-smoke.mjs
//   PROD_BASE_URL=https://staging.example.com node scripts/smoke/prod-smoke.mjs
//   PROD_SMOKE_STRICT=false node scripts/smoke/prod-smoke.mjs   # report but don't fail

import { setTimeout as delay } from 'node:timers/promises';

const BASE_URL = (process.env.PROD_BASE_URL ?? 'https://designsystem.nikolayvalev.com').replace(/\/$/, '');
const STRICT = (process.env.PROD_SMOKE_STRICT ?? 'true').toLowerCase() !== 'false';
const TIMEOUT_MS = Number(process.env.PROD_SMOKE_TIMEOUT_MS ?? 15_000);
const RETRIES = Number(process.env.PROD_SMOKE_RETRIES ?? 2);

// The portal handlers content-negotiate via `wantsHtml()` (api/_lib/site.ts):
// without an HTML Accept header they return JSON. A check asserting text/html
// must therefore ask for it, or it fails against a perfectly healthy portal.
const HTML_ACCEPT = 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8';

const checks = [
  {
    name: 'portal root',
    path: '/',
    headers: { accept: HTML_ACCEPT },
    expectStatus: [200],
    expectContentType: /text\/html/,
  },
  {
    name: 'healthz',
    path: '/healthz',
    expectStatus: [200],
  },
  {
    name: 'engineers route',
    path: '/engineers',
    headers: { accept: HTML_ACCEPT },
    expectStatus: [200],
    expectContentType: /text\/html/,
  },
  {
    name: 'recruiters route',
    path: '/recruiters',
    headers: { accept: HTML_ACCEPT },
    expectStatus: [200],
    expectContentType: /text\/html/,
  },
  {
    name: 'catalog route',
    path: '/catalog',
    expectStatus: [200],
  },
  {
    name: 'docs route',
    path: '/docs',
    expectStatus: [200],
  },
  {
    name: 'Storybook proxy',
    path: '/storybook/',
    headers: { accept: HTML_ACCEPT },
    expectStatus: [200],
    expectContentType: /text\/html/,
    expectBody: /storybook/i,
  },
  {
    name: 'MCP endpoint (initialize)',
    path: '/mcp',
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      accept: 'application/json, text/event-stream',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2025-03-26',
        capabilities: {},
        clientInfo: { name: 'prod-smoke', version: '1.0.0' },
      },
    }),
    // Streamable HTTP MCP servers return 200 on initialize.
    expectStatus: [200],
  },
];

async function fetchWithTimeout(url, init) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function runOne(check) {
  const url = `${BASE_URL}${check.path}`;
  const init = {
    method: check.method ?? 'GET',
    headers: check.headers,
    body: check.body,
    redirect: 'follow',
  };

  let lastError = null;
  for (let attempt = 0; attempt <= RETRIES; attempt += 1) {
    try {
      const res = await fetchWithTimeout(url, init);
      const problems = [];

      if (!check.expectStatus.includes(res.status)) {
        problems.push(`status ${res.status} not in [${check.expectStatus.join(', ')}]`);
      }

      if (check.expectContentType) {
        const ct = res.headers.get('content-type') ?? '';
        if (!check.expectContentType.test(ct)) {
          problems.push(`content-type "${ct}" did not match ${check.expectContentType}`);
        }
      }

      if (check.expectBody) {
        const text = await res.text();
        if (!check.expectBody.test(text)) {
          problems.push(`body did not match ${check.expectBody}`);
        }
      }

      if (problems.length === 0) {
        return { ok: true, status: res.status };
      }

      lastError = new Error(problems.join('; '));
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
    }

    if (attempt < RETRIES) {
      await delay(500 * (attempt + 1));
    }
  }

  return { ok: false, error: lastError?.message ?? 'unknown' };
}

async function main() {
  console.log(`Prod smoke check :: base=${BASE_URL} strict=${STRICT} timeout=${TIMEOUT_MS}ms retries=${RETRIES}`);
  let failures = 0;

  for (const check of checks) {
    const result = await runOne(check);
    if (result.ok) {
      console.log(`  ok    ${check.name.padEnd(28)} ${check.method ?? 'GET'} ${check.path} → ${result.status}`);
    } else {
      failures += 1;
      const prefix = STRICT ? '::error::' : '::warning::';
      console.log(`  FAIL  ${check.name.padEnd(28)} ${check.method ?? 'GET'} ${check.path} — ${result.error}`);
      console.log(`${prefix}Prod smoke check failed: ${check.name} (${check.method ?? 'GET'} ${BASE_URL}${check.path}) — ${result.error}`);
    }
  }

  console.log(`\nProd smoke summary: total=${checks.length} failures=${failures} strict=${STRICT}`);

  if (failures > 0 && STRICT) {
    process.exit(1);
  }
}

await main();
