# Authentication Feature Module

This module provides complete authentication functionality for the e-commerce frontend application.

## Overview

The authentication feature module implements secure user authentication with automatic token management, form validation, and protected routes. It follows the feature-based architecture pattern with all related code organized in a single directory.

## Structure

```
auth/
├── api/
│   └── index.ts           # RTK Query API endpoints
├── components/
│   ├── ProtectedRoute.tsx # Route protection component
│   └── index.ts           # Component exports
├── hooks/
│   └── index.ts           # Custom auth hooks
├── pages/
│   ├── LoginPage.tsx      # Login page with validation
│   └── RegisterPage.tsx   # Registration page with validation
├── validation/
│   └── index.ts           # Zod validation schemas
└── README.md              # This file
```

## Features Implemented

### 1. Authentication API Endpoints (api/index.ts)

RTK Query endpoints for all authentication operations:

- **login**: Authenticates user and returns tokens
- **register**: Creates new user account
- **logout**: Invalidates server-side session
- **getMe**: Fetches current user profile
- **refreshToken**: Obtains new access token

All endpoints use automatic token injection via the base API configuration.

**Validates Requirements:** 3.1, 3.2, 3.4, 3.5

### 2. Form Validation Schemas (validation/index.ts)

Zod schemas for type-safe form validation:

- **loginSchema**: Email and password validation
- **registerSchema**: Name, email, password with strength requirements, and password confirmation

**Validates Requirements:** 3.1, 19.1, 19.2

### 3. Custom Hooks (hooks/index.ts)

Convenient hooks for accessing auth functionality:

- **useAuth()**: Access authentication state (user, tokens, isAuthenticated, role checks)
- **useLogout()**: Handle logout with cache invalidation
- **useRequireRole()**: Check if user has required role

**Validates Requirements:** 3.1, 3.3, 3.4, 3.5

### 4. Protected Route Component (components/ProtectedRoute.tsx)

Route wrapper that:
- Redirects unauthenticated users to login
- Optionally requires admin role
- Shows loading state during auth check
- Preserves intended destination for post-login redirect

**Validates Requirements:** 3.3, 10.5

### 5. Login Page (pages/LoginPage.tsx)

Features:
- React Hook Form integration with Zod validation
- Inline error messages
- Loading states
- Automatic redirect to intended page after login
- Link to registration page

**Validates Requirements:** 3.1, 3.3, 19.1, 19.2, 19.3

### 6. Register Page (pages/RegisterPage.tsx)

Features:
- React Hook Form integration with Zod validation
- Password strength validation (uppercase, lowercase, number)
- Password confirmation matching
- Inline error messages
- Loading states
- Link to login page

**Validates Requirements:** 3.1, 19.1, 19.2, 19.3

## Integration

### Redux Store

The auth slice is already integrated in the Redux store at `store/slices/authSlice.ts` with actions:
- `setCredentials`: Store user and tokens
- `setUser`: Update user data
- `logout`: Clear all auth state
- `setLoading`: Update loading state

### Middleware

Authentication and error handling are provided as follows:

1. **baseQueryWithReauth** (`services/api/baseApi.ts`):
   - Intercepts 401 responses
   - Automatically refreshes tokens
   - Retries failed requests
   - Logs out on refresh failure

2. **errorMiddleware** (`store/middleware/errorMiddleware.ts`):
   - Handles global error display
   - Shows user-friendly error messages

### Protected Routes

Protected routes are configured in `App.tsx`:

```tsx

<Route
  path={ROUTES.CHECKOUT}
  element={
    <ProtectedRoute>
      <CheckoutPage />
    </ProtectedRoute>
  }
/>


<Route
  path={ROUTES.ADMIN}
  element={
    <ProtectedRoute requireAdmin>
      <AdminLayout />
    </ProtectedRoute>
  }
>
  {/* Admin routes */}
</Route>
```

## Usage Examples

### Using Auth Hooks

```tsx
import { useAuth, useLogout } from '@/features/auth/hooks';

function MyComponent() {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const logout = useLogout();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <p>Welcome, {user.name}!</p>
      {isAdmin && <p>You have admin access</p>}
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Using API Endpoints

```tsx
import { useLoginMutation } from '@/features/auth/api';

function LoginForm() {
  const [login, { isLoading, error }] = useLoginMutation();

  const handleLogin = async (credentials) => {
    try {
      const result = await login(credentials).unwrap();

    } catch (err) {

    }
  };
}
```

### Creating Protected Routes

```tsx
import { ProtectedRoute } from '@/features/auth/components';


<Route
  path="/profile"
  element={
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  }
/>


<Route
  path="/admin"
  element={
    <ProtectedRoute requireAdmin>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
```

## Token Management

### Storage
- Access token: Stored in Redux state and localStorage
- Refresh token: Stored in Redux state and localStorage
- User data: Stored in Redux state and localStorage

### Automatic Refresh
The auth middleware automatically:
1. Detects 401 responses
2. Attempts token refresh using refresh token
3. Retries the original request with new token
4. Logs out user if refresh fails

### Security Considerations
- Tokens are automatically injected into API requests via `prepareHeaders`
- Tokens are cleared on logout
- All API caches are invalidated on auth state changes
- HTTPS should be used in production to protect tokens in transit

## Requirements Validation

This module validates the following requirements:

- **3.1**: Secure token storage in Redux and localStorage
- **3.2**: Automatic token refresh without user intervention
- **3.3**: Protected route authentication and redirection
- **3.4**: Complete state clearing on logout
- **3.5**: Cache invalidation on auth state changes
- **10.5**: Admin role verification for admin routes
- **19.1**: React Hook Form for form state management
- **19.2**: Zod schemas for type-safe validation
- **19.3**: Inline error message display

## Future Enhancements

Potential improvements for future iterations:

1. Social authentication (Google, Facebook, etc.)
2. Two-factor authentication (2FA)
3. Password reset functionality
4. Email verification
5. Remember me functionality
6. Session timeout warnings
7. Biometric authentication for mobile
8. OAuth2 integration
