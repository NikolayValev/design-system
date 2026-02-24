#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { validateManifest } from '../apps/manifest-contract.mjs';

const usage = `
Usage:
  node scripts/ci/validate-linked-repo-manifests.mjs [--strict] [--ref <branch>]
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

if (linkedRepositories.length === 0) {
  console.log('::warning::No linkedRepositories entries found; skipping linked manifest validation.');
  process.exit(0);
}

const toRawGithubUrl = (repositoryUrl, manifestPath, ref) => {
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
    const safePath = manifestPath.replace(/^\/+/, '');
    return `https://raw.githubusercontent.com/${owner}/${repo}/${ref}/${safePath}`;
  } catch {
    return undefined;
  }
};

const fetchJson = async url => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return await response.json();
};

let hardFailures = 0;
let advisoryWarnings = 0;
let validatedCount = 0;

for (const entry of linkedRepositories) {
  const label = entry.id ?? 'unknown';
  const manifestPath = entry.manifestPath ?? 'app.manifest.json';
  const expectedId = entry.manifestId;
  const requiredManifest = entry.requiredManifest === true;
  const manifestUrl =
    entry.manifestUrl ??
    toRawGithubUrl(entry.repository, manifestPath, entry.ref ?? defaultRef);

  if (!manifestUrl) {
    const message = `Unable to resolve manifest URL for linked repo "${label}".`;
    if (strictMode || requiredManifest) {
      console.error(`::error::${message}`);
      hardFailures += 1;
    } else {
      console.warn(`::warning::${message}`);
      advisoryWarnings += 1;
    }
    continue;
  }

  try {
    const manifest = await fetchJson(manifestUrl);
    const result = validateManifest(manifest, { expectedId, sourceLabel: manifestUrl });

    for (const warning of result.warnings) {
      console.warn(`::warning::${warning}`);
      advisoryWarnings += 1;
    }

    if (result.errors.length > 0) {
      for (const error of result.errors) {
        console.error(`::error::${error}`);
      }
      hardFailures += result.errors.length;
      continue;
    }

    validatedCount += 1;
    console.log(`Validated linked manifest for ${label}: ${manifestUrl}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const formatted = `Failed to load linked manifest for "${label}" (${manifestUrl}): ${message}`;
    if (strictMode || requiredManifest) {
      console.error(`::error::${formatted}`);
      hardFailures += 1;
    } else {
      console.warn(`::warning::${formatted}`);
      advisoryWarnings += 1;
    }
  }
}

console.log(
  `Linked manifest validation summary: validated=${validatedCount}, warnings=${advisoryWarnings}, failures=${hardFailures}, strict=${strictMode}`,
);

if (hardFailures > 0) {
  process.exitCode = 1;
}
