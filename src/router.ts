import type { Request } from './parser.js';
import type { Response } from './response.js';

export type Handler = (request: Request) => Response | Promise<Response>;

export class Router {
  private routes = new Map<string, Map<string, Handler>>();

  on(method: string, path: string, handler: Handler): this {
    const methods = this.routes.get(path) ?? new Map<string, Handler>();
    methods.set(method.toUpperCase(), handler);
    this.routes.set(path, methods);
    return this;
  }

  async dispatch(request: Request): Promise<Response> {
    const methods = this.routes.get(request.path);
    if (!methods) return { status: 404, body: 'Not Found\n' };
    const handler = methods.get(request.method) ?? (request.method === 'HEAD' ? methods.get('GET') : undefined);
    if (handler) return handler(request);
    const allow = new Set(methods.keys());
    if (allow.has('GET')) allow.add('HEAD');
    return { status: 405, headers: { allow: [...allow].join(', ') }, body: 'Method Not Allowed\n' };
  }
}
