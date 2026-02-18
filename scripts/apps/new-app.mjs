#!/usr/bin/env node

import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const usage = `
Usage:
  node scripts/apps/new-app.mjs --id <app-id> --name <display-name> --domain <domain-name>
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
const displayName = getArg('--name') ?? id;
const domain = getArg('--domain') ?? 'core-platform';

if (!id) {
  console.error(usage.trim());
  process.exit(1);
}

const rootDir = process.cwd();
const appPath = path.join(rootDir, 'apps', id);

if (existsSync(appPath)) {
  console.error(`App already exists: apps/${id}`);
  process.exit(1);
}

mkdirSync(path.join(appPath, 'src'), { recursive: true });

const packageJson = {
  name: `@apps/${id}`,
  version: '0.1.0',
  private: true,
  description: `${displayName} application shell`,
  type: 'module',
  scripts: {
    build: `node ../../scripts/apps/validate-app.mjs --app ${id} --path apps/${id} --mode build`,
    typecheck: `node ../../scripts/apps/validate-app.mjs --app ${id} --path apps/${id} --mode typecheck`,
    lint: `node ../../scripts/apps/validate-app.mjs --app ${id} --path apps/${id} --mode lint`,
    dev: `node ../../scripts/apps/validate-app.mjs --app ${id} --path apps/${id} --mode dev`,
  },
  dependencies: {
    '@nikolayvalev/design-system': 'workspace:*',
    '@repo/auth': 'workspace:*',
    '@repo/state': 'workspace:*',
  },
};

const manifest = {
  id,
  displayName,
  domain,
  frontend: {
    framework: 'nextjs',
    path: `apps/${id}`,
  },
  backend: {
    framework: 'fastapi',
    serviceName: `${id}-api`,
  },
  contracts: {
    designSystem: '@nikolayvalev/design-system',
    auth: '@repo/auth',
    state: '@repo/state',
  },
  environments: ['preview', 'production'],
};

const readme = `# ${displayName}

## Purpose

${displayName} is part of the core platform portfolio.

## Local Commands

\`\`\`bash
pnpm --filter @apps/${id} build
pnpm --filter @apps/${id} typecheck
pnpm --filter @apps/${id} lint
\`\`\`

## Contracts

- Design system: \`@nikolayvalev/design-system\`
- Auth service: \`@repo/auth\`
- State factory: \`@repo/state\`
`;

const mainTs = `import type { AuthConfig } from '@repo/auth';
import { createStateFactory } from '@repo/state';

export const ${id.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())}AuthConfig: AuthConfig = {
  provider: 'credentials',
};

export const shellState = createStateFactory({
  name: '${id}-shell',
  initialState: { ready: false },
  reducers: {
    setReady(state, payload: boolean) {
      return { ...state, ready: payload };
    },
  },
});
`;

writeFileSync(path.join(appPath, 'package.json'), `${JSON.stringify(packageJson, null, 2)}\n`, 'utf8');
writeFileSync(path.join(appPath, 'app.manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
writeFileSync(path.join(appPath, 'README.md'), readme, 'utf8');
writeFileSync(path.join(appPath, 'src', 'main.ts'), mainTs, 'utf8');

console.log(`Created app scaffold: apps/${id}`);

