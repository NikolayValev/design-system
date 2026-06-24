import { describe, it, expect } from 'vitest';
import { validateWidgetSource } from './validate';

const ALLOWED = new Set(['Card', 'LineChart', 'StatChip']);
const ok = (src: string) => validateWidgetSource(src, ALLOWED).ok;
const errs = (src: string) => validateWidgetSource(src, ALLOWED).errors;

describe('validateWidgetSource — accepts', () => {
  it('a registered component with a host wrapper and className', () => {
    expect(ok("return <div className=\"grid\"><Card><LineChart data={[]} colorIndex={1} /></Card></div>;")).toBe(true);
  });
  it('useMetric + a hook + a map over data', () => {
    expect(
      ok("const m = useMetric('x'); const items = (m.data ?? []).map((d) => d.value); return <StatChip label=\"n\" value={items.length} />;"),
    ).toBe(true);
  });
  it('allowed host text elements', () => {
    expect(ok('return <section><h2 className="t">Hi</h2><p>body</p></section>;')).toBe(true);
  });
});

describe('validateWidgetSource — rejects', () => {
  it('an unregistered component', () => {
    expect(ok('return <Mystery />;')).toBe(false);
    expect(errs('return <Mystery />;').join(' ')).toMatch(/Mystery.*allow-list/i);
  });
  it('a disallowed host element', () => {
    expect(ok('return <img src="x" />;')).toBe(false);
  });
  it('a disallowed attribute on a host element', () => {
    expect(ok('return <div onClick={1}>x</div>;')).toBe(false);
    expect(ok('return <div style={{}}>x</div>;')).toBe(false);
    expect(ok('return <a href="x">x</a>;')).toBe(false); // <a> not in host allow-list
  });
  it('imports and requires', () => {
    expect(ok("import x from 'y'; return null;")).toBe(false);
    expect(ok("const x = require('y'); return null;")).toBe(false);
  });
  it('eval and the Function constructor', () => {
    expect(ok("return eval('1');")).toBe(false);
    expect(ok("return Function('return 1')();")).toBe(false);
  });
  it('global access (window/document/fetch)', () => {
    expect(ok('return window.location.href;')).toBe(false);
    expect(ok('document.cookie; return null;')).toBe(false);
    expect(ok("fetch('/x'); return null;")).toBe(false);
  });
  it('prototype-escape property access', () => {
    expect(ok("return [].constructor;")).toBe(false);
    expect(ok("return ({}).__proto__;")).toBe(false);
    expect(ok("return ({})['constructor'];")).toBe(false);
  });
  it('dangerouslySetInnerHTML', () => {
    expect(ok('return <Card dangerouslySetInnerHTML={{ __html: "x" }} />;')).toBe(false);
  });
  it('spread attributes on host elements', () => {
    expect(ok('return <div {...props}>x</div>;')).toBe(false);
  });
  it('tagged template expressions', () => {
    expect(ok('return foo`bar`;')).toBe(false);
  });
  it('dynamic/computed property access', () => {
    expect(ok("const k = 'constructor'; return [][k];")).toBe(false);
    expect(ok("return ({})['con' + 'structor'];")).toBe(false);
    expect(ok('return ({})[`constructor`];')).toBe(false);
    expect(ok('const i = 0; const a = [1]; return a[i].toString();')).toBe(false);
  });
  it('spread attributes on registered components', () => {
    expect(ok('return <Card {...{ dangerouslySetInnerHTML: { __html: "x" } }} />;')).toBe(false);
  });
  it('dynamic import()', () => {
    expect(ok("return import('node:fs');")).toBe(false);
    expect(ok("import('x').then(() => null); return null;")).toBe(false);
    expect(ok("return import('data:text/javascript,export default 1');")).toBe(false);
  });
  it('async and generator functions', () => {
    expect(ok('const f = async () => 1; return f();')).toBe(false);
    expect(ok('function* g() { yield 1; } return g();')).toBe(false);
  });
  it('labeled statements', () => {
    expect(ok('loop: for (;;) { break loop; } return null;')).toBe(false);
  });
  it('a syntax error', () => {
    expect(ok('return <Card;')).toBe(false);
    expect(errs('return <Card;').join(' ')).toMatch(/syntax error/i);
  });
});

describe('validateWidgetSource — no false positives', () => {
  it('allows an object literal whose key is a forbidden name', () => {
    expect(ok("const o = { window: 1, fetch: 2 }; return <StatChip label=\"n\" value={o.window} />;")).toBe(true);
  });
  it('allows numeric array indexing', () => {
    expect(ok("const a = [1, 2, 3]; return <StatChip label=\"n\" value={a[0]} />;")).toBe(true);
  });
});
