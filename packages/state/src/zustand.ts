import { resolveInitialState } from './internal';
import type { ReducerArgs, StateFactoryConfig, StateReducers, StoreActionCreators } from './types';

export type ZustandSetState<Store> = (
  partial: Store | Partial<Store> | ((state: Store) => Store | Partial<Store>),
  replace?: boolean,
) => void;

export type ZustandGetState<Store> = () => Store;

export interface ZustandStateSlice<State, Reducers extends StateReducers<State>> {
  state: State;
  dispatch<Name extends keyof Reducers>(type: Name, ...args: ReducerArgs<Reducers[Name]>): State;
  actions: StoreActionCreators<State, Reducers>;
  reset(): void;
}

export function createZustandInitializer<State, Reducers extends StateReducers<State>>(
  config: StateFactoryConfig<State, Reducers>,
) {
  return (
    set: ZustandSetState<ZustandStateSlice<State, Reducers>>,
    _get: ZustandGetState<ZustandStateSlice<State, Reducers>>,
  ): ZustandStateSlice<State, Reducers> => {
    const initialState = resolveInitialState(config.initialState);

    const dispatch = <Name extends keyof Reducers>(
      type: Name,
      ...args: ReducerArgs<Reducers[Name]>
    ): State => {
      let nextState = initialState;

      set(current => {
        const reducer = config.reducers[type];
        nextState = reducer(current.state, args[0] as never);
        return {
          ...current,
          state: nextState,
        };
      });

      return nextState;
    };

    const actions = {} as StoreActionCreators<State, Reducers>;
    for (const key of Object.keys(config.reducers) as Array<keyof Reducers>) {
      actions[key] = ((...args: unknown[]) =>
        dispatch(key, ...(args as ReducerArgs<Reducers[typeof key]>))) as StoreActionCreators<
        State,
        Reducers
      >[typeof key];
    }

    const reset = (): void => {
      set(current => ({
        ...current,
        state: initialState,
      }));
    };

    return {
      state: initialState,
      dispatch,
      actions,
      reset,
    };
  };
}

