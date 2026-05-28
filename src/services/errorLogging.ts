import * as Sentry from '@sentry/react';

/**
 * Error logging service for centralized error tracking
 * 
 * Provides a unified interface for logging errors to monitoring services
 * (e.g., Sentry, LogRocket) while showing user-friendly messages.
 * 
 * Validates: Requirement 14.4 (Errors are logged and user-friendly messages shown)
 */

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  metadata?: Record<string, unknown>;
}

export interface LoggedError {
  message: string;
  stack?: string | undefined;
  name: string;
  timestamp: string;
  context?: ErrorContext;
  userAgent: string;
  url: string;
  level: 'error' | 'warning' | 'info';
}

class ErrorLoggingService {
  private isInitialized = false;
  private errorQueue: LoggedError[] = [];

  /**
   * Initialize the error logging service with Sentry
   * 
   * Integrates Sentry for error tracking and performance monitoring
   */
  initialize(): void {
    if (this.isInitialized) {
      return;
    }


    const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
    const enableErrorTracking = import.meta.env.VITE_ENABLE_ERROR_TRACKING === 'true';

    if (sentryDsn && enableErrorTracking) {
      Sentry.init({
        dsn: sentryDsn,
        environment: import.meta.env.MODE,

        tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0, // 10% in production, 100% in dev

        replaysSessionSampleRate: 0.1, // 10% of sessions
        replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors
        integrations: [
          Sentry.browserTracingIntegration(),
          Sentry.replayIntegration({
            maskAllText: true,
            blockAllMedia: true,
          }),
        ],

        release: import.meta.env.VITE_APP_VERSION,

        ignoreErrors: [
          'ResizeObserver loop limit exceeded',
          'Non-Error promise rejection captured',
          'Network request failed',
        ],

        beforeSend(event, hint) {

          if (hint.originalException instanceof Error) {
            event.contexts = {
              ...event.contexts,
              app: {
                name: import.meta.env.VITE_APP_NAME,
                version: import.meta.env.VITE_APP_VERSION,
              },
            };
          }
          return event;
        },
      });

      console.log('Sentry error tracking initialized');
    } else if (import.meta.env.DEV) {
      console.log('Error logging service initialized (development mode)');
    }

    this.isInitialized = true;


    this.flushQueue();
  }

  /**
   * Log an error with context
   * 
   * @param error - The error to log
   * @param context - Additional context about where/why the error occurred
   * @param level - Severity level of the error
   */
  logError(
    error: Error | string,
    context?: ErrorContext,
    level: 'error' | 'warning' | 'info' = 'error'
  ): void {
    const errorObj = typeof error === 'string' ? new Error(error) : error;

    const loggedError: LoggedError = {
      message: errorObj.message,
      name: errorObj.name,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      level,
      ...(errorObj.stack && { stack: errorObj.stack }),
      ...(context && { context }),
    };


    if (import.meta.env.DEV) {
      console.group(`[${level.toUpperCase()}] ${errorObj.name}`);
      console.error('Message:', errorObj.message);
      if (context) {
        console.log('Context:', context);
      }
      if (errorObj.stack) {
        console.log('Stack:', errorObj.stack);
      }
      console.groupEnd();
    }


    if (this.isInitialized && import.meta.env.VITE_ENABLE_ERROR_TRACKING === 'true') {
      Sentry.captureException(errorObj, {
        level: level as Sentry.SeverityLevel,
        contexts: {
          error: {
            ...context,
          },
        },
        tags: {
          component: context?.component,
          action: context?.action,
        },
        extra: context?.metadata,
      });
    } else if (import.meta.env.PROD) {

      if (!this.isInitialized) {
        this.errorQueue.push(loggedError);
      }
    }
  }

  /**
   * Log an API error
   * 
   * @param error - The API error response
   * @param endpoint - The API endpoint that failed
   * @param method - The HTTP method used
   */
  logApiError(
    error: unknown,
    endpoint: string,
    method: string = 'GET'
  ): void {
    const errorMessage = this.extractErrorMessage(error);
    
    this.logError(
      new Error(`API Error: ${method} ${endpoint} - ${errorMessage}`),
      {
        action: 'api_request',
        metadata: {
          endpoint,
          method,
          error,
        },
      }
    );
  }

  /**
   * Log a React error boundary error
   * 
   * @param error - The error caught by the boundary
   * @param errorInfo - React error info with component stack
   * @param boundaryLevel - The level of the error boundary
   */
  logBoundaryError(
    error: Error,
    errorInfo: React.ErrorInfo,
    boundaryLevel: string
  ): void {
    this.logError(error, {
      component: 'ErrorBoundary',
      metadata: {
        boundaryLevel,
        componentStack: errorInfo.componentStack,
      },
    });
  }

  /**
   * Log a warning (non-critical error)
   * 
   * @param message - Warning message
   * @param context - Additional context
   */
  logWarning(message: string, context?: ErrorContext): void {
    this.logError(new Error(message), context, 'warning');
  }

  /**
   * Log an info message
   * 
   * @param message - Info message
   * @param context - Additional context
   */
  logInfo(message: string, context?: ErrorContext): void {
    this.logError(new Error(message), context, 'info');
  }

  /**
   * Extract a user-friendly error message from various error types
   */
  private extractErrorMessage(error: unknown): string {
    if (typeof error === 'string') {
      return error;
    }

    if (error instanceof Error) {
      return error.message;
    }

    if (typeof error === 'object' && error !== null) {
      if ('message' in error && typeof error['message'] === 'string') {
        return error['message'];
      }
      if ('data' in error && typeof error.data === 'object' && error.data !== null) {
        const data = error.data as Record<string, unknown>;
        if ('message' in data && typeof data['message'] === 'string') {
          return data['message'];
        }
      }
    }

    return 'An unknown error occurred';
  }

  /**
   * Send error to monitoring service
   * 
   * Sends errors to Sentry with proper context
   */
  private sendToMonitoring(error: LoggedError): void {
    if (import.meta.env.VITE_ENABLE_ERROR_TRACKING === 'true') {
      Sentry.captureException(new Error(error.message), {
        level: error.level as Sentry.SeverityLevel,
        contexts: {
          error: {
            ...error.context,
          },
        },
        tags: {
          component: error.context?.component,
          action: error.context?.action,
        },
        extra: {
          ...error.context?.metadata,
          timestamp: error.timestamp,
          url: error.url,
          userAgent: error.userAgent,
        },
      });
    }
  }

  /**
   * Flush queued errors to monitoring service
   */
  private flushQueue(): void {
    while (this.errorQueue.length > 0) {
      const error = this.errorQueue.shift();
      if (error) {
        this.sendToMonitoring(error);
      }
    }
  }

  /**
   * Set user context for error tracking
   * 
   * @param userId - User ID to associate with errors
   * @param email - User email (optional)
   * @param username - Username (optional)
   */
  setUser(userId: string, email?: string, username?: string): void {
    if (import.meta.env.VITE_ENABLE_ERROR_TRACKING === 'true') {
      Sentry.setUser({ id: userId, email, username });
    }
    if (import.meta.env.DEV) {
      console.log('User context set:', { userId, email, username });
    }
  }

  /**
   * Clear user context (e.g., on logout)
   */
  clearUser(): void {
    if (import.meta.env.VITE_ENABLE_ERROR_TRACKING === 'true') {
      Sentry.setUser(null);
    }
    if (import.meta.env.DEV) {
      console.log('User context cleared');
    }
  }
}


export const errorLogger = new ErrorLoggingService();


if (typeof window !== 'undefined') {
  errorLogger.initialize();
}
