#!/usr/bin/env node

import { spawnSync } from 'node:child_process';

const usage = `
Usage:
  node scripts/ci/validate-platform-contracts.mjs [--strict]
  node scripts/ci/validate-platform-contracts.mjs [--strict-manifests] [--strict-openapi] [--strict-error-envelope]
`;

const argv = process.argv.slice(2);
const strictMode = argv.includes('--strict');
const strictManifests = strictMode || argv.includes('--strict-manifests');
const strictOpenApi = strictMode || argv.includes('--strict-openapi');
const strictErrorEnvelope = strictMode || argv.includes('--strict-error-envelope');
const allowedFlags = new Set(['--strict', '--strict-manifests', '--strict-openapi', '--strict-error-envelope']);

if (argv.some(flag => !allowedFlags.has(flag))) {
  console.error(usage.trim());
  process.exit(1);
}

const nodeBin = process.execPath;
const rootDir = process.cwd();

const validations = [
  {
    name: 'dependent app config',
    scriptPath: 'scripts/ci/validate-dependent-apps-config.mjs',
    args: [],
  },
  {
    name: 'linked contracts',
    scriptPath: 'scripts/ci/validate-linked-contracts.mjs',
    args: [
      ...(strictManifests ? ['--strict-manifests'] : []),
      ...(strictOpenApi ? ['--strict-openapi'] : []),
    ],
  },
  {
    name: 'linked error-envelope samples',
    scriptPath: 'scripts/contracts/validate-linked-error-envelopes.mjs',
    args: strictErrorEnvelope ? ['--strict'] : [],
  },
  {
    name: 'error envelope fixture',
    scriptPath: 'scripts/contracts/validate-error-envelope.mjs',
    args: ['--file', 'contracts/examples/error-envelope.sample.json'],
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
    `Platform contract validation passed (strictManifests=${strictManifests}, strictOpenApi=${strictOpenApi}, strictErrorEnvelope=${strictErrorEnvelope}).`,
  );
}
