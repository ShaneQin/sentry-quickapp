import device from '@system.device';
import app from '@system.app';
import network from '@system.network';
import { getCurrentHub, addGlobalEventProcessor } from '@sentry/core';
import type { Event, Integration} from '@sentry/types';

export class QuickAppInfo implements Integration {
  public static id: string = 'Quick App Info';

  public name: string = QuickAppInfo.id;

  public deviceInfo: Record<string, any> = {}

  public appInfo: Record<string, any> = {}

  public networkInfo = {}

  public constructor() {
    setTimeout(() => {
      this.getDeviceInfo()
      this.getAppInfo()
      this.getNetworkInfo()
    })
    
  }

  public setupOnce(): void {
    addGlobalEventProcessor((event: Event): Event => {
      if (getCurrentHub().getIntegration(QuickAppInfo)) {
        return {
          ...event,
          contexts: {
            ...event.contexts,
            device: this.deviceInfo,
            app: this.appInfo,
            network: this.networkInfo
          },
          tags: {
            ...event.tags,
            brand: this.deviceInfo.brand,
            'package.name': this.appInfo.packageName,
            'version.name': this.appInfo.versionName,
            'version.code': this.appInfo.versionCode
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

  public getNetworkInfo() {
    network.getType({
      success: (data) => {
        this.networkInfo = this._handleInfoData(data)
      }
    })
  }

  private _handleInfoData(info: Record<string, any>): Record<string, any> {
    const handledInfo: Record<string, any> = {}
    Object.keys(info).forEach(key => {
      if (typeof info[key] === 'string' || typeof info[key] === 'number') {
        handledInfo[key] = info[key]
      } else {
        handledInfo[key] = JSON.stringify(info[key])
      }
    })
    return handledInfo
  }
}