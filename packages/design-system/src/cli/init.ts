#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';

type CliOptions = {
  cwd: string;
  mcpUrl: string;
  installRoot: string;
  profile: 'public' | 'dashboard' | 'experimental';
  force: boolean;
};

type WriteResult = {
  filePath: string;
  status: 'created' | 'updated' | 'skipped';
};

const DEFAULT_MCP_URL = 'https://designsystem.nikolayvalev.com/mcp';
const DEFAULT_INSTALL_ROOT = 'src/design-system';

function printHelp(): void {
  process.stdout.write(`Design System CLI

Usage:
  design-system init [options]

Options:
  --mcp-url <url>       MCP server URL (default: ${DEFAULT_MCP_URL})
  --install-root <dir>  Local source install root (default: ${DEFAULT_INSTALL_ROOT})
  --profile <name>      Token CSS profile: public | dashboard | experimental (default: public)
  --force               Overwrite existing scaffold files
  --help                Show help
`);
}

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {
    cwd: process.cwd(),
    mcpUrl: DEFAULT_MCP_URL,
    installRoot: DEFAULT_INSTALL_ROOT,
    profile: 'public',
    force: false,
  };

  const args = [...argv];
  if (args[0] === 'init') {
    args.shift();
  }

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (!arg) {
      continue;
    }

    if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    }

    if (arg === '--force') {
      options.force = true;
      continue;
    }

    if (arg === '--mcp-url') {
      const value = args[index + 1];
      if (!value) {
        throw new Error('Missing value for --mcp-url');
      }

      options.mcpUrl = value;
      index += 1;
      continue;
    }

    if (arg === '--install-root') {
      const value = args[index + 1];
      if (!value) {
        throw new Error('Missing value for --install-root');
      }

      options.installRoot = normalizePath(value);
      index += 1;
      continue;
    }

    if (arg === '--profile') {
      const value = args[index + 1];
      if (!value) {
        throw new Error('Missing value for --profile');
      }

      if (value !== 'public' && value !== 'dashboard' && value !== 'experimental') {
        throw new Error(`Unsupported profile "${value}". Use public, dashboard, or experimental.`);
      }

      options.profile = value;
      index += 1;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return options;
}

async function pathExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function writeFileSafe(
  filePath: string,
  content: string,
  options: { force: boolean },
): Promise<WriteResult> {
  const exists = await pathExists(filePath);
  if (exists && !options.force) {
    return { filePath, status: 'skipped' };
  }

  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, content, 'utf8');
  return { filePath, status: exists ? 'updated' : 'created' };
}

function normalizePath(value: string): string {
  return value.replace(/\\/g, '/').replace(/\/+$/, '');
}

function detectPackageManager(): 'pnpm' | 'yarn' | 'npm' {
  const ua = process.env.npm_config_user_agent ?? '';
  if (ua.startsWith('pnpm/')) {
    return 'pnpm';
  }

  if (ua.startsWith('yarn/')) {
    return 'yarn';
  }

  return 'npm';
}

function installCommand(packageManager: 'pnpm' | 'yarn' | 'npm'): string {
  if (packageManager === 'pnpm') {
    return 'pnpm add @nikolayvalev/design-tokens';
  }

  if (packageManager === 'yarn') {
    return 'yarn add @nikolayvalev/design-tokens';
  }

  return 'npm install @nikolayvalev/design-tokens';
}

function makeScaffoldReadme(options: CliOptions): string {
  return `# Local Design-System Source

This directory is scaffolded by \`@nikolayvalev/design-system\` CLI.

Install flow:
1. Configure your MCP client to use \`${options.mcpUrl}\`.
2. Call MCP tools like \`get_component_bundle\`, \`get_section_bundle\`, and \`get_page_bundle\`.
3. Write returned files inside \`${options.installRoot}\`.
4. Commit generated source files to your repository.

Token profile selected during init: \`${options.profile}\`
Recommended CSS import:
\`@nikolayvalev/design-tokens/styles/${options.profile}.css\`
`;
}

