import type { ComponentRegistry } from '../registry/component-registry';
import type { DataRegistry } from '../registry/data-registry';

export interface SystemPromptOptions {
  /** Extra guidance appended after the standard rules. */
  appendix?: string;
}

const HOST_ELEMENTS_DOC =
  'div, span, p, ul, ol, li, section, header, footer, h1-h6, small, strong, em, b, i, br, hr';

/** Build the model's system prompt from the live component + data registries. */
export function buildSystemPrompt(
  components: ComponentRegistry,
  data: DataRegistry,
  options: SystemPromptOptions = {},
): string {
  const componentLines = components.entries
    .map(
      (e) =>
        `- <${e.name}> — ${e.description}` +
        (e.propsSchema ? ` Props: ${JSON.stringify(e.propsSchema)}` : ''),
    )
    .join('\n');

  const dataLines = data.sources.length
    ? data.sources.map((s) => `- "${s.id}" — ${s.description}`).join('\n')
    : '- (none)';

  return [
    'You are a generative-UI assistant for a "command panel". When a request is best answered visually, call the `propose_widget` tool to propose one or more widgets. You may also reply with plain text.',
    '',
    "A widget's `jsx` is the BODY of a function component (no imports). It may call the hooks `useState`, `useMemo`, `useRef`, and `useMetric(id, params?)`, and MUST `return` a single element.",
    '',
    'You may ONLY use these components (PascalCase):',
    componentLines,
    '',
    `You may also use these plain HTML elements for layout/text: ${HOST_ELEMENTS_DOC}. On HTML elements only the \`className\` attribute is allowed — no inline styles, no event handlers.`,
    '',
    'Data comes ONLY from `useMetric(id)`, which returns `{ data, loading, error }`. You may ONLY reference these data source ids — never invent data or ids:',
    dataLines,
    '',
    'Rules:',
    "- List every data source id a widget uses in the tool's `dataSources` field.",
    '- Do NOT use imports, `fetch`, `window`, `document`, `eval`, or any other browser/global API. Only the components, host elements, hooks, and `useMetric` above are available.',
    '- Keep each widget focused on answering one question.',
    ...(options.appendix ? ['', options.appendix] : []),
  ].join('\n');
}
