import { describe, it, expect } from 'vitest';
import { proposeWidgetSchema, proposeWidgetTool } from './propose-widget';

describe('proposeWidgetSchema', () => {
  it('accepts a valid widget proposal', () => {
    const r = proposeWidgetSchema.safeParse({
      title: 'Revenue',
      description: 'Monthly revenue line chart.',
      jsx: "const m = useMetric('revenue.monthly'); return <LineChart data={m.data ?? []} />;",
      dataSources: ['revenue.monthly'],
    });
    expect(r.success).toBe(true);
  });
  it('rejects a proposal missing jsx', () => {
    const r = proposeWidgetSchema.safeParse({ title: 'X', description: 'y', dataSources: [] });
    expect(r.success).toBe(false);
  });
  it('rejects dataSources that is not an array of strings', () => {
    const r = proposeWidgetSchema.safeParse({ title: 'X', description: 'y', jsx: 'return null;', dataSources: 'nope' });
    expect(r.success).toBe(false);
  });
});

describe('proposeWidgetTool', () => {
  it('is a tool with a description', () => {
    expect(typeof proposeWidgetTool.description).toBe('string');
    expect(proposeWidgetTool.description.length).toBeGreaterThan(0);
  });
});
