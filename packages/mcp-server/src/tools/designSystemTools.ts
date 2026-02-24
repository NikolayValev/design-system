import fg from 'fast-glob';
import path from 'path';
import fs from 'fs/promises';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export type ArtifactKind = 'component' | 'section' | 'page';
type BundleOrigin = 'local' | 'remote';

const ARTIFACT_DIR_NAME: Record<ArtifactKind, string> = {
  component: 'components',
  section: 'sections',
  page: 'pages',
};

const DEFAULT_DESIGN_SYSTEM_SRC_DIR = path.resolve(__dirname, '../../../../packages/design-system/src');
const DESIGN_SYSTEM_SRC_DIR = process.env.DESIGN_SYSTEM_SRC_DIR ?? DEFAULT_DESIGN_SYSTEM_SRC_DIR;

const DESIGN_SYSTEM_ARTIFACT_DIR: Record<ArtifactKind, string> = {
  component: process.env.DESIGN_SYSTEM_COMPONENTS_DIR ?? path.join(DESIGN_SYSTEM_SRC_DIR, ARTIFACT_DIR_NAME.component),
  section: process.env.DESIGN_SYSTEM_SECTIONS_DIR ?? path.join(DESIGN_SYSTEM_SRC_DIR, ARTIFACT_DIR_NAME.section),
  page: process.env.DESIGN_SYSTEM_PAGES_DIR ?? path.join(DESIGN_SYSTEM_SRC_DIR, ARTIFACT_DIR_NAME.page),
};

const DEFAULT_GITHUB_REPOSITORY = 'NikolayValev/design-system';
const DEFAULT_GITHUB_REF = 'main';
const DEFAULT_GITHUB_COMPONENTS_ROOT = 'packages/design-system/src/components';
const DEFAULT_GITHUB_SRC_ROOT = path.posix.dirname(DEFAULT_GITHUB_COMPONENTS_ROOT);
const DEFAULT_GITHUB_API_BASE = 'https://api.github.com';
const DEFAULT_REQUEST_TIMEOUT_MS = 10_000;

const GITHUB_REPOSITORY = process.env.DESIGN_SYSTEM_GITHUB_REPOSITORY ?? DEFAULT_GITHUB_REPOSITORY;
const GITHUB_REF = process.env.DESIGN_SYSTEM_GITHUB_REF ?? DEFAULT_GITHUB_REF;
const GITHUB_COMPONENTS_ROOT = process.env.DESIGN_SYSTEM_GITHUB_COMPONENTS_ROOT ?? DEFAULT_GITHUB_COMPONENTS_ROOT;
const GITHUB_SRC_ROOT = process.env.DESIGN_SYSTEM_GITHUB_SRC_ROOT ?? path.posix.dirname(GITHUB_COMPONENTS_ROOT);
const GITHUB_SECTIONS_ROOT = process.env.DESIGN_SYSTEM_GITHUB_SECTIONS_ROOT ?? `${GITHUB_SRC_ROOT}/sections`;
const GITHUB_PAGES_ROOT = process.env.DESIGN_SYSTEM_GITHUB_PAGES_ROOT ?? `${GITHUB_SRC_ROOT}/pages`;
const GITHUB_API_BASE = process.env.DESIGN_SYSTEM_GITHUB_API_BASE ?? DEFAULT_GITHUB_API_BASE;
const LEGACY_COMPONENTS_API_URL = process.env.DESIGN_SYSTEM_COMPONENTS_GITHUB_API_URL;
const REQUEST_TIMEOUT_MS = Number(process.env.DESIGN_SYSTEM_REMOTE_TIMEOUT_MS ?? DEFAULT_REQUEST_TIMEOUT_MS);
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const REMOTE_INDEX_CACHE_TTL_MS = 5 * 60 * 1000;
const REMOTE_SOURCE_CACHE_TTL_MS = 15 * 60 * 1000;
const REMOTE_TREE_CACHE_TTL_MS = 5 * 60 * 1000;

const TOKEN_PACKAGE_NAME = '@nikolayvalev/design-tokens';
const COMPONENT_INSTALL_ROOT = 'src/design-system';

