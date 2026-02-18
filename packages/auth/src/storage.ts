import type { AuthSession, AuthStorage } from './types';

export interface InMemoryAuthStorageOptions<Context = unknown> {
  resolveKey?: (context: Context) => string;
}

/**
 * Default storage for local development and tests.
 * Production apps should provide persistent storage adapters.
 */
export function createInMemoryAuthStorage<Context = unknown>(
  options: InMemoryAuthStorageOptions<Context> = {},
): AuthStorage<Context> {
  const resolveKey = options.resolveKey ?? (() => 'default');
  const sessions = new Map<string, AuthSession>();

  return {
    getSession(context) {
      return sessions.get(resolveKey(context)) ?? null;
    },
    setSession(context, session) {
      sessions.set(resolveKey(context), session);
    },
    clearSession(context) {
      sessions.delete(resolveKey(context));
    },
  };
}

