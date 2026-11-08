import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { compile } from 'tailwindcss';
import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
const here = path.dirname(fileURLToPath(import.meta.url));

/** Compile global.css with the real Tailwind v4 compiler, as a consumer's build would. */
async function utilities(candidates: string[]): Promise<string> {
  const css = await readFile(path.join(here, 'global.css'), 'utf8');
  const compiler = await compile(css, {
    base: here,
    loadStylesheet: async (id, base) => {
      const file = id === 'tailwindcss' ? require.resolve('tailwindcss/index.css') : path.resolve(base, id);
      return { path: file, base: path.dirname(file), content: await readFile(file, 'utf8') };
    },
  });
  return compiler.build(candidates);
}

/** The declaration a single utility compiles to, e.g. `max-width: var(--container-3xl)`. */
function declaration(css: string, className: string, property: string): string | undefined {
  const escaped = className.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const rule = css.match(new RegExp(`\\.${escaped}\\s*\\{([^}]*)\\}`));
  return rule?.[1].match(new RegExp(`${property}:\\s*([^;]+);`))?.[1].trim();
}

// Every name the spacing scale shares with Tailwind's container scale.
const SHARED_SIZES = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] as const;

// Width utilities whose own namespace Tailwind consults before `--spacing-*`.
const WIDTH_UTILITIES = [
  { prefix: 'max-w', property: 'max-width' },
  { prefix: 'min-w', property: 'min-width' },
  { prefix: 'w', property: 'width' },
  { prefix: 'basis', property: 'flex-basis' },
] as const;

describe('global.css theme', () => {
  // Tailwind resolves `max-w-3xl` against `--spacing-*` before `--container-*`.
  // Mapping the spacing scale into the theme therefore turned a 48rem measure
  // into 4rem in every consumer that wrote `max-w-3xl`.
  it.each(WIDTH_UTILITIES.flatMap((u) => SHARED_SIZES.map((size) => ({ ...u, size }))))(
    '$prefix-$size keeps its container width',
    async ({ prefix, property, size }) => {
      const css = await utilities([`${prefix}-${size}`]);
      expect(declaration(css, `${prefix}-${size}`, property)).toBe(`var(--container-${size})`);
    },
  );

  it('emits the container values the width utilities point at', async () => {
    const css = await utilities(['max-w-3xl', 'max-w-xl']);
    expect(css).toMatch(/--container-3xl:\s*48rem/);
    expect(css).toMatch(/--container-xl:\s*36rem/);
  });

  // The fix must not cost the spacing scale its own utilities.
  it.each(SHARED_SIZES)('p-%s and gap-%s still read the spacing scale', async (size) => {
    const css = await utilities([`p-${size}`, `gap-${size}`]);
    expect(declaration(css, `p-${size}`, 'padding')).toBe(`var(--vde-space-${size})`);
    expect(declaration(css, `gap-${size}`, 'gap')).toBe(`var(--vde-space-${size})`);
  });
});