const SOURCE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs'] as const;
const IGNORED_EXTERNAL_DEPENDENCIES = new Set(['react', 'react/jsx-runtime', 'react-dom']);

export type ArtifactSummary = {
  kind: ArtifactKind;
  name: string;
  file: string;
  doc: string;
  origin: BundleOrigin;
};

export type ArtifactSource = ArtifactSummary & {
  source: string;
};

export type ArtifactInstallBundleFile = {
  path: string;
  source: string;
  kind: ArtifactKind | 'support';
  origin: BundleOrigin;
};

export type ArtifactInstallBundle = {
  artifactKind: ArtifactKind;
  requested: string[];
  resolved: string[];
  missing: string[];
  installRoot: string;
  tokenPackage: string;
  files: ArtifactInstallBundleFile[];
  externalDependencies: string[];
  warnings: string[];
  origin: 'local' | 'remote' | 'mixed';
};

// Backward-compatible aliases for existing MCP consumers.
export type ComponentSummary = ArtifactSummary;
export type ComponentSource = ArtifactSource;
export type ComponentInstallBundle = ArtifactInstallBundle;

type RemoteIndexEntry = {
  kind: ArtifactKind;
  name: string;
  file: string;
  repoPath: string;
  downloadUrl: string;
};

type CachedRemoteSource = {
  loadedAt: number;
  source: string;
  doc: string;
};

type GitTreeEntry = {
  path?: string;
  type?: string;
};

type GitTreeResponse = {
  tree?: GitTreeEntry[];
};

type GithubContentsEntry = {
  name?: string;
  path?: string;
  type?: string;
  download_url?: string | null;
};

type BundleWorkItem = {
  srcRelativePath: string;
  origin: BundleOrigin;
  repoPath?: string;
};

type LoadedSource = {
  source: string;
  origin: BundleOrigin;
  repoPath?: string;
};

type RemoteTreeCache = {
  loadedAt: number;
  entries: GitTreeEntry[];
};

const remoteIndexCache = new Map<ArtifactKind, { loadedAt: number; entries: RemoteIndexEntry[] }>();
const remoteSourceCache = new Map<string, CachedRemoteSource>();
let remoteTreeCache: RemoteTreeCache | undefined;

const githubApiHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    'user-agent': 'design-system-mcp-server',
    accept: 'application/vnd.github+json',
  };

  if (GITHUB_TOKEN) {
    headers.authorization = `Bearer ${GITHUB_TOKEN}`;
  }

  return headers;
};

const normalizeTimeoutMs = () => {
  if (Number.isFinite(REQUEST_TIMEOUT_MS) && REQUEST_TIMEOUT_MS > 0) {
    return REQUEST_TIMEOUT_MS;
  }

  return DEFAULT_REQUEST_TIMEOUT_MS;
};

const withTimeout = async <T>(work: (signal: AbortSignal) => Promise<T>): Promise<T> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), normalizeTimeoutMs());
  try {
    return await work(controller.signal);
  } finally {
    clearTimeout(timeout);
  }
};

const buildTreeApiUrl = () =>
  `${GITHUB_API_BASE}/repos/${GITHUB_REPOSITORY}/git/trees/${encodeURIComponent(GITHUB_REF)}?recursive=1`;

const buildRawUrl = (repoPath: string) =>
  `https://raw.githubusercontent.com/${GITHUB_REPOSITORY}/${GITHUB_REF}/${repoPath}`;

function getRemoteRootForKind(kind: ArtifactKind): string {
  if (kind === 'component') {
    return GITHUB_COMPONENTS_ROOT;
  }

  if (kind === 'section') {
    return GITHUB_SECTIONS_ROOT;
  }

  return GITHUB_PAGES_ROOT;
}

export async function getArtifactList(kind: ArtifactKind): Promise<ArtifactSummary[]> {
  const local = await getLocalArtifactList(kind);
  if (local.length > 0) {
    return local;
  }

  return await getRemoteArtifactList(kind);
}

