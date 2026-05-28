# Error Handling Implementation

This document describes the comprehensive error handling system implemented for the premium e-commerce frontend.

## Overview

The error handling system provides:
- **Hierarchical Error Boundaries**: Catch React errors at different levels
- **Retry Logic**: Automatic retry with exponential backoff for failed API requests
- **Offline Detection**: Network status monitoring with user feedback
- **Error Logging**: Centralized error tracking and monitoring
- **User-Friendly Messages**: Clear, actionable error messages with retry options

## Architecture

### 1. Hierarchical Error Boundaries

Error boundaries are implemented at four levels:

#### Root Level (`level="root"`)
- Catches catastrophic errors that prevent the entire application from functioning
- Displays full-page error UI with reload option
- Used at the top level of the application

```tsx
<ErrorBoundary level="root" fallback={RootErrorFallback}>
  <Provider store={store}>
    <App />
  </Provider>
</ErrorBoundary>
```

#### Route Level (`level="route"`)
- Catches errors specific to a route/page
- Allows navigation to other routes
- Displays error UI with retry, go back, and go home options

```tsx
<Route
  path="/products"
  element={
    <ErrorBoundary level="route" fallback={RouteErrorFallback}>
      <ProductListPage />
    </ErrorBoundary>
  }
/>
```

#### Feature Level (`level="feature"`)
- Catches errors in a specific feature module
- Keeps the rest of the page functional
- Displays inline error UI with retry option

```tsx
<ErrorBoundary level="feature" fallback={FeatureErrorFallback}>
  <ProductFilters />
</ErrorBoundary>
```

#### Component Level (`level="component"`)
- Catches errors in individual components
- Minimal error UI that doesn't disrupt the page
- Displays compact error message with retry button

```tsx
<ErrorBoundary level="component" fallback={ComponentErrorFallback}>
  <ProductCard product={product} />
</ErrorBoundary>
```

### 2. Retry Logic with Exponential Backoff

API requests automatically retry on failure with exponential backoff:

**Configuration:**
- Maximum retries: 3 attempts
- Base delay: 1 second
- Backoff formula: `baseDelay * 2^retryCount ± 25% jitter`
- Retry delays: ~1s, ~2s, ~4s

**Retry Conditions:**
- Network errors (no response)
- 5xx server errors (500-599)
- Timeout errors
- Rate limit errors (429)

**No Retry:**
- 4xx client errors (except 429)
- 401 authentication errors (handled by auth middleware)

**Implementation:**
```typescript

export const calculateRetryDelay = (retryCount: number): number => {
  const baseDelay = 1000;
  const exponentialDelay = baseDelay * Math.pow(2, retryCount);
  const jitter = exponentialDelay * 0.25 * (Math.random() - 0.5);
  return exponentialDelay + jitter;
};
```

### 3. Offline Detection

Network status monitoring provides:
- Real-time online/offline detection
- Toast notifications when status changes
- Persistent banner when offline
- Automatic reconnection handling

**Usage:**
```tsx
import { useNetworkStatus, NetworkStatusIndicator } from '@/hooks';

function MyComponent() {
  const { isOnline, isOffline } = useNetworkStatus();
  
  return (
    <div>
      {isOffline && <p>You are offline</p>}
      {/* Component content */}
    </div>
  );
}


<NetworkStatusIndicator />
```

### 4. Error Logging Service

Centralized error logging with monitoring service integration:

**Features:**
- Logs errors to console in development
- Sends errors to monitoring service in production (Sentry, LogRocket, etc.)
- Captures error context (component, action, user, metadata)
- Supports different severity levels (error, warning, info)

**Usage:**
```typescript
import { errorLogger } from '@/services/errorLogging';


errorLogger.logError(error, {
  component: 'ProductList',
  action: 'fetch_products',
  metadata: { filters, page },
});


errorLogger.logApiError(error, '/api/products', 'GET');


errorLogger.logWarning('Slow API response', {
  action: 'fetch_products',
  metadata: { duration: 5000 },
});


errorLogger.setUser(userId, email, username);


errorLogger.clearUser();
```

### 5. Error Middleware

Global error handling middleware for RTK Query:

**Features:**
- Intercepts all rejected API actions
- Displays appropriate toast notifications
- Logs errors to monitoring service
- Provides retry actions for recoverable errors
- Handles different error types with specific messages

**Error Types Handled:**
- 400: Validation errors with field-specific messages
- 403: Permission denied
- 404: Resource not found
- 409: Conflict (duplicate resource)
- 422: Unprocessable entity
- 429: Rate limit exceeded
- 500-504: Server errors with retry option
- Network errors: Connection issues with retry option
- Timeout errors: Request timeout with retry option

## Usage Examples

### Example 1: Wrapping a Feature with Error Boundary

```tsx
import { ErrorBoundary, FeatureErrorFallback } from '@/components/error';

function ProductListPage() {
  return (
    <div>
      <h1>Products</h1>
      
      {/* Wrap feature components with error boundaries */}
      <ErrorBoundary level="feature" fallback={FeatureErrorFallback}>
        <ProductFilters />
      </ErrorBoundary>
      
      <ErrorBoundary level="feature" fallback={FeatureErrorFallback}>
        <ProductGrid />
      </ErrorBoundary>
    </div>
  );
}
```

### Example 2: Custom Error Fallback

```tsx
import { ErrorBoundary } from '@/components/error';
import type { ErrorFallbackProps } from '@/components/error';

function CustomErrorFallback({ error, reset }: ErrorFallbackProps) {
  return (
    <div className="custom-error">
      <h2>Oops! Something went wrong</h2>
      <p>{error?.message}</p>
      <button onClick={reset}>Try Again</button>
    </div>
  );
}

function MyComponent() {
  return (
    <ErrorBoundary level="component" fallback={CustomErrorFallback}>
      <MyFeature />
    </ErrorBoundary>
  );
}
```

