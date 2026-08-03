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
    <div className="p-4 bg-error/10 border border-error/30 rounded-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <svg
            className="h-5 w-5 text-error mr-2"
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
          <span className="text-sm text-error">
            Component error
          </span>
        </div>
        <button
          onClick={reset}
          className="px-3 py-1 bg-error text-on-error rounded text-xs hover:brightness-110 transition-colors"
        >
          Retry
        </button>
      </div>
      {import.meta.env.DEV && error && (
        <details className="mt-2">
          <summary className="cursor-pointer text-xs text-error hover:opacity-80">
            Details
          </summary>
          <pre className="mt-1 text-xs text-on-surface-variant overflow-auto max-h-24">
            {error.message}
          </pre>
        </details>
      )}
    </div>
  );
};

export default ComponentErrorFallback;
