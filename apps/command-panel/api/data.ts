import { createDataRouteHandler } from '@nikolayvalev/command-panel';
import { dataRegistry } from '../src/data/registry';

export const dataHandler = createDataRouteHandler(dataRegistry);

export function POST(request: Request): Promise<Response> {
  return dataHandler(request);
}
