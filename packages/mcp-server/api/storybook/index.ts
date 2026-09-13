import type { IncomingMessage, ServerResponse } from 'node:http';
import { redirectToStorybook } from '../_lib/storybook.js';

export default function handler(req: IncomingMessage, res: ServerResponse) {
  redirectToStorybook(req, res);
}
