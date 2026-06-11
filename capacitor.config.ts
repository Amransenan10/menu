import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.menutech.app',
  appName: 'منيو تيك',
  webDir: 'out',
  server: {
    url: 'https://menu-alpha-pearl.vercel.app',
    allowNavigation: ['menu-alpha-pearl.vercel.app']
  }
};

export default config;
