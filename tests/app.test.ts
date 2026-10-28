import { test } from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createAppRouter } from '../src/app.js';
import { createServer } from '../src/server.js';

test('application serves about JSON, HEAD, and rejects unsupported methods', async t => {
  const server = createServer(createAppRouter());
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => new Promise<void>(resolve => server.close(() => resolve())));
  const address = server.address();
  assert.ok(address && typeof address !== 'string');
  const url = `http://127.0.0.1:${address.port}/about`;

  const response = await fetch(url, { signal: AbortSignal.timeout(2000) });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('content-type'), 'application/json; charset=utf-8');
  const body = await response.text();
  assert.deepEqual(JSON.parse(body), { name: 'ether-http', author: 'etherlyvan' });
  assert.equal(Number(response.headers.get('content-length')), Buffer.byteLength(body));

  const head = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(2000) });
  assert.equal(head.status, 200);
  assert.equal(head.headers.get('content-length'), response.headers.get('content-length'));
  assert.equal(await head.text(), '');

  const post = await fetch(url, { method: 'POST', signal: AbortSignal.timeout(2000) });
  assert.equal(post.status, 405);
  assert.equal(post.headers.get('allow'), 'GET, HEAD');
  await post.text();
});
