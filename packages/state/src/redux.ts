import { resolveInitialState } from './internal';
import type { ReducerArgs, ReducerPayload, StateFactoryConfig, StateReducers } from './types';

export interface ReduxAction<Type extends string = string, Payload = unknown> {
  type: Type;
  payload: Payload;
}

export type ReduxActionCreators<
  State,
  Reducers extends StateReducers<State>,
  Scope extends string,
> = {
  [Name in keyof Reducers & string]: (
    ...args: ReducerArgs<Reducers[Name]>
  ) => ReduxAction<`${Scope}/${Name}`, ReducerPayload<Reducers[Name]>>;
};

export type ReduxActions<
  State,
  Reducers extends StateReducers<State>,
  Scope extends string,
> = ReturnType<ReduxActionCreators<State, Reducers, Scope>[keyof Reducers & string]>;

export interface ReduxStateModule<
  State,
  Reducers extends StateReducers<State>,
  Scope extends string,
> {
  readonly name: Scope;
  readonly initialState: State;
  readonly actionTypes: {
    [Name in keyof Reducers & string]: `${Scope}/${Name}`;
  };
  readonly actions: ReduxActionCreators<State, Reducers, Scope>;
  reducer(state: State | undefined, action: { type: string; payload?: unknown }): State;
}

export function createReduxStateModule<
  State,
  Reducers extends StateReducers<State>,
  Scope extends string,
>(
  config: StateFactoryConfig<State, Reducers> & { name: Scope },
): ReduxStateModule<State, Reducers, Scope> {
  const initialState = resolveInitialState(config.initialState);

  const actionTypes = {} as ReduxStateModule<State, Reducers, Scope>['actionTypes'];
  for (const key of Object.keys(config.reducers) as Array<keyof Reducers & string>) {
    actionTypes[key] = `${config.name}/${key}` as ReduxStateModule<State, Reducers, Scope>['actionTypes'][typeof key];
  }

  const actions = {} as ReduxActionCreators<State, Reducers, Scope>;
  for (const key of Object.keys(config.reducers) as Array<keyof Reducers & string>) {
    actions[key] = ((...args: unknown[]) => ({
      type: actionTypes[key],
      payload: args[0],
    })) as ReduxActionCreators<State, Reducers, Scope>[typeof key];
  }

  const reducer = (state: State | undefined, action: { type: string; payload?: unknown }): State => {
    const currentState = state ?? initialState;

    for (const key of Object.keys(config.reducers) as Array<keyof Reducers & string>) {
      if (action.type === actionTypes[key]) {
        return config.reducers[key](currentState, action.payload as never);
      }
    }

    return currentState;
  };

  return {
    name: config.name,
    initialState,
    actionTypes,
    actions,
    reducer,
  };
}

