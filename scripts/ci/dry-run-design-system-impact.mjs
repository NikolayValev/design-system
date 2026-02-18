#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const configPath = path.join(rootDir, '.github', 'dependent-apps.json');

if (!existsSync(configPath)) {
  console.error('Missing config file: .github/dependent-apps.json');
  process.exit(1);
}

const config = JSON.parse(readFileSync(configPath, 'utf8'));
const designSystemPackage = config.designSystemPackage;
const appTargets = Array.isArray(config.apps) ? config.apps : [];

if (!designSystemPackage || appTargets.length === 0) {
  console.error('Invalid dependent app config.');
  process.exit(1);
}

const dependentApps = [];
const missingRequiredApps = [];

for (const app of appTargets) {
  const appDir = path.join(rootDir, app.path);
  const packageJsonPath = path.join(appDir, 'package.json');

  if (!existsSync(packageJsonPath)) {
    if (app.required) {
      missingRequiredApps.push(app.path);
    } else {
      console.log(`::warning::Skipping ${app.id} (${app.path}) because package.json is missing.`);
    }
    continue;
  }

  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
  const allDeps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
    ...packageJson.peerDependencies,
  };

  if (!allDeps[designSystemPackage]) {
    console.log(
      `::warning::Skipping ${app.id} (${app.path}) because it does not depend on ${designSystemPackage}.`,
    );
    continue;
  }

  dependentApps.push({
    id: app.id,
    path: app.path,
    packageName: packageJson.name,
  });
}

if (missingRequiredApps.length > 0) {
  console.error(`Missing required app(s): ${missingRequiredApps.join(', ')}`);
  process.exit(1);
}

if (dependentApps.length === 0) {
  console.log(`::warning::No dependent apps found for ${designSystemPackage}.`);
  process.exit(0);
}

for (const app of dependentApps) {
  const filter = app.packageName && app.packageName.length > 0 ? app.packageName : `./${app.path}`;
  console.log(`Running dry-run build validation for ${app.id} (${filter})`);
  const result =
    process.platform === 'win32'
      ? spawnSync('cmd.exe', ['/d', '/s', '/c', `pnpm turbo run build --filter ${filter}`], {
          stdio: 'inherit',
          cwd: rootDir,
          shell: false,
        })
      : spawnSync('pnpm', ['turbo', 'run', 'build', '--filter', filter], {
          stdio: 'inherit',
          cwd: rootDir,
          shell: false,
        });

  if (result.error) {
    console.error(`Failed to execute pnpm for dry-run validation: ${result.error.message}`);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log('Design system impact validation completed.');
