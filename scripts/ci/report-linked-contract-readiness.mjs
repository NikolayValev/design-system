#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const usage = `
Usage:
  node scripts/ci/report-linked-contract-readiness.mjs [--out <file>]
`;

const argv = process.argv.slice(2);
const getArg = flag => {
  const index = argv.indexOf(flag);
  if (index === -1 || index === argv.length - 1) {
    return undefined;
  }
  return argv[index + 1];
};

const allowedFlags = new Set(['--out']);
for (const token of argv) {
  if (token.startsWith('--') && !allowedFlags.has(token)) {
    console.error(usage.trim());
    process.exit(1);
  }
}

const outPathInput = getArg('--out');
const outPath = outPathInput
  ? path.isAbsolute(outPathInput)
    ? outPathInput
    : path.resolve(process.cwd(), outPathInput)
  : undefined;

const rootDir = process.cwd();
const configPath = path.join(rootDir, '.github', 'dependent-apps.json');

if (!existsSync(configPath)) {
  console.error('::error::Missing config file: .github/dependent-apps.json');
  process.exit(1);
}

const config = JSON.parse(readFileSync(configPath, 'utf8'));
const linkedRepositories = Array.isArray(config.linkedRepositories) ? config.linkedRepositories : [];

const toRawGithubUrl = (repositoryUrl, relativePath, ref = 'main') => {
  if (typeof repositoryUrl !== 'string' || repositoryUrl.length === 0) {
    return undefined;
  }

  try {
    const parsed = new URL(repositoryUrl);
    if (parsed.hostname !== 'github.com') {
      return undefined;
    }

    const parts = parsed.pathname.replace(/^\/+|\/+$/g, '').split('/');
    if (parts.length < 2) {
      return undefined;
    }

    const owner = parts[0];
    const repo = parts[1].replace(/\.git$/i, '');
    const safePath = relativePath.replace(/^\/+/, '');
    return `https://raw.githubusercontent.com/${owner}/${repo}/${ref}/${safePath}`;
  } catch {
    return undefined;
  }
};

const probeUrl = async url => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    if (response.ok) {
      return { ok: true, status: response.status };
    }
    return { ok: false, status: response.status };
  } catch {
    return { ok: false, status: 'network_error' };
  }
};

const rows = [];

for (const entry of linkedRepositories) {
  const ref = entry.ref ?? 'main';
  const manifestPath = entry.manifestPath ?? 'app.manifest.json';
  const manifestUrl = entry.manifestUrl ?? toRawGithubUrl(entry.repository, manifestPath, ref);
  const openapiUrl =
    entry.role === 'backend' || typeof entry.openapiPath === 'string'
      ? entry.openapiUrl ?? toRawGithubUrl(entry.repository, entry.openapiPath ?? 'openapi/openapi.json', ref)
      : undefined;
  const errorEnvelopeUrl =
    entry.errorEnvelopeSampleUrl ??
    toRawGithubUrl(
      entry.repository,
      entry.errorEnvelopeSamplePath ?? 'contracts/examples/error-envelope.sample.json',
      ref,
    );

  const manifestResult = manifestUrl ? await probeUrl(manifestUrl) : { ok: false, status: 'unresolved' };
  const openapiResult = openapiUrl ? await probeUrl(openapiUrl) : { ok: true, status: 'n/a' };
  const errorEnvelopeResult = errorEnvelopeUrl
    ? await probeUrl(errorEnvelopeUrl)
    : { ok: false, status: 'unresolved' };

  rows.push({
    id: entry.id ?? 'unknown',
    role: entry.role ?? 'unknown',
    manifestReady: manifestResult.ok,
    manifestStatus: manifestResult.status,
    openapiReady: openapiResult.ok,
    openapiStatus: openapiResult.status,
    errorEnvelopeReady: errorEnvelopeResult.ok,
    errorEnvelopeStatus: errorEnvelopeResult.status,
  });
}

const strictManifestReady = rows.filter(row => !row.manifestReady).length === 0;
const strictOpenApiReady = rows
  .filter(row => row.role === 'backend')
  .filter(row => !row.openapiReady).length === 0;
const strictErrorEnvelopeReady = rows.filter(row => !row.errorEnvelopeReady).length === 0;

const lines = [];
lines.push('| linked id | role | manifest status | openapi status | error-envelope status |');
lines.push('| --- | --- | --- | --- | --- |');
for (const row of rows) {
  const manifestCell = row.manifestReady ? `ready (${row.manifestStatus})` : `not-ready (${row.manifestStatus})`;
  const openapiCell = row.openapiReady ? `ready (${row.openapiStatus})` : `not-ready (${row.openapiStatus})`;
  const errorEnvelopeCell = row.errorEnvelopeReady
    ? `ready (${row.errorEnvelopeStatus})`
    : `not-ready (${row.errorEnvelopeStatus})`;
  lines.push(`| ${row.id} | ${row.role} | ${manifestCell} | ${openapiCell} | ${errorEnvelopeCell} |`);
}

lines.push('');
lines.push(`Strict readiness: manifests=${strictManifestReady ? 'ready' : 'not-ready'}`);
lines.push(`Strict readiness: linked backend OpenAPI=${strictOpenApiReady ? 'ready' : 'not-ready'}`);
lines.push(`Strict readiness: linked error-envelope=${strictErrorEnvelopeReady ? 'ready' : 'not-ready'}`);

const reportText = `${lines.join('\n')}\n`;
process.stdout.write(reportText);

if (outPath) {
  const markdown = [
    '# Linked Contract Readiness Report',
    '',
    `Generated at: ${new Date().toISOString()}`,
    '',
    ...lines,
    '',
  ].join('\n');
  mkdirSync(path.dirname(outPath), { recursive: true });
  writeFileSync(outPath, markdown, 'utf8');
  console.log(`Wrote readiness report: ${outPath}`);
}