### Example 3: Handling Errors in API Calls

```tsx
import { useGetProductsQuery } from '@/features/products/api';
import { errorLogger } from '@/services/errorLogging';

function ProductList() {
  const { data, error, isLoading, refetch } = useGetProductsQuery();
  


  useEffect(() => {
    if (error) {
      errorLogger.logError(error, {
        component: 'ProductList',
        action: 'fetch_products',
      });
    }
  }, [error]);
  
  if (error) {
    return (
      <div>
        <p>Failed to load products</p>
        <button onClick={refetch}>Retry</button>
      </div>
    );
  }
  

}
```

### Example 4: Monitoring Network Status

```tsx
import { useNetworkStatus } from '@/hooks';

function CheckoutPage() {
  const { isOffline } = useNetworkStatus();
  
  return (
    <div>
      <h1>Checkout</h1>
      
      {isOffline && (
        <div className="alert alert-warning">
          You are offline. Please reconnect to complete your purchase.
        </div>
      )}
      
      <button disabled={isOffline}>
        Place Order
      </button>
    </div>
  );
}
```

## Testing Error Handling

### Testing Error Boundaries

```tsx
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from '@/components/error';

function ThrowError() {
  throw new Error('Test error');
}

test('error boundary catches errors', () => {
  render(
    <ErrorBoundary level="component">
      <ThrowError />
    </ErrorBoundary>
  );
  
  expect(screen.getByText(/component error/i)).toBeInTheDocument();
});
```

### Testing Retry Logic

```tsx
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('/api/products', (req, res, ctx) => {
    return res.once(ctx.status(500)); // Fail first time
  }),
  rest.get('/api/products', (req, res, ctx) => {
    return res(ctx.json({ products: [] })); // Succeed on retry
  })
);

test('retries failed requests', async () => {

});
```

### Testing Offline Detection

```tsx
import { renderHook, act } from '@testing-library/react';
import { useNetworkStatus } from '@/hooks';

test('detects offline status', () => {
  const { result } = renderHook(() => useNetworkStatus());
  
  expect(result.current.isOnline).toBe(true);
  
  act(() => {
    window.dispatchEvent(new Event('offline'));
  });
  
  expect(result.current.isOffline).toBe(true);
});
```

## Integration with Monitoring Services

### Sentry Integration (Example)

To integrate with Sentry, install the package and update the error logging service:

```bash
npm install @sentry/react
```

```typescript

import * as Sentry from '@sentry/react';

class ErrorLoggingService {
  initialize(): void {
    if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
      Sentry.init({
        dsn: import.meta.env.VITE_SENTRY_DSN,
        environment: import.meta.env.MODE,
        tracesSampleRate: 1.0,
      });
    }
    this.isInitialized = true;
  }
  
  private sendToMonitoring(error: LoggedError): void {
    Sentry.captureException(new Error(error.message), {
      level: error.level,
      contexts: {
        error: error.context,
      },
      tags: {
        component: error.context?.component,
        action: error.context?.action,
      },
    });
  }
  
  setUser(userId: string, email?: string, username?: string): void {
    Sentry.setUser({ id: userId, email, username });
  }
  
  clearUser(): void {
    Sentry.setUser(null);
  }
}
```

## Best Practices

1. **Use Appropriate Error Boundary Levels**
   - Root: Only for the top-level app wrapper
   - Route: For each route/page
   - Feature: For major feature sections
   - Component: For individual components that might fail

2. **Provide Meaningful Error Messages**
   - Use clear, user-friendly language
   - Avoid technical jargon
   - Provide actionable next steps

3. **Log Errors with Context**
   - Include component name, action, and relevant metadata
   - Set user context for authenticated users
   - Clear user context on logout

4. **Handle Offline Gracefully**
   - Disable actions that require network
   - Show clear offline indicators
   - Queue actions for when connection is restored

5. **Test Error Scenarios**
   - Test error boundaries with throwing components
   - Test retry logic with failing API calls
   - Test offline detection with network events

## Requirements Validation

This implementation validates the following requirements:

- **14.1**: Error boundaries catch React errors at multiple levels
- **14.2**: Failed requests retry with exponential backoff (up to 3 attempts)
- **14.3**: Offline state is detected and displayed to users
- **14.4**: Errors are logged to monitoring service with user-friendly messages
- **14.5**: Recoverable errors include retry actions in the UI

## Files Created

- `frontend/src/components/error/ErrorBoundary.tsx` - Main error boundary component
- `frontend/src/components/error/RootErrorFallback.tsx` - Root-level fallback UI
- `frontend/src/components/error/RouteErrorFallback.tsx` - Route-level fallback UI
- `frontend/src/components/error/FeatureErrorFallback.tsx` - Feature-level fallback UI
- `frontend/src/components/error/ComponentErrorFallback.tsx` - Component-level fallback UI
- `frontend/src/components/error/index.ts` - Error components exports
- `frontend/src/services/api/retryConfig.ts` - Retry logic configuration
- `frontend/src/hooks/useNetworkStatus.ts` - Network status monitoring hook
- `frontend/src/services/errorLogging.ts` - Error logging service

## Files Modified

- `frontend/src/services/api/baseApi.ts` - Added retry logic to base query
- `frontend/src/store/middleware/errorMiddleware.ts` - Enhanced with logging and retry actions
- `frontend/src/hooks/index.ts` - Added network status exports
- `frontend/src/App.tsx` - Integrated error boundaries and network indicator
