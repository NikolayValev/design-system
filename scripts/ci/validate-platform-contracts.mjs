#!/usr/bin/env node

import { spawnSync } from 'node:child_process';

const usage = `
Usage:
  node scripts/ci/validate-platform-contracts.mjs [--strict]
  node scripts/ci/validate-platform-contracts.mjs [--strict-manifests] [--strict-openapi] [--strict-error-envelope]
  node scripts/ci/validate-platform-contracts.mjs [--scope=local|linked|all]

Scopes:
  local   Checks owned by this repo (dependent-apps config, error-envelope fixture).
  linked  Checks against external linked repos (manifests, OpenAPI, error-envelope samples).
  all     Both (default).
`;

const argv = process.argv.slice(2);
const strictMode = argv.includes('--strict');
const strictManifests = strictMode || argv.includes('--strict-manifests');
const strictOpenApi = strictMode || argv.includes('--strict-openapi');
const strictErrorEnvelope = strictMode || argv.includes('--strict-error-envelope');

const scopeFlag = argv.find(flag => flag.startsWith('--scope='));
const scope = scopeFlag ? scopeFlag.slice('--scope='.length) : 'all';
const allowedScopes = new Set(['local', 'linked', 'all']);

const allowedFlags = new Set([
  '--strict',
  '--strict-manifests',
  '--strict-openapi',
  '--strict-error-envelope',
]);

if (argv.some(flag => !allowedFlags.has(flag) && !flag.startsWith('--scope='))) {
  console.error(usage.trim());
  process.exit(1);
}

if (!allowedScopes.has(scope)) {
  console.error(`Unknown scope "${scope}".`);
  console.error(usage.trim());
  process.exit(1);
}

const nodeBin = process.execPath;
const rootDir = process.cwd();

const allValidations = [
  {
    name: 'dependent app config',
    scope: 'local',
    scriptPath: 'scripts/ci/validate-dependent-apps-config.mjs',
    args: [],
  },
  {
    name: 'linked contracts',
    scope: 'linked',
    scriptPath: 'scripts/ci/validate-linked-contracts.mjs',
    args: [
      ...(strictManifests ? ['--strict-manifests'] : []),
      ...(strictOpenApi ? ['--strict-openapi'] : []),
    ],
  },
  {
    name: 'linked error-envelope samples',
    scope: 'linked',
    scriptPath: 'scripts/contracts/validate-linked-error-envelopes.mjs',
    args: strictErrorEnvelope ? ['--strict'] : [],
  },
  {
    name: 'error envelope fixture',
    scope: 'local',
    scriptPath: 'scripts/contracts/validate-error-envelope.mjs',
    args: ['--file', 'contracts/examples/error-envelope.sample.json'],
  },
];

const validations =
  scope === 'all' ? allValidations : allValidations.filter(v => v.scope === scope);

let failures = 0;

for (const validation of validations) {
  console.log(`Running ${validation.name} validation (${validation.scope})...`);

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
    `Platform contract validation passed (scope=${scope}, strictManifests=${strictManifests}, strictOpenApi=${strictOpenApi}, strictErrorEnvelope=${strictErrorEnvelope}).`,
  );
}
