import * as React from 'react';
import type { ChatTransport, UIMessage } from 'ai';
import { DataResolverProvider } from '../sandbox/use-metric';
import { createHttpDataResolver } from '../generation/http-resolver';
import type { DataResolver } from '../registry/data-registry';
import { PinnedStoreProvider } from '../state/use-pinned-store';
import type { PinnedStore } from '../state/pinned-store';
import { ChatPane } from './ChatPane';
import { DashboardGrid } from './DashboardGrid';
import type { ComponentRegistry } from '../registry/component-registry';

export interface CommandPanelProps {
  /** Pass a STABLE registry reference (e.g. module-scope defaultComponentRegistry). */
  registry: ComponentRegistry;
  /** Chat generation endpoint (POST). Defaults to '/api/command-panel'. */
  apiEndpoint?: string;
  /** Read-only data endpoint backing useMetric (POST). Defaults to '/api/command-panel/data'. */
  dataEndpoint?: string;
  /** Override the data resolver (tests / custom transport). Defaults to createHttpDataResolver(dataEndpoint). */
  dataResolver?: DataResolver;
  /** Override the pinned store (tests / shared instance). Defaults to a localStorage-backed store. */
  store?: PinnedStore;
  /** Override the chat transport (tests). Forwarded to ChatPane. */
  transport?: ChatTransport<UIMessage>;
  className?: string;
}

export function CommandPanel({
  registry,
  apiEndpoint = '/api/command-panel',
  dataEndpoint = '/api/command-panel/data',
  dataResolver,
  store,
  transport,
  className,
}: CommandPanelProps): JSX.Element {
  const resolver = React.useMemo(
    () => dataResolver ?? createHttpDataResolver(dataEndpoint),
    [dataResolver, dataEndpoint],
  );

  return (
    <DataResolverProvider resolver={resolver}>
      <PinnedStoreProvider store={store}>
        <div
          className={className}
          style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '1rem', height: '100%', minHeight: 0 }}
        >
          <ChatPane registry={registry} apiEndpoint={apiEndpoint} transport={transport} />
          <DashboardGrid registry={registry} />
        </div>
      </PinnedStoreProvider>
    </DataResolverProvider>
  );
}
