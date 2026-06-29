import { createDataRegistry } from '@nikolayvalev/command-panel';
import { dataSources } from './sources';

export const dataRegistry = createDataRegistry(dataSources);
