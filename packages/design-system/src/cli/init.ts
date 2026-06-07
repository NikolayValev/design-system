#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import readline from 'node:readline';
import {
  getCompiledVisionIds,
  getVisionThemeIds,
  groupThemesByFamily,
  themeFamilies,
  visionThemes,
} from '../vde-themes';

type ModuleKey = 'themes' | 'components' | 'pages';
type PackageManager = 'pnpm' | 'yarn' | 'npm';

type CliOptions = {
  cwd: string;
  mcpUrl: string;
  installRoot: string;
  visions: string[];
  visionsExplicit: boolean;
  force: boolean;
  interactive: boolean;
  modules: ModuleKey[];
  modulesExplicit: boolean;
  writeMcpConfig: boolean;
  listModulesOnly: boolean;
  listVisionsOnly: boolean;
};

type WriteResult = {
  filePath: string;
  status: 'created' | 'updated' | 'skipped';
};

const DEFAULT_MCP_URL = 'https://designsystem.nikolayvalev.com/mcp';
const DEFAULT_INSTALL_ROOT = 'src/design-system';

const MODULE_ORDER: readonly ModuleKey[] = ['themes', 'components', 'pages'];

const MODULE_DESCRIPTIONS: Record<ModuleKey, string> = {
  themes: 'Set up vision themes + per-vision CSS',
  components: 'Prepare source folder for component bundles',
  pages: 'Prepare source folders for section/page bundles',
};

const MODULE_ALIASES: Record<string, ModuleKey> = {
  theme: 'themes',
  themes: 'themes',
  token: 'themes',
  tokens: 'themes',
  runtime: 'themes',
  component: 'components',
  components: 'components',
  page: 'pages',
  pages: 'pages',
  section: 'pages',
  sections: 'pages',
};

const ANSI = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  gray: '\x1b[90m',
};

function supportsColor(): boolean {
  if (!process.stdout.isTTY) {
    return false;
  }

  if (process.env.NO_COLOR) {
    return false;
  }

  if (process.env.FORCE_COLOR === '0') {
    return false;
  }

  return true;
}

const COLOR_ENABLED = supportsColor();

function style(text: string, colorCode: string): string {
  if (!COLOR_ENABLED) {
    return text;
  }

  return `${colorCode}${text}${ANSI.reset}`;
}

function modulesDisplayList(): string {
  return MODULE_ORDER.join(', ');
}

function printModules(): void {
  process.stdout.write('Available modules:\n');
  MODULE_ORDER.forEach((module, idx) => {
    process.stdout.write(`  ${idx + 1}) ${module.padEnd(10)} ${MODULE_DESCRIPTIONS[module]}\n`);
  });
}

function printVisions(): void {
  process.stdout.write('Available visions (grouped by family):\n');
  const groups = groupThemesByFamily(visionThemes);
  for (const group of groups) {
    process.stdout.write(`\n  ${style(group.family.name, ANSI.bold)}\n`);
    for (const theme of group.themes) {
      process.stdout.write(`    - ${theme.id}\n`);
    }
  }
  process.stdout.write('\n');
}

function printHelp(): void {
  const allVisionIds = getVisionThemeIds().join(', ');
  process.stdout.write(`Design System CLI

Usage:
  design-system init [options]
  design-system --help

Examples:
  design-system init
  design-system init --modules themes,components
  design-system init --targets pages --no-interactive
  design-system init --vision editorial,museum
  design-system init --list-modules
  design-system init --list-visions

Options:
  --mcp-url <url>       MCP server URL (default: ${DEFAULT_MCP_URL})
  --install-root <dir>  Local source install root (default: ${DEFAULT_INSTALL_ROOT})
  --vision <ids>        Comma-separated vision id list (default: all)
                        Available: ${allVisionIds}
  --modules <list>      Comma-separated module list (${modulesDisplayList()})
  --targets <list>      Alias for --modules
  --list-modules        Print selectable modules and exit
  --list-visions        Print available vision IDs grouped by family and exit
  --mcp-config          Always write .mcp.json and .cursor/mcp.json
  --no-mcp-config       Skip writing MCP config files
  --interactive         Force interactive selector menus
  --no-interactive      Disable interactive selector menus
  --force               Overwrite existing scaffold files
  --help                Show help
`);
}

