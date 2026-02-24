#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { syncOpenApiContract } from './openapi-contract-lib.mjs';

const usage = `
Usage:
  node scripts/contracts/sync-linked-openapi-snapshots.mjs [--check] [--strict] [--ref <branch>]
`;

const argv = process.argv.slice(2);
const hasFlag = flag => argv.includes(flag);
const getArg = flag => {
  const index = argv.indexOf(flag);
  if (index === -1 || index === argv.length - 1) {
    return undefined;
  }
  return argv[index + 1];
};

const checkOnly = hasFlag('--check');
const strictMode = hasFlag('--strict');
const defaultRef = getArg('--ref') ?? 'main';

const rootDir = process.cwd();
const configPath = path.join(rootDir, '.github', 'dependent-apps.json');

if (!existsSync(configPath)) {
  console.error('::error::Missing config file: .github/dependent-apps.json');
  process.exit(1);
}

const config = JSON.parse(readFileSync(configPath, 'utf8'));
const linkedRepositories = Array.isArray(config.linkedRepositories) ? config.linkedRepositories : [];

const toRawGithubUrl = (repositoryUrl, relativePath, ref) => {
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
    const safePath = (relativePath ?? 'openapi/openapi.json').replace(/^\/+/, '');
    return `https://raw.githubusercontent.com/${owner}/${repo}/${ref}/${safePath}`;
  } catch {
    return undefined;
  }
};

const targets = linkedRepositories
  .filter(entry => entry.role === 'backend' || typeof entry.openapiPath === 'string')
  .map(entry => ({
    id: entry.id ?? 'unknown',
    required: entry.requiredOpenapi === true,
    sourceUrl: entry.openapiUrl ?? toRawGithubUrl(entry.repository, entry.openapiPath, entry.ref ?? defaultRef),
    snapshotPath:
      typeof entry.openapiSnapshotPath === 'string' && entry.openapiSnapshotPath.length > 0
        ? entry.openapiSnapshotPath
        : `openapi/${entry.id ?? 'backend'}.openapi.snapshot.json`,
  }));

if (targets.length === 0) {
  console.log('::warning::No backend OpenAPI targets configured in linkedRepositories.');
  process.exit(0);
}

let validated = 0;
let warnings = 0;
let failures = 0;

for (const target of targets) {
  if (!target.sourceUrl) {
    const message = `Unable to resolve OpenAPI source URL for ${target.id}.`;
    if (strictMode || target.required) {
      console.error(`::error::${message}`);
      failures += 1;
    } else {
      console.warn(`::warning::${message}`);
      warnings += 1;
    }
    continue;
  }

  try {
    const result = await syncOpenApiContract({
      sourceUrl: target.sourceUrl,
      outPath: target.snapshotPath,
      checkOnly,
    });

    if (result.status === 'updated') {
      validated += 1;
      console.log(`Updated linked OpenAPI snapshot for ${target.id}: ${result.outPath}`);
      continue;
    }

    if (result.status === 'in_sync') {
      validated += 1;
      console.log(`Linked OpenAPI snapshot is in sync for ${target.id}: ${result.outPath}`);
      continue;
    }

    const message =
      result.status === 'missing'
        ? `OpenAPI snapshot file is missing for ${target.id}: ${result.outPath}`
        : `OpenAPI snapshot drift detected for ${target.id}: ${result.outPath}`;

    if (strictMode || target.required) {
      console.error(`::error::${message}`);
      failures += 1;
    } else {
      console.warn(`::warning::${message}`);
      warnings += 1;
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (strictMode || target.required) {
      console.error(`::error::${message}`);
      failures += 1;
    } else {
      console.warn(`::warning::${message}`);
      warnings += 1;
    }
  }
}

console.log(
  `Linked OpenAPI summary: validated=${validated}, warnings=${warnings}, failures=${failures}, check=${checkOnly}, strict=${strictMode}`,
);

if (failures > 0) {
  process.exitCode = 1;
}
