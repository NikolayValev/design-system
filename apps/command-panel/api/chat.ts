import { createCommandPanelHandler } from '@nikolayvalev/command-panel/server';
import { defaultComponentRegistry } from '@nikolayvalev/command-panel';
import { createOpenAI } from '@ai-sdk/openai';
import type { LanguageModel } from 'ai';
import { dataRegistry } from '../src/data/registry';

/**
 * Provider selection (server-side only — API keys come from env, never the client):
 * - `OPENROUTER_API_KEY` set → route generation through OpenRouter (OpenAI-compatible),
 *   using `OPENROUTER_MODEL` (default `openai/gpt-4o`). `.chat()` forces the
 *   chat-completions API; OpenRouter does not implement OpenAI's Responses API.
 * - otherwise → fall back to the engine default (Anthropic, via `ANTHROPIC_API_KEY`).
 *
 * Resolved per request so the dev server picks up env without a restart and the
 * module never reads a secret at import time.
 */
function selectModel(): LanguageModel | undefined {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return undefined;
  const openrouter = createOpenAI({ baseURL: 'https://openrouter.ai/api/v1', apiKey });
  return openrouter.chat(process.env.OPENROUTER_MODEL ?? 'openai/gpt-4o');
}

export function POST(request: Request): Promise<Response> {
  const handler = createCommandPanelHandler({
    componentRegistry: defaultComponentRegistry,
    dataRegistry,
    model: selectModel(),
  });
  return handler(request);
}
