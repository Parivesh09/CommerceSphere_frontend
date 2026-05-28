# Monitoring & Analytics Quick Reference

Quick reference for using monitoring and analytics in the application.

## Import

```typescript
import { monitoring, analytics, performanceMonitor, errorLogger } from '@/services/monitoring';
```

## Error Tracking

```typescript

errorLogger.logError(error, {
  component: 'ComponentName',
  action: 'action_name',
  metadata: { key: 'value' }
});


errorLogger.logApiError(error, '/api/endpoint', 'GET');


errorLogger.logWarning('Warning message', { component: 'ComponentName' });
```

## Performance Tracking

```typescript

performanceMonitor.mark('operation-start');
performanceMonitor.mark('operation-end');


const duration = performanceMonitor.measure(
  'operation-duration',
  'operation-start',
  'operation-end'
);


const lcp = performanceMonitor.getMetric('LCP');
const fid = performanceMonitor.getMetric('FID');
const cls = performanceMonitor.getMetric('CLS');
```

## Analytics - Page Views

```typescript

import { usePageTracking } from '@/hooks/usePageTracking';

function App() {
  usePageTracking(); // Tracks all route changes
  return <Routes>...</Routes>;
}


analytics.trackPageView('/products');
```

## Analytics - E-commerce Events

```typescript

analytics.trackProductView(productId, name, category, price);


analytics.trackAddToCart(productId, name, price, quantity);


analytics.trackRemoveFromCart(productId, name, price, quantity);


analytics.trackBeginCheckout(cartValue, itemCount);


analytics.trackPurchase(orderId, revenue, tax, shipping);


analytics.trackSearch(searchTerm, resultCount);
```

## Analytics - Authentication

```typescript

analytics.trackLogin('email'); // or 'google', 'facebook', etc.


analytics.trackSignUp('email');


analytics.trackLogout();
```

## Analytics - Custom Events

```typescript
analytics.trackEvent({
  category: 'Category',
  action: 'action_name',
  label: 'optional_label',
  value: 123,
  metadata: {
    custom_field: 'value'
  }
});
```

## User Context

```typescript

monitoring.setUser(userId, email, name, role);


monitoring.clearUser();
```

## Common Patterns

### Track Component Performance

```typescript
useEffect(() => {
  performanceMonitor.mark('component-mount-start');
  
  return () => {
    performanceMonitor.mark('component-mount-end');
    performanceMonitor.measure(
      'component-mount',
      'component-mount-start',
      'component-mount-end'
    );
  };
}, []);
```

### Track API Calls

```typescript
try {
  const response = await fetch('/api/products');
  const data = await response.json();
  

  analytics.trackEvent({
    category: 'API',
    action: 'fetch_products',
    label: 'success'
  });
  
  return data;
} catch (error) {

  errorLogger.logApiError(error, '/api/products', 'GET');
  throw error;
}
```

### Track User Actions

```typescript
const handleButtonClick = () => {

  analytics.trackEvent({
    category: 'User Interaction',
    action: 'button_click',
    label: 'Add to Cart'
  });
  

  addToCart(product);
};
```

### Track Form Submissions

```typescript
const handleSubmit = async (data) => {
  performanceMonitor.mark('form-submit-start');
  
  try {
    await submitForm(data);
    
    analytics.trackEvent({
      category: 'Form',
      action: 'submit',
      label: 'Contact Form'
    });
  } catch (error) {
    errorLogger.logError(error, {
      component: 'ContactForm',
      action: 'submit',
      metadata: { formData: data }
    });
  } finally {
    performanceMonitor.mark('form-submit-end');
    performanceMonitor.measure(
      'form-submit-duration',
      'form-submit-start',
      'form-submit-end'
    );
  }
};
```

## Environment Variables

```bash
# Enable monitoring
VITE_ENABLE_ERROR_TRACKING=true
VITE_ENABLE_ANALYTICS=true

# Sentry
VITE_SENTRY_DSN=https://...@sentry.io/...

# Google Analytics
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

## Best Practices

1. **Always provide context** when logging errors
2. **Track key user actions** for analytics
3. **Set user context** after login
4. **Clear user context** on logout
5. **Use performance marks** for critical operations
6. **Don't log sensitive data** (passwords, credit cards, etc.)
7. **Test in development** before deploying

## See Also

- [Full Documentation](./MONITORING_SETUP.md)
- [Example Component](./src/examples/MonitoringExample.tsx)
