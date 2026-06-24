import { describe, it, expect } from 'vitest';
import { transpileWidgetBody } from './transpile';

describe('transpileWidgetBody', () => {
  it('wraps the body in a Widget function and compiles JSX to React.createElement', () => {
    const code = transpileWidgetBody('return <Card>hi</Card>;');
    expect(code).toContain('function Widget');
    expect(code).toContain('React.createElement');
    expect(code).toContain('Card');
    expect(code).not.toContain('jsx('); // classic runtime, not automatic
  });

  it('compiles host elements to string-tag createElement calls', () => {
    const code = transpileWidgetBody('return <div className="x" />;');
    expect(code).toContain('React.createElement(');
    // sucrase outputs single quotes for tag names in classic runtime
    expect(code).toMatch(/React\.createElement\(['"]div['"]/);
  });
});