function makeSetupGuide(options: CliOptions, manager: 'pnpm' | 'yarn' | 'npm'): string {
  return `# Design System Setup Guide

## 1) Install tokens package

\`\`\`bash
${installCommand(manager)}
\`\`\`

## 2) Import selected profile CSS

\`\`\`ts
import '@nikolayvalev/design-tokens/styles/${options.profile}.css';
\`\`\`

## 3) MCP endpoint

Use this URL in your MCP client configuration:
\`${options.mcpUrl}\`

## 4) Local install root

Write MCP bundle files to:
\`${options.installRoot}\`
`;
}

async function scaffold(options: CliOptions): Promise<WriteResult[]> {
  const mcpConfig = {
    mcpServers: {
      'design-system': {
        transport: 'streamable-http',
        url: options.mcpUrl,
      },
    },
  };

  const designSystemConfig = {
    mcpUrl: options.mcpUrl,
    installRoot: options.installRoot,
    tokenProfile: options.profile,
    generatedBy: '@nikolayvalev/design-system',
  };

  const root = options.cwd;
  const manager = detectPackageManager();
  const installRoot = path.join(root, options.installRoot);

  return await Promise.all([
    writeFileSafe(path.join(root, '.mcp.json'), `${JSON.stringify(mcpConfig, null, 2)}\n`, options),
    writeFileSafe(path.join(root, '.cursor', 'mcp.json'), `${JSON.stringify(mcpConfig, null, 2)}\n`, options),
    writeFileSafe(path.join(root, 'design-system.config.json'), `${JSON.stringify(designSystemConfig, null, 2)}\n`, options),
    writeFileSafe(path.join(root, 'DESIGN_SYSTEM_SETUP.md'), makeSetupGuide(options, manager), options),
    writeFileSafe(path.join(installRoot, 'README.md'), makeScaffoldReadme(options), options),
    writeFileSafe(path.join(installRoot, 'components', '.gitkeep'), '', options),
    writeFileSafe(path.join(installRoot, 'sections', '.gitkeep'), '', options),
    writeFileSafe(path.join(installRoot, 'pages', '.gitkeep'), '', options),
  ]);
}

async function main() {
  try {
    const options = parseArgs(process.argv.slice(2));
    const writes = await scaffold(options);

    const created = writes.filter(result => result.status === 'created').map(result => result.filePath);
    const updated = writes.filter(result => result.status === 'updated').map(result => result.filePath);
    const skipped = writes.filter(result => result.status === 'skipped').map(result => result.filePath);
    const manager = detectPackageManager();

    process.stdout.write('\nDesign system scaffold complete.\n');
    process.stdout.write(`Created: ${created.length}, Updated: ${updated.length}, Skipped: ${skipped.length}\n`);

    if (created.length > 0) {
      process.stdout.write('\nCreated files:\n');
      for (const filePath of created) {
        process.stdout.write(`  - ${path.relative(options.cwd, filePath)}\n`);
      }
    }

    if (updated.length > 0) {
      process.stdout.write('\nUpdated files:\n');
      for (const filePath of updated) {
        process.stdout.write(`  - ${path.relative(options.cwd, filePath)}\n`);
      }
    }

    if (skipped.length > 0) {
      process.stdout.write('\nSkipped existing files (use --force to overwrite):\n');
      for (const filePath of skipped) {
        process.stdout.write(`  - ${path.relative(options.cwd, filePath)}\n`);
      }
    }

    process.stdout.write('\nNext steps:\n');
    process.stdout.write(`  1. ${installCommand(manager)}\n`);
    process.stdout.write(`  2. Open DESIGN_SYSTEM_SETUP.md\n`);
    process.stdout.write('  3. Use your MCP client to call list_components and get_component_bundle\n');
  } catch (error) {
    process.stderr.write(`\nError: ${error instanceof Error ? error.message : 'Unknown error'}\n`);
    process.stderr.write('Run `design-system init --help` for usage.\n');
    process.exit(1);
  }
}

void main();