function parseVisionInput(rawValue: string, source: string): string[] {
  const trimmed = rawValue.trim();
  if (!trimmed) {
    throw new Error(`No vision ids provided for ${source}.`);
  }

  const tokens = trimmed.split(/[,\s]+/).filter(Boolean);
  const validated = getCompiledVisionIds(tokens);
  return validated;
}

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {
    cwd: process.cwd(),
    mcpUrl: DEFAULT_MCP_URL,
    installRoot: DEFAULT_INSTALL_ROOT,
    visions: getVisionThemeIds(),
    visionsExplicit: false,
    force: false,
    interactive: process.stdin.isTTY && process.stdout.isTTY,
    modules: [...MODULE_ORDER],
    modulesExplicit: false,
    writeMcpConfig: true,
    listModulesOnly: false,
    listVisionsOnly: false,
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

    if (arg === '--list-modules') {
      options.listModulesOnly = true;
      continue;
    }

    if (arg === '--list-visions') {
      options.listVisionsOnly = true;
      continue;
    }

    if (arg === '--mcp-config') {
      options.writeMcpConfig = true;
      continue;
    }

    if (arg === '--no-mcp-config') {
      options.writeMcpConfig = false;
      continue;
    }

    if (arg === '--interactive') {
      options.interactive = true;
      continue;
    }

    if (arg === '--no-interactive') {
      options.interactive = false;
      continue;
    }

    if (arg === '--mcp-url') {
      const value = args[index + 1];
      if (!value || value.startsWith('-')) {
        throw new Error('Missing value for --mcp-url');
      }

      options.mcpUrl = value;
      index += 1;
      continue;
    }

    if (arg === '--install-root') {
      const value = args[index + 1];
      if (!value || value.startsWith('-')) {
        throw new Error('Missing value for --install-root');
      }

      options.installRoot = normalizePath(value);
      index += 1;
      continue;
    }

    if (arg === '--vision') {
      const value = args[index + 1];
      if (!value || value.startsWith('-')) {
        throw new Error('Missing value for --vision');
      }

      options.visions = parseVisionInput(value, '--vision');
      options.visionsExplicit = true;
      index += 1;
      continue;
    }

    if (arg === '--modules' || arg === '--targets') {
      const value = args[index + 1];
      if (!value || value.startsWith('-')) {
        throw new Error(`Missing value for ${arg}`);
      }

      options.modules = parseModuleInput(value, arg);
      options.modulesExplicit = true;
      index += 1;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return options;
}

function normalizeModuleToken(token: string): ModuleKey | null {
  const normalized = token.toLowerCase().replace(/^@/, '').trim();
  if (!normalized) {
    return null;
  }

  return MODULE_ALIASES[normalized] ?? null;
}

function parseModuleInput(rawValue: string, source: string): ModuleKey[] {
  const trimmed = rawValue.trim().toLowerCase();
  if (!trimmed) {
    throw new Error(`No modules provided for ${source}`);
  }

  if (trimmed === 'all' || trimmed === '*') {
    return [...MODULE_ORDER];
  }

  const tokenSet = new Set<ModuleKey>();
  const rawTokens = trimmed.split(/[,\s]+/).filter(Boolean);

  for (const rawToken of rawTokens) {
    const numeric = Number(rawToken);
    if (Number.isInteger(numeric) && numeric >= 1 && numeric <= MODULE_ORDER.length) {
      tokenSet.add(MODULE_ORDER[numeric - 1] as ModuleKey);
      continue;
    }

    const normalized = normalizeModuleToken(rawToken);
    if (!normalized) {
      throw new Error(
        `Unknown module "${rawToken}" in ${source}. Use: ${modulesDisplayList()}`,
      );
    }

    tokenSet.add(normalized);
  }

  if (tokenSet.size === 0) {
    throw new Error(`No valid modules provided for ${source}`);
  }

  return MODULE_ORDER.filter(module => tokenSet.has(module));
}

function renderFullscreen(lines: string[]): void {
  process.stdout.write('\x1b[2J\x1b[H');
  process.stdout.write(`${lines.join('\n')}\n`);
}

function withRawInput<T>(runner: (finish: () => void) => Promise<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const stdin = process.stdin;
    if (!stdin.isTTY || !process.stdout.isTTY) {
      reject(new Error('Interactive selector requires a TTY terminal. Use --modules and --vision flags.'));
      return;
    }

    readline.emitKeypressEvents(stdin);
    stdin.setRawMode(true);
    stdin.resume();
    process.stdout.write('\x1b[?25l');

    let finished = false;
    const finish = () => {
      if (finished) {
        return;
      }

      finished = true;
      stdin.setRawMode(false);
      process.stdout.write('\x1b[?25h');
      process.stdout.write('\n');
    };

    runner(finish).then(resolve).catch(reject).finally(finish);
  });
}

