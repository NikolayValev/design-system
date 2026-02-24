#!/usr/bin/env node

import { writeFileSync } from 'node:fs';
import path from 'node:path';

const usage = `
Usage:
  node scripts/apps/new-polyrepo-manifest.mjs \\
    --id <app-id> \\
    --name <display-name> \\
    --domain <domain> \\
    --frontend-repo <frontend-repository-url> \\
    --backend-repo <backend-repository-url> \\
    [--service <backend-service-name>] \\
    [--openapi <openapi-path>] \\
    [--out <output-file>]
`;

const argv = process.argv.slice(2);
const getArg = flag => {
  const index = argv.indexOf(flag);
  if (index === -1 || index === argv.length - 1) {
    return undefined;
  }
  return argv[index + 1];
};

const id = getArg('--id');
const displayName = getArg('--name');
const domain = getArg('--domain');
const frontendRepository = getArg('--frontend-repo');
const backendRepository = getArg('--backend-repo');
const serviceName = getArg('--service') ?? `${id}-api`;
const openapiPath = getArg('--openapi') ?? 'openapi/openapi.json';
const outputPath = getArg('--out') ?? 'app.manifest.json';

if (!id || !displayName || !domain || !frontendRepository || !backendRepository) {
  console.error(usage.trim());
  process.exit(1);
}

const manifest = {
  manifestVersion: 2,
  id,
  displayName,
  domain,
  topology: 'polyrepo',
  frontend: {
    framework: 'nextjs',
    path: '.',
    repository: frontendRepository,
  },
  backend: {
    framework: 'fastapi',
    serviceName,
    repository: backendRepository,
  },
  contracts: {
    designSystem: '@nikolayvalev/design-system',
    auth: '@repo/auth',
    state: '@repo/state',
    openapi: openapiPath,
  },
  environments: ['preview', 'production'],
  owners: {
    team: id,
    contact: `${id}@local`,
  },
};

const destination = path.isAbsolute(outputPath) ? outputPath : path.resolve(process.cwd(), outputPath);
writeFileSync(destination, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
console.log(`Created polyrepo manifest: ${destination}`);
