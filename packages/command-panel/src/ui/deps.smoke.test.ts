import { describe, it, expect } from 'vitest';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, isToolUIPart, getToolName } from 'ai';
import { createStateFactory } from '@repo/state';

describe('phase 2c dependencies', () => {
  it('exposes the client chat + state primitives', () => {
    expect(typeof useChat).toBe('function');
    expect(typeof DefaultChatTransport).toBe('function');
    expect(typeof isToolUIPart).toBe('function');
    expect(typeof getToolName).toBe('function');
    expect(typeof createStateFactory).toBe('function');
  });
});