function toggleAllModules(selected: Set<ModuleKey>): Set<ModuleKey> {
  if (selected.size === MODULE_ORDER.length) {
    return new Set<ModuleKey>();
  }

  return new Set<ModuleKey>(MODULE_ORDER);
}

async function selectModulesInteractively(defaultModules: ModuleKey[]): Promise<ModuleKey[]> {
  return withRawInput<ModuleKey[]>(finish =>
    new Promise<ModuleKey[]>((resolve, reject) => {
      const stdin = process.stdin;
      let cursor = 0;
      let message = '';
      let selected = new Set<ModuleKey>(defaultModules);

      const cleanup = () => {
        stdin.off('keypress', onKeypress);
        finish();
      };

      const render = () => {
        const lines: string[] = [
          style('Design System Selector', `${ANSI.bold}${ANSI.cyan}`),
          'Choose what to scaffold/download.',
          style('Controls: Up/Down move, Space toggle, A toggle all, Enter confirm, Q cancel', ANSI.dim),
          '',
        ];

        MODULE_ORDER.forEach((module, idx) => {
          const isActive = idx === cursor;
          const prefix = isActive ? style('>', ANSI.cyan) : ' ';
          const marker = selected.has(module) ? '[x]' : '[ ]';
          lines.push(`${prefix} ${marker} ${module.padEnd(10)} ${MODULE_DESCRIPTIONS[module]}`);
        });

        if (message) {
          lines.push('');
          lines.push(style(message, ANSI.yellow));
        }

        renderFullscreen(lines);
      };

      const onKeypress = (_: string, key: { name?: string; ctrl?: boolean } = {}) => {
        if (key.ctrl && key.name === 'c') {
          cleanup();
          reject(new Error('Interactive selection cancelled.'));
          return;
        }

        if (key.name === 'q' || key.name === 'escape') {
          cleanup();
          reject(new Error('Interactive selection cancelled.'));
          return;
        }

        if (key.name === 'up') {
          cursor = (cursor - 1 + MODULE_ORDER.length) % MODULE_ORDER.length;
          render();
          return;
        }

        if (key.name === 'down') {
          cursor = (cursor + 1) % MODULE_ORDER.length;
          render();
          return;
        }

        if (key.name === 'space') {
          const module = MODULE_ORDER[cursor] as ModuleKey;
          if (selected.has(module)) {
            selected.delete(module);
          } else {
            selected.add(module);
          }
          message = '';
          render();
          return;
        }

        if (key.name === 'a') {
          selected = toggleAllModules(selected);
          message = '';
          render();
          return;
        }

        if (key.name === 'return' || key.name === 'enter') {
          if (selected.size === 0) {
            message = 'Select at least one module before continuing.';
            render();
            return;
          }

          cleanup();
          resolve(MODULE_ORDER.filter(module => selected.has(module)));
        }
      };

      stdin.on('keypress', onKeypress);
      render();
    }),
  );
}

