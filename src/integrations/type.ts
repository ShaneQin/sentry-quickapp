interface IDeviceInfo {
  brand: string;
  manufacturer: string;
  model: string;
  osType: string;
  osVersionName: string;
  osVersionCode: number;
  screenWidth: number;
  screenHeight: number;
  windowWidth: number;
  windowHeight: number;
  screenDensity: number;
  vendorOsVersion: string;
  deviceType: string;
}

interface IAppInfo {
  name: string;
  packageName: string;
  source: { packageName: string; type: string; extra: object };
  versionName: string;
  versionCode: number
}