import device from '@system.device';
import app from '@system.app';
import { getCurrentHub, addGlobalEventProcessor } from '@sentry/core';
import type { Event, Integration} from '@sentry/types';

export class QuickAppInfo implements Integration {
  public static id: string = 'Quick App Info';

  public name: string = QuickAppInfo.id;

  public deviceInfo = {}

  public appInfo = {}

  public constructor() {
    setTimeout(() => {
      this.getDeviceInfo()
      this.getAppInfo()
    })
    
  }

  public setupOnce(): void {
    addGlobalEventProcessor((event: Event) => {
      if (getCurrentHub().getIntegration(QuickAppInfo)) {
        return {
          ...event,
          contexts: {
            ...event.contexts,
            device: this.deviceInfo,
            app: this.appInfo
          }
        }
      }
      return event
    })
  }

  public getDeviceInfo() {
    device.getInfo({
      success: (ret) => {
        console.log(ret)
        this.deviceInfo = ret
      }
    })
  }

  public getAppInfo() {
    this.appInfo = app.getInfo()
  }
}