async function selectVisionsInteractively(defaultVisions: string[]): Promise<string[]> {
  return withRawInput<string[]>(finish =>
    new Promise<string[]>((resolve, reject) => {
      const stdin = process.stdin;
      const allVisions = getVisionThemeIds();
      const groups = groupThemesByFamily(visionThemes);

      // Build flat ordered list with group separators info
      const flatItems: Array<{ id: string; familyName: string }> = [];
      for (const group of groups) {
        for (const theme of group.themes) {
          flatItems.push({ id: theme.id, familyName: group.family.name });
        }
      }

      let cursor = 0;
      let message = '';
      let selected = new Set<string>(defaultVisions);

      const cleanup = () => {
        stdin.off('keypress', onKeypress);
        finish();
      };

      const toggleAll = () => {
        if (selected.size === allVisions.length) {
          selected = new Set<string>();
        } else {
          selected = new Set<string>(allVisions);
        }
      };

      const render = () => {
        const lines: string[] = [
          style('Vision Picker', `${ANSI.bold}${ANSI.cyan}`),
          'Choose which visions to include.',
          style('Controls: Up/Down move, Space toggle, A toggle all, Enter confirm, Q cancel', ANSI.dim),
          '',
        ];

        let lastFamily = '';
        flatItems.forEach((item, idx) => {
          if (item.familyName !== lastFamily) {
            lines.push(style(`  ${item.familyName}`, ANSI.bold));
            lastFamily = item.familyName;
          }
          const isActive = idx === cursor;
          const prefix = isActive ? style('>', ANSI.cyan) : ' ';
          const marker = selected.has(item.id) ? '[x]' : '[ ]';
          lines.push(`${prefix} ${marker} ${item.id}`);
        });

        if (message) {
          lines.push('');
          lines.push(style(message, ANSI.yellow));
        }

        renderFullscreen(lines);
      };

      const onKeypress = (_: string, key: { name?: string; ctrl?: boolean } = {}) => {
        if (key.ctrl && key.name === 'c') {
          cleanup();
          reject(new Error('Interactive vision selection cancelled.'));
          return;
        }

        if (key.name === 'q' || key.name === 'escape') {
          cleanup();
          reject(new Error('Interactive vision selection cancelled.'));
          return;
        }

        if (key.name === 'up') {
          cursor = (cursor - 1 + flatItems.length) % flatItems.length;
          render();
          return;
        }

        if (key.name === 'down') {
          cursor = (cursor + 1) % flatItems.length;
          render();
          return;
        }

        if (key.name === 'space') {
          const item = flatItems[cursor];
          if (item) {
            if (selected.has(item.id)) {
              selected.delete(item.id);
            } else {
              selected.add(item.id);
            }
          }
          message = '';
          render();
          return;
        }

        if (key.name === 'a') {
          toggleAll();
          message = '';
          render();
          return;
        }

        if (key.name === 'return' || key.name === 'enter') {
          if (selected.size === 0) {
            message = 'Select at least one vision before continuing.';
            render();
            return;
          }

          cleanup();
          // Return in catalog order
          resolve(allVisions.filter(id => selected.has(id)));
        }
      };

      stdin.on('keypress', onKeypress);
      render();
    }),
  );
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

function detectPackageManager(): PackageManager {
  const ua = process.env.npm_config_user_agent ?? '';
  if (ua.startsWith('pnpm/')) {
    return 'pnpm';
  }

  if (ua.startsWith('yarn/')) {
    return 'yarn';
  }

  return 'npm';
}

function getSourceModules(modules: ModuleKey[]): ModuleKey[] {
  return modules.filter(module => module === 'components' || module === 'pages');
}

function hasModule(modules: ModuleKey[], module: ModuleKey): boolean {
  return modules.includes(module);
}

function needsMcp(modules: ModuleKey[]): boolean {
  return hasModule(modules, 'components') || hasModule(modules, 'pages');
}

function makeScaffoldReadme(options: CliOptions, modules: ModuleKey[]): string {
  const sourceModules = getSourceModules(modules);
  const moduleList = sourceModules.length > 0
    ? sourceModules.map(module => `- \`${module}\``).join('\n')
    : '- none';

  const visionImports = options.visions
    .map(id => `import '@nikolayvalev/design-system/styles/${id}.css';`)
    .join('\n');

  return `# Local Design-System Source

This directory is scaffolded by \`@nikolayvalev/design-system\` CLI.
Selected source modules:
${moduleList}

Install flow:
1. Configure your MCP client to use \`${options.mcpUrl}\`.
2. Call MCP tools like \`get_component_bundle\`, \`get_section_bundle\`, and \`get_page_bundle\`.
3. Write returned files inside \`${options.installRoot}\`.
4. Commit generated source files to your repository.

Selected visions:
${options.visions.map(id => `- \`${id}\``).join('\n')}

