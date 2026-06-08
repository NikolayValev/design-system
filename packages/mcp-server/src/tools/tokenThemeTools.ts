import fg from 'fast-glob';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_DESIGN_SYSTEM_SRC_DIR = path.resolve(__dirname, '../../../../packages/design-system/src');
const DESIGN_SYSTEM_SRC_DIR = process.env.DESIGN_SYSTEM_SRC_DIR ?? DEFAULT_DESIGN_SYSTEM_SRC_DIR;
const THEMES_DIR = path.join(DESIGN_SYSTEM_SRC_DIR, 'vde-themes');

// ── Types ────────────────────────────────────────────────────────────────────

export type ThemeSummary = {
  id: string;
  name: string;
  archetype: string;
  description: string;
  file: string;
};

export type ThemeDetail = ThemeSummary & { source: string };

// ── Helpers ──────────────────────────────────────────────────────────────────

function extractThemeMeta(source: string): Record<string, string> {
  const meta: Record<string, string> = {};
  for (const field of ['id', 'name', 'archetype', 'description']) {
    const m = source.match(new RegExp(`${field}:\\s*['"\`]([^'"\`\n]+)['"\`]`));
    if (m) meta[field] = m[1];
  }
  return meta;
}

async function allThemeFiles(): Promise<string[]> {
  return fg('*.theme.ts', { cwd: THEMES_DIR, absolute: true });
}

// ── Theme tools ──────────────────────────────────────────────────────────────

export async function listThemes(): Promise<ThemeSummary[]> {
  const files = await allThemeFiles();
  const summaries: ThemeSummary[] = [];

  for (const file of files.sort()) {
    try {
      const source = await fs.readFile(file, 'utf-8');
      const meta = extractThemeMeta(source);
      if (meta.id && meta.name) {
        summaries.push({
          id: meta.id,
          name: meta.name,
          archetype: meta.archetype ?? '',
          description: meta.description ?? '',
          file: path.basename(file),
        });
      }
    } catch {
      // skip unreadable files
    }
  }

  return summaries;
}

export async function getTheme(id: string): Promise<ThemeDetail | null> {
  const files = await allThemeFiles();

  for (const file of files) {
    try {
      const source = await fs.readFile(file, 'utf-8');
      const meta = extractThemeMeta(source);
      const slug = path.basename(file, '.theme.ts');

      if (meta.id === id || slug === id) {
        return {
          id: meta.id ?? id,
          name: meta.name ?? id,
          archetype: meta.archetype ?? '',
          description: meta.description ?? '',
          file: path.basename(file),
          source,
        };
      }
    } catch {
      // skip
    }
  }

  return null;
}
