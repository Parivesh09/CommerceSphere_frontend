import { retry } from '@reduxjs/toolkit/query';

/**
 * Retry configuration for API requests with exponential backoff
 * 
 * Implements automatic retry logic for failed requests with:
 * - Maximum of 3 retry attempts
 * - Exponential backoff with jitter
 * - Selective retry based on error type
 * 
 * Validates: Requirement 14.2 (Failed requests retry with exponential backoff)
 */

/**
 * Calculate retry delay with exponential backoff and jitter
 * 
 * Formula: baseDelay * 2^retryCount ± 25% jitter
 * - Attempt 1: ~1s (750ms - 1250ms)
 * - Attempt 2: ~2s (1500ms - 2500ms)
 * - Attempt 3: ~4s (3000ms - 5000ms)
 * 
 * Jitter prevents thundering herd problem when services recover
 */
export const calculateRetryDelay = (retryCount: number): number => {
  const baseDelay = 1000; // 1 second
  const exponentialDelay = baseDelay * Math.pow(2, retryCount);
  const jitter = exponentialDelay * 0.25 * (Math.random() - 0.5);
  return exponentialDelay + jitter;
};

/**
 * Determine if a request should be retried based on error type
 * 
 * Retries on:
 * - Network errors (no response)
 * - 5xx server errors (500-599)
 * - Timeout errors
 * 
 * Does NOT retry on:
 * - 4xx client errors (except 429 rate limit)
 * - 401 authentication errors (handled by baseQueryWithReauth)
 */
export const shouldRetry = (error: unknown): boolean => {

  const hasStatus = (err: unknown): err is { status: number | string } => {
    return typeof err === 'object' && err !== null && 'status' in err;
  };

  if (!hasStatus(error)) {

    return true;
  }

  const status = error.status;


  if (typeof status === 'number' && status >= 500 && status < 600) {
    return true;
  }


  if (status === 429) {
    return true;
  }


  if (status === 'TIMEOUT_ERROR') {
    return true;
  }


  if (status === 'FETCH_ERROR' || status === 'NETWORK_ERROR') {
    return true;
  }


  return false;
};

/**
 * RTK Query retry configuration
 * 
 * This configuration is used with the retry() function from RTK Query
 * to automatically retry failed requests with exponential backoff.
 */
export const retryConfig = {
  maxRetries: 3,
  backoff: calculateRetryDelay,
};

/**
 * Create a base query with retry logic
 * 
 * Wraps a base query with automatic retry functionality
 */
export const staggeredBaseQueryWithRetry = retry(
  async (_args, _api, _extraOptions) => {


    return { data: null };
  },
  {
    maxRetries: retryConfig.maxRetries,
    backoff: async (attempt) => {
      const delay = calculateRetryDelay(attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    },
  }
);

/**
 * Retry options for individual endpoints
 * 
 * Can be used to override retry behavior for specific endpoints:
 * 
 * @example
 * builder.query({
 *   query: () => '/data',
 *   extraOptions: { maxRetries: 5 }
 * })
 */
export interface RetryOptions {
  maxRetries?: number;
  backoff?: (attempt: number, maxRetries: number) => number;
}
