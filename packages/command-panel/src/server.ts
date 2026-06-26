// Server-only entry: the LLM generation layer (imports the AI SDK). Keep this
// out of client bundles — import from "@nikolayvalev/command-panel/server".
export { buildSystemPrompt, type SystemPromptOptions } from './generation/system-prompt';
export {
  proposeWidgetSchema,
  proposeWidgetTool,
  type ProposeWidgetInput,
} from './generation/propose-widget';
export {
  runGeneration,
  createCommandPanelHandler,
  DEFAULT_MODEL_ID,
  type RunGenerationParams,
  type CommandPanelHandlerConfig,
} from './generation/handler';
export { createDataRouteHandler } from './generation/data-route';
