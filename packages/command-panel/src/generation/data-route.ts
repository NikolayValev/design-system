import { getDataSource, type DataRegistry } from '../registry/data-registry';

/**
 * Read-only data route (drop into a Next.js `route.ts` as `POST`). Accepts
 * `{ id, params }`, resolves a REGISTERED DataSource, and rejects unknown ids.
 * This is the only outbound data path the generated widgets' `useMetric` can use.
 */
export function createDataRouteHandler(dataRegistry: DataRegistry) {
  return async (req: Request): Promise<Response> => {
    let body: { id?: string; params?: Record<string, unknown> };
    try {
      body = (await req.json()) as typeof body;
    } catch {
      return Response.json({ error: 'Invalid JSON body.' }, { status: 400 });
    }
    if (!body.id) {
      return Response.json({ error: 'Missing data source id.' }, { status: 400 });
    }
    if (
      body.params !== undefined &&
      (typeof body.params !== 'object' || body.params === null || Array.isArray(body.params))
    ) {
      return Response.json({ error: 'Invalid params: expected an object.' }, { status: 400 });
    }
    const source = getDataSource(dataRegistry, body.id);
    if (!source) {
      return Response.json({ error: `Unknown data source: ${body.id}` }, { status: 404 });
    }
    try {
      const data = await source.load(body.params);
      return Response.json(data ?? null);
    } catch (e) {
      return Response.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
    }
  };
}
