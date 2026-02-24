import fg from 'fast-glob';
import path from 'path';
import fs from 'fs/promises';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEFAULT_COMPONENTS_DIR = path.resolve(__dirname, '../../../../packages/design-system/src/components');
const DESIGN_SYSTEM_COMPONENTS_DIR = process.env.DESIGN_SYSTEM_COMPONENTS_DIR ?? DEFAULT_COMPONENTS_DIR;

export type ComponentSummary = {
  name: string;
  file: string;
  doc: string;
};

export type ComponentSource = ComponentSummary & {
  source: string;
};

export async function getComponentList() {
  const files = await fg(['**/*.tsx'], { cwd: DESIGN_SYSTEM_COMPONENTS_DIR });
  return Promise.all(
    files.map(async file => {
      const name = path.basename(file, '.tsx');
      const doc = await extractJsDoc(path.join(DESIGN_SYSTEM_COMPONENTS_DIR, file));
      return { name, file, doc };
    }),
  );
}

export async function searchComponents(query: string) {
  const all = await getComponentList();
  const q = query.toLowerCase();
  return all.filter(c => c.name.toLowerCase().includes(q) || (c.doc && c.doc.toLowerCase().includes(q)));
}

export async function getComponentSource(name: string): Promise<ComponentSource | null> {
  const all = await getComponentList();
  const match = all.find(component => component.name.toLowerCase() === name.toLowerCase());
  if (!match) {
    return null;
  }

  const sourcePath = path.join(DESIGN_SYSTEM_COMPONENTS_DIR, match.file);
  const source = await fs.readFile(sourcePath, 'utf8');
  return { ...match, source };
}

async function extractJsDoc(filePath: string): Promise<string> {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const match = content.match(/\/\*\*([\s\S]*?)\*\//);
    if (match) {
      return match[1].replace(/\s*\* ?/g, ' ').trim();
    }
  } catch {}
  return '';
}
