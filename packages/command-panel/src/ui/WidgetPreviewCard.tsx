import * as React from 'react';
import { Button, Card, CardHeader, CardTitle, CardContent } from '@nikolayvalev/design-system';
import { WidgetRenderer } from '../sandbox/WidgetRenderer';
import type { ComponentRegistry } from '../registry/component-registry';

export interface WidgetProposal {
  id: string;
  title: string;
  description: string;
  jsx: string;
  dataSources: string[];
}

export interface WidgetPreviewCardProps {
  proposal: WidgetProposal;
  /** Pass a STABLE registry reference (see WidgetRenderer docs). */
  registry: ComponentRegistry;
  onPin?: (proposal: WidgetProposal) => void;
  isPinned?: boolean;
  className?: string;
}

export function WidgetPreviewCard({
  proposal,
  registry,
  onPin,
  isPinned,
  className,
}: WidgetPreviewCardProps): JSX.Element {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{proposal.title}</CardTitle>
        {proposal.description ? (
          <p style={{ margin: 0, color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>
            {proposal.description}
          </p>
        ) : null}
      </CardHeader>
      <CardContent>
        <WidgetRenderer source={proposal.jsx} registry={registry} />
        {onPin ? (
          <div style={{ marginTop: '0.75rem' }}>
            <Button
              type="button"
              variant={isPinned ? 'outline' : 'default'}
              size="sm"
              disabled={isPinned}
              onClick={() => onPin(proposal)}
            >
              {isPinned ? 'Pinned' : 'Pin to dashboard'}
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