export async function searchArtifacts(kind: ArtifactKind, query: string): Promise<ArtifactSummary[]> {
  const all = await getArtifactList(kind);
  const q = query.toLowerCase();

  let matches = all.filter(artifact =>
    artifact.name.toLowerCase().includes(q) || (artifact.doc && artifact.doc.toLowerCase().includes(q)),
  );

  if (matches.length === 0 && all.some(artifact => artifact.origin === 'remote' && artifact.doc.length === 0)) {
    await hydrateRemoteDocs(kind);
    const refreshed = await getRemoteArtifactList(kind);
    matches = refreshed.filter(artifact =>
      artifact.name.toLowerCase().includes(q) || (artifact.doc && artifact.doc.toLowerCase().includes(q)),
    );
  }

  return matches;
}

export async function getArtifactSource(kind: ArtifactKind, name: string): Promise<ArtifactSource | null> {
  const local = await getLocalArtifactList(kind);
  const localMatch = local.find(artifact => artifact.name.toLowerCase() === name.toLowerCase());

  if (localMatch) {
    const sourcePath = path.join(DESIGN_SYSTEM_ARTIFACT_DIR[kind], ...toPosixPath(localMatch.file).split('/'));
    const source = await fs.readFile(sourcePath, 'utf8');
    return { ...localMatch, source };
  }

  const remoteEntries = await getRemoteIndex(kind);
  const remoteMatch = remoteEntries.find(artifact => artifact.name.toLowerCase() === name.toLowerCase());
  if (!remoteMatch) {
    return null;
  }

  const source = await getRemoteSourceByRepoPath(remoteMatch.repoPath);
  if (!source) {
    return null;
  }

  return {
    kind,
    name: remoteMatch.name,
    file: remoteMatch.file,
    doc: extractJsDocFromContent(source),
    origin: 'remote',
    source,
  };
}

export async function getArtifactInstallBundle(kind: ArtifactKind, names: string[]): Promise<ArtifactInstallBundle> {
  const requested = dedupeCaseSensitive(names.map(name => name.trim()).filter(Boolean));
  const missing: string[] = [];
  const resolved: string[] = [];
  const warnings: string[] = [];
  const queue: BundleWorkItem[] = [];

  for (const name of requested) {
    const seed = await resolveArtifactSeed(kind, name);
    if (!seed) {
      missing.push(name);
      continue;
    }

    resolved.push(seed.name);
    queue.push({
      srcRelativePath: seed.srcRelativePath,
      origin: seed.origin,
      repoPath: seed.repoPath,
    });
  }

  const seedPaths = new Set(queue.map(item => item.srcRelativePath));
  const visited = new Set<string>();
  const fileMap = new Map<string, ArtifactInstallBundleFile>();
  const externalDependencies = new Set<string>();
  const originSet = new Set<BundleOrigin>();

  while (queue.length > 0) {
    const workItem = queue.shift();
    if (!workItem) {
      break;
    }

    const normalizedPath = normalizeSrcRelativePath(workItem.srcRelativePath);
    if (!isPathInsideSrc(normalizedPath) || visited.has(normalizedPath)) {
      continue;
    }

    const loaded = await loadSource(workItem);
    if (!loaded) {
      warnings.push(`Could not load source for "${normalizedPath}" (${workItem.origin}).`);
      continue;
    }

    visited.add(normalizedPath);
    originSet.add(loaded.origin);

    const existing = fileMap.get(normalizedPath);
    const fileKind: ArtifactKind | 'support' = seedPaths.has(normalizedPath) ? kind : 'support';
    if (!existing || existing.kind === 'support') {
      fileMap.set(normalizedPath, {
        path: normalizedPath,
        source: loaded.source,
        kind: fileKind,
        origin: loaded.origin,
      });
    }

    const { relativeImports, externalImports } = parseImports(loaded.source);
    for (const dependency of externalImports) {
      if (!IGNORED_EXTERNAL_DEPENDENCIES.has(dependency)) {
        externalDependencies.add(dependency);
      }
    }

    for (const importPath of relativeImports) {
      const resolvedImport = await resolveRelativeImport({
        fromPath: normalizedPath,
        importPath,
        origin: loaded.origin,
      });

      if (!resolvedImport) {
        warnings.push(`Unresolved relative import "${importPath}" from "${normalizedPath}".`);
        continue;
      }

      if (!visited.has(resolvedImport.srcRelativePath)) {
        queue.push(resolvedImport);
      }
    }
  }

  const files = Array.from(fileMap.values()).sort((a, b) => a.path.localeCompare(b.path));

  return {
    artifactKind: kind,
    requested,
    resolved: dedupeCaseSensitive(resolved),
    missing,
    installRoot: COMPONENT_INSTALL_ROOT,
    tokenPackage: TOKEN_PACKAGE_NAME,
    files,
    externalDependencies: Array.from(externalDependencies).sort((a, b) => a.localeCompare(b)),
    warnings,
    origin: resolveBundleOrigin(originSet),
  };
}

