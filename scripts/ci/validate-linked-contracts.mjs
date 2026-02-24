#!/usr/bin/env node

import { spawnSync } from 'node:child_process';

const usage = `
Usage:
  node scripts/ci/validate-linked-contracts.mjs [--strict]
  node scripts/ci/validate-linked-contracts.mjs [--strict-manifests] [--strict-openapi]
`;

const argv = process.argv.slice(2);
const strictMode = argv.includes('--strict');
const strictManifests = strictMode || argv.includes('--strict-manifests');
const strictOpenApi = strictMode || argv.includes('--strict-openapi');
const allowedFlags = new Set(['--strict', '--strict-manifests', '--strict-openapi']);

if (argv.some(flag => !allowedFlags.has(flag))) {
  console.error(usage.trim());
  process.exit(1);
}

const nodeBin = process.execPath;
const rootDir = process.cwd();

const validations = [
  {
    name: 'linked manifests',
    scriptPath: 'scripts/ci/validate-linked-repo-manifests.mjs',
    args: strictManifests ? ['--strict'] : [],
  },
  {
    name: 'linked backend OpenAPI',
    scriptPath: 'scripts/contracts/sync-linked-openapi-snapshots.mjs',
    args: strictOpenApi ? ['--check', '--strict'] : ['--check'],
  },
];

let failures = 0;

for (const validation of validations) {
  console.log(`Running ${validation.name} validation...`);

  const result = spawnSync(nodeBin, [validation.scriptPath, ...validation.args], {
    cwd: rootDir,
    stdio: 'inherit',
    shell: false,
  });

  if (result.error) {
    console.error(`::error::Failed to run ${validation.name} validation: ${result.error.message}`);
    failures += 1;
    continue;
  }

  if ((result.status ?? 1) !== 0) {
    failures += 1;
  }
}

if (failures > 0) {
  process.exitCode = 1;
} else {
  console.log(
    `Linked contract validation passed (strictManifests=${strictManifests}, strictOpenApi=${strictOpenApi}).`,
  );
}
