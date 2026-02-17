/**
 * Core authentication types.
 */

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  image?: string;
  role: 'admin' | 'user' | 'viewer';
}

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
}

export interface AuthConfig {
  /** OAuth provider name */
  provider: 'github' | 'google' | 'credentials';
  /** Client ID for OAuth */
  clientId?: string;
  /** Client secret for OAuth */
  clientSecret?: string;
  /** URL to redirect after login */
  callbackUrl?: string;
  /** Session duration in seconds (default: 30 days) */
  sessionMaxAge?: number;
}
