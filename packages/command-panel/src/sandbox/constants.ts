/** Lowercase host elements the LLM may use for layout/text. */
export const HOST_ELEMENTS: ReadonlySet<string> = new Set([
  'div', 'span', 'p', 'ul', 'ol', 'li', 'section', 'header', 'footer',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'small', 'strong', 'em', 'b', 'i', 'br', 'hr',
]);

/** The only attributes permitted on host elements. */
export const ALLOWED_HOST_ATTRS: ReadonlySet<string> = new Set(['className', 'key']);

/** Identifiers that are forbidden in any reference position. */
export const DISALLOWED_IDENTIFIERS: ReadonlySet<string> = new Set([
  'window', 'document', 'globalThis', 'self', 'top', 'parent', 'frames', 'navigator', 'location', 'history',
  'fetch', 'XMLHttpRequest', 'WebSocket', 'EventSource', 'Worker', 'SharedWorker', 'importScripts',
  'localStorage', 'sessionStorage', 'indexedDB', 'caches', 'crypto',
  'eval', 'Function', 'require', 'module', 'exports', 'process', 'global', 'Buffer',
  'setTimeout', 'setInterval', 'setImmediate', 'queueMicrotask', 'requestAnimationFrame',
  'arguments', 'postMessage', 'alert', 'prompt', 'confirm', 'open',
]);

/** Property names whose access enables prototype/constructor escapes. */
export const FORBIDDEN_MEMBER_PROPS: ReadonlySet<string> = new Set([
  'constructor', '__proto__', 'prototype',
  '__defineGetter__', '__defineSetter__', '__lookupGetter__', '__lookupSetter__',
]);

/**
 * Globals shadowed to `undefined` as evaluator params (defense-in-depth backstop).
 * MUST NOT include reserved words or `eval`/`arguments` (illegal as strict-mode params);
 * the validator already rejects those.
 */
export const SHADOWED_GLOBALS: readonly string[] = [
  'window', 'document', 'globalThis', 'self', 'top', 'parent', 'frames', 'navigator', 'location', 'history',
  'fetch', 'XMLHttpRequest', 'WebSocket', 'EventSource', 'Worker',
  'localStorage', 'sessionStorage', 'indexedDB', 'caches', 'crypto',
  'Function', 'require', 'process', 'global', 'Buffer',
  'setTimeout', 'setInterval', 'postMessage', 'alert', 'prompt', 'confirm', 'open',
];

/** React hooks (plus useMetric) injected into the evaluator scope. */
export const HOOK_NAMES: readonly string[] = ['useState', 'useMemo', 'useRef', 'useMetric'];
