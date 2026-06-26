import { tool } from 'ai';
import type { Tool, Context } from '@ai-sdk/provider-utils';
import { z } from 'zod';

export const proposeWidgetSchema = z.object({
  title: z.string().describe('Short human-readable title for the widget.'),
  description: z.string().describe('One sentence on what the widget shows.'),
  jsx: z
    .string()
    .describe(
      'Function-component body (no imports) that returns a single element built only from the allowed components, host elements, and useMetric.',
    ),
  dataSources: z.array(z.string()).describe('The data source ids this widget reads via useMetric.'),
});

export type ProposeWidgetInput = z.infer<typeof proposeWidgetSchema>;

/**
 * The tool the model calls to propose a widget. It has NO `execute`: the tool
 * call is surfaced to the client, which renders/pins the widget. The model
 * proposes; it does not run anything.
 */
export const proposeWidgetTool: Tool<ProposeWidgetInput, never, Context> = tool({
  description: 'Propose a UI widget (chart, stat card, etc.) to render in the command panel.',
  inputSchema: proposeWidgetSchema,
});
