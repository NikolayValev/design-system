#!/usr/bin/env node
/**
 * Validates that the built package exports are correctly structured
 * and all documented import paths work as expected.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

console.log('🔍 Validating package exports...\n');

let hasErrors = false;

function fail(message) {
  console.error(`❌ ${message}`);
  hasErrors = true;
}

function pass(message) {
  console.log(`✅ ${message}`);
}

// Check that dist directory exists
if (!fs.existsSync(distDir)) {
  fail('dist directory does not exist. Run "pnpm build" first.');
  process.exit(1);
}

// Check required files exist
const requiredFiles = [
  'dist/index.js',
  'dist/index.d.ts',
  'dist/tailwind/index.js',
  'dist/tailwind/index.d.ts',
  'dist/tokens/index.js',
  'dist/tokens/index.d.ts',
  'dist/styles/global.css',
  'dist/styles/public.css',
  'dist/styles/dashboard.css',
  'dist/styles/experimental.css',
];

console.log('📦 Checking required files:\n');

requiredFiles.forEach((file) => {
  const fullPath = path.join(rootDir, file);
  if (fs.existsSync(fullPath)) {
    const stats = fs.statSync(fullPath);
    pass(`${file} (${stats.size} bytes)`);
  } else {
    fail(`${file} is missing`);
  }
});

// Check package.json exports configuration
console.log('\n📋 Checking package.json exports:\n');

const pkgPath = path.join(rootDir, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

const expectedExports = {
  '.': 'Root entrypoint',
  './styles': 'Default CSS',
  './styles/public.css': 'Public profile CSS',
  './styles/dashboard.css': 'Dashboard profile CSS',
  './styles/experimental.css': 'Experimental profile CSS',
  './tailwind': 'Tailwind preset',
  './tokens': 'Design tokens',
};

Object.entries(expectedExports).forEach(([exportPath, description]) => {
  if (pkg.exports && pkg.exports[exportPath]) {
    pass(`Export "${exportPath}" configured - ${description}`);
  } else {
    fail(`Export "${exportPath}" missing - ${description}`);
  }
});

// Verify CSS files contain expected content
console.log('\n🎨 Validating CSS file content:\n');

const cssChecks = [
  {
    file: 'dist/styles/public.css',
    mustContain: [':root', '@import', 'tailwindcss'],
    description: 'Public CSS has base imports',
  },
  {
    file: 'dist/styles/dashboard.css',
    mustContain: [':root', '--color-background'],
    description: 'Dashboard CSS has tokens',
  },
  {
    file: 'dist/styles/experimental.css',
    mustContain: [':root', '--color-background'],
    description: 'Experimental CSS has tokens',
  },
];

cssChecks.forEach(({ file, mustContain, description }) => {
  const fullPath = path.join(rootDir, file);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf-8');
    const hasAll = mustContain.every((str) => content.includes(str));
    if (hasAll) {
      pass(`${description}`);
    } else {
      fail(`${description} - missing required content`);
    }
  }
});

// Check TypeScript declarations
console.log('\n📝 Checking TypeScript declarations:\n');

const dtsChecks = [
  {
    file: 'dist/index.d.ts',
    mustExport: ['Button', 'Card', 'Input', 'createTheme', 'applyTheme'],
    description: 'Root exports',
  },
  {
    file: 'dist/tailwind/index.d.ts',
    mustExport: ['createTailwindPreset', 'publicProfile', 'dashboardProfile'],
    description: 'Tailwind exports',
  },
  {
    file: 'dist/tokens/index.d.ts',
    mustExport: ['ThemeProfile', 'publicProfile', 'dashboardProfile'],
    description: 'Token exports',
  },
];

dtsChecks.forEach(({ file, mustExport, description }) => {
  const fullPath = path.join(rootDir, file);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf-8');
    const allFound = mustExport.every((name) => content.includes(name));
    if (allFound) {
      pass(`${description} include expected types`);
    } else {
      const missing = mustExport.filter((name) => !content.includes(name));
      fail(`${description} missing: ${missing.join(', ')}`);
    }
  }
});

// Summary
console.log('\n' + '='.repeat(60) + '\n');

if (hasErrors) {
  console.error('❌ Validation failed. Fix the errors above.\n');
  process.exit(1);
} else {
  console.log('✅ All validations passed! Package is ready.\n');
  process.exit(0);
}
