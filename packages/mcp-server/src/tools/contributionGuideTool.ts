import path from 'path';
import fs from 'fs/promises';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const GUIDE_PATH = path.resolve(__dirname, '../../../../packages/design-system/CONTRIBUTION_GUIDE.md');

export function getContributionGuide() {
  return {
    title: 'Contribution Guide',
    url: '/mcp/tools/contribution-guide',
    markdownPath: GUIDE_PATH,
  };
}
