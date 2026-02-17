import type { AuthConfig } from './types';
import { createAuthClient } from './client';

/**
 * Higher-order function that wraps a request handler with authentication.
 *
 * @example
 * ```ts
 * import { withAuth } from '@repo/auth';
 *
 * export const GET = withAuth({ provider: 'github' }, async (req, session) => {
 *   return new Response(JSON.stringify(session.user));
 * });
 * ```
 */
export function withAuth(
  config: AuthConfig,
  handler: (request: Request, session: { user: { id: string; email: string } }) => Promise<Response>,
) {
  const auth = createAuthClient(config);

  return async (request: Request): Promise<Response> => {
    const session = await auth.getSession();

    if (!session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return handler(request, session);
  };
}
