import fg from 'fast-glob';
import path from 'path';
import fs from 'fs/promises';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DESIGN_SYSTEM_ROOT = path.resolve(__dirname, '../../../../packages/design-system/src/components');

export async function getComponentList() {
  const files = await fg(['*.tsx'], { cwd: DESIGN_SYSTEM_ROOT });
  return Promise.all(files.map(async (file) => {
    const name = path.basename(file, '.tsx');
    const doc = await extractJsDoc(path.join(DESIGN_SYSTEM_ROOT, file));
    return { name, file, doc };
  }));
}

export async function searchComponents(query: string) {
  const all = await getComponentList();
  const q = query.toLowerCase();
  return all.filter(c => c.name.toLowerCase().includes(q) || (c.doc && c.doc.toLowerCase().includes(q)));
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
