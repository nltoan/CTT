import {NextResponse} from 'next/server';

type RateLimitEntry = {
  count: number;
  expiresAt: number;
};

type RateLimitStore = Map<string, RateLimitEntry>;

type GlobalWithRateLimit = typeof globalThis & {
  __CTT_RATE_LIMIT_STORE__?: RateLimitStore;
};

function getStore(): RateLimitStore {
  const globalObject = globalThis as GlobalWithRateLimit;

  if (!globalObject.__CTT_RATE_LIMIT_STORE__) {
    globalObject.__CTT_RATE_LIMIT_STORE__ = new Map();
  }

  return globalObject.__CTT_RATE_LIMIT_STORE__!;
}

export type RateLimitOptions = {
  limit: number;
  windowMs: number;
  prefix?: string;
  identifier?: string;
};

export type RateLimitSuccess = {
  ok: true;
  headers: Record<string, string>;
  limit: number;
  remaining: number;
  resetAt: number;
};

export type RateLimitExceeded = {
  ok: false;
  headers: Record<string, string>;
  retryAfter: number;
  limit: number;
};

export type RateLimitResult = RateLimitSuccess | RateLimitExceeded;

export const DEFAULT_PUBLIC_RATE_LIMIT: RateLimitOptions = {
  limit: 120,
  windowMs: 60_000,
  prefix: 'public-api'
};

export const DEFAULT_FORM_RATE_LIMIT: RateLimitOptions = {
  limit: 5,
  windowMs: 5 * 60_000,
  prefix: 'form-submission'
};

export function extractClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const [first] = forwarded.split(',');
    if (first) {
      return first.trim();
    }
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }

  return '127.0.0.1';
}

export function enforceRateLimit(
  request: Request,
  options: RateLimitOptions
): RateLimitResult {
  const store = getStore();
  const now = Date.now();
  const keyParts = [options.prefix ?? 'rate-limit'];

  if (options.identifier) {
    keyParts.push(options.identifier);
  }

  keyParts.push(extractClientIp(request));

  const key = keyParts.join(':');
  const existing = store.get(key);

  if (!existing || existing.expiresAt <= now) {
    const entry: RateLimitEntry = {
      count: 1,
      expiresAt: now + options.windowMs
    };
    store.set(key, entry);

    const remaining = Math.max(0, options.limit - 1);
    return {
      ok: true,
      headers: buildHeaders({
        limit: options.limit,
        remaining,
        resetAt: entry.expiresAt
      }),
      limit: options.limit,
      remaining,
      resetAt: entry.expiresAt
    };
  }

  existing.count += 1;
  store.set(key, existing);

  const consumed = Math.min(existing.count, options.limit);
  const remaining = Math.max(0, options.limit - consumed);
  const resetAt = existing.expiresAt;

  if (existing.count > options.limit) {
    const retryAfter = Math.max(1, Math.ceil((resetAt - now) / 1000));
    return {
      ok: false,
      headers: buildHeaders({
        limit: options.limit,
        remaining: 0,
        resetAt,
        retryAfter
      }),
      retryAfter,
      limit: options.limit
    };
  }

  return {
    ok: true,
    headers: buildHeaders({
      limit: options.limit,
      remaining,
      resetAt
    }),
    limit: options.limit,
    remaining,
    resetAt
  };
}

function buildHeaders({
  limit,
  remaining,
  resetAt,
  retryAfter
}: {
  limit: number;
  remaining: number;
  resetAt: number;
  retryAfter?: number;
}) {
  const headers: Record<string, string> = {
    'X-RateLimit-Limit': String(limit),
    'X-RateLimit-Remaining': String(Math.max(0, remaining)),
    'X-RateLimit-Reset': String(Math.ceil(resetAt / 1000))
  };

  if (retryAfter !== undefined) {
    headers['Retry-After'] = String(retryAfter);
  }

  return headers;
}

export function tooManyRequestsResponse(
  result: RateLimitExceeded,
  message: string = 'Too many requests'
) {
  return NextResponse.json(
    {error: message, retryAfter: result.retryAfter},
    {
      status: 429,
      headers: result.headers
    }
  );
}

export function resetRateLimitStore() {
  getStore().clear();
}
