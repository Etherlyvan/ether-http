import { test } from 'node:test';
import assert from 'node:assert/strict';
import { connect } from 'node:net';
import { once } from 'node:events';
import { HttpError, MAX_HEADERS, parseRequest } from '../src/parser.js';
import { serializeResponse } from '../src/response.js';
import { Router } from '../src/router.js';
import { createServer } from '../src/server.js';

test('parser waits for complete headers and byte-length body', () => {
  assert.equal(parseRequest(Buffer.from('GET / HTTP/1.1\r\nHost: local')), null);
  const prefix = 'POST /echo?q=1 HTTP/1.1\r\nHost: local\r\nContent-Length: 2\r\n\r\n';
  assert.equal(parseRequest(Buffer.from(prefix + 'a')), null);
  const request = parseRequest(Buffer.from(prefix + 'é'))!;
  assert.equal(request.path, '/echo');
  assert.equal(request.body.toString(), 'é');
});

test('parser rejects ambiguous framing and unsupported requests', () => {
  for (const [headers, status] of [
    ['Host: x\r\nContent-Length: 1\r\nContent-Length: 1', 400],
    ['Host: x\r\nContent-Length: -1', 400],
    ['Host: x\r\nContent-Length: 1048577', 413],
    ['Host: x\r\nTransfer-Encoding: chunked', 501],
    ['Host: x\r\nExpect: 100-continue', 417],
    ['X-Test: value', 400],
    ['Host : x', 400],
  ] as const) {
    assert.throws(() => parseRequest(Buffer.from(`GET / HTTP/1.1\r\n${headers}\r\n\r\n`)),
      error => error instanceof HttpError && error.status === status);
  }
  assert.throws(() => parseRequest(Buffer.alloc(MAX_HEADERS + 1, 65)), { status: 431 });
});

test('response uses bytes, suppresses HEAD body, and rejects header injection', () => {
  const response = serializeResponse({ body: 'é' }).toString();
  assert.match(response, /content-length: 2\r\n/);
  assert.ok(serializeResponse({ body: 'é' }, true).toString().endsWith('\r\n\r\n'));
  assert.throws(() => serializeResponse({ headers: { x: 'a\r\nb: c' } }));
  assert.throws(() => serializeResponse({ headers: { 'Transfer-Encoding': 'chunked' } }));
  const framed = serializeResponse({ headers: { 'Content-Length': '999', Connection: 'keep-alive' }, body: 'ok' }).toString();
  assert.match(framed, /content-length: 2\r\n/);
  assert.match(framed, /connection: close\r\n/);
});

test('request line rejects control bytes and accepts HTTP method tokens', () => {
  for (const target of ['/bad\x00path', '/bad\x7fpath', '/bad#fragment', '/bad\tpath']) {
    assert.throws(() => parseRequest(Buffer.from(`GET ${target} HTTP/1.1\r\nHost: x\r\n\r\n`)), { status: 400 });
  }
  const request = parseRequest(Buffer.from('CUSTOM-METHOD / HTTP/1.1\r\nHost: x\r\nX-Test: a\tb\t \r\n\r\n'))!;
  assert.equal(request.method, 'CUSTOM-METHOD');
  assert.equal(request.headers['x-test'], 'a\tb');
  assert.throws(() => parseRequest(Buffer.from('GET / HTTP/1.1\r\nHost: x\r\nContent-Length: \xa01\xa0\r\n\r\na', 'latin1')), { status: 400 });
});

test('TCP server handles fragmented bodies, routing, HEAD, and handler errors', async t => {
  const router = new Router()
    .on('GET', '/', () => ({ body: 'hello' }))
    .on('POST', '/echo', request => ({ body: request.body }))
    .on('GET', '/bad-response', () => ({ headers: { 'Transfer-Encoding': 'chunked' }, body: 'hello' }))
    .on('GET', '/error', () => { throw new Error('private detail'); });
  const server = createServer(router);
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => new Promise<void>(resolve => { server.close(() => resolve()); }));
  const address = server.address();
  assert.ok(address && typeof address !== 'string');
  const port = address.port;
  async function exchange(chunks: string[]) {
    const socket = connect(port, '127.0.0.1');
    socket.setTimeout(2000, () => socket.destroy(new Error('Test timed out')));
    const result: Buffer[] = [];
    socket.on('data', chunk => result.push(chunk));
    const done = once(socket, 'close');
    await once(socket, 'connect');
    for (const chunk of chunks) {
      socket.write(chunk);
      await new Promise(resolve => setTimeout(resolve, 5));
    }
    socket.end();
    await done;
    return Buffer.concat(result).toString();
  }
  assert.ok((await exchange(['POST /echo HTTP/1.1\r\nHost: x\r\nContent-Length: 5\r\n\r\nhe', 'llo'])).endsWith('hello'));
  assert.match(await exchange(['GET /missing HTTP/1.1\r\nHost: x\r\n\r\n']), /^HTTP\/1.1 404/);
  assert.match(await exchange(['POST / HTTP/1.1\r\nHost: x\r\n\r\n']), /allow: GET, HEAD/);
  assert.ok((await exchange(['HEAD / HTTP/1.1\r\nHost: x\r\n\r\n'])).endsWith('\r\n\r\n'));
  const failed = await exchange(['GET /error HTTP/1.1\r\nHost: x\r\n\r\n']);
  assert.match(failed, /^HTTP\/1.1 500/);
  assert.ok(!failed.includes('private detail'));
  assert.match(await exchange(['GET /bad-response HTTP/1.1\r\nHost: x\r\n\r\n']), /^HTTP\/1.1 500/);
  assert.match(await exchange(['GET / HTTP/1.1\r\nHost: x\r\nContent-Length: -1\r\n\r\n']), /^HTTP\/1.1 400/);
  assert.ok((await exchange(['GET / HTTP/1.1\r\nHost: x\r\n\r\nGET /error HTTP/1.1\r\nHost: x\r\n\r\n'])).endsWith('hello'));
  assert.match(await exchange(['GET / HTTP/1.1\r\n']), /^HTTP\/1.1 400/);
});
