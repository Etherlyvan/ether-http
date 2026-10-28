export interface Response {
  status?: number;
  headers?: Record<string, string>;
  body?: string | Buffer;
}

const reasons: Record<number, string> = {
  200: 'OK', 400: 'Bad Request', 404: 'Not Found', 405: 'Method Not Allowed',
  408: 'Request Timeout', 413: 'Content Too Large', 415: 'Unsupported Media Type', 417: 'Expectation Failed',
  431: 'Request Header Fields Too Large', 500: 'Internal Server Error', 501: 'Not Implemented',
};

export function serializeResponse(response: Response, head = false): Buffer {
  const status = response.status ?? 200;
  if (!reasons[status]) throw new Error('Unsupported response status');
  const body = Buffer.from(response.body ?? '');
  const headers: Record<string, string> = Object.create(null);
  headers['content-type'] = 'text/plain; charset=utf-8';
  for (const [name, value] of Object.entries(response.headers ?? {})) {
    if (!/^[!#$%&'*+.^_`|~0-9A-Za-z-]+$/.test(name) || /[^\t\x20-\x7e\x80-\xff]/.test(value)) {
      throw new Error('Invalid response header');
    }
    if (name.toLowerCase() === 'transfer-encoding') {
      throw new Error('Transfer encoding is unsupported');
    }
    headers[name.toLowerCase()] = value;
  }
  headers['content-length'] = String(body.length);
  headers.connection = 'close';
  const prefix = `HTTP/1.1 ${status} ${reasons[status]}\r\n` +
    Object.entries(headers).map(([name, value]) => `${name}: ${value}\r\n`).join('') + '\r\n';
  return Buffer.concat([Buffer.from(prefix, 'latin1'), head ? Buffer.alloc(0) : body]);
}

export function json(value: unknown): Response {
  return { headers: { 'content-type': 'application/json; charset=utf-8' }, body: JSON.stringify(value) };
}
