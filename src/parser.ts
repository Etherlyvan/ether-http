export class HttpError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

export interface Request {
  method: string;
  target: string;
  path: string;
  headers: Record<string, string>;
  body: Buffer;
}

export const MAX_HEADERS = 16 * 1024;
export const MAX_BODY = 1024 * 1024;

// TCP chunks do not correspond to HTTP messages. null means more bytes are needed.
export function parseRequest(data: Buffer): Request | null {
  const end = data.indexOf('\r\n\r\n');
  if (end === -1) {
    if (data.length > MAX_HEADERS) throw new HttpError(431, 'Headers too large');
    return null;
  }
  if (end + 4 > MAX_HEADERS) throw new HttpError(431, 'Headers too large');
  const [line, ...lines] = data.subarray(0, end).toString('latin1').split('\r\n');
  const match = /^([!#$%&'*+.^_`|~0-9A-Za-z-]+) (\/[\x21-\x7e]*) HTTP\/1\.1$/.exec(line);
  if (!match || match[2].includes('#')) throw new HttpError(400, 'Invalid request line');
  const headers: Record<string, string> = Object.create(null);
  for (const header of lines) {
    const field = /^([!#$%&'*+.^_`|~0-9A-Za-z-]+):[\t ]*([^\r\n]*)$/.exec(header);
    if (!field || /[\x00-\x08\x0a-\x1f\x7f]/.test(field[2])) throw new HttpError(400, 'Invalid header');
    const name = field[1].toLowerCase();
    if (name in headers) throw new HttpError(400, 'Duplicate header');
    headers[name] = field[2].replace(/^[\t ]+|[\t ]+$/g, '');
  }
  if (!headers.host) throw new HttpError(400, 'Host is required');
  if ('transfer-encoding' in headers) throw new HttpError(501, 'Transfer encoding is unsupported');
  if ('expect' in headers) throw new HttpError(417, 'Expect is unsupported');
  const lengthText = headers['content-length'] ?? '0';
  if (!/^\d+$/.test(lengthText)) throw new HttpError(400, 'Invalid content length');
  const length = Number(lengthText);
  if (!Number.isSafeInteger(length) || length > MAX_BODY) throw new HttpError(413, 'Body too large');
  if (data.length < end + 4 + length) return null;
  return {
    method: match[1], target: match[2], path: match[2].split('?')[0], headers,
    body: data.subarray(end + 4, end + 4 + length),
  };
}
