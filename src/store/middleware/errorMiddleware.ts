import { isRejectedWithValue } from '@reduxjs/toolkit';
import type { Middleware } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { errorLogger } from '../../services/errorLogging';

interface ErrorPayload {
  status?: number | string;
  data?: {
    message?: string;
    errors?: Array<{ message?: string }>;
  };
  message?: string;
}

/**
 * Error handling middleware for global error feedback
 * 
 * This middleware intercepts all rejected API actions and provides
 * appropriate user feedback through toast notifications. It handles
 * different error types (network, validation, server, etc.) with
 * user-friendly messages and logs errors for debugging.
 * 
 * Validates: Requirements 2.6, 14.4, 14.5
 */
export const errorMiddleware: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const error = action.payload as ErrorPayload;
    const status = error?.status;
    const data = error?.data;
    const meta = action.meta as { arg?: { endpointName?: string; originalArgs?: unknown } };
    const endpoint = meta?.arg?.endpointName || 'unknown';


    errorLogger.logApiError(error, endpoint);


    if (status === 401) {
      return next(action);
    }


    switch (status) {
      case 400: {

        if (data?.errors && Array.isArray(data.errors)) {
          data.errors.forEach((err) => {
            toast.error(err.message || 'Validation error');
          });
        } else if (data?.message) {
          toast.error(data.message);
        } else {
          toast.error('Invalid request. Please check your input.');
        }
        break;
      }

      case 403:
        toast.error('You do not have permission to perform this action.');
        break;

      case 404:
        toast.error('The requested resource was not found.');
        break;

      case 409:
        toast.error(data?.message || 'A conflict occurred. The resource may already exist.');
        break;

      case 422:
        toast.error(data?.message || 'Unable to process your request. Please check your input.');
        break;

      case 429:
        toast.error('Too many requests. Please try again later.');
        break;

      case 500:
      case 502:
      case 503:
      case 504:

        toast.error('Server error. Please try again later.', {
          duration: 5000,
        });
        break;

      case 'FETCH_ERROR':
      case 'NETWORK_ERROR': {
        toast.error('Network error. Please check your connection and try again.', {
          duration: 5000,
        });
        break;
      }

      case 'TIMEOUT_ERROR':
        toast.error('Request timed out. Please try again.', {
          duration: 5000,
        });
        break;

      case 'PARSING_ERROR':
        toast.error('Unable to process server response. Please try again.');
        break;

      default: {

        const message = data?.message || error?.message || 'An unexpected error occurred.';
        toast.error(message, {
          duration: 4000,
        });
        break;
      }
    }


    if (import.meta.env.DEV) {
      console.error('API Error:', {
        status,
        data,
        error,
        action,
      });
    }
  }

  return next(action);
};
