import * as React from 'react';
import { SHADOWED_GLOBALS } from './constants';

/**
 * Build a React component from transpiled widget code.
 *
 * Security model: the transpiled code runs inside `new Function`, which has NO access
 * to this module's closure but DOES see ambient globals. We neutralize that by passing
 * the dangerous globals as parameters bound to `undefined`, so `window`, `fetch`, etc.
 * lexically resolve to `undefined` inside the widget. The AST validator is the primary
 * gate; this shadowing is the backstop. `"use strict"` ensures undeclared free
 * identifiers throw rather than leaking, and `this` is undefined.
 */
export function buildWidgetComponent(
  transpiledCode: string,
  scope: Record<string, unknown>,
): React.ComponentType<any> {
  const injected: Record<string, unknown> = { React, ...scope };

  // Unique param list: injected names first, then any shadowed globals not already injected.
  const paramNames: string[] = [...Object.keys(injected)];
  const paramSeen = new Set(paramNames);
  for (const g of SHADOWED_GLOBALS) {
    if (!paramSeen.has(g)) {
      paramNames.push(g);
      paramSeen.add(g);
    }
  }

  const args: unknown[] = paramNames.map((name) =>
    name in injected ? injected[name] : undefined,
  );

  const body = `"use strict";\n${transpiledCode}\nreturn Widget;`;
  // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
  const factory = new Function(...paramNames, body) as (...a: unknown[]) => React.ComponentType<any>;
  return factory(...args);
}
