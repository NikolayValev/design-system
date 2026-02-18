import type { AuthConfig } from '@repo/auth';
import { createStateFactory } from '@repo/state';

export const secondBrainAuthConfig: AuthConfig = {
  provider: 'credentials',
};

export const shellState = createStateFactory({
  name: 'second-brain-shell',
  initialState: { ready: false },
  reducers: {
    setReady(state, payload: boolean) {
      return { ...state, ready: payload };
    },
  },
});
