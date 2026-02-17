import type { AuthConfig, AuthSession, AuthUser } from './types';

/**
 * Create a configured authentication client.
 *
 * @example
 * ```ts
 * import { createAuthClient } from '@repo/auth';
 *
 * const auth = createAuthClient({
 *   provider: 'github',
 *   clientId: process.env.GITHUB_CLIENT_ID,
 *   clientSecret: process.env.GITHUB_CLIENT_SECRET,
 * });
 * ```
 */
export function createAuthClient(config: AuthConfig) {
  const sessionMaxAge = config.sessionMaxAge ?? 30 * 24 * 60 * 60; // 30 days

  return {
    config,

    /**
     * Get current session (placeholder — wire up your session store).
     */
    async getSession(): Promise<AuthSession | null> {
      // TODO: Implement session retrieval from your preferred store
      return null;
    },

    /**
     * Get the current user from an active session.
     */
    async getUser(): Promise<AuthUser | null> {
      const session = await this.getSession();
      return session?.user ?? null;
    },

    /**
     * Sign out and clear the session.
     */
    async signOut(): Promise<void> {
      // TODO: Implement session invalidation
    },

    /** Max session age in seconds */
    sessionMaxAge,
  };
}
