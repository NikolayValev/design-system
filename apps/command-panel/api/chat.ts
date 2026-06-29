import { createCommandPanelHandler } from '@nikolayvalev/command-panel/server';
import { defaultComponentRegistry } from '@nikolayvalev/command-panel';
import { dataRegistry } from '../src/data/registry';

// Uses ANTHROPIC_API_KEY from the runtime env (never exposed to the client).
export const chatHandler = createCommandPanelHandler({
  componentRegistry: defaultComponentRegistry,
  dataRegistry,
});

export function POST(request: Request): Promise<Response> {
  return chatHandler(request);
}