Recommended CSS imports (one per selected vision):
\`\`\`ts
${visionImports}
\`\`\`

Wrap your app in \`VisionProvider\` from \`@nikolayvalev/design-system\` to activate the vision system.
`;
}

function makeSetupGuide(options: CliOptions, manager: PackageManager, modules: ModuleKey[]): string {
  const sourceModules = getSourceModules(modules);

  const sections: string[] = ['# Design System Setup Guide', ''];
  let step = 1;

  if (hasModule(modules, 'themes')) {
    sections.push(`## ${step}) Install the design system package`);
    sections.push('');
    sections.push('```bash');
    if (manager === 'pnpm') {
      sections.push('pnpm add @nikolayvalev/design-system');
    } else if (manager === 'yarn') {
      sections.push('yarn add @nikolayvalev/design-system');
    } else {
      sections.push('npm install @nikolayvalev/design-system');
    }
    sections.push('```');
    sections.push('');

    sections.push(`## ${step + 1}) Import vision CSS`);
    sections.push('');
    sections.push('Import the per-vision CSS for each vision you want to use:');
    sections.push('');
    sections.push('```ts');
    for (const visionId of options.visions) {
      sections.push(`import '@nikolayvalev/design-system/styles/${visionId}.css';`);
    }
    sections.push('```');
    sections.push('');

    sections.push(`## ${step + 2}) Wrap your app in VisionProvider`);
    sections.push('');
    sections.push('```tsx');
    sections.push(`import { VisionProvider } from '@nikolayvalev/design-system';`);
    sections.push('');
    sections.push(`// Use the vision id that matches the CSS you imported`);
    sections.push(`<VisionProvider visionId="${options.visions[0] ?? 'editorial'}">`);
    sections.push(`  <App />`);
    sections.push(`</VisionProvider>`);
    sections.push('```');
    sections.push('');

    sections.push('Selected visions:');
    for (const visionId of options.visions) {
      sections.push(`- \`${visionId}\``);
    }
    sections.push('');
    step += 3;
  }

  if (needsMcp(modules)) {
    sections.push(`## ${step}) MCP endpoint`);
    sections.push('');
    sections.push('Use this URL in your MCP client configuration:');
    sections.push(`\`${options.mcpUrl}\``);
    if (!options.writeMcpConfig) {
      sections.push('');
      sections.push('MCP config files were not generated (`--no-mcp-config`). Configure your client manually.');
    }
    sections.push('');
    step += 1;
  }

  if (sourceModules.length > 0) {
    sections.push(`## ${step}) Local install root`);
    sections.push('');
    sections.push(`Write MCP bundle files to: \`${options.installRoot}\``);
    sections.push('');

    sections.push('Bundle tools for selected modules:');
    if (sourceModules.includes('components')) {
      sections.push('- Components: `list_components` + `get_component_bundle`');
    }
    if (sourceModules.includes('pages')) {
      sections.push('- Sections: `list_sections` + `get_section_bundle`');
      sections.push('- Pages: `list_pages` + `get_page_bundle`');
    }
    sections.push('');
  }

  sections.push('Selected modules:');
  sections.push(...modules.map(module => `- \`${module}\``));
  sections.push('');

  return sections.join('\n');
}

