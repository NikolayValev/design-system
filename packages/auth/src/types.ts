/**
 * Core authentication types.
 */

export type AuthProvider = 'github' | 'google' | 'credentials' | (string & {});
export type AuthRole = 'admin' | 'user' | 'viewer' | (string & {});

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  image?: string;
  role?: AuthRole;
}

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
  refreshToken?: string;
  /**
   * Unix timestamp in milliseconds.
   */
  expiresAt: number;
}

export interface AuthConfig {
  /** OAuth provider name */
  provider: AuthProvider;
  /** Client ID for OAuth */
  clientId?: string;
  /** Client secret for OAuth */
  clientSecret?: string;
  /** URL to redirect after login */
  callbackUrl?: string;
  /** Session duration in seconds (default: 30 days) */
  sessionMaxAge?: number;
}

export interface AuthStorage<Context = unknown> {
  getSession(context: Context): Promise<AuthSession | null> | AuthSession | null;
  setSession(context: Context, session: AuthSession): Promise<void> | void;
  clearSession(context: Context): Promise<void> | void;
}

export interface AuthClientDependencies<Context = unknown> {
  storage: AuthStorage<Context>;
  now?: () => number;
  onSessionExpired?: (context: Context, session: AuthSession) => Promise<void> | void;
}

export type AuthErrorCode = 'UNAUTHORIZED' | 'SESSION_EXPIRED';

export interface AuthClient<Context = unknown> {
  config: AuthConfig;
  sessionMaxAge: number;
  getSession(context: Context): Promise<AuthSession | null>;
  getUser(context: Context): Promise<AuthUser | null>;
  signIn(context: Context, session: AuthSession): Promise<void>;
  signOut(context: Context): Promise<void>;
  isAuthenticated(context: Context): Promise<boolean>;
  requireSession(context: Context): Promise<AuthSession>;
}
