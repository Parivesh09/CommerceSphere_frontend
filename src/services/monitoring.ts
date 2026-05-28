/**
 * Centralized monitoring service
 * 
 * Provides a unified interface for all monitoring and analytics services
 * - Error tracking (Sentry)
 * - Performance monitoring (Web Vitals)
 * - Analytics (Google Analytics)
 * 
 * Validates: Requirement 14.4 (Monitoring and analytics)
 */

import { errorLogger } from './errorLogging';
import { performanceMonitor } from './performance';
import { analytics } from './analytics';

class MonitoringService {
  /**
   * Initialize all monitoring services
   * 
   * Should be called once at application startup
   */
  initialize(): void {

    errorLogger.initialize();


    performanceMonitor.initialize();


    analytics.initialize();


    if (document.readyState === 'complete') {
      performanceMonitor.trackNavigationTiming();
    } else {
      window.addEventListener('load', () => {
        performanceMonitor.trackNavigationTiming();
      });
    }

    console.log('Monitoring services initialized');
  }

  /**
   * Set user context across all services
   * 
   * @param userId - User ID
   * @param email - User email (optional)
   * @param username - Username (optional)
   * @param role - User role (optional)
   */
  setUser(userId: string, email?: string, username?: string, role?: string): void {
    errorLogger.setUser(userId, email, username);
    analytics.setUserProperties({
      userId,
      email,
      name: username,
      role,
    });
  }

  /**
   * Clear user context across all services
   * 
   * Should be called on logout
   */
  clearUser(): void {
    errorLogger.clearUser();
    analytics.clearUserProperties();
  }

  /**
   * Get error logger instance
   */
  get errors() {
    return errorLogger;
  }

  /**
   * Get performance monitor instance
   */
  get performance() {
    return performanceMonitor;
  }

  /**
   * Get analytics instance
   */
  get analytics() {
    return analytics;
  }
}


export const monitoring = new MonitoringService();


export { errorLogger, performanceMonitor, analytics };
