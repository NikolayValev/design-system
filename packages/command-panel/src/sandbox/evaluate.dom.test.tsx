// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { transpileWidgetBody } from './transpile';
import { buildWidgetComponent } from './evaluate';

function build(source: string, scope: Record<string, unknown> = {}) {
  return buildWidgetComponent(transpileWidgetBody(source), scope);
}

describe('buildWidgetComponent', () => {
  it('builds a component that renders host JSX', () => {
    const Widget = build('return <div>hello</div>;');
    render(<Widget />);
    expect(screen.getByText('hello')).toBeDefined();
  });

  it('injects registry components into scope by name', () => {
    const Box = ({ children }: { children?: React.ReactNode }) => <section>{children}</section>;
    const Widget = build('return <Box>inside</Box>;', { Box });
    render(<Widget />);
    expect(screen.getByText('inside')).toBeDefined();
  });

  it('shadows forbidden globals to undefined inside the widget', () => {
    // typeof window must be 'undefined' inside the sandbox even though jsdom defines it.
    const seen: string[] = [];
    const probe = (t: string) => { seen.push(t); };
    const Widget = build('probe(typeof window); return <div>x</div>;', { probe });
    render(<Widget />);
    expect(seen).toEqual(['undefined']);
  });
});
