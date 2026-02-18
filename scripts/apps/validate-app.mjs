#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const usage = `
Usage:
  node scripts/apps/validate-app.mjs --app <app-id> --path <app-path> --mode <build|typecheck|lint|dev>
`;

const argv = process.argv.slice(2);
const getArg = flag => {
  const index = argv.indexOf(flag);
  if (index === -1 || index === argv.length - 1) {
    return undefined;
  }
  return argv[index + 1];
};

const appId = getArg('--app');
const appPath = getArg('--path');
const mode = getArg('--mode') ?? 'build';

if (!appId || !appPath) {
  console.error(usage.trim());
  process.exit(1);
}

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, '../..');
const appDir = path.join(rootDir, appPath);

const requiredFiles = ['README.md', 'app.manifest.json', 'package.json', 'src/main.ts'];
const requiredContracts = ['@nikolayvalev/design-system', '@repo/auth', '@repo/state'];
const errors = [];

for (const relativeFile of requiredFiles) {
  const absoluteFile = path.join(appDir, relativeFile);
  if (!existsSync(absoluteFile)) {
    errors.push(`Missing required file: ${appPath}/${relativeFile}`);
  }
}

const packageJsonPath = path.join(appDir, 'package.json');
if (existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
  const dependencies = packageJson.dependencies ?? {};
  const scripts = packageJson.scripts ?? {};

  for (const dependency of requiredContracts) {
    if (!dependencies[dependency]) {
      errors.push(`Missing dependency "${dependency}" in ${appPath}/package.json`);
    }
  }

  const requiredScriptNames = ['build', 'typecheck', 'lint', 'dev'];
  for (const scriptName of requiredScriptNames) {
    if (!scripts[scriptName]) {
      errors.push(`Missing script "${scriptName}" in ${appPath}/package.json`);
    }
  }

  const packageName = packageJson.name;
  if (typeof packageName !== 'string' || packageName.length === 0) {
    errors.push(`Invalid package name in ${appPath}/package.json`);
  }
}

const manifestPath = path.join(appDir, 'app.manifest.json');
if (existsSync(manifestPath)) {
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

  if (manifest.id !== appId) {
    errors.push(`Manifest id mismatch. Expected "${appId}", received "${manifest.id}".`);
  }

  if (manifest.frontend?.framework !== 'nextjs') {
    errors.push(`Manifest frontend.framework must be "nextjs" for ${appId}.`);
  }

  if (manifest.backend?.framework !== 'fastapi') {
    errors.push(`Manifest backend.framework must be "fastapi" for ${appId}.`);
  }

  if (manifest.contracts?.designSystem !== '@nikolayvalev/design-system') {
    errors.push(`Manifest contracts.designSystem is invalid for ${appId}.`);
  }

  if (manifest.contracts?.auth !== '@repo/auth') {
    errors.push(`Manifest contracts.auth is invalid for ${appId}.`);
  }

  if (manifest.contracts?.state !== '@repo/state') {
    errors.push(`Manifest contracts.state is invalid for ${appId}.`);
  }
}

if (errors.length > 0) {
  for (const message of errors) {
    console.error(`::error::${message}`);
  }
  process.exit(1);
}

if (mode === 'build') {
  const distDir = path.join(appDir, 'dist');
  mkdirSync(distDir, { recursive: true });
  writeFileSync(
    path.join(distDir, '.dry-run.json'),
    `${JSON.stringify({ appId, validatedAt: new Date().toISOString() }, null, 2)}\n`,
    'utf8',
  );
}

console.log(`Validated ${appId} (${mode})`);
