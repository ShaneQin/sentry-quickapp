export * from './exports';

import { Integrations as CoreIntegrations } from '@sentry/core';

import { WINDOW } from '@sentry/browser';
import * as QuickAppIntegrations from './integrations';

let windowIntegrations = {};

if (WINDOW.Sentry && WINDOW.Sentry.Integrations) {
  windowIntegrations = WINDOW.Sentry.Integrations;
}

const INTEGRATIONS = {
  ...windowIntegrations,
  ...CoreIntegrations,
  ...QuickAppIntegrations
};

export { INTEGRATIONS as Integrations };

export {
  BrowserTracing,
  defaultRequestInstrumentationOptions,
  instrumentOutgoingRequests,
} from '@sentry-internal/tracing';
export type { RequestInstrumentationOptions } from '@sentry-internal/tracing';
export {
  addTracingExtensions,
  extractTraceparentData,
  getActiveTransaction,
  spanStatusfromHttpCode,
  trace,
} from '@sentry/core';
export type { SpanStatusType } from '@sentry/core';
export type { Span } from '@sentry/types';
