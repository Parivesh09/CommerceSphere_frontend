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
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/20 mb-4">
            <svg
              className="w-8 h-8 text-orange-600 dark:text-orange-400"
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Page Error
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            This page encountered an error and couldn't load properly.
            You can try again or navigate to a different page.
          </p>
        </div>

        {import.meta.env.DEV && error && (
          <details className="mb-6 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mb-2">
              Error details (development only)
            </summary>
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <p className="text-sm font-semibold text-orange-600 dark:text-orange-400 mb-2">
                {error.name}: {error.message}
              </p>
              <pre className="text-xs text-gray-700 dark:text-gray-300 overflow-auto max-h-40">
                {error.stack}
              </pre>
            </div>
          </details>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Try Again
          </button>
          <button
            onClick={handleGoBack}
            className="px-5 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
          >
            Go Back
          </button>
          <button
            onClick={handleGoHome}
            className="px-5 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default RouteErrorFallback;
