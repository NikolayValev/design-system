import { describe, it, expect } from 'vitest';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateMetrics, sameMetrics, type Metrics } from './generate-metrics';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');

describe('generateMetrics', () => {
  it('computes plausible monorepo metrics from source', async () => {
    const m = await generateMetrics(repoRoot);
    expect(typeof m.generatedAt).toBe('string');
    expect(m.components).toBeGreaterThan(0);
    expect(m.sections).toBeGreaterThanOrEqual(0);
    expect(m.pages).toBeGreaterThanOrEqual(0);
    expect(m.stories).toBeGreaterThan(0);
    expect(Array.isArray(m.bundle)).toBe(true);
    m.bundle.forEach((b) => {
      expect(typeof b.file).toBe('string');
      expect(b.bytes).toBeGreaterThan(0);
    });
  });

  it('ignores generatedAt when deciding whether metrics changed', () => {
    const base: Metrics = { generatedAt: 'a', components: 1, sections: 0, pages: 0, stories: 1, bundle: [] };
    expect(sameMetrics(base, { ...base, generatedAt: 'b' })).toBe(true);
    expect(sameMetrics(base, { ...base, generatedAt: 'b', components: 2 })).toBe(false);
  });
});
