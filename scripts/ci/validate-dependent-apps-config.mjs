#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const configPath = path.join(rootDir, '.github', 'dependent-apps.json');

const errors = [];

const isRecord = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const isNonEmptyString = value => typeof value === 'string' && value.trim().length > 0;
const isBoolean = value => typeof value === 'boolean';

const isHttpUrl = value => {
  if (!isNonEmptyString(value)) {
    return false;
  }

  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

if (!existsSync(configPath)) {
  console.error('::error::Missing config file: .github/dependent-apps.json');
  process.exit(1);
}

let config;
try {
  config = JSON.parse(readFileSync(configPath, 'utf8'));
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`::error::Invalid JSON in .github/dependent-apps.json: ${message}`);
  process.exit(1);
}

if (!isRecord(config)) {
  console.error('::error::.github/dependent-apps.json root must be an object.');
  process.exit(1);
}

if (!isNonEmptyString(config.designSystemPackage)) {
  errors.push('designSystemPackage must be a non-empty string.');
}

const apps = Array.isArray(config.apps) ? config.apps : null;
if (!apps || apps.length === 0) {
  errors.push('apps must be a non-empty array.');
}

const appIds = new Set();
const appPaths = new Set();

for (const app of apps ?? []) {
  if (!isRecord(app)) {
    errors.push('Each apps entry must be an object.');
    continue;
  }

  if (!isNonEmptyString(app.id)) {
    errors.push('apps[].id must be a non-empty string.');
  } else {
    if (appIds.has(app.id)) {
      errors.push(`Duplicate apps[].id value: "${app.id}".`);
    }
    appIds.add(app.id);
  }

  if (!isNonEmptyString(app.path)) {
    errors.push(`apps[${app.id ?? '?'}].path must be a non-empty string.`);
  } else {
    if (appPaths.has(app.path)) {
      errors.push(`Duplicate apps[].path value: "${app.path}".`);
    }
    appPaths.add(app.path);
  }

  if (!isBoolean(app.required)) {
    errors.push(`apps[${app.id ?? '?'}].required must be boolean.`);
  }

  if (app.repository !== undefined && !isHttpUrl(app.repository)) {
    errors.push(`apps[${app.id ?? '?'}].repository must be a valid http(s) URL when provided.`);
  }
}

const linkedRepositories = Array.isArray(config.linkedRepositories) ? config.linkedRepositories : null;
if (!linkedRepositories || linkedRepositories.length === 0) {
  errors.push('linkedRepositories must be a non-empty array.');
}

const linkedIds = new Set();
const allowedRoles = new Set(['frontend', 'backend']);

for (const linked of linkedRepositories ?? []) {
  if (!isRecord(linked)) {
    errors.push('Each linkedRepositories entry must be an object.');
    continue;
  }

  if (!isNonEmptyString(linked.id)) {
    errors.push('linkedRepositories[].id must be a non-empty string.');
  } else {
    if (linkedIds.has(linked.id)) {
      errors.push(`Duplicate linkedRepositories[].id value: "${linked.id}".`);
    }
    linkedIds.add(linked.id);
  }

  if (!isNonEmptyString(linked.role) || !allowedRoles.has(linked.role)) {
    errors.push(`linkedRepositories[${linked.id ?? '?'}].role must be "frontend" or "backend".`);
  }

  if (!isHttpUrl(linked.repository)) {
    errors.push(`linkedRepositories[${linked.id ?? '?'}].repository must be a valid http(s) URL.`);
  }

  if (linked.manifestId !== undefined && !isNonEmptyString(linked.manifestId)) {
    errors.push(`linkedRepositories[${linked.id ?? '?'}].manifestId must be a non-empty string when provided.`);
  }

  if (linked.manifestId && !appIds.has(linked.manifestId)) {
    errors.push(
      `linkedRepositories[${linked.id}].manifestId ("${linked.manifestId}") must map to an apps[].id value.`,
    );
  }

  if (linked.manifestPath !== undefined && !isNonEmptyString(linked.manifestPath)) {
    errors.push(`linkedRepositories[${linked.id ?? '?'}].manifestPath must be a non-empty string when provided.`);
  }

  if (linked.requiredManifest !== undefined && !isBoolean(linked.requiredManifest)) {
    errors.push(`linkedRepositories[${linked.id ?? '?'}].requiredManifest must be boolean when provided.`);
  }

  if (linked.openapiPath !== undefined && !isNonEmptyString(linked.openapiPath)) {
    errors.push(`linkedRepositories[${linked.id ?? '?'}].openapiPath must be a non-empty string when provided.`);
  }

  if (linked.openapiSnapshotPath !== undefined && !isNonEmptyString(linked.openapiSnapshotPath)) {
    errors.push(
      `linkedRepositories[${linked.id ?? '?'}].openapiSnapshotPath must be a non-empty string when provided.`,
    );
  }

  if (linked.requiredOpenapi !== undefined && !isBoolean(linked.requiredOpenapi)) {
    errors.push(`linkedRepositories[${linked.id ?? '?'}].requiredOpenapi must be boolean when provided.`);
  }

  if (linked.requiredOpenapi === true && !isNonEmptyString(linked.openapiPath)) {
    errors.push(`linkedRepositories[${linked.id ?? '?'}].requiredOpenapi=true requires openapiPath.`);
  }

  if (linked.errorEnvelopeSamplePath !== undefined && !isNonEmptyString(linked.errorEnvelopeSamplePath)) {
    errors.push(
      `linkedRepositories[${linked.id ?? '?'}].errorEnvelopeSamplePath must be a non-empty string when provided.`,
    );
  }

  if (linked.errorEnvelopeSampleUrl !== undefined && !isHttpUrl(linked.errorEnvelopeSampleUrl)) {
    errors.push(
      `linkedRepositories[${linked.id ?? '?'}].errorEnvelopeSampleUrl must be a valid http(s) URL when provided.`,
    );
  }

  if (linked.requiredErrorEnvelope !== undefined && !isBoolean(linked.requiredErrorEnvelope)) {
    errors.push(`linkedRepositories[${linked.id ?? '?'}].requiredErrorEnvelope must be boolean when provided.`);
  }
}

if (errors.length > 0) {
  for (const error of errors) {
    console.error(`::error::${error}`);
  }
  process.exit(1);
}

console.log('Validated .github/dependent-apps.json');
