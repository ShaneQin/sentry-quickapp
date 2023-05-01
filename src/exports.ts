export type {
  Breadcrumb,
  BreadcrumbHint,
  Request,
  SdkInfo,
  Event,
  EventHint,
  Exception,
  // eslint-disable-next-line deprecation/deprecation
  Severity,
  SeverityLevel,
  StackFrame,
  Stacktrace,
  Thread,
  Transaction,
  User,
  Session,
} from '@sentry/types';

export type { QuickAppOptions } from './client';

export {
  addGlobalEventProcessor,
  addBreadcrumb,
  captureException,
  captureEvent,
  captureMessage,
  configureScope,
  createTransport,
  getHubFromCarrier,
  getCurrentHub,
  Hub,
  makeMain,
  Scope,
  startTransaction,
  SDK_VERSION,
  setContext,
  setExtra,
  setExtras,
  setTag,
  setTags,
  setUser,
  withScope,
  FunctionToString,
  InboundFilters,
} from '@sentry/core';

export { WINDOW } from '@sentry/browser';
export { QuickAppClient } from './client';
export { makeFetchTransport } from './transports';
export {
  defaultStackParser,
  defaultStackLineParsers,
  chromeStackLineParser,
  geckoStackLineParser,
  opera10StackLineParser,
  opera11StackLineParser,
  winjsStackLineParser,
} from '@sentry/browser';
export { eventFromException, eventFromMessage } from '@sentry/browser';
export { createUserFeedbackEnvelope } from '@sentry/browser';
export {
  defaultIntegrations,
  forceLoad,
  init,
  lastEventId,
  onLoad,
  flush,
  close,
  wrap,
  captureUserFeedback,
} from './sdk';
export { GlobalHandlers, TryCatch, Breadcrumbs, LinkedErrors, HttpContext, Dedupe } from '@sentry/browser';
