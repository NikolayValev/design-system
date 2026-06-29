export type StateInitializer<State> = State | (() => State);

export type AnyStateReducer<State> = (state: State, payload: unknown) => State;

export type StateReducers<State> = Record<string, AnyStateReducer<State>>;

// `state: never` (contravariant) lets this match reducers of any concrete
// `(state: State, payload) => State` shape under strictFunctionTypes while still
// inferring the payload type — avoids `any` (and its no-explicit-any warning).
export type ReducerPayload<Reducer> = Reducer extends (
  state: never,
  payload: infer Payload,
) => unknown
  ? Payload
  : never;

export type ReducerArgs<Reducer> = [ReducerPayload<Reducer>] extends [void]
  ? []
  : [payload: ReducerPayload<Reducer>];

export type StoreActionCreators<State, Reducers extends StateReducers<State>> = {
  [Name in keyof Reducers]: (...args: ReducerArgs<Reducers[Name]>) => State;
};

export interface StateFactoryConfig<State, Reducers extends StateReducers<State>> {
  name: string;
  initialState: StateInitializer<State>;
  reducers: Reducers;
}

export type StateListener<State> = (state: State, previousState: State) => void;

export interface StateStore<State, Reducers extends StateReducers<State>> {
  readonly name: string;
  dispatch<Name extends keyof Reducers>(type: Name, ...args: ReducerArgs<Reducers[Name]>): State;
  getState(): State;
  subscribe(listener: StateListener<State>): () => void;
  actions: StoreActionCreators<State, Reducers>;
  reset(): State;
  destroy(): void;
}
