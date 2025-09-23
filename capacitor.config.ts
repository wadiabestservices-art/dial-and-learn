import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.c4583632aeec4b3fafbf4f8da5d4d8a6',
  appName: 'USSD Executor',
  webDir: 'dist',
  server: {
    url: "https://c4583632-aeec-4b3f-afbf-4f8da5d4d8a6.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#1a1b23",
      showSpinner: false
    }
  }
};

export default config;