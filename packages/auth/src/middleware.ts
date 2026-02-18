import { createAuthClient } from './client';
import { AuthError } from './errors';
import type { AuthClient, AuthConfig, AuthSession, AuthStorage } from './types';

export interface WithAuthOptions<Context = Request> {
  resolveContext?: (request: Request) => Context;
  onUnauthorized?: (request: Request, error: AuthError) => Response | Promise<Response>;
}

export type WithAuthHandler<Context = Request> = (
  request: Request,
  session: AuthSession,
  context: Context,
) => Promise<Response>;

const defaultUnauthorizedHandler = (_request: Request, error: AuthError): Response =>
  new Response(JSON.stringify({ error: error.message }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });

export function withAuthClient<Context = Request>(
  auth: AuthClient<Context>,
  handler: WithAuthHandler<Context>,
  options: WithAuthOptions<Context> = {},
) {
  return async (request: Request): Promise<Response> => {
    const context = options.resolveContext
      ? options.resolveContext(request)
      : (request as unknown as Context);

    try {
      const session = await auth.requireSession(context);
      return handler(request, session, context);
    } catch (error) {
      if (error instanceof AuthError) {
        const onUnauthorized = options.onUnauthorized ?? defaultUnauthorizedHandler;
        return onUnauthorized(request, error);
      }
      throw error;
    }
  };
}

/**
 * HTTP middleware helper for frameworks using Request/Response handlers.
 */
export function withAuth<Context = Request>(
  config: AuthConfig,
  storage: AuthStorage<Context>,
  handler: WithAuthHandler<Context>,
  options: WithAuthOptions<Context> = {},
) {
  const auth = createAuthClient(config, { storage });
  return withAuthClient(auth, handler, options);
}

