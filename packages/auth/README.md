# @repo/auth

Shared authentication service package for apps like Second Brain and Strata Management.

## Goals

- Keep auth flow logic in one place.
- Let each app inject its own session storage strategy.
- Reuse the same middleware and auth types across repos.

## Usage

```ts
import { createAuthClient } from '@repo/auth';

const auth = createAuthClient(
  {
    provider: 'credentials',
    sessionMaxAge: 60 * 60 * 24 * 7,
  },
  {
    storage: {
      getSession: async context => context.session ?? null,
      setSession: async (context, session) => {
        context.session = session;
      },
      clearSession: async context => {
        context.session = null;
      },
    },
  },
);
```

## HTTP guard helper

```ts
import { withAuth } from '@repo/auth';

export const GET = withAuth(config, storage, async (_request, session) => {
  return Response.json({ user: session.user });
});
```

