# Monitoring and Analytics Setup Guide

This document describes the monitoring and analytics infrastructure for the premium e-commerce frontend application.

## Overview

The application includes comprehensive monitoring and analytics capabilities:

1. **Error Tracking** - Sentry for error monitoring and debugging
2. **Performance Monitoring** - Web Vitals for Core Web Vitals tracking
3. **Analytics** - Google Analytics for user behavior tracking
4. **Custom Event Tracking** - Track key user actions and e-commerce events

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  Monitoring Service                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │    Error     │  │ Performance  │  │  Analytics   │ │
│  │   Logging    │  │  Monitoring  │  │   Service    │ │
│  │   (Sentry)   │  │ (Web Vitals) │  │  (GA/Custom) │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Services

### 1. Error Logging Service (`services/errorLogging.ts`)

Provides centralized error tracking with Sentry integration.

**Features:**
- Automatic error capture with React Error Boundaries
- API error tracking
- User context association
- Error queuing for offline scenarios
- Development-friendly console logging

**Usage:**
```typescript
import { errorLogger } from '@/services/errorLogging';


errorLogger.logError(error, {
  component: 'ProductList',
  action: 'fetch_products',
  metadata: { productId: '123' }
});


errorLogger.logApiError(error, '/api/products', 'GET');


errorLogger.setUser('user-123', 'user@example.com', 'John Doe');


errorLogger.clearUser();
```

### 2. Performance Monitoring Service (`services/performance.ts`)

Tracks Core Web Vitals and custom performance metrics.

**Metrics Tracked:**
- **LCP** (Largest Contentful Paint) - Loading performance
- **FID** (First Input Delay) - Interactivity
- **CLS** (Cumulative Layout Shift) - Visual stability
- **FCP** (First Contentful Paint) - Initial render
- **TTFB** (Time to First Byte) - Server response time

**Usage:**
```typescript
import { performanceMonitor } from '@/services/performance';


performanceMonitor.mark('checkout-start');


performanceMonitor.measure('checkout-duration', 'checkout-start', 'checkout-end');


performanceMonitor.trackNavigationTiming();


performanceMonitor.trackResourceTiming('script');


const metrics = performanceMonitor.getMetrics();
const lcp = performanceMonitor.getMetric('LCP');
```

### 3. Analytics Service (`services/analytics.ts`)

Tracks user behavior and e-commerce events.

**Features:**
- Page view tracking
- Custom event tracking
- E-commerce event tracking
- User property management
- Google Analytics integration

**Usage:**
```typescript
import { analytics } from '@/services/analytics';


analytics.trackPageView('/products');


analytics.trackEvent({
  category: 'User Interaction',
  action: 'click_button',
  label: 'Add to Cart',
  value: 1
});


analytics.trackProductView('prod-123', 'Blue Shirt', 'Clothing', 29.99);
analytics.trackAddToCart('prod-123', 'Blue Shirt', 29.99, 1);
analytics.trackBeginCheckout(59.98, 2);
analytics.trackPurchase('order-456', 59.98, 5.00, 10.00);


analytics.trackSearch('blue shirts', 42);


analytics.trackLogin('email');
analytics.trackSignUp('google');
analytics.trackLogout();


analytics.setUserProperties({
  userId: 'user-123',
  email: 'user@example.com',
  name: 'John Doe',
  role: 'customer'
});
```

### 4. Centralized Monitoring Service (`services/monitoring.ts`)

Unified interface for all monitoring services.

**Usage:**
```typescript
import { monitoring } from '@/services/monitoring';


monitoring.initialize();


monitoring.setUser('user-123', 'user@example.com', 'John Doe', 'customer');


monitoring.clearUser();


monitoring.errors.logError(error);
monitoring.performance.mark('custom-mark');
monitoring.analytics.trackEvent({ ... });
```

## Configuration

### Environment Variables

Add these to your `.env` file:

```bash
# Enable/disable monitoring
VITE_ENABLE_ERROR_TRACKING=true
VITE_ENABLE_ANALYTICS=true

# Sentry Configuration
VITE_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
SENTRY_ORG=your-org
SENTRY_PROJECT=your-project
SENTRY_AUTH_TOKEN=your-auth-token

# Google Analytics
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX

# Custom Analytics Endpoint (optional)
VITE_ANALYTICS_ENDPOINT=https://your-analytics-endpoint.com/events

# App Info
VITE_APP_NAME=CommerceSphere
VITE_APP_VERSION=1.0.0
```

### Sentry Setup

1. Create a Sentry account at https://sentry.io
2. Create a new project for your frontend application
3. Copy the DSN from the project settings
4. Add the DSN to your `.env` file
5. For source map upload, create an auth token in Sentry settings
6. Add the auth token and org/project info to `.env`

### Google Analytics Setup

1. Create a Google Analytics 4 property
2. Get your Measurement ID (starts with G-)
3. Add it to your `.env` file as `VITE_GOOGLE_ANALYTICS_ID`

## Integration

### Automatic Initialization

Monitoring services are automatically initialized in `main.tsx`:

```typescript
import { monitoring } from './services/monitoring';


monitoring.initialize();
```

### Page View Tracking

Use the `usePageTracking` hook in your root component:

