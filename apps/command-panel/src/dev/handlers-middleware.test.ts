import { describe, it, expect } from 'vitest';
import { Readable } from 'node:stream';
import type { IncomingMessage } from 'node:http';
import { toWebRequest } from './handlers-middleware';

function fakeReq(method: string, url: string, body?: string): IncomingMessage {
  const stream = Readable.from(body ? [Buffer.from(body)] : []) as unknown as IncomingMessage;
  stream.method = method;
  stream.url = url;
  stream.headers = { 'content-type': 'application/json' };
  return stream;
}

describe('toWebRequest', () => {
  it('converts a Node POST request (method, url, JSON body) to a web Request', async () => {
    const web = await toWebRequest(fakeReq('POST', '/api/data', JSON.stringify({ id: 'x' })));
    expect(web.method).toBe('POST');
    expect(new URL(web.url).pathname).toBe('/api/data');
    expect(await web.json()).toEqual({ id: 'x' });
  });

  it('omits the body for GET', async () => {
    const web = await toWebRequest(fakeReq('GET', '/api/data'));
    expect(web.method).toBe('GET');
    expect(web.body).toBeNull();
  });
});
