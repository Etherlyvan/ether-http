import { Router } from './router.js';
import { json } from './response.js';

export function createAppRouter(): Router {
  return new Router()
    .on('GET', '/', () => ({ body: 'ether-http: HTTP over TCP\n' }))
    .on('GET', '/health', () => json({ status: 'ok' }))
    .on('GET', '/about', () => json({ name: 'ether-http', author: 'etherlyvan' }))
    .on('POST', '/echo', request => ({
      headers: { 'content-type': 'application/octet-stream' }, body: request.body,
    }));
}
