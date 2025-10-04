import * as Sentry from '@sentry/nextjs';

import {buildSentryOptions} from './src/lib/monitoring/sentry';

const options = buildSentryOptions('browser');

if (options) {
  const integrations: NonNullable<Parameters<typeof Sentry.init>[0]['integrations']> = [];

  if (typeof Sentry.browserTracingIntegration === 'function') {
    integrations.push(Sentry.browserTracingIntegration());
  }

  if (typeof Sentry.replayIntegration === 'function') {
    integrations.push(Sentry.replayIntegration());
  }

  Sentry.init({
    ...options,
    integrations
  });
}