// Backward-compatible component APIs.
export async function getComponentList(): Promise<ComponentSummary[]> {
  return await getArtifactList('component');
}

export async function searchComponents(query: string): Promise<ComponentSummary[]> {
  return await searchArtifacts('component', query);
}

export async function getComponentSource(name: string): Promise<ComponentSource | null> {
  return await getArtifactSource('component', name);
}

export async function getComponentInstallBundle(componentNames: string[]): Promise<ComponentInstallBundle> {
  return await getArtifactInstallBundle('component', componentNames);
}

// Section APIs.
export async function getSectionList(): Promise<ArtifactSummary[]> {
  return await getArtifactList('section');
}

export async function searchSections(query: string): Promise<ArtifactSummary[]> {
  return await searchArtifacts('section', query);
}

export async function getSectionSource(name: string): Promise<ArtifactSource | null> {
  return await getArtifactSource('section', name);
}

export async function getSectionInstallBundle(sectionNames: string[]): Promise<ArtifactInstallBundle> {
  return await getArtifactInstallBundle('section', sectionNames);
}

// Page APIs.
export async function getPageList(): Promise<ArtifactSummary[]> {
  return await getArtifactList('page');
}

export async function searchPages(query: string): Promise<ArtifactSummary[]> {
  return await searchArtifacts('page', query);
}

export async function getPageSource(name: string): Promise<ArtifactSource | null> {
  return await getArtifactSource('page', name);
}

export async function getPageInstallBundle(pageNames: string[]): Promise<ArtifactInstallBundle> {
  return await getArtifactInstallBundle('page', pageNames);
}

async function resolveArtifactSeed(
  kind: ArtifactKind,
  name: string,
): Promise<{ name: string; srcRelativePath: string; origin: BundleOrigin; repoPath?: string } | null> {
  const local = await getLocalArtifactList(kind);
  const localMatch = local.find(artifact => artifact.name.toLowerCase() === name.toLowerCase());
  if (localMatch) {
    return {
      name: localMatch.name,
      srcRelativePath: normalizeSrcRelativePath(path.posix.join(ARTIFACT_DIR_NAME[kind], toPosixPath(localMatch.file))),
      origin: 'local',
    };
  }

  const remoteEntries = await getRemoteIndex(kind);
  const remoteMatch = remoteEntries.find(artifact => artifact.name.toLowerCase() === name.toLowerCase());
  if (!remoteMatch) {
    return null;
  }

  return {
    name: remoteMatch.name,
    srcRelativePath: repoPathToSrcRelativePath(remoteMatch.repoPath),
    origin: 'remote',
    repoPath: remoteMatch.repoPath,
  };
}

async function getLocalArtifactList(kind: ArtifactKind): Promise<ArtifactSummary[]> {
  const cwd = DESIGN_SYSTEM_ARTIFACT_DIR[kind];

  try {
    const files = await fg(['**/*.tsx'], { cwd });
    const list = await Promise.all(
      files.map(async file => {
        const normalizedFile = toPosixPath(file);
        const name = path.basename(normalizedFile, '.tsx');
        const doc = await extractJsDoc(path.join(cwd, ...normalizedFile.split('/')));
        return {
          kind,
          name,
          file: normalizedFile,
          doc,
          origin: 'local' as const,
        };
      }),
    );

    return list.sort((a, b) => a.file.localeCompare(b.file));
  } catch {
    return [];
  }
}

