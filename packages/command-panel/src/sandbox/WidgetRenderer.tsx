import * as React from 'react';
import { validateWidgetSource } from './validate';
import { transpileWidgetBody } from './transpile';
import { buildWidgetComponent } from './evaluate';
import { useMetric } from './use-metric';
import { WidgetErrorBoundary } from './ErrorBoundary';
import {
  type ComponentRegistry,
  registryComponentNames,
  registryScope,
} from '../registry/component-registry';

export interface WidgetRendererProps {
  source: string;
  /**
   * Pass a STABLE registry reference (module scope, or memoized via `useMemo`).
   * The widget is rebuilt (validate → transpile → `new Function`) whenever this
   * object identity changes, so a fresh registry created inline on every parent
   * render forces a rebuild each render.
   */
  registry: ComponentRegistry;
  className?: string;
}

function ErrorCard({ message, className }: { message: string; className?: string }): JSX.Element {
  return (
    <div
      role="alert"
      className={className}
      style={{
        padding: '0.75rem 1rem',
        borderRadius: 'var(--radius, 0.5rem)',
        border: '1px solid var(--destructive, #dc2626)',
        color: 'var(--destructive, #dc2626)',
        background: 'var(--card, transparent)',
        font: 'inherit',
        fontSize: '0.875rem',
      }}
    >
      Widget error: {message}
    </div>
  );
}

export function WidgetRenderer({ source, registry, className }: WidgetRendererProps): JSX.Element {
  const built = React.useMemo(() => {
    const validation = validateWidgetSource(source, new Set(registryComponentNames(registry)));
    if (!validation.ok) {
      return { component: null as React.ComponentType<any> | null, error: validation.errors.join(' ') };
    }
    try {
      const code = transpileWidgetBody(source);
      const scope = {
        useMetric,
        useState: React.useState,
        useMemo: React.useMemo,
        useRef: React.useRef,
        ...registryScope(registry),
      };
      return { component: buildWidgetComponent(code, scope), error: null as string | null };
    } catch (e) {
      return { component: null, error: e instanceof Error ? e.message : String(e) };
    }
  }, [source, registry]);

  if (built.error || !built.component) {
    return <ErrorCard message={built.error ?? 'Failed to build widget.'} className={className} />;
  }

  const Widget = built.component;
  return (
    <WidgetErrorBoundary resetKey={source} fallback={(m) => <ErrorCard message={m} className={className} />}>
      <div className={className}>
        <Widget />
      </div>
    </WidgetErrorBoundary>
  );
}
