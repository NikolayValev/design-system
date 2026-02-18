# @repo/state

Shared state factory package for consistent app state models across projects.

## Goals

- Define state transitions once.
- Reuse the same state logic in vanilla, Zustand, or Redux setups.
- Avoid per-repo drift in AI-generated state patterns.

## Define a state model

```ts
import { createStateFactory } from '@repo/state';

const taskState = createStateFactory({
  name: 'tasks',
  initialState: { items: [] as string[] },
  reducers: {
    add(state, payload: string) {
      return { ...state, items: [...state.items, payload] };
    },
    clear(state, _payload: void) {
      return { ...state, items: [] };
    },
  },
});

const store = taskState.createStore();
store.actions.add('Review notes');
```

## Zustand adapter

```ts
import { create } from 'zustand';
import { createZustandInitializer } from '@repo/state';

const initializer = createZustandInitializer(taskConfig);
const useTaskStore = create(initializer);
```

## Redux adapter

```ts
import { createReduxStateModule } from '@repo/state';

const taskRedux = createReduxStateModule(taskConfig);
```

