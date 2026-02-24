#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { validateManifest } from './manifest-contract.mjs';

const usage = `
Usage:
  node scripts/apps/validate-external-manifest.mjs --manifest <path-or-url> [--app <app-id>]
`;

const argv = process.argv.slice(2);
const getArg = flag => {
  const index = argv.indexOf(flag);
  if (index === -1 || index === argv.length - 1) {
    return undefined;
  }
  return argv[index + 1];
};

const manifestTarget = getArg('--manifest');
const appId = getArg('--app');

if (!manifestTarget) {
  console.error(usage.trim());
  process.exit(1);
}

const isHttpTarget = /^https?:\/\//i.test(manifestTarget);

const loadManifestText = async () => {
  if (isHttpTarget) {
    const response = await fetch(manifestTarget);
    if (!response.ok) {
      throw new Error(`Unable to fetch ${manifestTarget}: HTTP ${response.status}`);
    }

    return await response.text();
  }

  const absolutePath = path.isAbsolute(manifestTarget)
    ? manifestTarget
    : path.resolve(process.cwd(), manifestTarget);

  if (!existsSync(absolutePath)) {
    throw new Error(`Manifest file does not exist: ${absolutePath}`);
  }

  return readFileSync(absolutePath, 'utf8');
};

try {
  const manifestText = await loadManifestText();
  const manifest = JSON.parse(manifestText);
  const result = validateManifest(manifest, { expectedId: appId, sourceLabel: manifestTarget });

  for (const message of result.warnings) {
    console.warn(`::warning::${message}`);
  }

  if (result.errors.length > 0) {
    for (const message of result.errors) {
      console.error(`::error::${message}`);
    }
    process.exit(1);
  }

  console.log(`Validated manifest: ${manifestTarget}`);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`::error::${message}`);
  process.exit(1);
}
