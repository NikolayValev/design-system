import { describe, it, expect } from 'vitest';
import { buildSystemPrompt } from './system-prompt';
import { createComponentRegistry } from '../registry/component-registry';
import { createDataRegistry } from '../registry/data-registry';

const components = createComponentRegistry([
  { name: 'LineChart', component: () => null, description: 'SVG line chart.' },
]);
const data = createDataRegistry([
  { id: 'revenue.monthly', description: 'Monthly revenue.', load: async () => [] },
]);

describe('buildSystemPrompt', () => {
  it('lists each component name and description', () => {
    const p = buildSystemPrompt(components, data);
    expect(p).toContain('LineChart');
    expect(p).toContain('SVG line chart.');
  });
  it('lists each data source id and forbids inventing data', () => {
    const p = buildSystemPrompt(components, data);
    expect(p).toContain('revenue.monthly');
    expect(p).toContain('useMetric');
    expect(p).toMatch(/never invent data|do not invent/i);
  });
  it('states the propose_widget tool and the jsx contract', () => {
    const p = buildSystemPrompt(components, data);
    expect(p).toContain('propose_widget');
    expect(p).toMatch(/return/i);
  });
  it('shows (none) when there are no data sources', () => {
    const p = buildSystemPrompt(components, createDataRegistry([]));
    expect(p).toContain('(none)');
  });
  it('appends an optional appendix', () => {
    const p = buildSystemPrompt(components, data, { appendix: 'EXTRA-GUIDANCE-XYZ' });
    expect(p).toContain('EXTRA-GUIDANCE-XYZ');
  });
  it('includes chart-data guidance (shape + pass-through example) when a chart is registered', () => {
    const p = buildSystemPrompt(components, data);
    expect(p).toContain('{ label: string; value: number }[]');
    expect(p).toContain('colorIndex');
    expect(p).toContain('data={m.data ?? []}');
    // the example uses a real registered chart name + data id
    expect(p).toContain('<LineChart data={m.data ?? []} colorIndex={1} />');
    expect(p).toContain("useMetric('revenue.monthly')");
  });
  it('omits chart guidance when no chart component is registered', () => {
    const noCharts = createComponentRegistry([
      { name: 'StatChip', component: () => null, description: 'A compact metric token.' },
    ]);
    const p = buildSystemPrompt(noCharts, data);
    expect(p).not.toContain('colorIndex');
  });
});
