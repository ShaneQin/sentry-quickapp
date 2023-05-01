import type { Scope } from '@sentry/core';
import { BaseClient, SDK_VERSION } from '@sentry/core';
import type {
  BrowserClientReplayOptions,
  ClientOptions,
  Event,
  EventHint,
  Options,
  Severity,
  SeverityLevel,
  UserFeedback,
} from '@sentry/types';
import { createClientReportEnvelope, dsnToString, getSDKSource, logger } from '@sentry/utils';

import { eventFromException, eventFromMessage } from '@sentry/browser';
import { WINDOW } from '@sentry/browser';
import type { Breadcrumbs } from '@sentry/browser';
import type { QuickAppTransportOptions } from './transports/types';
import { createUserFeedbackEnvelope } from '@sentry/browser';
const BREADCRUMB_INTEGRATION_ID = 'Breadcrumbs';
