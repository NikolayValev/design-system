#!/usr/bin/env node
// Simple uptime probe (NIK-20). Reads newline-separated target URLs from the
// UPTIME_TARGETS env var, fetches each with a short timeout + one retry, and
// reports pass/fail. Emits a failed_summary GitHub Actions output so the
// calling workflow can open/update a tracking issue.
//
// Local use:
//   UPTIME_TARGETS=$'https://example.com/\nhttps://example.com/api' \
//     node scripts/uptime/probe.mjs

import { appendFile } from 'node:fs/promises';
import { setTimeout as delay } from 'node:timers/promises';

const raw = process.env.UPTIME_TARGETS ?? '';
const TIMEOUT_MS = Number(process.env.UPTIME_TIMEOUT_MS ?? 12_000);
const RETRIES = Number(process.env.UPTIME_RETRIES ?? 1);

const targets = raw
  .split(/\r?\n/)
  .map(line => line.trim())
  .filter(line => line.length > 0 && !line.startsWith('#'));

if (targets.length === 0) {
  console.error('No targets provided in UPTIME_TARGETS.');
  process.exit(2);
}

async function probe(url) {
  for (let attempt = 0; attempt <= RETRIES; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(url, {
        method: 'GET',
        redirect: 'follow',
        signal: controller.signal,
        headers: { 'user-agent': 'nikolayvalev-uptime-probe/1.0' },
      });
      clearTimeout(timer);
      if (res.status >= 200 && res.status < 400) {
        return { ok: true, status: res.status };
      }
      if (attempt === RETRIES) {
        return { ok: false, reason: `status ${res.status}` };
      }
    } catch (error) {
      clearTimeout(timer);
      if (attempt === RETRIES) {
        return { ok: false, reason: error instanceof Error ? error.message : String(error) };
      }
    }
    await delay(1000 * (attempt + 1));
  }
  return { ok: false, reason: 'unknown' };
}

const results = await Promise.all(
  targets.map(async url => ({ url, ...(await probe(url)) })),
);

const failed = results.filter(r => !r.ok);

for (const result of results) {
  if (result.ok) {
    console.log(`  ok    ${result.status.toString().padEnd(3)} ${result.url}`);
  } else {
    console.log(`  FAIL      ${result.url} — ${result.reason}`);
  }
}

console.log(`\nUptime summary: total=${results.length} failed=${failed.length}`);

if (process.env.GITHUB_OUTPUT && failed.length > 0) {
  const summary = failed.map(f => `${f.url} — ${f.reason}`).join('\n');
  await appendFile(
    process.env.GITHUB_OUTPUT,
    `failed_summary<<PROBE_EOF\n${summary}\nPROBE_EOF\n`,
  );
}

if (failed.length > 0) {
  process.exit(1);
}
