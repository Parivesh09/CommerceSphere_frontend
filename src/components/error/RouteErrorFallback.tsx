import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { ErrorFallbackProps } from './ErrorBoundary';

/**
 * Route-level error fallback component
 * 
 * Displays an error UI for route-level errors while allowing navigation
 * to other routes. Provides options to retry, go back, or return home.
 * 
 * Validates: Requirement 14.1
 */
const RouteErrorFallback: React.FC<ErrorFallbackProps> = ({ error, reset }) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-warning/10 mb-4">
            <svg
              className="w-8 h-8 text-warning"
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
          </div>
          <h2 className="text-2xl font-bold text-[var(--color-on-surface)] mb-2">
            Page Error
          </h2>
          <p className="text-[var(--color-on-surface-variant)] mb-6">
            This page encountered an error and couldn't load properly.
            You can try again or navigate to a different page.
          </p>
        </div>

        {import.meta.env.DEV && error && (
          <details className="mb-6 text-left">
            <summary className="cursor-pointer text-sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] mb-2">
              Error details (development only)
            </summary>
            <div className="p-4 bg-[var(--color-surface-container-high)] rounded-lg">
              <p className="text-sm font-semibold text-warning mb-2">
                {error.name}: {error.message}
              </p>
              <pre className="text-xs text-[var(--color-on-surface-variant)] overflow-auto max-h-40">
                {error.stack}
              </pre>
            </div>
          </details>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-5 py-2.5 bg-[var(--color-primary)] text-on-primary rounded-lg hover:bg-[var(--color-primary)]/90 transition-colors font-medium"
          >
            Try Again
          </button>
          <button
            onClick={handleGoBack}
            className="px-5 py-2.5 bg-[var(--color-surface-container-high)] text-[var(--color-on-surface)] rounded-lg hover:bg-[var(--color-surface-container)] transition-colors font-medium"
          >
            Go Back
          </button>
          <button
            onClick={handleGoHome}
            className="px-5 py-2.5 bg-[var(--color-surface-container-high)] text-[var(--color-on-surface)] rounded-lg hover:bg-[var(--color-surface-container)] transition-colors font-medium"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default RouteErrorFallback;
