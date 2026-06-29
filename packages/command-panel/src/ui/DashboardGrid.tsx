import * as React from 'react';
import { Button, Card, CardHeader, CardTitle, CardContent } from '@nikolayvalev/design-system';
import { WidgetRenderer } from '../sandbox/WidgetRenderer';
import { usePinnedStore } from '../state/use-pinned-store';
import type { ComponentRegistry } from '../registry/component-registry';

export interface DashboardGridProps {
  /** Pass a STABLE registry reference (see WidgetRenderer docs). */
  registry: ComponentRegistry;
  className?: string;
}

export function DashboardGrid({ registry, className }: DashboardGridProps): JSX.Element {
  const { widgets, unpin, reorder } = usePinnedStore();

  if (widgets.length === 0) {
    return (
      <div className={className} style={{ color: 'var(--muted-foreground)', padding: '2rem', textAlign: 'center' }}>
        No pinned widgets yet. Pin a proposal from the chat to add it here.
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}
    >
      {widgets.map((widget, i) => (
        <Card key={widget.id} data-widget-id={widget.id}>
          <CardHeader>
            <CardTitle>{widget.title}</CardTitle>
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-label="Move up"
                disabled={i === 0}
                onClick={() => reorder(i, i - 1)}
              >
                ↑
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-label="Move down"
                disabled={i === widgets.length - 1}
                onClick={() => reorder(i, i + 1)}
              >
                ↓
              </Button>
              <Button type="button" variant="ghost" size="sm" aria-label="Remove" onClick={() => unpin(widget.id)}>
                ✕
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <WidgetRenderer source={widget.jsx} registry={registry} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
