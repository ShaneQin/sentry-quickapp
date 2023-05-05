# sentry-quickapp 快应用Sentry SDK

![npm version](https://img.shields.io/npm/v/sentry-quickapp2)
![npm download](https://img.shields.io/npm/dm/sentry-quickapp2)

## 功能

## 用法

1. 安装依赖（注意这里是sentry-quickapp2，因为sentry-quickapp被别人注册了）
   ```bash
   npm install sentry-quickapp2 --save
   ```
2. 在快应用 `app.ux` 文件中引入
   ```js
   import { init, captureException } from 'sentry-quickapp2'
   export default {
     onCreate() {
      init({
          dsn: '你项目的dsn',
        })
      },
      onError(e) {
        captureException(e)
      }
   }
   ```