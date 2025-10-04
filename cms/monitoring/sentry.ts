import type {Application, ErrorRequestHandler} from 'express';
import * as Sentry from '@sentry/node';

import {buildSentryOptions} from '../../src/lib/monitoring/sentry';

let initialized = false;
let handlersAttached = false;

function ensureSentry() {
  if (initialized) {
    return true;
  }

  const options = buildSentryOptions('server');
  if (!options) {
    return false;
  }

  Sentry.init({
    ...options,
    autoSessionTracking: false
  });

  initialized = true;
  return true;
}

export function registerCmsMonitoring(app: Application) {
  if (handlersAttached || !ensureSentry()) {
    return false;
  }

  const requestHandler = Sentry.Handlers.requestHandler();
  const tracingHandler =
    typeof Sentry.Handlers.tracingHandler === 'function'
      ? Sentry.Handlers.tracingHandler()
      : null;
  const errorHandler = Sentry.Handlers.errorHandler() as ErrorRequestHandler;

  app.use(requestHandler);
  if (tracingHandler) {
    app.use(tracingHandler);
  }
  app.use(errorHandler);

  handlersAttached = true;
  return true;
}
