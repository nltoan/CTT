const PLATFORM_DSN_KEYS = {
  browser: ['NEXT_PUBLIC_SENTRY_DSN', 'SENTRY_DSN'],
  server: ['SENTRY_DSN'],
  edge: ['SENTRY_EDGE_DSN', 'SENTRY_DSN']
} as const;

type Platform = keyof typeof PLATFORM_DSN_KEYS;

type Nullable<T> = T | null;

const PLATFORM_ENABLED_KEYS: Record<Platform, string[]> = {
  browser: ['NEXT_PUBLIC_SENTRY_ENABLED', 'SENTRY_ENABLED'],
  server: ['SENTRY_ENABLED'],
  edge: ['SENTRY_EDGE_ENABLED', 'SENTRY_ENABLED']
};

const TRACE_RATE_KEYS: Record<Platform, string[]> = {
  browser: ['NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE', 'SENTRY_TRACES_SAMPLE_RATE'],
  server: ['SENTRY_TRACES_SAMPLE_RATE'],
  edge: ['SENTRY_TRACES_SAMPLE_RATE']
};

const REPLAYS_SESSION_KEYS = ['NEXT_PUBLIC_SENTRY_REPLAYS_SESSION_SAMPLE_RATE'];
const REPLAYS_ERROR_KEYS = ['NEXT_PUBLIC_SENTRY_REPLAYS_ERROR_SAMPLE_RATE'];

const DEFAULT_TRACES_SAMPLE_RATE = process.env.NODE_ENV === 'production' ? 0.2 : 0;
const DEFAULT_REPLAYS_SESSION_SAMPLE_RATE = 0;
const DEFAULT_REPLAYS_ERROR_SAMPLE_RATE = 1;

function getFirstPresent(keys: string[]): string | undefined {
  for (const key of keys) {
    const value = process.env[key];
    if (value && value.length > 0) {
      return value;
    }
  }
  return undefined;
}

function parseSampleRate(raw: string | undefined, fallback: number): number {
  if (!raw) {
    return fallback;
  }
  const value = Number(raw);
  if (Number.isFinite(value) && value >= 0 && value <= 1) {
    return value;
  }
  return fallback;
}

function parseEnabled(raw: string | undefined, fallback: boolean): boolean {
  if (!raw) {
    return fallback;
  }
  const normalized = raw.toLowerCase();
  if (['true', '1', 'yes', 'on'].includes(normalized)) {
    return true;
  }
  if (['false', '0', 'no', 'off'].includes(normalized)) {
    return false;
  }
  return fallback;
}

export interface SentryInitOptions {
  dsn: string;
  environment?: string;
  release?: string;
  tracesSampleRate?: number;
  replaysSessionSampleRate?: number;
  replaysOnErrorSampleRate?: number;
  enabled?: boolean;
}

function resolveEnvironment() {
  return (
    process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ??
    process.env.SENTRY_ENVIRONMENT ??
    process.env.NODE_ENV ??
    'development'
  );
}

function resolveRelease() {
  return process.env.SENTRY_RELEASE ?? process.env.VERCEL_GIT_COMMIT_SHA;
}

export function buildSentryOptions(platform: Platform): Nullable<SentryInitOptions> {
  const dsn = getFirstPresent(PLATFORM_DSN_KEYS[platform]);
  if (!dsn) {
    return null;
  }

  const enabled = parseEnabled(
    getFirstPresent(PLATFORM_ENABLED_KEYS[platform]),
    process.env.NODE_ENV === 'production'
  );

  const tracesSampleRate = parseSampleRate(
    getFirstPresent(TRACE_RATE_KEYS[platform]),
    DEFAULT_TRACES_SAMPLE_RATE
  );

  const baseOptions: SentryInitOptions = {
    dsn,
    enabled,
    environment: resolveEnvironment(),
    release: resolveRelease(),
    tracesSampleRate
  };

  if (platform === 'browser') {
    baseOptions.replaysSessionSampleRate = parseSampleRate(
      getFirstPresent(REPLAYS_SESSION_KEYS),
      DEFAULT_REPLAYS_SESSION_SAMPLE_RATE
    );
    baseOptions.replaysOnErrorSampleRate = parseSampleRate(
      getFirstPresent(REPLAYS_ERROR_KEYS),
      DEFAULT_REPLAYS_ERROR_SAMPLE_RATE
    );
  }

  return baseOptions;
}

export function isSentryEnabled(platform: Platform): boolean {
  const options = buildSentryOptions(platform);
  return Boolean(options?.enabled && options?.dsn);
}

export type { Platform as SentryPlatform };
