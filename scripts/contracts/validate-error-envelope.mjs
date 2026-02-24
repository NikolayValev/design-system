#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { validateErrorEnvelopePayload } from './error-envelope-lib.mjs';

const usage = `
Usage:
  node scripts/contracts/validate-error-envelope.mjs --file <json-file>
`;

const argv = process.argv.slice(2);
const getArg = flag => {
  const index = argv.indexOf(flag);
  if (index === -1 || index === argv.length - 1) {
    return undefined;
  }
  return argv[index + 1];
};

const fileInput = getArg('--file');

if (!fileInput) {
  console.error(usage.trim());
  process.exit(1);
}

const absolutePath = path.isAbsolute(fileInput) ? fileInput : path.resolve(process.cwd(), fileInput);
if (!existsSync(absolutePath)) {
  console.error(`::error::File does not exist: ${absolutePath}`);
  process.exit(1);
}

let payload;
try {
  payload = JSON.parse(readFileSync(absolutePath, 'utf8'));
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`::error::Invalid JSON in ${absolutePath}: ${message}`);
  process.exit(1);
}

const errors = validateErrorEnvelopePayload(payload);

if (errors.length > 0) {
  for (const message of errors) {
    console.error(`::error::${message}`);
  }
  process.exit(1);
}

console.log(`Validated error envelope: ${absolutePath}`);