async function getRemoteArtifactList(kind: ArtifactKind): Promise<ArtifactSummary[]> {
  const entries = await getRemoteIndex(kind);

  return entries
    .map(entry => {
      const cached = getCachedRemoteSource(entry.repoPath);
      return {
        kind,
        name: entry.name,
        file: entry.file,
        doc: cached?.doc ?? '',
        origin: 'remote' as const,
      };
    })
    .sort((a, b) => a.file.localeCompare(b.file));
}

async function getRemoteIndex(kind: ArtifactKind): Promise<RemoteIndexEntry[]> {
  const cached = remoteIndexCache.get(kind);
  if (cached && Date.now() - cached.loadedAt < REMOTE_INDEX_CACHE_TTL_MS) {
    return cached.entries;
  }

  try {
    const entries = LEGACY_COMPONENTS_API_URL && kind === 'component'
      ? await fetchLegacyRemoteComponentIndex()
      : await fetchRemoteIndexFromTree(kind);

    remoteIndexCache.set(kind, {
      loadedAt: Date.now(),
      entries,
    });

    return entries;
  } catch {
    if (cached) {
      return cached.entries;
    }

    return [];
  }
}

async function fetchLegacyRemoteComponentIndex(): Promise<RemoteIndexEntry[]> {
  const payload = await withTimeout(signal =>
    fetch(LEGACY_COMPONENTS_API_URL as string, {
      signal,
      headers: githubApiHeaders(),
    }).then(async response => {
      if (!response.ok) {
        throw new Error(`GitHub index fetch failed (${response.status})`);
      }

      return (await response.json()) as unknown;
    }),
  );

  if (!Array.isArray(payload)) {
    return [];
  }

  return parseContentsEntries('component', payload);
}

async function fetchRemoteIndexFromTree(kind: ArtifactKind): Promise<RemoteIndexEntry[]> {
  const tree = await getRemoteTreeEntries();
  return parseTreeEntries(kind, tree);
}

async function getRemoteTreeEntries(): Promise<GitTreeEntry[]> {
  if (remoteTreeCache && Date.now() - remoteTreeCache.loadedAt < REMOTE_TREE_CACHE_TTL_MS) {
    return remoteTreeCache.entries;
  }

  const payload = await withTimeout(signal =>
    fetch(buildTreeApiUrl(), {
      signal,
      headers: githubApiHeaders(),
    }).then(async response => {
      if (!response.ok) {
        throw new Error(`GitHub tree fetch failed (${response.status})`);
      }

      return (await response.json()) as unknown;
    }),
  );

  if (!isRecord(payload)) {
    return [];
  }

  const tree = (payload as GitTreeResponse).tree;
  if (!Array.isArray(tree)) {
    return [];
  }

  remoteTreeCache = {
    loadedAt: Date.now(),
    entries: tree,
  };

  return tree;
}

function parseContentsEntries(kind: ArtifactKind, entries: unknown[]): RemoteIndexEntry[] {
  const artifactRoot = getRemoteRootForKind(kind);

  return entries
    .filter(isRecord)
    .map(entry => entry as GithubContentsEntry)
    .filter(entry => entry.type === 'file' && isNonEmptyString(entry.name) && entry.name.endsWith('.tsx'))
    .map(entry => {
      const repoPath = normalizeRepoPath(entry.path ?? `${artifactRoot}/${entry.name}`);
      return {
        kind,
        name: path.basename(entry.name ?? '', '.tsx'),
        file: toPosixPath(entry.name ?? ''),
        repoPath,
        downloadUrl: entry.download_url ?? buildRawUrl(repoPath),
      };
    });
}

