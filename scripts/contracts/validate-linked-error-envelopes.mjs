#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { validateErrorEnvelopePayload } from './error-envelope-lib.mjs';

const usage = `
Usage:
  node scripts/contracts/validate-linked-error-envelopes.mjs [--strict] [--ref <branch>]
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
    const safePath = (relativePath ?? 'contracts/examples/error-envelope.sample.json').replace(/^\/+/, '');
    return `https://raw.githubusercontent.com/${owner}/${repo}/${ref}/${safePath}`;
  } catch {
    return undefined;
  }
};

let validated = 0;
let warnings = 0;
let failures = 0;

for (const entry of linkedRepositories) {
  const label = entry.id ?? 'unknown';
  const required = entry.requiredErrorEnvelope === true;
  const samplePath = entry.errorEnvelopeSamplePath ?? 'contracts/examples/error-envelope.sample.json';
  const sampleUrl =
    entry.errorEnvelopeSampleUrl ??
    toRawGithubUrl(entry.repository, samplePath, entry.ref ?? defaultRef);

  if (!sampleUrl) {
    const message = `Unable to resolve error-envelope sample URL for "${label}".`;
    if (strictMode || required) {
      console.error(`::error::${message}`);
      failures += 1;
    } else {
      console.warn(`::warning::${message}`);
      warnings += 1;
    }
    continue;
  }

  try {
    const response = await fetch(sampleUrl);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const payload = await response.json();
    const validationErrors = validateErrorEnvelopePayload(payload);

    if (validationErrors.length > 0) {
      const combined = validationErrors.join(' ');
      if (strictMode || required) {
        console.error(`::error::Invalid error envelope for "${label}": ${combined}`);
        failures += 1;
      } else {
        console.warn(`::warning::Invalid error envelope for "${label}": ${combined}`);
        warnings += 1;
      }
      continue;
    }

    validated += 1;
    console.log(`Validated linked error-envelope sample for ${label}: ${sampleUrl}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const formatted = `Failed to load error-envelope sample for "${label}" (${sampleUrl}): ${message}`;
    if (strictMode || required) {
      console.error(`::error::${formatted}`);
      failures += 1;
    } else {
      console.warn(`::warning::${formatted}`);
      warnings += 1;
    }
  }
}

console.log(
  `Linked error-envelope summary: validated=${validated}, warnings=${warnings}, failures=${failures}, strict=${strictMode}`,
);

if (failures > 0) {
  process.exitCode = 1;
}
