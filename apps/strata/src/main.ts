import type { AuthConfig } from '@repo/auth';
import { createStateFactory } from '@repo/state';

export const strataAuthConfig: AuthConfig = {
  provider: 'credentials',
};

export const shellState = createStateFactory({
  name: 'strata-shell',
  initialState: { ready: false },
  reducers: {
    setReady(state, payload: boolean) {
      return { ...state, ready: payload };
    },
  },
});