function parseTreeEntries(kind: ArtifactKind, entries: GitTreeEntry[]): RemoteIndexEntry[] {
  const rootPrefix = `${normalizeRepoPath(getRemoteRootForKind(kind))}/`;

  return entries
    .filter(entry => entry.type === 'blob' && isNonEmptyString(entry.path))
    .map(entry => normalizeRepoPath(entry.path as string))
    .filter(repoPath => repoPath.startsWith(rootPrefix) && repoPath.endsWith('.tsx'))
    .map(repoPath => {
      const file = repoPath.slice(rootPrefix.length);
      return {
        kind,
        name: path.basename(file, '.tsx'),
        file,
        repoPath,
        downloadUrl: buildRawUrl(repoPath),
      };
    });
}

async function hydrateRemoteDocs(kind: ArtifactKind): Promise<void> {
  const entries = await getRemoteIndex(kind);
  const pending = entries.filter(entry => !getCachedRemoteSource(entry.repoPath));
  if (pending.length === 0) {
    return;
  }

  await Promise.all(
    pending.map(async entry => {
      const source = await getRemoteSourceByRepoPath(entry.repoPath);
      if (!source) {
        return;
      }

      remoteSourceCache.set(entry.repoPath, {
        loadedAt: Date.now(),
        source,
        doc: extractJsDocFromContent(source),
      });
    }),
  );
}

async function loadSource(workItem: BundleWorkItem): Promise<LoadedSource | null> {
  const srcRelativePath = normalizeSrcRelativePath(workItem.srcRelativePath);

  if (workItem.origin === 'local') {
    try {
      const source = await fs.readFile(localAbsolutePath(srcRelativePath), 'utf8');
      return {
        source,
        origin: 'local',
      };
    } catch {
      return null;
    }
  }

  const repoPath = workItem.repoPath ?? srcRelativePathToRepoPath(srcRelativePath);
  const source = await getRemoteSourceByRepoPath(repoPath);
  if (!source) {
    return null;
  }

  return {
    source,
    origin: 'remote',
    repoPath,
  };
}

async function resolveRelativeImport({
  fromPath,
  importPath,
  origin,
}: {
  fromPath: string;
  importPath: string;
  origin: BundleOrigin;
}): Promise<BundleWorkItem | null> {
  const basePath = normalizeSrcRelativePath(path.posix.join(path.posix.dirname(fromPath), importPath));
  const candidates = buildCandidatePaths(basePath);

  if (origin === 'local') {
    for (const candidate of candidates) {
      if (await localSourceExists(candidate)) {
        return {
          srcRelativePath: candidate,
          origin: 'local',
        };
      }
    }

    return null;
  }

  for (const candidate of candidates) {
    const repoPath = srcRelativePathToRepoPath(candidate);
    const source = await getRemoteSourceByRepoPath(repoPath);
    if (source) {
      return {
        srcRelativePath: candidate,
        origin: 'remote',
        repoPath,
      };
    }
  }

  return null;
}

function buildCandidatePaths(basePath: string): string[] {
  const normalizedBase = normalizeSrcRelativePath(basePath);
  const ext = path.posix.extname(normalizedBase);

  if (ext) {
    return [normalizedBase];
  }

  const directCandidates = SOURCE_EXTENSIONS.map(extension => `${normalizedBase}${extension}`);
  const indexCandidates = SOURCE_EXTENSIONS.map(extension => path.posix.join(normalizedBase, `index${extension}`));
  return [...directCandidates, ...indexCandidates];
}

