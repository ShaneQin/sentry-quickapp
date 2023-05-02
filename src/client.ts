import type { Scope } from '@sentry/core';
import { BaseClient, SDK_VERSION } from '@sentry/core';
import type {
  ClientOptions,
  Event,
  EventHint,
  Options,
  Severity,
  SeverityLevel,
  UserFeedback,
} from '@sentry/types';
import { getSDKSource, logger, isError, isPlainObject } from '@sentry/utils';

import { eventFromException, eventFromMessage } from '@sentry/browser';
import { eventFromQuickAppError } from './eventbuilder';
import { WINDOW } from '@sentry/browser';
import type { Breadcrumbs } from '@sentry/browser';
import type { QuickAppTransportOptions } from './transports/types';
import { createUserFeedbackEnvelope } from '@sentry/browser';
const BREADCRUMB_INTEGRATION_ID = 'Breadcrumbs';

export type QuickAppOptions = Options<QuickAppTransportOptions>;

export type QuickAppClientOptions = ClientOptions<QuickAppTransportOptions>;

export class QuickAppClient extends BaseClient<QuickAppClientOptions> {
  public constructor(options: QuickAppClientOptions) {
    const sdkSource = WINDOW.SENTRY_SDK_SOURCE || getSDKSource();

    options._metadata = options._metadata || {};
    options._metadata.sdk = options._metadata.sdk || {
      name: 'sentry.javascript.quickapp',
      packages: [
        {
          name: `sentry-quickapp`,
          version: SDK_VERSION,
        },
      ],
      version: SDK_VERSION,
    };

    super(options);
  }

  /**
   * @inheritDoc
   */
  public eventFromException(exception: unknown, hint?: EventHint): PromiseLike<Event> {
    if (isPlainObject(exception) && exception.message && exception.stack && !isError(exception)) {
      return eventFromQuickAppError(this._options.stackParser, exception, hint);
    }
    return eventFromException(this._options.stackParser, exception, hint, this._options.attachStacktrace);
  }

  /**
   * @inheritDoc
   */
  public eventFromMessage(
    message: string,
    // eslint-disable-next-line deprecation/deprecation
    level: Severity | SeverityLevel = 'info',
    hint?: EventHint,
  ): PromiseLike<Event> {
    return eventFromMessage(this._options.stackParser, message, level, hint, this._options.attachStacktrace);
  }

  /**
   * @inheritDoc
   */
  public sendEvent(event: Event, hint?: EventHint): void {
    // We only want to add the sentry event breadcrumb when the user has the breadcrumb integration installed and
    // activated its `sentry` option.
    // We also do not want to use the `Breadcrumbs` class here directly, because we do not want it to be included in
    // bundles, if it is not used by the SDK.
    // This all sadly is a bit ugly, but we currently don't have a "pre-send" hook on the integrations so we do it this
    // way for now.
    const breadcrumbIntegration = this.getIntegrationById(BREADCRUMB_INTEGRATION_ID) as Breadcrumbs | undefined;
    // We check for definedness of `addSentryBreadcrumb` in case users provided their own integration with id
    // "Breadcrumbs" that does not have this function.
    if (breadcrumbIntegration && breadcrumbIntegration.addSentryBreadcrumb) {
      breadcrumbIntegration.addSentryBreadcrumb(event);
    }

    super.sendEvent(event, hint);
  }

  /**
   * Sends user feedback to Sentry.
   */
  public captureUserFeedback(feedback: UserFeedback): void {
    if (!this._isEnabled()) {
      __DEBUG_BUILD__ && logger.warn('SDK not enabled, will not capture user feedback.');
      return;
    }

    const envelope = createUserFeedbackEnvelope(feedback, {
      metadata: this.getSdkMetadata(),
      dsn: this.getDsn(),
      tunnel: this.getOptions().tunnel,
    });
    void this._sendEnvelope(envelope);
  }

  /**
   * @inheritDoc
   */
  protected _prepareEvent(event: Event, hint: EventHint, scope?: Scope): PromiseLike<Event | null> {
    event.platform = event.platform || 'javascript';
    return super._prepareEvent(event, hint, scope);
  }
}