```typescript
import { usePageTracking } from '@/hooks/usePageTracking';

function App() {
  usePageTracking(); // Automatically tracks page views on route changes
  
  return (
    <Routes>
      {/* Your routes */}
    </Routes>
  );
}
```

### Error Boundary Integration

Error boundaries automatically log errors to Sentry:

```typescript
import { errorLogger } from '@/services/errorLogging';

class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    errorLogger.logBoundaryError(error, errorInfo, 'feature');
  }
}
```

### Redux Integration

Track errors in Redux middleware:

```typescript
import { errorLogger } from '@/services/errorLogging';

const errorMiddleware: Middleware = (api) => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    errorLogger.logApiError(
      action.payload,
      action.meta.arg.endpointName,
      action.meta.arg.type
    );
  }
  return next(action);
};
```

## Custom Event Tracking

### E-commerce Events

Track key e-commerce actions:

```typescript

analytics.trackProductView(productId, name, category, price);
analytics.trackAddToCart(productId, name, price, quantity);
analytics.trackRemoveFromCart(productId, name, price, quantity);


analytics.trackBeginCheckout(cartValue, itemCount);
analytics.trackPurchase(orderId, revenue, tax, shipping);


analytics.trackSearch(searchTerm, resultCount);
```

### Custom Events

Track any custom user action:

```typescript
analytics.trackEvent({
  category: 'Feature',
  action: 'action_name',
  label: 'optional_label',
  value: 123,
  metadata: {
    custom_field: 'value'
  }
});
```

## Performance Tracking

### Automatic Metrics

Core Web Vitals are tracked automatically:
- LCP, FID, CLS, FCP, TTFB

### Custom Timing

Track custom performance metrics:

```typescript

performanceMonitor.mark('operation-start');




performanceMonitor.mark('operation-end');
const duration = performanceMonitor.measure(
  'operation-duration',
  'operation-start',
  'operation-end'
);
```

## Source Maps

Source maps are automatically generated and uploaded to Sentry in production builds.

**Configuration:**
- Source maps are generated during build (`sourcemap: true` in vite.config.ts)
- Sentry Vite plugin uploads source maps to Sentry
- Source maps are deleted after upload for security

**Build Command:**
```bash
npm run build
```

## Best Practices

### 1. Error Context

Always provide context when logging errors:

```typescript
errorLogger.logError(error, {
  component: 'ComponentName',
  action: 'user_action',
  metadata: {
    userId: user.id,
    productId: product.id
  }
});
```

### 2. User Privacy

- Anonymize IP addresses in Google Analytics (enabled by default)
- Don't log sensitive user data (passwords, credit cards, etc.)
- Use Sentry's data scrubbing features
- Mask sensitive data in Session Replay

### 3. Performance Impact

- Monitoring services are loaded asynchronously
- Error tracking has minimal performance impact
- Analytics events are batched
- Source maps are only uploaded in production

### 4. Development vs Production

- Development: Detailed console logging, no external tracking
- Production: External tracking enabled, minimal console output

### 5. User Context

Set user context after login:

```typescript

monitoring.setUser(user.id, user.email, user.name, user.role);


monitoring.clearUser();
```

## Monitoring Dashboard

### Sentry Dashboard

Access your Sentry dashboard to:
- View error trends and frequency
- Analyze error stack traces with source maps
- Track performance metrics
- View user sessions with Session Replay
- Set up alerts for critical errors

### Google Analytics Dashboard

Access Google Analytics to:
- View user behavior and flow
- Analyze e-commerce performance
- Track conversion funnels
- Monitor Core Web Vitals
- Create custom reports

## Troubleshooting

### Source Maps Not Working

1. Ensure `SENTRY_AUTH_TOKEN` is set
2. Verify `SENTRY_ORG` and `SENTRY_PROJECT` are correct
3. Check that source maps are generated (`sourcemap: true`)
4. Verify Sentry Vite plugin is configured correctly

### Analytics Not Tracking

1. Verify `VITE_ENABLE_ANALYTICS=true`
2. Check `VITE_GOOGLE_ANALYTICS_ID` is set correctly
3. Ensure ad blockers are not blocking analytics
4. Check browser console for errors

### Performance Metrics Not Appearing

1. Verify `VITE_ENABLE_ERROR_TRACKING=true`
2. Check that Web Vitals are supported in the browser
3. Ensure page is fully loaded before checking metrics
4. Check Sentry performance monitoring is enabled

## Testing

### Development Testing

```bash
# Run with monitoring enabled
VITE_ENABLE_ERROR_TRACKING=true \
VITE_ENABLE_ANALYTICS=true \
npm run dev
```

### Production Testing

```bash
# Build with monitoring
npm run build

# Preview production build
npm run preview
```

## Security Considerations

1. **Environment Variables**: Never commit `.env` files with real credentials
2. **Source Maps**: Deleted after upload to prevent exposure
3. **User Data**: Sensitive data is never logged
4. **CORS**: Analytics endpoints should have proper CORS configuration
5. **CSP**: Content Security Policy should allow monitoring domains

## Support

For issues or questions:
- Sentry: https://docs.sentry.io
- Web Vitals: https://web.dev/vitals
- Google Analytics: https://support.google.com/analytics

## Validates

This implementation validates **Requirement 14.4**: Errors are logged and user-friendly messages shown, with comprehensive monitoring and analytics infrastructure.
