// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { WidgetRenderer } from './WidgetRenderer';
import { DataResolverProvider } from './use-metric';
import { createComponentRegistry, type ComponentEntry } from '../registry/component-registry';

const Box = ({ children }: { children?: React.ReactNode }) => <section>{children}</section>;
const registry = createComponentRegistry([
  { name: 'Box', component: Box, description: 'box' } as ComponentEntry,
]);

describe('WidgetRenderer', () => {
  it('renders a valid widget using a registered component', () => {
    render(<WidgetRenderer source="return <Box>ok</Box>;" registry={registry} />);
    expect(screen.getByText('ok')).toBeDefined();
  });

  it('shows an error card (not a crash) for source that fails validation', () => {
    render(<WidgetRenderer source="return window.location.href;" registry={registry} />);
    expect(screen.getByRole('alert').textContent).toMatch(/not allowed/i);
  });

  it('catches a runtime error in a valid-but-throwing widget', () => {
    render(<WidgetRenderer source="return <Box>{undefined.x}</Box>;" registry={registry} />);
    expect(screen.getByRole('alert')).toBeDefined();
  });

  it('renders live data through useMetric', async () => {
    render(
      <DataResolverProvider resolver={async () => 7}>
        <WidgetRenderer source="const m = useMetric('k'); return <Box>{m.loading ? 'load' : String(m.data)}</Box>;" registry={registry} />
      </DataResolverProvider>,
    );
    await waitFor(() => expect(screen.getByText('7')).toBeDefined());
  });
});
