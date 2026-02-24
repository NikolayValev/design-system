import path from 'path';
import fs from 'fs/promises';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEFAULT_CONTRIBUTION_GUIDE_PATH = path.resolve(
  __dirname,
  '../../../../packages/design-system/CONTRIBUTION_GUIDE.md',
);
const CONTRIBUTION_GUIDE_PATH =
  process.env.DESIGN_SYSTEM_CONTRIBUTION_GUIDE_PATH ?? DEFAULT_CONTRIBUTION_GUIDE_PATH;

export function getContributionGuide() {
  return {
    title: 'Contribution Guide',
    markdownPath: CONTRIBUTION_GUIDE_PATH,
  };
}

export async function getContributionGuideMarkdown() {
  return fs.readFile(CONTRIBUTION_GUIDE_PATH, 'utf8');
}
