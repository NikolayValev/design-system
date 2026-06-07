#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import readline from 'node:readline';
import {
  getCompiledVisionIds,
  getVisionThemeIds,
} from '../vde-themes';

const BUILT_IN_PROFILE_NAMES = ['public', 'dashboard', 'experimental'] as const;
type BuiltInProfileName = (typeof BUILT_IN_PROFILE_NAMES)[number];

/** Per-profile vision map used by the CLI's output config. */
type VisionByProfile = Record<BuiltInProfileName, string>;

const VISION_SETS = ['legacy', 'expanded', 'all'] as const;
type VisionSet = (typeof VISION_SETS)[number];

const DEFAULT_VISION_SET: VisionSet = 'all';

const LEGACY_VISION_IDS = ['museum', 'brutalist', 'immersive', 'editorial', 'zen', 'synthwave', 'noir', 'terminal'];
const EXPANDED_VISION_IDS = ['swiss_international', 'clay_soft', 'solarpunk', 'y2k_chrome'];

function getVisionSetIds(set: VisionSet): string[] {
  if (set === 'legacy') return LEGACY_VISION_IDS;
  if (set === 'expanded') return getCompiledVisionIds(EXPANDED_VISION_IDS);
  return getVisionThemeIds();
}

function isVisionSet(value: string): value is VisionSet {
  return (VISION_SETS as readonly string[]).includes(value);
}

const DEFAULT_VISION_ASSIGNMENTS: Record<VisionSet, VisionByProfile> = {
  legacy: { public: 'editorial', dashboard: 'terminal', experimental: 'brutalist' },
  expanded: { public: 'swiss_international', dashboard: 'clay_soft', experimental: 'y2k_chrome' },
  all: { public: 'editorial', dashboard: 'terminal', experimental: 'synthwave' },
};

function getDefaultVisionAssignments(set: VisionSet): VisionByProfile {
  return { ...DEFAULT_VISION_ASSIGNMENTS[set] };
}

function buildVisionAssignments(
  set: VisionSet,
  overrides: Partial<VisionByProfile> = {},
): VisionByProfile {
  const allowed = new Set(getVisionSetIds(set));
  const next = { ...getDefaultVisionAssignments(set), ...overrides };
  for (const [profile, visionId] of Object.entries(next)) {
    if (!allowed.has(visionId)) {
      throw new Error(`Vision "${visionId}" is not part of "${set}" vision set (profile: ${profile}).`);
    }
  }
  return next;
}

type ModuleKey = 'themes' | 'components' | 'pages';
type PackageManager = 'pnpm' | 'yarn' | 'npm';
type Profile = BuiltInProfileName;

type CliOptions = {
  cwd: string;
  mcpUrl: string;
  installRoot: string;
  profile: Profile;
  profileExplicit: boolean;
  force: boolean;
  interactive: boolean;
  modules: ModuleKey[];
  modulesExplicit: boolean;
  visionSet: VisionSet;
  visionSetExplicit: boolean;
  visionAssignments: VisionByProfile;
  visionAssignmentOverrides: Partial<VisionByProfile>;
  visionAssignmentsExplicit: boolean;
  writeMcpConfig: boolean;
  listModulesOnly: boolean;
  listProfilesOnly: boolean;
  listVisionSetsOnly: boolean;
  listVisionsOnly: boolean;
  listVisionsSet: VisionSet;
};

type WriteResult = {
  filePath: string;
  status: 'created' | 'updated' | 'skipped';
};

const DEFAULT_MCP_URL = 'https://designsystem.nikolayvalev.com/mcp';
const DEFAULT_INSTALL_ROOT = 'src/design-system';
const DEFAULT_PROFILE: Profile = BUILT_IN_PROFILE_NAMES[0];

const MODULE_ORDER: readonly ModuleKey[] = ['themes', 'components', 'pages'];
const PROFILE_ORDER: readonly Profile[] = BUILT_IN_PROFILE_NAMES;
const VISION_SET_ORDER: readonly VisionSet[] = VISION_SETS;

