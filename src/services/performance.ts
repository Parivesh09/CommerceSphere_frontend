import { onCLS, onINP, onFCP, onLCP, onTTFB, type Metric } from 'web-vitals';
import * as Sentry from '@sentry/react';

/**
 * Performance monitoring service using Web Vitals
 * 
 * Tracks Core Web Vitals and sends them to monitoring services
 * - LCP (Largest Contentful Paint): Loading performance
 * - FID (First Input Delay): Interactivity
 * - CLS (Cumulative Layout Shift): Visual stability
 * - FCP (First Contentful Paint): Initial render
 * - TTFB (Time to First Byte): Server response time
 * 
 * Validates: Requirement 14.4 (Performance monitoring)
 */

export interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  navigationType: string;
}

class PerformanceMonitoringService {
  private isInitialized = false;
  private metrics: Map<string, PerformanceMetric> = new Map();

  /**
   * Initialize performance monitoring
   * 
   * Sets up Web Vitals tracking and reporting
   */
  initialize(): void {
    if (this.isInitialized) {
      return;
    }

    const enableTracking = import.meta.env.VITE_ENABLE_ERROR_TRACKING === 'true';

    if (enableTracking) {

      onCLS(this.handleMetric.bind(this));
      onINP(this.handleMetric.bind(this)); // INP replaced FID in web-vitals v3
      onFCP(this.handleMetric.bind(this));
      onLCP(this.handleMetric.bind(this));
      onTTFB(this.handleMetric.bind(this));

      console.log('Performance monitoring initialized');
    }

    this.isInitialized = true;
  }

  /**
   * Handle a Web Vitals metric
   * 
   * @param metric - The Web Vitals metric
   */
  private handleMetric(metric: Metric): void {
    const performanceMetric: PerformanceMetric = {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
      navigationType: metric.navigationType,
    };


    this.metrics.set(metric.name, performanceMetric);


    if (import.meta.env.DEV) {
      console.log(`[Performance] ${metric.name}:`, {
        value: Math.round(metric.value),
        rating: metric.rating,
      });
    }


    if (import.meta.env.VITE_ENABLE_ERROR_TRACKING === 'true') {
      Sentry.setMeasurement(metric.name, metric.value, 'millisecond');
    }


    this.sendToAnalytics(performanceMetric);
  }

  /**
   * Send performance metric to analytics
   * 
   * @param metric - The performance metric to send
   */
  private sendToAnalytics(metric: PerformanceMetric): void {

    if (typeof window !== 'undefined' && 'gtag' in window) {
      const gtag = (window as any).gtag;
      gtag('event', metric.name, {
        event_category: 'Web Vitals',
        event_label: metric.id,
        value: Math.round(metric.value),
        metric_rating: metric.rating,
        non_interaction: true,
      });
    }


    if (import.meta.env['VITE_ANALYTICS_ENDPOINT']) {
      this.sendToCustomEndpoint(metric);
    }
  }

  /**
   * Send metric to custom analytics endpoint
   * 
   * @param metric - The performance metric to send
   */
  private async sendToCustomEndpoint(metric: PerformanceMetric): Promise<void> {
    try {
      const endpoint = import.meta.env['VITE_ANALYTICS_ENDPOINT'];
      if (!endpoint) return;
      
      await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'performance',
          metric,
          timestamp: new Date().toISOString(),
          url: window.location.href,
          userAgent: navigator.userAgent,
        }),
      });
    } catch (error) {

      console.error('Failed to send performance metric:', error);
    }
  }

  /**
   * Get all collected metrics
   * 
   * @returns Map of metric names to metric data
   */
  getMetrics(): Map<string, PerformanceMetric> {
    return new Map(this.metrics);
  }

  /**
   * Get a specific metric by name
   * 
   * @param name - The metric name (e.g., 'LCP', 'FID', 'CLS')
   * @returns The metric data or undefined
   */
  getMetric(name: string): PerformanceMetric | undefined {
    return this.metrics.get(name);
  }

  /**
   * Track a custom performance mark
   * 
   * @param name - The mark name
   */
  mark(name: string): void {
    if ('performance' in window && 'mark' in window.performance) {
      window.performance.mark(name);
    }
  }

  /**
   * Measure time between two marks
   * 
   * @param name - The measure name
   * @param startMark - The start mark name
   * @param endMark - The end mark name (optional, defaults to now)
   * @returns The measured duration in milliseconds
   */
  measure(name: string, startMark: string, endMark?: string): number | null {
    if ('performance' in window && 'measure' in window.performance) {
      try {
        const measure = window.performance.measure(name, startMark, endMark);
        

        if (import.meta.env.DEV) {
          console.log(`[Performance] ${name}: ${Math.round(measure.duration)}ms`);
        }


        if (import.meta.env.VITE_ENABLE_ERROR_TRACKING === 'true') {
          Sentry.setMeasurement(name, measure.duration, 'millisecond');
        }

        return measure.duration;
      } catch (error) {
        console.error('Failed to measure performance:', error);
        return null;
      }
    }
    return null;
  }

  /**
   * Track navigation timing
   * 
   * Captures detailed navigation timing metrics
   */
  trackNavigationTiming(): void {
    if ('performance' in window && 'getEntriesByType' in window.performance) {
      const [navigation] = window.performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      
      if (navigation) {
        const metrics = {
          dns: navigation.domainLookupEnd - navigation.domainLookupStart,
          tcp: navigation.connectEnd - navigation.connectStart,
          request: navigation.responseStart - navigation.requestStart,
          response: navigation.responseEnd - navigation.responseStart,
          dom: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          load: navigation.loadEventEnd - navigation.loadEventStart,
        };

        if (import.meta.env.DEV) {
          console.log('[Performance] Navigation Timing:', metrics);
        }


        if (import.meta.env.VITE_ENABLE_ERROR_TRACKING === 'true') {
          Object.entries(metrics).forEach(([key, value]) => {
            Sentry.setMeasurement(`navigation.${key}`, value, 'millisecond');
          });
        }
      }
    }
  }

  /**
   * Track resource timing
   * 
   * Captures timing for specific resources
   * 
   * @param resourceType - The type of resource to track (e.g., 'script', 'stylesheet', 'image')
   */
  trackResourceTiming(resourceType?: string): void {
    if ('performance' in window && 'getEntriesByType' in window.performance) {
      const resources = window.performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      
      const filtered = resourceType
        ? resources.filter(r => r.initiatorType === resourceType)
        : resources;

      const summary = {
        count: filtered.length,
        totalDuration: filtered.reduce((sum, r) => sum + r.duration, 0),
        avgDuration: filtered.length > 0 
          ? filtered.reduce((sum, r) => sum + r.duration, 0) / filtered.length 
          : 0,
      };

      if (import.meta.env.DEV) {
        console.log(`[Performance] Resource Timing (${resourceType || 'all'}):`, summary);
      }
    }
  }
}


export const performanceMonitor = new PerformanceMonitoringService();


if (typeof window !== 'undefined') {

  if (document.readyState === 'complete') {
    performanceMonitor.initialize();
  } else {
    window.addEventListener('load', () => {
      performanceMonitor.initialize();
    });
  }
}
