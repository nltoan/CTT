import {describe, expect, it, beforeEach} from 'vitest';

import {
  DEFAULT_PUBLIC_RATE_LIMIT,
  enforceRateLimit,
  resetRateLimitStore
} from '@lib/rate-limit';

function createRequest(ip: string) {
  return new Request('https://example.com/api', {
    headers: {
      'x-forwarded-for': ip
    }
  });
}

describe('enforceRateLimit', () => {
  beforeEach(() => {
    resetRateLimitStore();
  });

  it('allows requests within the configured limit', () => {
    const options = {...DEFAULT_PUBLIC_RATE_LIMIT, limit: 3, identifier: 'test-allow'};
    const request = createRequest('203.0.113.5');

    const result = enforceRateLimit(request, options);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.headers['X-RateLimit-Limit']).toBe('3');
      expect(result.headers['X-RateLimit-Remaining']).toBe('2');
      expect(result.headers['X-RateLimit-Reset']).toBeDefined();
    }
  });

  it('blocks requests that exceed the limit window', () => {
    const options = {...DEFAULT_PUBLIC_RATE_LIMIT, limit: 2, identifier: 'test-block'};
    const request = createRequest('198.51.100.9');

    const first = enforceRateLimit(request, options);
    const second = enforceRateLimit(request, options);
    const third = enforceRateLimit(request, options);

    expect(first.ok).toBe(true);
    expect(second.ok).toBe(true);
    expect(third.ok).toBe(false);

    if (!third.ok) {
      expect(third.retryAfter).toBeGreaterThanOrEqual(1);
      expect(third.headers['Retry-After']).toBeDefined();
      expect(third.headers['X-RateLimit-Remaining']).toBe('0');
    }
  });
});
