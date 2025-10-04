import {createHash} from 'node:crypto';

import {NextResponse} from 'next/server';

export function jsonResponseWithCache({
  request,
  body,
  status = 200,
  ttl = 60,
  headers,
  cacheTags
}: {
  request: Request;
  body: unknown;
  status?: number;
  ttl?: number;
  headers?: Record<string, string>;
  cacheTags?: string[];
}) {
  const payload = JSON.stringify(body);
  const etag = `"${createHash('sha1').update(payload).digest('base64')}"`;
  const ifNoneMatch = request.headers.get('if-none-match');

  const baseHeaders = new Headers({
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': `public, max-age=${ttl}, s-maxage=${ttl}`,
    ETag: etag
  });

  if (headers) {
    for (const [key, value] of Object.entries(headers)) {
      if (typeof value === 'string') {
        baseHeaders.set(key, value);
      }
    }
  }

  if (cacheTags?.length) {
    baseHeaders.set('Cache-Tag', cacheTags.join(','));
  }

  if (status === 200 && ifNoneMatch && ifNoneMatch === etag) {
    return new NextResponse(null, {
      status: 304,
      headers: baseHeaders
    });
  }

  return new NextResponse(payload, {
    status,
    headers: baseHeaders
  });
}

export function textResponseWithCache({
  request,
  body,
  status = 200,
  ttl = 60,
  contentType = 'text/plain; charset=utf-8',
  headers,
  cacheTags
}: {
  request: Request;
  body: string;
  status?: number;
  ttl?: number;
  contentType?: string;
  headers?: Record<string, string>;
  cacheTags?: string[];
}) {
  const etag = `"${createHash('sha1').update(body).digest('base64')}"`;
  const ifNoneMatch = request.headers.get('if-none-match');

  const baseHeaders = new Headers({
    'Content-Type': contentType,
    'Cache-Control': `public, max-age=${ttl}, s-maxage=${ttl}`,
    ETag: etag
  });

  if (headers) {
    for (const [key, value] of Object.entries(headers)) {
      if (typeof value === 'string') {
        baseHeaders.set(key, value);
      }
    }
  }

  if (cacheTags?.length) {
    baseHeaders.set('Cache-Tag', cacheTags.join(','));
  }

  if (status === 200 && ifNoneMatch && ifNoneMatch === etag) {
    return new NextResponse(null, {
      status: 304,
      headers: baseHeaders
    });
  }

  return new NextResponse(body, {
    status,
    headers: baseHeaders
  });
}
