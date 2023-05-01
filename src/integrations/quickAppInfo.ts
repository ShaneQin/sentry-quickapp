import { getCurrentHub, addGlobalEventProcessor } from '@sentry/core';
import type { Event, Integration} from '@sentry/types';

export class QuickAppInfo implements Integration {
  public static id: string = 'Quick App Info';

  public name: string = QuickAppInfo.id;

  public setupOnce(): void {
    addGlobalEventProcessor((event: Event) => {
      if (getCurrentHub().getIntegration(QuickAppInfo)) {
        return {
          ...event,
          contexts: {
            ...event.contexts,
            device: {
              a: 1
            }
          }
        }
      }
      return event
    })
  }
}