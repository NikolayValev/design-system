import { AuthError } from './errors';
import { createInMemoryAuthStorage } from './storage';
import type { AuthClient, AuthClientDependencies, AuthConfig, AuthSession, AuthUser } from './types';

const DEFAULT_SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

/**
 * Creates a standalone auth client with storage injected by the consumer.
 * If dependencies are omitted, it falls back to in-memory storage.
 */
export function createAuthClient<Context = unknown>(
  config: AuthConfig,
  dependencies?: AuthClientDependencies<Context>,
): AuthClient<Context> {
  const storage = dependencies?.storage ?? createInMemoryAuthStorage<Context>();
  const now = dependencies?.now ?? Date.now;
  const sessionMaxAge = config.sessionMaxAge ?? DEFAULT_SESSION_MAX_AGE_SECONDS;

  const getSession = async (context: Context): Promise<AuthSession | null> => {
    const session = await storage.getSession(context);

    if (!session) {
      return null;
    }

    if (session.expiresAt <= now()) {
      await storage.clearSession(context);
      await dependencies?.onSessionExpired?.(context, session);
      return null;
    }

    return session;
  };

  const getUser = async (context: Context): Promise<AuthUser | null> => {
    const session = await getSession(context);
    return session?.user ?? null;
  };

  const signIn = async (context: Context, session: AuthSession): Promise<void> => {
    await storage.setSession(context, session);
  };

  const signOut = async (context: Context): Promise<void> => {
    await storage.clearSession(context);
  };

  const isAuthenticated = async (context: Context): Promise<boolean> => {
    const session = await getSession(context);
    return session !== null;
  };

  const requireSession = async (context: Context): Promise<AuthSession> => {
    const session = await getSession(context);
    if (!session) {
      throw new AuthError('UNAUTHORIZED', 'Unauthorized');
    }
    return session;
  };

  return {
    config,
    sessionMaxAge,
    getSession,
    getUser,
    signIn,
    signOut,
    isAuthenticated,
    requireSession,
  };
}

