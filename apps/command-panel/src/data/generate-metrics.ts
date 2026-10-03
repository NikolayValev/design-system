import fg from 'fast-glob';
import { readFileSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export interface Metrics {
  generatedAt: string;
  components: number;
  sections: number;
  pages: number;
  stories: number;
  bundle: { file: string; bytes: number }[];
}

const DS = 'packages/design-system';

async function countTsx(repoRoot: string, dir: string): Promise<number> {
  const files = await fg([`${dir}/**/*.tsx`], {
    cwd: repoRoot,
    ignore: ['**/*.stories.tsx', '**/*.test.tsx', '**/*.dom.test.tsx'],
  });
  return files.length;
}

export async function generateMetrics(repoRoot: string): Promise<Metrics> {
  const [components, sections, pages] = await Promise.all([
    countTsx(repoRoot, `${DS}/src/components`),
    countTsx(repoRoot, `${DS}/src/sections`),
    countTsx(repoRoot, `${DS}/src/pages`),
  ]);

  const storyFiles = await fg(['packages/**/*.stories.{ts,tsx}', 'apps/**/*.stories.{ts,tsx}'], {
    cwd: repoRoot,
    ignore: ['**/node_modules/**', '**/dist/**'],
  });

  const bundleFiles = await fg([`${DS}/dist/**/*.js`], { cwd: repoRoot, ignore: ['**/cli/**'] });
  const bundle = bundleFiles
    .map((file) => ({ file: path.basename(file), bytes: statSync(path.join(repoRoot, file)).size }))
    .sort((a, b) => b.bytes - a.bytes);

  return {
    generatedAt: new Date().toISOString(),
    components,
    sections,
    pages,
    stories: storyFiles.length,
    bundle,
  };
}

export function sameMetrics(a: Metrics, b: Metrics): boolean {
  const { generatedAt: _a, ...restA } = a;
  const { generatedAt: _b, ...restB } = b;
  return JSON.stringify(restA) === JSON.stringify(restB);
}

function readPrevious(file: string): Metrics | null {
  try {
    return JSON.parse(readFileSync(file, 'utf8')) as Metrics;
  } catch {
    return null;
  }
}

async function main(): Promise<void> {
  const here = path.dirname(fileURLToPath(import.meta.url));
  const repoRoot = path.resolve(here, '../../../..');
  const metrics = await generateMetrics(repoRoot);
  const out = path.join(here, 'metrics.generated.json');
  // The file is committed and regenerated on every test/build run. Keep the old
  // timestamp when nothing else moved, so a run doesn't leave the tree dirty.
  const previous = readPrevious(out);
  if (previous && sameMetrics(previous, metrics)) {
    metrics.generatedAt = previous.generatedAt;
  }
  writeFileSync(out, `${JSON.stringify(metrics, null, 2)}\n`, 'utf8');
  console.log(`metrics written: ${out}`);
}

// Run as a script (tsx src/data/generate-metrics.ts), not when imported.
const invokedDirectly = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (invokedDirectly) {
  void main();
}
