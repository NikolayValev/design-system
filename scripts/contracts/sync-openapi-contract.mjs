#!/usr/bin/env node

import { syncOpenApiContract } from './openapi-contract-lib.mjs';

const usage = `
Usage:
  node scripts/contracts/sync-openapi-contract.mjs --source-url <url> --out <file> [--check]
  node scripts/contracts/sync-openapi-contract.mjs --source-path <file> --out <file> [--check]

Options:
  --check                 Do not write. Exit non-zero if output differs from source.
  --header "Key: Value"   Optional HTTP header for URL source. Can be repeated.
`;

const argv = process.argv.slice(2);

const getArg = flag => {
  const index = argv.indexOf(flag);
  if (index === -1 || index === argv.length - 1) {
    return undefined;
  }
  return argv[index + 1];
};

const getArgs = flag => {
  const values = [];
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === flag && i + 1 < argv.length) {
      values.push(argv[i + 1]);
    }
  }
  return values;
};

const hasFlag = flag => argv.includes(flag);

const sourceUrl = getArg('--source-url') ?? process.env.OPENAPI_SOURCE_URL;
const sourcePathInput = getArg('--source-path') ?? process.env.OPENAPI_SOURCE_PATH;
const outPathInput =
  getArg('--out') ?? process.env.OPENAPI_OUT_PATH ?? 'openapi/second-brain.openapi.snapshot.json';
const checkOnly = hasFlag('--check');
const headerArgs = [
  ...getArgs('--header'),
  ...(process.env.OPENAPI_AUTH_HEADER ? [process.env.OPENAPI_AUTH_HEADER] : []),
];

if (!outPathInput || (!sourceUrl && !sourcePathInput) || (sourceUrl && sourcePathInput)) {
  console.error(usage.trim());
  process.exit(1);
}

try {
  const result = await syncOpenApiContract({
    sourceUrl,
    sourcePath: sourcePathInput,
    outPath: outPathInput,
    checkOnly,
    headerValues: headerArgs,
  });

  if (result.status === 'missing') {
    console.error(`::error::OpenAPI snapshot file is missing: ${result.outPath}`);
    process.exit(1);
  }

  if (result.status === 'drift') {
    console.error(`::error::OpenAPI snapshot drift detected at ${result.outPath}`);
    process.exit(1);
  }

  if (result.status === 'in_sync') {
    console.log(`OpenAPI snapshot is in sync: ${result.outPath}`);
    process.exit(0);
  }

  console.log(`Updated OpenAPI snapshot: ${result.outPath}`);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`::error::${message}`);
  process.exit(1);
}
