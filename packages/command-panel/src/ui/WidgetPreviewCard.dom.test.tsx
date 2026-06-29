// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WidgetPreviewCard, type WidgetProposal } from './WidgetPreviewCard';
import { DataResolverProvider } from '../sandbox/use-metric';
import { defaultComponentRegistry } from '../registry/default-registry';

const proposal: WidgetProposal = {
  id: 'p1',
  title: 'Total',
  description: 'A single stat.',
  jsx: 'return <StatChip label="Total" value={3} />;',
  dataSources: [],
};

const stubResolver = async () => null;

function renderCard(props: Partial<React.ComponentProps<typeof WidgetPreviewCard>> = {}) {
  return render(
    <DataResolverProvider resolver={stubResolver}>
      <WidgetPreviewCard proposal={proposal} registry={defaultComponentRegistry} {...props} />
    </DataResolverProvider>,
  );
}

describe('WidgetPreviewCard', () => {
  it('renders title, description, and the live sandboxed widget', () => {
    renderCard();
    expect(screen.getByText('Total', { selector: 'h3' })).toBeTruthy();
    expect(screen.getByText('A single stat.')).toBeTruthy();
    // The StatChip renders its value.
    expect(screen.getByText('3')).toBeTruthy();
  });

  it('calls onPin with the proposal when Pin is clicked', () => {
    const onPin = vi.fn();
    renderCard({ onPin });
    fireEvent.click(screen.getByRole('button', { name: /pin to dashboard/i }));
    expect(onPin).toHaveBeenCalledWith(proposal);
  });

  it('shows a disabled Pinned state', () => {
    const onPin = vi.fn();
    renderCard({ onPin, isPinned: true });
    const btn = screen.getByRole('button', { name: /pinned/i }) as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
  });
});
