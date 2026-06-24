import { describe, it, expect } from 'vitest';
import { COMMAND_PANEL_VERSION } from './index';

describe('package smoke', () => {
  it('exports a version constant', () => {
    expect(COMMAND_PANEL_VERSION).toBe('0.0.0');
  });
});
