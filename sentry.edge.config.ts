import * as Sentry from '@sentry/nextjs';

import {buildSentryOptions} from './src/lib/monitoring/sentry';

const options = buildSentryOptions('edge');

if (options) {
  Sentry.init({
    ...options
  });
}
