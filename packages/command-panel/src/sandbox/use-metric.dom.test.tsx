// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { DataResolverProvider, useMetric } from './use-metric';
import type { DataResolver } from '../registry/data-registry';

function Probe({ id }: { id: string }) {
  const { data, loading, error } = useMetric<number>(id);
  if (loading) return <span>loading</span>;
  if (error) return <span>error:{error}</span>;
  return <span>value:{String(data)}</span>;
}

function renderWith(resolver: DataResolver, id: string) {
  return render(
    <DataResolverProvider resolver={resolver}>
      <Probe id={id} />
    </DataResolverProvider>,
  );
}

describe('useMetric', () => {
  it('shows loading then the resolved value', async () => {
    renderWith(async () => 42, 'x');
    expect(screen.getByText('loading')).toBeDefined();
    await waitFor(() => expect(screen.getByText('value:42')).toBeDefined());
  });

  it('surfaces a resolver rejection as an error state', async () => {
    renderWith(async () => { throw new Error('boom'); }, 'x');
    await waitFor(() => expect(screen.getByText('error:boom')).toBeDefined());
  });

  it('errors when no resolver is provided', async () => {
    render(<Probe id="x" />);
    await waitFor(() => expect(screen.getByText(/error:/)).toBeDefined());
  });
});
