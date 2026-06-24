import { transform } from 'sucrase';

/**
 * Wrap a widget body (statements ending in `return <jsx/>`) as a function component
 * and transpile its JSX to classic `React.createElement` calls. `React` and any
 * component identifiers are supplied by the evaluator's scope, not by imports.
 */
export function transpileWidgetBody(source: string): string {
  const wrapped = `function Widget(props) {\n${source}\n}`;
  const { code } = transform(wrapped, {
    transforms: ['jsx'],
    jsxRuntime: 'classic',
    production: true,
  });
  return code;
}
