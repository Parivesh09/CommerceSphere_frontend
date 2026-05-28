/**
 * Application configuration
 * Centralized access to environment variables with type safety
 */

export const config = {
  api: {
    gatewayUrl: import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:3000',
    wsUrl: import.meta.env.VITE_WS_URL || 'ws://localhost:3000',
  },
  app: {
    name: import.meta.env.VITE_APP_NAME || 'CommerceSphere',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    env: import.meta.env.VITE_APP_ENV || 'development',
  },
  features: {
    analytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    errorTracking: import.meta.env.VITE_ENABLE_ERROR_TRACKING === 'true',
    serviceWorker: import.meta.env.VITE_ENABLE_SERVICE_WORKER === 'true',
  },
  external: {
    stripePublicKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY,
    googleAnalyticsId: import.meta.env.VITE_GOOGLE_ANALYTICS_ID,
    sentryDsn: import.meta.env.VITE_SENTRY_DSN,
  },
  cache: {
    duration: parseInt(import.meta.env.VITE_CACHE_DURATION || '300000', 10),
  },
} as const;

export default config;
