import * as React from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, isToolUIPart, getToolName, type ChatTransport, type UIMessage } from 'ai';
import { Button, Input } from '@nikolayvalev/design-system';
import { WidgetPreviewCard, type WidgetProposal } from './WidgetPreviewCard';
import { usePinnedStore } from '../state/use-pinned-store';
import type { ComponentRegistry } from '../registry/component-registry';
import type { ProposeWidgetInput } from '../generation/propose-widget';

export interface ChatPaneProps {
  /** Pass a STABLE registry reference (see WidgetRenderer docs). */
  registry: ComponentRegistry;
  apiEndpoint?: string;
  /** Injectable transport (tests / custom hosting). Defaults to DefaultChatTransport({ api }). */
  transport?: ChatTransport<UIMessage>;
  className?: string;
}

export function ChatPane({
  registry,
  apiEndpoint = '/api/command-panel',
  transport,
  className,
}: ChatPaneProps): JSX.Element {
  const chatTransport = React.useMemo(
    () => transport ?? new DefaultChatTransport({ api: apiEndpoint }),
    [transport, apiEndpoint],
  );
  const { messages, sendMessage, status, error } = useChat({ transport: chatTransport });
  const { widgets, pin } = usePinnedStore();
  const pinnedIds = React.useMemo(() => new Set(widgets.map((w) => w.id)), [widgets]);
  const [input, setInput] = React.useState('');
  const busy = status === 'submitted' || status === 'streaming';

  const onSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    sendMessage({ text });
    setInput('');
  };

  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {messages.map((message) => (
          <div key={message.id} data-role={message.role}>
            {message.parts.map((part, i) => {
              if (part.type === 'text') {
                return (
                  <p key={`${message.id}-text-${i}`} style={{ margin: 0 }}>
                    {part.text}
                  </p>
                );
              }
              if (
                isToolUIPart(part) &&
                getToolName(part) === 'propose_widget' &&
                (part.state === 'input-available' || part.state === 'output-available')
              ) {
                const proposal = toProposal(part.toolCallId, part.input as ProposeWidgetInput);
                return (
                  <WidgetPreviewCard
                    key={part.toolCallId}
                    proposal={proposal}
                    registry={registry}
                    onPin={pin}
                    isPinned={pinnedIds.has(proposal.id)}
                  />
                );
              }
              return null;
            })}
          </div>
        ))}
        {error ? (
          <p role="alert" style={{ color: 'var(--destructive)', margin: 0 }}>
            {error.message}
          </p>
        ) : null}
      </div>
      <form onSubmit={onSubmit} style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
        <Input
          aria-label="Message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask for a chart or a stat…"
          disabled={busy}
          style={{ flex: 1 }}
        />
        <Button type="submit" disabled={busy || input.trim() === ''}>
          Send
        </Button>
      </form>
    </div>
  );
}

function toProposal(id: string, input: ProposeWidgetInput): WidgetProposal {
  return {
    id,
    title: input.title,
    description: input.description,
    jsx: input.jsx,
    dataSources: input.dataSources,
  };
}
