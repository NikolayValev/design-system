import * as React from 'react';
import type { DataResolver } from '../registry/data-registry';

export interface MetricState<T = unknown> {
  data: T | undefined;
  loading: boolean;
  error: string | undefined;
}

const DataResolverContext = React.createContext<DataResolver | null>(null);

export function DataResolverProvider({
  resolver,
  children,
}: {
  resolver: DataResolver;
  children: React.ReactNode;
}): JSX.Element {
  return React.createElement(DataResolverContext.Provider, { value: resolver }, children);
}

/**
 * The only data channel available to generated widgets. Resolves `id` through the
 * context resolver (which is backed by a read-only DataRegistry). Re-runs when
 * `id` or the JSON-serialized `params` change; guards against stale updates.
 */
export function useMetric<T = unknown>(id: string, params?: Record<string, unknown>): MetricState<T> {
  const resolver = React.useContext(DataResolverContext);
  const paramsKey = params ? JSON.stringify(params) : '';
  const [state, setState] = React.useState<MetricState<T>>({
    data: undefined,
    loading: true,
    error: undefined,
  });

  React.useEffect(() => {
    let cancelled = false;
    setState({ data: undefined, loading: true, error: undefined });

    if (!resolver) {
      setState({ data: undefined, loading: false, error: 'No data resolver provided.' });
      return;
    }

    resolver(id, params)
      .then((value) => {
        if (!cancelled) setState({ data: value as T, loading: false, error: undefined });
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setState({ data: undefined, loading: false, error: e instanceof Error ? e.message : String(e) });
        }
      });

    return () => {
      cancelled = true;
    };
    // paramsKey captures params by value; resolver/id are the other inputs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolver, id, paramsKey]);

  return state;
}