const MODULE_DESCRIPTIONS: Record<ModuleKey, string> = {
  themes: 'Install tokens package + choose a style profile',
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

const PROFILE_VIBES: Record<Profile, string> = {
  public: 'Bright and open. Editorial marketing feel.',
  dashboard: 'Calm and focused. Dense operator console vibe.',
  experimental: 'High contrast and bold. Prototype lab energy.',
};

const PROFILE_SWATCHES: Record<Profile, readonly number[]> = {
  public: [45, 219, 228],
  dashboard: [24, 67, 111],
  experimental: [201, 46, 226],
};

const VISION_SET_DESCRIPTIONS: Record<VisionSet, string> = {
  legacy: 'Classic foundational vision set',
  expanded: 'Expanded archetypes and visual directions',
  all: 'Complete registry (legacy + expanded)',
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

function swatch(color256: number): string {
  if (!COLOR_ENABLED) {
    return '[ ]';
  }

  return `\x1b[48;5;${color256}m   \x1b[0m`;
}

function profilePalette(profile: Profile): string {
  return PROFILE_SWATCHES[profile].map(value => swatch(value)).join(' ');
}

function profileDisplayLabel(profile: Profile): string {
  return `${profile.padEnd(12)} ${PROFILE_VIBES[profile]}`;
}

function modulesDisplayList(): string {
  return MODULE_ORDER.join(', ');
}

function profileDisplayList(): string {
  return PROFILE_ORDER.join(' | ');
}

function isProfile(value: string): value is Profile {
  return (PROFILE_ORDER as readonly string[]).includes(value);
}

function visionSetDisplayList(): string {
  return VISION_SET_ORDER.join(' | ');
}

function isBuiltInProfile(value: string): value is Profile {
  return (PROFILE_ORDER as readonly string[]).includes(value);
}

function parseVisionAssignmentPairs(rawValue: string, source: string): Partial<VisionByProfile> {
  const trimmed = rawValue.trim();
  if (!trimmed) {
    throw new Error(`No profile vision assignments provided for ${source}.`);
  }

  const overrides: Partial<VisionByProfile> = {};
  const pairs = trimmed.split(/[,\s]+/).filter(Boolean);
  for (const pair of pairs) {
    const [rawProfile, rawVision] = pair.split('=').map(value => value.trim());
    if (!rawProfile || !rawVision) {
      throw new Error(`Invalid assignment "${pair}" in ${source}. Use profile=visionId.`);
    }

    if (!isBuiltInProfile(rawProfile)) {
      throw new Error(
        `Unsupported profile "${rawProfile}" in ${source}. Use ${profileDisplayList()}.`,
      );
    }

    overrides[rawProfile] = rawVision;
  }

  return overrides;
}

function printModules(): void {
  process.stdout.write('Available modules:\n');
  MODULE_ORDER.forEach((module, idx) => {
    process.stdout.write(`  ${idx + 1}) ${module.padEnd(10)} ${MODULE_DESCRIPTIONS[module]}\n`);
  });
}

function printProfiles(): void {
  process.stdout.write('Available style profiles:\n');
  PROFILE_ORDER.forEach((profile, idx) => {
    process.stdout.write(`  ${idx + 1}) ${profileDisplayLabel(profile)}\n`);
    process.stdout.write(`     ${profilePalette(profile)}\n`);
  });
}

function printVisionSets(): void {
  process.stdout.write('Available vision sets:\n');
  VISION_SET_ORDER.forEach((set, idx) => {
    process.stdout.write(`  ${idx + 1}) ${set.padEnd(10)} ${VISION_SET_DESCRIPTIONS[set]}\n`);
  });
}

function printVisionIds(set: VisionSet): void {
  process.stdout.write(`Vision IDs for set "${set}":\n`);
  getVisionSetIds(set).forEach((visionId, idx) => {
    process.stdout.write(`  ${idx + 1}) ${visionId}\n`);
  });
}

function printHelp(): void {
  process.stdout.write(`Design System CLI

Usage:
  design-system init [options]
  design-system --help

Examples:
  design-system init
  design-system init --modules themes,components
  design-system init --targets pages --no-interactive
  design-system init --vision-system expanded --vision-public swiss_international
  design-system init --list-modules
  design-system init --list-profiles

Options:
  --mcp-url <url>       MCP server URL (default: ${DEFAULT_MCP_URL})
  --install-root <dir>  Local source install root (default: ${DEFAULT_INSTALL_ROOT})
  --profile <name>      Style profile: ${profileDisplayList()} (default: ${DEFAULT_PROFILE})
  --modules <list>      Comma-separated module list (${modulesDisplayList()})
  --targets <list>      Alias for --modules
  --vision-system <id>  Compile-time vision set: ${visionSetDisplayList()} (default: ${DEFAULT_VISION_SET})
  --vision-map <pairs>  Profile/vision map, e.g. public=editorial,dashboard=terminal
  --vision-public <id>  Assign compile-time vision for public profile
  --vision-dashboard <id> Assign compile-time vision for dashboard profile
  --vision-experimental <id> Assign compile-time vision for experimental profile
  --list-modules        Print selectable modules and exit
  --list-profiles       Print style profiles (colors + vibes) and exit
  --list-vision-systems Print vision sets and exit
  --list-visions [sys]  Print available vision IDs for a set and exit (default: selected set)
  --mcp-config          Always write .mcp.json and .cursor/mcp.json
  --no-mcp-config       Skip writing MCP config files
  --interactive         Force interactive selector menus
  --no-interactive      Disable interactive selector menus
  --force               Overwrite existing scaffold files
  --help                Show help
`);
}

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {
    cwd: process.cwd(),
    mcpUrl: DEFAULT_MCP_URL,
    installRoot: DEFAULT_INSTALL_ROOT,
    profile: DEFAULT_PROFILE,
    profileExplicit: false,
    force: false,
    interactive: process.stdin.isTTY && process.stdout.isTTY,
    modules: [...MODULE_ORDER],
    modulesExplicit: false,
    visionSet: DEFAULT_VISION_SET,
    visionSetExplicit: false,
    visionAssignments: getDefaultVisionAssignments(DEFAULT_VISION_SET),
    visionAssignmentOverrides: {},
    visionAssignmentsExplicit: false,
    writeMcpConfig: true,
    listModulesOnly: false,
    listProfilesOnly: false,
    listVisionSetsOnly: false,
    listVisionsOnly: false,
    listVisionsSet: DEFAULT_VISION_SET,
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

    if (arg === '--list-profiles') {
      options.listProfilesOnly = true;
      continue;
    }

    if (arg === '--list-vision-systems') {
      options.listVisionSetsOnly = true;
      continue;
    }

    if (arg === '--list-visions') {
      options.listVisionsOnly = true;
      const value = args[index + 1];
      if (value && !value.startsWith('-')) {
        if (!isVisionSet(value)) {
          throw new Error(`Unsupported vision set "${value}". Use ${visionSetDisplayList()}.`);
        }

        options.listVisionsSet = value;
        index += 1;
      }
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

    if (arg === '--profile') {
      const value = args[index + 1];
      if (!value || value.startsWith('-')) {
        throw new Error('Missing value for --profile');
      }

      if (!isProfile(value)) {
        throw new Error(`Unsupported profile "${value}". Use ${profileDisplayList()}.`);
      }

      options.profile = value;
      options.profileExplicit = true;
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

    if (arg === '--vision-system') {
      const value = args[index + 1];
      if (!value || value.startsWith('-')) {
        throw new Error('Missing value for --vision-system');
      }

      if (!isVisionSet(value)) {
        throw new Error(`Unsupported vision set "${value}". Use ${visionSetDisplayList()}.`);
      }

      options.visionSet = value;
      options.visionSetExplicit = true;
      options.listVisionsSet = value;
      index += 1;
      continue;
    }

    if (arg === '--vision-map') {
      const value = args[index + 1];
      if (!value || value.startsWith('-')) {
        throw new Error('Missing value for --vision-map');
      }

      options.visionAssignmentOverrides = {
        ...options.visionAssignmentOverrides,
        ...parseVisionAssignmentPairs(value, '--vision-map'),
      };
      options.visionAssignmentsExplicit = true;
      index += 1;
      continue;
    }

    if (arg === '--vision-public') {
      const value = args[index + 1];
      if (!value || value.startsWith('-')) {
        throw new Error('Missing value for --vision-public');
      }

      options.visionAssignmentOverrides = { ...options.visionAssignmentOverrides, public: value };
      options.visionAssignmentsExplicit = true;
      index += 1;
      continue;
    }

    if (arg === '--vision-dashboard') {
      const value = args[index + 1];
      if (!value || value.startsWith('-')) {
        throw new Error('Missing value for --vision-dashboard');
      }

      options.visionAssignmentOverrides = { ...options.visionAssignmentOverrides, dashboard: value };
      options.visionAssignmentsExplicit = true;
      index += 1;
      continue;
    }

    if (arg === '--vision-experimental') {
      const value = args[index + 1];
      if (!value || value.startsWith('-')) {
        throw new Error('Missing value for --vision-experimental');
      }

      options.visionAssignmentOverrides = { ...options.visionAssignmentOverrides, experimental: value };
      options.visionAssignmentsExplicit = true;
      index += 1;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  options.visionAssignments = buildVisionAssignments(
    options.visionSet,
    options.visionAssignmentOverrides,
  );

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
      reject(new Error('Interactive selector requires a TTY terminal. Use --modules and --profile flags.'));
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

async function selectProfileInteractively(defaultProfile: Profile): Promise<Profile> {
  return withRawInput<Profile>(finish =>
    new Promise<Profile>((resolve, reject) => {
      const stdin = process.stdin;
      let cursor = PROFILE_ORDER.indexOf(defaultProfile);
      if (cursor < 0) {
        cursor = 0;
      }

      const cleanup = () => {
        stdin.off('keypress', onKeypress);
        finish();
      };

      const render = () => {
        const lines: string[] = [
          style('Theme Style Picker', `${ANSI.bold}${ANSI.green}`),
          'Choose your default style profile.',
          style('Controls: Up/Down move, Enter confirm, Q cancel', ANSI.dim),
          '',
        ];

        PROFILE_ORDER.forEach((profile, idx) => {
          const isActive = idx === cursor;
          const prefix = isActive ? style('>', ANSI.green) : ' ';
          lines.push(`${prefix} ${profileDisplayLabel(profile)}`);
          lines.push(`    ${profilePalette(profile)}`);
        });

        renderFullscreen(lines);
      };

      const onKeypress = (_: string, key: { name?: string; ctrl?: boolean } = {}) => {
        if (key.ctrl && key.name === 'c') {
          cleanup();
          reject(new Error('Interactive profile selection cancelled.'));
          return;
        }

        if (key.name === 'q' || key.name === 'escape') {
          cleanup();
          reject(new Error('Interactive profile selection cancelled.'));
          return;
        }

        if (key.name === 'up') {
          cursor = (cursor - 1 + PROFILE_ORDER.length) % PROFILE_ORDER.length;
          render();
          return;
        }

        if (key.name === 'down') {
          cursor = (cursor + 1) % PROFILE_ORDER.length;
          render();
          return;
        }

        if (key.name === 'return' || key.name === 'enter') {
          cleanup();
          resolve(PROFILE_ORDER[cursor] as Profile);
        }
      };

      stdin.on('keypress', onKeypress);
      render();
    }),
  );
}

async function selectVisionSetInteractively(defaultSet: VisionSet): Promise<VisionSet> {
  return withRawInput<VisionSet>(finish =>
    new Promise<VisionSet>((resolve, reject) => {
      const stdin = process.stdin;
      let cursor = VISION_SET_ORDER.indexOf(defaultSet);
      if (cursor < 0) {
        cursor = 0;
      }

      const cleanup = () => {
        stdin.off('keypress', onKeypress);
        finish();
      };

      const render = () => {
        const lines: string[] = [
          style('Vision Set Picker', `${ANSI.bold}${ANSI.cyan}`),
          'Choose the compile-time vision set.',
          style('Controls: Up/Down move, Enter confirm, Q cancel', ANSI.dim),
          '',
        ];

        VISION_SET_ORDER.forEach((set, idx) => {
          const isActive = idx === cursor;
          const prefix = isActive ? style('>', ANSI.cyan) : ' ';
          lines.push(`${prefix} ${set.padEnd(10)} ${VISION_SET_DESCRIPTIONS[set]}`);
        });

        renderFullscreen(lines);
      };

      const onKeypress = (_: string, key: { name?: string; ctrl?: boolean } = {}) => {
        if (key.ctrl && key.name === 'c') {
          cleanup();
          reject(new Error('Interactive vision set selection cancelled.'));
          return;
        }

        if (key.name === 'q' || key.name === 'escape') {
          cleanup();
          reject(new Error('Interactive vision set selection cancelled.'));
          return;
        }

        if (key.name === 'up') {
          cursor = (cursor - 1 + VISION_SET_ORDER.length) % VISION_SET_ORDER.length;
          render();
          return;
        }

        if (key.name === 'down') {
          cursor = (cursor + 1) % VISION_SET_ORDER.length;
          render();
          return;
        }

        if (key.name === 'return' || key.name === 'enter') {
          cleanup();
          resolve(VISION_SET_ORDER[cursor] as VisionSet);
        }
      };

      stdin.on('keypress', onKeypress);
      render();
    }),
  );
}

async function selectVisionForProfileInteractively(
  profile: Profile,
  set: VisionSet,
  defaultVisionId: string,
): Promise<string> {
  return withRawInput<string>(finish =>
    new Promise<string>((resolve, reject) => {
      const stdin = process.stdin;
      const options = [...getVisionSetIds(set)];
      let cursor = options.indexOf(defaultVisionId);
      if (cursor < 0) {
        cursor = 0;
      }

      const cleanup = () => {
        stdin.off('keypress', onKeypress);
        finish();
      };

      const render = () => {
        const lines: string[] = [
          style(`Vision Assignment: ${profile}`, `${ANSI.bold}${ANSI.green}`),
          `Choose compile-time vision for profile "${profile}" (${set} set).`,
          style('Controls: Up/Down move, Enter confirm, Q cancel', ANSI.dim),
          '',
        ];

        options.forEach((visionId, idx) => {
          const isActive = idx === cursor;
          const prefix = isActive ? style('>', ANSI.green) : ' ';
          lines.push(`${prefix} ${visionId}`);
        });

        renderFullscreen(lines);
      };

      const onKeypress = (_: string, key: { name?: string; ctrl?: boolean } = {}) => {
        if (key.ctrl && key.name === 'c') {
          cleanup();
          reject(new Error(`Interactive vision assignment cancelled for ${profile}.`));
          return;
        }

        if (key.name === 'q' || key.name === 'escape') {
          cleanup();
          reject(new Error(`Interactive vision assignment cancelled for ${profile}.`));
          return;
        }

        if (key.name === 'up') {
          cursor = (cursor - 1 + options.length) % options.length;
          render();
          return;
        }

        if (key.name === 'down') {
          cursor = (cursor + 1) % options.length;
          render();
          return;
        }

        if (key.name === 'return' || key.name === 'enter') {
          cleanup();
          resolve(options[cursor] as string);
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

function installCommand(packageManager: PackageManager): string {
  if (packageManager === 'pnpm') {
    return 'pnpm add @nikolayvalev/design-tokens';
  }

  if (packageManager === 'yarn') {
    return 'yarn add @nikolayvalev/design-tokens';
  }

  return 'npm install @nikolayvalev/design-tokens';
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

  return `# Local Design-System Source

This directory is scaffolded by \`@nikolayvalev/design-system\` CLI.
Selected source modules:
${moduleList}

Install flow:
1. Configure your MCP client to use \`${options.mcpUrl}\`.
2. Call MCP tools like \`get_component_bundle\`, \`get_section_bundle\`, and \`get_page_bundle\`.
3. Write returned files inside \`${options.installRoot}\`.
4. Commit generated source files to your repository.

Token profile selected during init: \`${options.profile}\`
Recommended CSS import:
\`@nikolayvalev/design-tokens/styles/${options.profile}.css\`

Compile-time vision set:
\`${options.visionSet}\`

Compile-time profile vision assignments:
- \`public\` -> \`${options.visionAssignments.public}\`
- \`dashboard\` -> \`${options.visionAssignments.dashboard}\`
- \`experimental\` -> \`${options.visionAssignments.experimental}\`
`;
}

function makeSetupGuide(options: CliOptions, manager: PackageManager, modules: ModuleKey[]): string {
  const sourceModules = getSourceModules(modules);

  const sections: string[] = ['# Design System Setup Guide', ''];
  let step = 1;

  if (hasModule(modules, 'themes')) {
    sections.push(`## ${step}) Install themes runtime package`);
    sections.push('');
    sections.push('```bash');
    sections.push(installCommand(manager));
    sections.push('```');
    sections.push('');

    sections.push(`## ${step + 1}) Import selected profile CSS`);
    sections.push('');
    sections.push('```ts');
    sections.push(`import '@nikolayvalev/design-tokens/styles/${options.profile}.css';`);
    sections.push('```');
    sections.push('');

    sections.push('Selected style vibe:');
    sections.push(`- \`${options.profile}\`: ${PROFILE_VIBES[options.profile]}`);
    sections.push('');
    sections.push('Compile-time vision assignments for generated profile CSS:');
    sections.push(`- Vision set: \`${options.visionSet}\``);
    sections.push(`- \`public\` -> \`${options.visionAssignments.public}\``);
    sections.push(`- \`dashboard\` -> \`${options.visionAssignments.dashboard}\``);
    sections.push(`- \`experimental\` -> \`${options.visionAssignments.experimental}\``);
    sections.push('');
    step += 2;
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

  sections.push('Build-time environment variables (when building the design-system package from source):');
  sections.push('```bash');
  sections.push(`DESIGN_SYSTEM_VISIONS=${options.visionAssignments.public},${options.visionAssignments.dashboard},${options.visionAssignments.experimental}`);
  sections.push(`DESIGN_SYSTEM_VISION_PUBLIC=${options.visionAssignments.public}`);
  sections.push(`DESIGN_SYSTEM_VISION_DASHBOARD=${options.visionAssignments.dashboard}`);
  sections.push(`DESIGN_SYSTEM_VISION_EXPERIMENTAL=${options.visionAssignments.experimental}`);
  sections.push('```');
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
    tokenProfile: options.profile,
    visionSet: options.visionSet,
    profileVisions: options.visionAssignments,
    modules: options.modules, // backwards compatibility
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

    if (options.listProfilesOnly) {
      printProfiles();
      process.exit(0);
    }

    if (options.listVisionSetsOnly) {
      printVisionSets();
      process.exit(0);
    }

    if (options.listVisionsOnly) {
      printVisionIds(options.listVisionsSet);
      process.exit(0);
    }

    if (options.interactive && !options.modulesExplicit) {
      options.modules = await selectModulesInteractively(options.modules);
    }

    if (options.interactive && hasModule(options.modules, 'themes') && !options.profileExplicit) {
      options.profile = await selectProfileInteractively(options.profile);
    }

    if (options.interactive && hasModule(options.modules, 'themes') && !options.visionSetExplicit) {
      options.visionSet = await selectVisionSetInteractively(options.visionSet);
      options.listVisionsSet = options.visionSet;
    }

    if (options.interactive && hasModule(options.modules, 'themes') && !options.visionAssignmentsExplicit) {
      const assignmentDraft = getDefaultVisionAssignments(options.visionSet);
      for (const profile of PROFILE_ORDER) {
        assignmentDraft[profile] = await selectVisionForProfileInteractively(
          profile,
          options.visionSet,
          assignmentDraft[profile],
        );
      }
      options.visionAssignmentOverrides = assignmentDraft;
      options.visionAssignmentsExplicit = true;
    }

    options.visionAssignments = buildVisionAssignments(
      options.visionSet,
      options.visionAssignmentsExplicit ? options.visionAssignmentOverrides : {},
    );

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
      process.stdout.write(`Style profile: ${options.profile} (${PROFILE_VIBES[options.profile]})\n`);
      process.stdout.write(`Vision set: ${options.visionSet}\n`);
      process.stdout.write(`Vision assignments: public=${options.visionAssignments.public}, dashboard=${options.visionAssignments.dashboard}, experimental=${options.visionAssignments.experimental}\n`);
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
      process.stdout.write(`  ${step}. ${installCommand(manager)}\n`);
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

    if (selected.has('themes')) {
      process.stdout.write(`  ${step}. For package builds, set DESIGN_SYSTEM_VISIONS=<comma-separated-ids> or individual DESIGN_SYSTEM_VISION_* vars\n`);
      step += 1;
    }
  } catch (error) {
    process.stderr.write(`\nError: ${error instanceof Error ? error.message : 'Unknown error'}\n`);
    process.stderr.write('Run `design-system init --help` for usage.\n');
    process.exit(1);
  }
}

void main();
