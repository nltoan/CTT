import {afterEach, describe, expect, it, vi} from 'vitest';

import {buildSentryOptions, isSentryEnabled} from '../monitoring/sentry';

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('buildSentryOptions', () => {
  it('returns null when DSN is missing', () => {
    vi.stubEnv('SENTRY_DSN', '');
    const result = buildSentryOptions('server');
    expect(result).toBeNull();
  });

  it('parses numeric sample rates safely', () => {
    vi.stubEnv('SENTRY_DSN', 'https://example.ingest.sentry.io/123');
    vi.stubEnv('SENTRY_TRACES_SAMPLE_RATE', '0.75');
    vi.stubEnv('SENTRY_ENVIRONMENT', 'staging');
    const result = buildSentryOptions('server');
    expect(result).toMatchObject({
      dsn: 'https://example.ingest.sentry.io/123',
      environment: 'staging',
      tracesSampleRate: 0.75,
      enabled: false
    });
  });

  it('falls back to defaults when sample rate is invalid', () => {
    vi.stubEnv('SENTRY_DSN', 'https://example');
    vi.stubEnv('SENTRY_TRACES_SAMPLE_RATE', 'not-a-number');
    const result = buildSentryOptions('server');
    expect(result?.tracesSampleRate).toBe(process.env.NODE_ENV === 'production' ? 0.2 : 0);
  });

  it('includes replay rates for browser platform', () => {
    vi.stubEnv('NEXT_PUBLIC_SENTRY_DSN', 'https://browser');
    vi.stubEnv('NEXT_PUBLIC_SENTRY_REPLAYS_SESSION_SAMPLE_RATE', '0.5');
    vi.stubEnv('NEXT_PUBLIC_SENTRY_REPLAYS_ERROR_SAMPLE_RATE', '0.8');
    const result = buildSentryOptions('browser');
    expect(result).toMatchObject({
      dsn: 'https://browser',
      replaysSessionSampleRate: 0.5,
      replaysOnErrorSampleRate: 0.8
    });
  });
});

describe('isSentryEnabled', () => {
  it('is false without DSN', () => {
    const enabled = isSentryEnabled('server');
    expect(enabled).toBe(false);
  });

  it('respects explicit enable flag', () => {
    vi.stubEnv('SENTRY_DSN', 'https://server');
    vi.stubEnv('SENTRY_ENABLED', 'false');
    expect(isSentryEnabled('server')).toBe(false);
    vi.stubEnv('SENTRY_ENABLED', 'true');
    expect(isSentryEnabled('server')).toBe(true);
  });

  it('defaults to production-only when flag missing', () => {
    vi.stubEnv('SENTRY_DSN', 'https://server');
    const enabled = isSentryEnabled('server');
    expect(enabled).toBe(process.env.NODE_ENV === 'production');
  });

  it('honours browser specific env vars', () => {
    vi.stubEnv('NEXT_PUBLIC_SENTRY_DSN', 'https://browser');
    vi.stubEnv('NEXT_PUBLIC_SENTRY_ENABLED', 'true');
    expect(isSentryEnabled('browser')).toBe(true);
  });
});