async function scaffold(options: CliOptions): Promise<WriteResult[]> {
  const modules = new Set<ModuleKey>(options.modules);
  const sourceModules = getSourceModules(options.modules);
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
    visions: options.visions,
    modules: options.modules,
    downloadTargets: options.modules,
    generatedBy: '@nikolayvalev/design-system',
  };

  const root = options.cwd;
  const manager = detectPackageManager();
  const installRoot = path.join(root, options.installRoot);

  const writes: Array<Promise<WriteResult>> = [
    writeFileSafe(
      path.join(root, 'design-system.config.json'),
      `${JSON.stringify(designSystemConfig, null, 2)}\n`,
      options,
    ),
    writeFileSafe(path.join(root, 'DESIGN_SYSTEM_SETUP.md'), makeSetupGuide(options, manager, options.modules), options),
  ];

  if (options.writeMcpConfig && needsMcp(options.modules)) {
    writes.push(
      writeFileSafe(path.join(root, '.mcp.json'), `${JSON.stringify(mcpConfig, null, 2)}\n`, options),
      writeFileSafe(path.join(root, '.cursor', 'mcp.json'), `${JSON.stringify(mcpConfig, null, 2)}\n`, options),
    );
  }

  if (sourceModules.length > 0) {
    writes.push(writeFileSafe(path.join(installRoot, 'README.md'), makeScaffoldReadme(options, options.modules), options));
    if (modules.has('components')) {
      writes.push(writeFileSafe(path.join(installRoot, 'components', '.gitkeep'), '', options));
    }
    if (modules.has('pages')) {
      writes.push(writeFileSafe(path.join(installRoot, 'sections', '.gitkeep'), '', options));
      writes.push(writeFileSafe(path.join(installRoot, 'pages', '.gitkeep'), '', options));
    }
  }

  return await Promise.all(writes);
}

async function main() {
  try {
    const options = parseArgs(process.argv.slice(2));

    if (options.listModulesOnly) {
      printModules();
      process.exit(0);
    }

    if (options.listVisionsOnly) {
      printVisions();
      process.exit(0);
    }

    if (options.interactive && !options.modulesExplicit) {
      options.modules = await selectModulesInteractively(options.modules);
    }

    if (options.interactive && hasModule(options.modules, 'themes') && !options.visionsExplicit) {
      options.visions = await selectVisionsInteractively(options.visions);
    }

    const writes = await scaffold(options);

    const created = writes.filter(result => result.status === 'created').map(result => result.filePath);
    const updated = writes.filter(result => result.status === 'updated').map(result => result.filePath);
    const skipped = writes.filter(result => result.status === 'skipped').map(result => result.filePath);
    const manager = detectPackageManager();
    const sourceModules = getSourceModules(options.modules);
    const selected = new Set<ModuleKey>(options.modules);

    process.stdout.write('\nDesign system scaffold complete.\n');
    process.stdout.write(`Created: ${created.length}, Updated: ${updated.length}, Skipped: ${skipped.length}\n`);
    process.stdout.write(`Modules: ${options.modules.join(', ')}\n`);
    if (selected.has('themes')) {
      process.stdout.write(`Visions: ${options.visions.join(', ')}\n`);
    }

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
    let step = 1;
    if (selected.has('themes')) {
      if (manager === 'pnpm') {
        process.stdout.write(`  ${step}. pnpm add @nikolayvalev/design-system\n`);
      } else if (manager === 'yarn') {
        process.stdout.write(`  ${step}. yarn add @nikolayvalev/design-system\n`);
      } else {
        process.stdout.write(`  ${step}. npm install @nikolayvalev/design-system\n`);
      }
      step += 1;
    }

    process.stdout.write(`  ${step}. Open DESIGN_SYSTEM_SETUP.md\n`);
    step += 1;

    if (needsMcp(options.modules) && !options.writeMcpConfig) {
      process.stdout.write(`  ${step}. Configure your MCP client with ${options.mcpUrl}\n`);
      step += 1;
    }

    if (sourceModules.length > 0) {
      if (sourceModules.includes('components')) {
        process.stdout.write(`  ${step}. Use MCP: list_components + get_component_bundle\n`);
        step += 1;
      }
      if (sourceModules.includes('pages')) {
        process.stdout.write(`  ${step}. Use MCP: list_sections + get_section_bundle\n`);
        step += 1;
        process.stdout.write(`  ${step}. Use MCP: list_pages + get_page_bundle\n`);
        step += 1;
      }
    }
  } catch (error) {
    process.stderr.write(`\nError: ${error instanceof Error ? error.message : 'Unknown error'}\n`);
    process.stderr.write('Run `design-system init --help` for usage.\n');
    process.exit(1);
  }
}

void main();
