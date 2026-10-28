import { createServer as createTcpServer } from 'node:net';
import { HttpError, MAX_BODY, MAX_HEADERS, parseRequest } from './parser.js';
import { serializeResponse } from './response.js';
import { Router } from './router.js';

export function createServer(router: Router) {
  return createTcpServer({ allowHalfOpen: true }, socket => {
    let buffer = Buffer.alloc(0);
    let handled = false;
    socket.setTimeout(10_000);
    const fail = (status: number, message: string) => {
      if (handled) return;
      handled = true;
      socket.end(serializeResponse({ status, body: `${message}\n` }));
    };
    socket.on('error', () => { socket.destroy(); });
    socket.on('timeout', () => {
      if (handled) socket.destroy();
      else fail(408, 'Request Timeout');
    });
    socket.on('end', () => { if (!handled) fail(400, 'Incomplete request'); });
    socket.on('data', async chunk => {
      if (handled) return;
      if (buffer.length + chunk.length > MAX_HEADERS + MAX_BODY) {
        fail(413, 'Request too large');
        return;
      }
      buffer = Buffer.concat([buffer, chunk]);
      try {
        const request = parseRequest(buffer);
        if (!request) return;
        handled = true;
        buffer = Buffer.alloc(0);
        try {
          const response = await router.dispatch(request);
          socket.end(serializeResponse(response, request.method === 'HEAD'));
        } catch {
          socket.end(serializeResponse({ status: 500, body: 'Internal Server Error\n' }, request.method === 'HEAD'));
        }
      } catch (error) {
        fail(error instanceof HttpError ? error.status : 500,
          error instanceof HttpError ? error.message : 'Internal Server Error');
      }
    });
  });
}
