import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL, API_TAGS } from '../../constants';
import type { RootState } from '../../store';
import { calculateRetryDelay, shouldRetry } from './retryConfig';

/**
 * Base API configuration for RTK Query
 * 
 * Features:
 * - Automatic token injection via prepareHeaders
 * - Tag-based cache invalidation
 * - Endpoint injection pattern for modular API definitions
 * - Automatic retry with exponential backoff
 * 
 * Token refresh and error handling are managed by middleware.
 * 
 * Validates: Requirements 2.1, 2.2, 2.3, 2.4, 14.2
 */

const baseQueryWithoutRetry = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {

    const token = (getState() as RootState).auth.accessToken;

    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }

    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

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
    const result = await baseQueryWithoutRetry(args, api, extraOptions);


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
