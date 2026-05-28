import React from 'react';
import type { ErrorFallbackProps } from './ErrorBoundary';

/**
 * Root-level error fallback component
 * 
 * Displays a full-page error UI for catastrophic errors that prevent
 * the entire application from functioning. Provides options to reload
 * the page or return to home.
 * 
 * Validates: Requirement 14.1
 */
const RootErrorFallback: React.FC<ErrorFallbackProps> = ({ error, reset }) => {
  const handleReload = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
            <svg
              className="w-10 h-10 text-red-600 dark:text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Application Error
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We're sorry, but the application encountered a critical error and cannot continue.
            Please try reloading the page.
          </p>
        </div>

        {import.meta.env.DEV && error && (
          <details className="mb-6 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mb-2">
              Error details (development only)
            </summary>
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <p className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2">
                {error.name}: {error.message}
              </p>
              <pre className="text-xs text-gray-700 dark:text-gray-300 overflow-auto max-h-48">
                {error.stack}
              </pre>
            </div>
          </details>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Try Again
          </button>
          <button
            onClick={handleReload}
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
          >
            Reload Page
          </button>
        </div>

        <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
          If this problem persists, please contact support.
        </p>
      </div>
    </div>
  );
};

export default RootErrorFallback;
