import {
  streamText,
  convertToModelMessages,
  type ModelMessage,
  type UIMessage,
  type LanguageModel,
} from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import type { ComponentRegistry } from '../registry/component-registry';
import type { DataRegistry } from '../registry/data-registry';
import { buildSystemPrompt } from './system-prompt';
import { proposeWidgetTool } from './propose-widget';

/** Default Claude model for generation. Resolved via @ai-sdk/anthropic (ANTHROPIC_API_KEY). */
export const DEFAULT_MODEL_ID = 'claude-opus-4-8';

export interface RunGenerationParams {
  componentRegistry: ComponentRegistry;
  dataRegistry: DataRegistry;
  messages: ModelMessage[];
  /** Override the model (e.g. a mock in tests). Defaults to anthropic(DEFAULT_MODEL_ID). */
  model?: LanguageModel;
  /** Override the system prompt. Defaults to buildSystemPrompt(...). */
  system?: string;
}

/** Testable core: builds the system prompt and runs the model with the propose_widget tool. */
export function runGeneration(params: RunGenerationParams) {
  const { componentRegistry, dataRegistry, messages, model, system } = params;
  return streamText({
    model: model ?? anthropic(DEFAULT_MODEL_ID),
    system: system ?? buildSystemPrompt(componentRegistry, dataRegistry),
    messages,
    tools: { propose_widget: proposeWidgetTool },
  });
}

export interface CommandPanelHandlerConfig {
  componentRegistry: ComponentRegistry;
  dataRegistry: DataRegistry;
  model?: LanguageModel;
  system?: string;
}

/**
 * Web-standard route handler (drop into a Next.js `route.ts` as `POST`).
 * Accepts `{ messages: UIMessage[] }` and returns a streaming UI-message response.
 */
export function createCommandPanelHandler(config: CommandPanelHandlerConfig) {
  return async (req: Request): Promise<Response> => {
    const { messages } = (await req.json()) as { messages: UIMessage[] };
    const result = runGeneration({
      componentRegistry: config.componentRegistry,
      dataRegistry: config.dataRegistry,
      model: config.model,
      system: config.system,
      messages: await convertToModelMessages(messages),
    });
    return result.toUIMessageStreamResponse();
  };
}
