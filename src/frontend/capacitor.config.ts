import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.eoatraveldeals.app',
  appName: 'EOATravelDeals',
  webDir: 'dist',
  server: {
    url: process.env.CAPACITOR_SERVER_URL || 'https://your-production-url.ic0.app',
    cleartext: false,
  },
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },
};

export default config;
