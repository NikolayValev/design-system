// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { App } from './App';

describe('App', () => {
  it('renders the command panel shell (chat input + dashboard empty state)', () => {
    render(<App />);
    expect(screen.getByLabelText(/message/i)).toBeTruthy();
    expect(screen.getByText(/no pinned widgets/i)).toBeTruthy();
  });
});