function parseImports(source: string): { relativeImports: string[]; externalImports: string[] } {
  const relativeImports = new Set<string>();
  const externalImports = new Set<string>();
  const importPattern =
    /(?:import|export)\s+(?:[^'"`]*?\s+from\s+)?['"]([^'"`]+)['"]|import\(\s*['"]([^'"`]+)['"]\s*\)/g;

  let match = importPattern.exec(source);
  while (match) {
    const specifier = match[1] ?? match[2];
    if (specifier) {
      if (specifier.startsWith('.')) {
        relativeImports.add(specifier);
      } else {
        externalImports.add(specifier);
      }
    }

    match = importPattern.exec(source);
  }

  return {
    relativeImports: Array.from(relativeImports),
    externalImports: Array.from(externalImports),
  };
}

async function localSourceExists(srcRelativePath: string): Promise<boolean> {
  if (!isPathInsideSrc(srcRelativePath)) {
    return false;
  }

  try {
    await fs.access(localAbsolutePath(srcRelativePath));
    return true;
  } catch {
    return false;
  }
}

function localAbsolutePath(srcRelativePath: string): string {
  return path.join(DESIGN_SYSTEM_SRC_DIR, ...normalizeSrcRelativePath(srcRelativePath).split('/'));
}

function srcRelativePathToRepoPath(srcRelativePath: string): string {
  return normalizeRepoPath(path.posix.join(GITHUB_SRC_ROOT, normalizeSrcRelativePath(srcRelativePath)));
}

function repoPathToSrcRelativePath(repoPath: string): string {
  const normalizedRepoPath = normalizeRepoPath(repoPath);
  const srcPrefix = `${normalizeRepoPath(GITHUB_SRC_ROOT)}/`;

  if (normalizedRepoPath.startsWith(srcPrefix)) {
    return normalizeSrcRelativePath(normalizedRepoPath.slice(srcPrefix.length));
  }

  return normalizeSrcRelativePath(normalizedRepoPath);
}

async function getRemoteSourceByRepoPath(repoPath: string): Promise<string | null> {
  const normalizedRepoPath = normalizeRepoPath(repoPath);
  const cached = getCachedRemoteSource(normalizedRepoPath);
  if (cached) {
    return cached.source;
  }

  const source = await fetchRemoteSource(buildRawUrl(normalizedRepoPath));
  if (!source) {
    return null;
  }

  remoteSourceCache.set(normalizedRepoPath, {
    loadedAt: Date.now(),
    source,
    doc: extractJsDocFromContent(source),
  });

  return source;
}

function getCachedRemoteSource(repoPath: string): CachedRemoteSource | null {
  const cached = remoteSourceCache.get(repoPath);
  if (!cached) {
    return null;
  }

  if (Date.now() - cached.loadedAt > REMOTE_SOURCE_CACHE_TTL_MS) {
    remoteSourceCache.delete(repoPath);
    return null;
  }

  return cached;
}

async function fetchRemoteSource(url: string): Promise<string | null> {
  try {
    return await withTimeout(signal =>
      fetch(url, {
        signal,
        headers: githubApiHeaders(),
      }).then(async response => {
        if (!response.ok) {
          throw new Error(`Source fetch failed (${response.status})`);
        }

        return await response.text();
      }),
    );
  } catch {
    return null;
  }
}

function extractJsDocFromContent(content: string): string {
  const match = content.match(/\/\*\*([\s\S]*?)\*\//);
  if (!match) {
    return '';
  }

  return match[1].replace(/\s*\* ?/g, ' ').trim();
}

async function extractJsDoc(filePath: string): Promise<string> {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    return extractJsDocFromContent(content);
  } catch {
    return '';
  }
}

function resolveBundleOrigin(originSet: Set<BundleOrigin>): 'local' | 'remote' | 'mixed' {
  const hasLocal = originSet.has('local');
  const hasRemote = originSet.has('remote');

  if (hasLocal && hasRemote) {
    return 'mixed';
  }

  if (hasRemote) {
    return 'remote';
  }

  return 'local';
}

function normalizeRepoPath(value: string): string {
  return normalizePathSlashes(path.posix.normalize(value));
}

function normalizeSrcRelativePath(value: string): string {
  const normalized = normalizePathSlashes(path.posix.normalize(value));
  if (normalized.startsWith('./')) {
    return normalized.slice(2);
  }

  return normalized;
}

function normalizePathSlashes(value: string): string {
  return value.replace(/\\/g, '/');
}

function toPosixPath(value: string): string {
  return value.replace(/\\/g, '/');
}

function isPathInsideSrc(value: string): boolean {
  if (!value || value === '.' || value === '..') {
    return false;
  }

  if (value.startsWith('../') || value.startsWith('/')) {
    return false;
  }

  return true;
}

function dedupeCaseSensitive(values: string[]): string[] {
  return Array.from(new Set(values));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}
