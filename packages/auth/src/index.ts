export { createAuthClient } from './client';
export { AuthError } from './errors';
export { withAuth, withAuthClient } from './middleware';
export { createInMemoryAuthStorage } from './storage';
export type {
  AuthClient,
  AuthClientDependencies,
  AuthConfig,
  AuthErrorCode,
  AuthRole,
  AuthSession,
  AuthStorage,
  AuthUser,
  AuthProvider,
} from './types';
