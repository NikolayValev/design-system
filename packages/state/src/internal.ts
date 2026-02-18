import type { StateInitializer } from './types';

export const resolveInitialState = <State>(initialState: StateInitializer<State>): State =>
  typeof initialState === 'function' ? (initialState as () => State)() : initialState;

