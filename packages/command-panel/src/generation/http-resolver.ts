import type { DataResolver } from '../registry/data-registry';

/**
 * Client-side DataResolver that fetches from the engine's read-only data route.
 * Pass a custom `fetchImpl` for testing; defaults to the global `fetch`.
 */
export function createHttpDataResolver(endpoint: string, fetchImpl: typeof fetch = fetch): DataResolver {
  return async (id, params) => {
    const res = await fetchImpl(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id, params }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`Data request failed (${res.status})${text ? `: ${text}` : ''}`);
    }
    return (await res.json()) as unknown;
  };
}
