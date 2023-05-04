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
        this.deviceInfo = this._handleInfoData(ret)
      }
    })
  }

  public getAppInfo() {
    this.appInfo = this._handleInfoData(app.getInfo())
  }

  private _handleInfoData(info: Record<string, any>): Record<string, any> {
    const handledInfo: Record<string, any> = {}
    Object.keys(info).forEach(key => {
      if (typeof info[key] === 'object') {
        handledInfo[key] = JSON.stringify(info[key])
      } else {
        handledInfo[key] = info[key]
      }
    })
    return handledInfo
  }
}