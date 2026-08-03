import React from 'react';
import type { ErrorFallbackProps } from './ErrorBoundary';

/**
 * Feature-level error fallback component
 * 
 * Displays an error UI for feature-specific errors while keeping the rest
 * of the page functional. Provides a retry option.
 * 
 * Validates: Requirement 14.1
 */
const FeatureErrorFallback: React.FC<ErrorFallbackProps> = ({ error, reset }) => {
  return (
    <div className="p-6 bg-warning/10 border border-warning/30 rounded-lg">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg
            className="h-6 w-6 text-warning"
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
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-warning">
            Feature Unavailable
          </h3>
          <p className="mt-1 text-sm text-warning">
            This feature encountered an error and is temporarily unavailable.
            The rest of the page should still work normally.
          </p>
          {import.meta.env.DEV && error && (
            <details className="mt-2">
              <summary className="cursor-pointer text-xs text-warning hover:text-[var(--color-on-warning-container)]">
                Error details (development only)
              </summary>
              <pre className="mt-2 text-xs text-warning overflow-auto max-h-32 p-2 bg-warning/10 rounded">
                {error.message}
              </pre>
            </details>
          )}
          <div className="mt-4">
            <button
              onClick={reset}
              className="px-4 py-2 bg-warning text-on-warning rounded-md hover:bg-warning/90 transition-colors text-sm font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureErrorFallback;
