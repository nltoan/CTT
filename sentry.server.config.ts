import * as Sentry from '@sentry/nextjs';

import {buildSentryOptions} from './src/lib/monitoring/sentry';

const options = buildSentryOptions('server');

if (options) {
  Sentry.init({
    ...options
  });
}
