/**
 * Middleware exports
 *
 * This module exports all custom Redux middleware used in the application.
 *
 * Note: Automatic token refresh is handled inside `baseApi` (baseQueryWithReauth);
 * it no longer lives in a separate middleware.
 */

export { errorMiddleware } from './errorMiddleware';
