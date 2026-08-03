# Redux Store and RTK Query Configuration

This directory contains the Redux store configuration, slices, and middleware for the application.

## Overview

The store is configured with:
- **Redux Toolkit** for state management
- **RTK Query** for API communication and caching
- **Custom middleware** for authentication and error handling

## Structure

```
store/
├── index.ts              # Store configuration
├── middleware/           # Custom middleware
│   ├── errorMiddleware.ts   # Global error handling
│   └── index.ts             # Middleware exports
└── slices/              # Redux slices
    ├── authSlice.ts         # Authentication state
    ├── cartSlice.ts         # Shopping cart state
    └── uiSlice.ts           # UI state (theme, modals, etc.)
```

## Features

### 1. RTK Query Base API

The base API is configured in `services/api/baseApi.ts` with:

- **Automatic token injection**: Access tokens are automatically added to request headers
- **Tag-based cache invalidation**: Efficient cache management using tags
- **Endpoint injection pattern**: Modular API definitions per feature

### 2. Automatic Token Refresh

Token refresh is handled inside `baseApi` (`services/api/baseApi.ts`) via `baseQueryWithReauth`:

- **Automatic token refresh**: Intercepts 401 responses and refreshes tokens
- **Request retry**: Retries the original request once after successful token refresh
- **Automatic logout**: Logs out users when refresh fails

**Validates Requirements**: 2.5, 3.2

### 3. Error Handling Middleware

The `errorMiddleware` provides:

- **Global error feedback**: Toast notifications for all API errors
- **Error categorization**: Different messages for different error types
- **Development logging**: Detailed error logs in development mode

**Error Types Handled**:
- 400: Validation errors
- 403: Permission denied
- 404: Not found
- 409: Conflict
- 422: Unprocessable entity
- 429: Rate limit exceeded
- 500-504: Server errors
- Network errors
- Timeout errors

**Validates Requirements**: 2.6

## Usage

### Accessing State

Use the typed hooks from `hooks/`:

```typescript
import { useAppSelector, useAppDispatch } from '@/hooks';

function MyComponent() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  

}
```

### Creating API Endpoints

Use the endpoint injection pattern:

```typescript

import { baseApi } from '@/services/api/baseApi';

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (filters) => ({
        url: '/products',
        params: filters,
      }),
      providesTags: ['Products'],
    }),
  }),
});

export const { useGetProductsQuery } = productsApi;
```

### Cache Invalidation

Use tags to invalidate cache:

```typescript
export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createProduct: builder.mutation({
      query: (product) => ({
        url: '/products',
        method: 'POST',
        body: product,
      }),
      invalidatesTags: ['Products'], // Invalidates product list
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...product }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body: product,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Product', id },
        'Products',
      ],
    }),
  }),
});
```

## Middleware Order

The middleware are applied in this order:

1. **Default RTK middleware** (thunk, immutability checks, etc.)
2. **RTK Query middleware** (caching, refetching, reauth, etc.)
3. **Error middleware** (error handling)

Note: Automatic token refresh is part of the RTK Query base query, so it runs
before requests are dispatched to the network.

## Configuration

### Environment Variables

Required environment variables:

```env
VITE_API_GATEWAY_URL=http://localhost:3000
```

### Store Configuration

The store is configured with:

```typescript
export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
    cart: cartReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(baseApi.middleware)
      .concat(errorMiddleware),
});
```

## Best Practices

1. **Use endpoint injection**: Keep API definitions modular and colocated with features
2. **Use tags for cache invalidation**: Leverage RTK Query's tag system
3. **Type everything**: Use TypeScript for all state and API types
4. **Handle errors gracefully**: Let the error middleware handle most errors
5. **Use optimistic updates**: For better UX on mutations

## Testing

When testing components that use the store:

```typescript
import { Provider } from 'react-redux';
import { store } from '@/store';

function renderWithStore(component: React.ReactElement) {
  return render(
    <Provider store={store}>
      {component}
    </Provider>
  );
}
```

## References

- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [RTK Query Documentation](https://redux-toolkit.js.org/rtk-query/overview)
- [Requirements Document](../../../.kiro/specs/premium-ecommerce-frontend/requirements.md)
- [Design Document](../../../.kiro/specs/premium-ecommerce-frontend/design.md)
