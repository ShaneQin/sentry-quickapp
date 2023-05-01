import {
  getCurrentHub,
  getIntegrationsToSetup,
  initAndBind,
  Integrations as CoreIntegrations,
} from '@sentry/core';
import type { UserFeedback } from '@sentry/types';
import {
  logger,
  resolvedSyncPromise,
  stackParserFromStackParserOptions,
} from '@sentry/utils';

import type { QuickAppClientOptions, QuickAppOptions } from './client';
import { QuickAppClient } from './client';
import { WINDOW, wrap as internalWrap } from '@sentry/browser';
import { Breadcrumbs, Dedupe, GlobalHandlers, HttpContext, LinkedErrors, TryCatch } from './integrations';
import { QuickAppInfo } from './integrations';
import { defaultStackParser } from '@sentry/browser';
import { makeFetchTransport } from './transports';

export const defaultIntegrations = [
  new CoreIntegrations.InboundFilters(),
  new CoreIntegrations.FunctionToString(),
  new TryCatch(),
  new Breadcrumbs(),
  new GlobalHandlers(),
  new LinkedErrors(),
  new Dedupe(),
  new HttpContext(),
  new QuickAppInfo()
];

declare const __SENTRY_RELEASE__: string | undefined;

export function init(options: QuickAppOptions = {}): void {
  if (options.defaultIntegrations === undefined) {
    options.defaultIntegrations = defaultIntegrations;
  }
  if (options.release === undefined) {
    // This allows build tooling to find-and-replace __SENTRY_RELEASE__ to inject a release value
    if (typeof __SENTRY_RELEASE__ === 'string') {
      options.release = __SENTRY_RELEASE__;
    }

    // This supports the variable that sentry-webpack-plugin injects
    if (WINDOW.SENTRY_RELEASE && WINDOW.SENTRY_RELEASE.id) {
      options.release = WINDOW.SENTRY_RELEASE.id;
    }
  }
  if (options.autoSessionTracking === undefined) {
    options.autoSessionTracking = true;
  }
  if (options.sendClientReports === undefined) {
    options.sendClientReports = true;
  }

  const clientOptions: QuickAppClientOptions = {
    ...options,
    stackParser: stackParserFromStackParserOptions(options.stackParser || defaultStackParser),
    integrations: getIntegrationsToSetup(options),
    transport: options.transport || makeFetchTransport,
  };

  initAndBind(QuickAppClient, clientOptions);
}

/**
 * This is the getter for lastEventId.
 *
 * @returns The last event id of a captured event.
 */
export function lastEventId(): string | undefined {
  return getCurrentHub().lastEventId();
}

/**
 * This function is here to be API compatible with the loader.
 * @hidden
 */
export function forceLoad(): void {
  // Noop
}

/**
 * This function is here to be API compatible with the loader.
 * @hidden
 */
export function onLoad(callback: () => void): void {
  callback();
}

/**
 * Call `flush()` on the current client, if there is one. See {@link Client.flush}.
 *
 * @param timeout Maximum time in ms the client should wait to flush its event queue. Omitting this parameter will cause
 * the client to wait until all events are sent before resolving the promise.
 * @returns A promise which resolves to `true` if the queue successfully drains before the timeout, or `false` if it
 * doesn't (or if there's no client defined).
 */
export function flush(timeout?: number): PromiseLike<boolean> {
  const client = getCurrentHub().getClient<QuickAppClient>();
  if (client) {
    return client.flush(timeout);
  }
  __DEBUG_BUILD__ && logger.warn('Cannot flush events. No client defined.');
  return resolvedSyncPromise(false);
}

/**
 * Call `close()` on the current client, if there is one. See {@link Client.close}.
 *
 * @param timeout Maximum time in ms the client should wait to flush its event queue before shutting down. Omitting this
 * parameter will cause the client to wait until all events are sent before disabling itself.
 * @returns A promise which resolves to `true` if the queue successfully drains before the timeout, or `false` if it
 * doesn't (or if there's no client defined).
 */
export function close(timeout?: number): PromiseLike<boolean> {
  const client = getCurrentHub().getClient<QuickAppClient>();
  if (client) {
    return client.close(timeout);
  }
  __DEBUG_BUILD__ && logger.warn('Cannot flush events and disable SDK. No client defined.');
  return resolvedSyncPromise(false);
}

/**
 * Wrap code within a try/catch block so the SDK is able to capture errors.
 *
 * @param fn A function to wrap.
 *
 * @returns The result of wrapped function call.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function wrap(fn: (...args: any) => any): any {
  return internalWrap(fn)();
}

/**
 * Captures user feedback and sends it to Sentry.
 */
export function captureUserFeedback(feedback: UserFeedback): void {
  const client = getCurrentHub().getClient<QuickAppClient>();
  if (client) {
    client.captureUserFeedback(feedback);
  }
}