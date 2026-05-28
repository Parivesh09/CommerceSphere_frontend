import React from 'react';
import type { ErrorFallbackProps } from './ErrorBoundary';

/**
 * Component-level error fallback component
 * 
 * Displays a minimal error UI for individual component errors.
 * Keeps the error contained to the smallest possible area.
 * 
 * Validates: Requirement 14.1
 */
const ComponentErrorFallback: React.FC<ErrorFallbackProps> = ({ error, reset }) => {
  return (
    <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <svg
            className="h-5 w-5 text-red-500 dark:text-red-400 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-sm text-red-800 dark:text-red-200">
            Component error
          </span>
        </div>
        <button
          onClick={reset}
          className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
      {import.meta.env.DEV && error && (
        <details className="mt-2">
          <summary className="cursor-pointer text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200">
            Details
          </summary>
          <pre className="mt-1 text-xs text-red-700 dark:text-red-300 overflow-auto max-h-24">
            {error.message}
          </pre>
        </details>
      )}
    </div>
  );
};

export default ComponentErrorFallback;
