import { createCommandPanelHandler } from '@nikolayvalev/command-panel/server';
import { defaultComponentRegistry } from '@nikolayvalev/command-panel';
import { createOpenAI } from '@ai-sdk/openai';
import { createGateway } from 'ai';
import type { LanguageModel } from 'ai';
import { dataRegistry } from '../src/data/registry';

/**
 * Provider selection (server-side only — API keys come from env, never the client),
 * in priority order:
 * - `GITHUB_MODELS_TOKEN` set → GitHub Models (free, OpenAI-compatible at
 *   https://models.github.ai/inference), using `GITHUB_MODELS_MODEL`
 *   (default `openai/gpt-4o`). `.chat()` forces chat-completions (no Responses API).
 * - `AI_GATEWAY_API_KEY` set → Vercel AI Gateway, using `AI_GATEWAY_MODEL`
 *   (default `openai/gpt-4o`). Needs a card on file to serve requests.
 * - `OPENROUTER_API_KEY` set → OpenRouter (OpenAI-compatible), using
 *   `OPENROUTER_MODEL` (default `openai/gpt-4o`). `.chat()` forces chat-completions.
 * - otherwise → fall back to the engine default (Anthropic, via `ANTHROPIC_API_KEY`).
 *
 * Resolved per request so the dev server picks up env without a restart and the
 * module never reads a secret at import time.
 */
function selectModel(): LanguageModel | undefined {
  const githubToken = process.env.GITHUB_MODELS_TOKEN;
  if (githubToken) {
    const github = createOpenAI({ baseURL: 'https://models.github.ai/inference', apiKey: githubToken });
    return github.chat(process.env.GITHUB_MODELS_MODEL ?? 'openai/gpt-4o');
  }
  const gatewayKey = process.env.AI_GATEWAY_API_KEY;
  if (gatewayKey) {
    const vercel = createGateway({ apiKey: gatewayKey });
    return vercel(process.env.AI_GATEWAY_MODEL ?? 'openai/gpt-4o');
  }
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (apiKey) {
    const openrouter = createOpenAI({ baseURL: 'https://openrouter.ai/api/v1', apiKey });
    return openrouter.chat(process.env.OPENROUTER_MODEL ?? 'openai/gpt-4o');
  }
  return undefined;
}

export function POST(request: Request): Promise<Response> {
  const handler = createCommandPanelHandler({
    componentRegistry: defaultComponentRegistry,
    dataRegistry,
    model: selectModel(),
  });
  return handler(request);
}
