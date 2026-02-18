import { resolveInitialState } from './internal';
import type {
  ReducerArgs,
  StateFactoryConfig,
  StateListener,
  StateReducers,
  StateStore,
  StoreActionCreators,
} from './types';

export interface StateFactory<State, Reducers extends StateReducers<State>> {
  readonly name: string;
  createStore(overrideState?: State): StateStore<State, Reducers>;
}

export function createStateFactory<State, Reducers extends StateReducers<State>>(
  config: StateFactoryConfig<State, Reducers>,
): StateFactory<State, Reducers> {
  const createStore = (overrideState?: State): StateStore<State, Reducers> => {
    const initialState = overrideState ?? resolveInitialState(config.initialState);
    let state = initialState;
    const listeners = new Set<StateListener<State>>();

    const notify = (nextState: State, previousState: State): void => {
      if (Object.is(nextState, previousState)) {
        return;
      }

      for (const listener of listeners) {
        listener(nextState, previousState);
      }
    };

    const getState = (): State => state;

    const dispatch = <Name extends keyof Reducers>(
      type: Name,
      ...args: ReducerArgs<Reducers[Name]>
    ): State => {
      const reducer = config.reducers[type];
      const previousState = state;
      state = reducer(previousState, args[0] as never);
      notify(state, previousState);
      return state;
    };

    const subscribe = (listener: StateListener<State>): (() => void) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    };

    const reset = (): State => {
      const previousState = state;
      state = initialState;
      notify(state, previousState);
      return state;
    };

    const destroy = (): void => {
      listeners.clear();
      state = initialState;
    };

    const actions = {} as StoreActionCreators<State, Reducers>;
    for (const key of Object.keys(config.reducers) as Array<keyof Reducers>) {
      actions[key] = ((...args: unknown[]) =>
        dispatch(key, ...(args as ReducerArgs<Reducers[typeof key]>))) as StoreActionCreators<
        State,
        Reducers
      >[typeof key];
    }

    return {
      name: config.name,
      dispatch,
      getState,
      subscribe,
      actions,
      reset,
      destroy,
    };
  };

  return {
    name: config.name,
    createStore,
  };
}

