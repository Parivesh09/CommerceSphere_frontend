import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL, API_TAGS } from '../../constants';
import type { RootState } from '../../store';
import { logout, setCredentials } from '../../store/slices/authSlice';
import { calculateRetryDelay, shouldRetry } from './retryConfig';

/**
 * Base API configuration for RTK Query
 *
 * Features:
 * - Automatic token injection via prepareHeaders
 * - Automatic token refresh on 401 (single retry, loop-safe)
 * - Tag-based cache invalidation
 * - Endpoint injection pattern for modular API definitions
 * - Automatic retry with exponential backoff
 *
 * Validates: Requirements 2.1, 2.2, 2.3, 2.4, 14.2
 */

const baseQueryWithoutReauth = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.accessToken;
    const userId = state.auth.user?.id;

    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }

    if (userId) {
      headers.set('x-user-id', userId);
    }

    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

/**
 * Base query with automatic token refresh
 *
 * On a 401 response the access token is refreshed once using the stored
 * refresh token, then the original request is retried. Refresh attempts are
 * never themselves retried (loop-safe). If refresh fails the user is logged
 * out and redirected to the login page.
 */
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  let result = await baseQueryWithoutReauth(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const state = api.getState() as RootState;
    const { accessToken, refreshToken, user } = state.auth;

    const isRefreshRequest = (typeof args === 'string' ? args : args.url).toString().includes('/auth/refresh');

    if (refreshToken && !isRefreshRequest) {
      const refreshResult = await baseQueryWithoutReauth(
        { url: '/auth/refresh', method: 'POST', body: { refreshToken } },
        api,
        extraOptions
      );

      if (refreshResult.data && user) {
        const data = refreshResult.data as { accessToken: string; refreshToken?: string };
        api.dispatch(
          setCredentials({
            user,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken || refreshToken,
          })
        );
        result = await baseQueryWithoutReauth(args, api, extraOptions);
      } else {
        api.dispatch(logout());
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    } else if (!refreshToken || !accessToken) {
      api.dispatch(logout());
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  }

  return result;
};

/**
 * Base query with automatic retry logic
 *
 * Wraps the base query with retry functionality that:
 * - Retries failed requests up to 3 times
 * - Uses exponential backoff with jitter
 * - Only retries on network errors and 5xx server errors
 *
 * Validates: Requirement 14.2
 */
const baseQuery = retry(
  async (args, api, extraOptions) => {
    const result = await baseQueryWithReauth(args, api, extraOptions);

    if (result.error && !shouldRetry(result.error)) {
      retry.fail(result.error);
    }

    return result;
  },
  {
    maxRetries: 3,
    backoff: async (attempt) => {
      const delay = calculateRetryDelay(attempt);
      console.log(`Retrying request (attempt ${attempt + 1}/3) after ${Math.round(delay)}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    },
  }
);

/**
 * Base API instance
 *
 * All feature-specific API slices should inject their endpoints into this base API
 * to share the same configuration, cache, and middleware.
 */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: Object.values(API_TAGS),
  endpoints: () => ({}),
});
