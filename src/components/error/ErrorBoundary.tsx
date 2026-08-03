import React, { Component } from 'react';
import type { ReactNode } from 'react';

/**
 * Error boundary levels for hierarchical error handling
 * 
 * - root: Catches catastrophic errors, displays full-page fallback
 * - route: Catches route-level errors, allows navigation to other routes
 * - feature: Catches feature-specific errors, displays feature-level fallback
 * - component: Catches individual component errors, displays component-level fallback
 * 
 * Validates: Requirement 14.1
 */
export type ErrorBoundaryLevel = 'root' | 'route' | 'feature' | 'component';

interface ErrorBoundaryProps {
  level: ErrorBoundaryLevel;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export interface ErrorFallbackProps {
  error: Error | null;
  reset: () => void;
  level: ErrorBoundaryLevel;
}

/**
 * Hierarchical Error Boundary Component
 * 
 * Catches React errors at different levels of the component tree and displays
 * appropriate fallback UI. Supports custom fallback components and error logging.
 * 
 * Validates: Requirement 14.1 (Error boundaries catch React errors)
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {

    console.error(`[ErrorBoundary:${this.props.level}]`, error, errorInfo);


    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }


    this.logErrorToService(error, errorInfo);
  }

  private logErrorToService(error: Error, errorInfo: React.ErrorInfo): void {

    import('../../services/errorLogging').then(({ errorLogger }) => {
      errorLogger.logBoundaryError(error, errorInfo, this.props.level);
    });
  }

  private reset = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return (
        <FallbackComponent
          error={this.state.error}
          reset={this.reset}
          level={this.props.level}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * Default error fallback component
 * 
 * Provides a basic error UI when no custom fallback is specified
 */
const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({ error, reset, level }) => {
  const getLevelMessage = () => {
    switch (level) {
      case 'root':
        return 'The application encountered a critical error.';
      case 'route':
        return 'This page encountered an error.';
      case 'feature':
        return 'This feature encountered an error.';
      case 'component':
        return 'This component encountered an error.';
      default:
        return 'An error occurred.';
    }
  };

  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center p-8 text-center"
    >
      <div className="mb-4 text-error">
        <svg
          className="h-16 w-16 mx-auto"
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
      <h2 className="text-2xl font-bold mb-2 text-[var(--color-on-surface)]">
        Oops! Something went wrong
      </h2>
      <p className="text-[var(--color-on-surface-variant)] mb-4">{getLevelMessage()}</p>
      {import.meta.env.DEV && error && (
        <details className="mb-4 text-left max-w-2xl w-full">
          <summary className="cursor-pointer text-sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]">
            Error details (development only)
          </summary>
          <pre className="mt-2 p-4 bg-[var(--color-surface-container-high)] rounded text-xs overflow-auto">
            {error.message}
            {'\n\n'}
            {error.stack}
          </pre>
        </details>
      )}
      <button
        onClick={reset}
        className="px-6 py-2 bg-[var(--color-primary)] text-on-primary rounded-lg hover:bg-[var(--color-primary)]/90 transition-colors"
      >
        Try Again
      </button>
    </div>
  );
};

export default ErrorBoundary;
