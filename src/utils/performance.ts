/**
 * Performance optimization utilities
 * 
 * Provides utilities for:
 * - Route prefetching
 * - Component memoization helpers
 * - Performance monitoring
 * 
 * Validates: Requirements 16.1, 16.4, 16.5
 */

/**
 * Prefetch a route by dynamically importing it
 * This loads the route's code in the background without navigating
 * 
 * @param importFn - The dynamic import function for the route
 * @returns Promise that resolves when the route is loaded
 */
export function prefetchRoute(importFn: () => Promise<any>): Promise<void> {
  return importFn().then(() => {

  }).catch((error) => {
    console.warn('Failed to prefetch route:', error);
  });
}

/**
 * Prefetch multiple routes in parallel
 * 
 * @param importFns - Array of dynamic import functions
 * @returns Promise that resolves when all routes are loaded
 */
export function prefetchRoutes(importFns: Array<() => Promise<any>>): Promise<void[]> {
  return Promise.all(importFns.map(fn => prefetchRoute(fn)));
}

/**
 * Create a prefetch handler for mouse enter events
 * Useful for prefetching routes when user hovers over a link
 * 
 * @param importFn - The dynamic import function for the route
 * @returns Event handler function
 */
export function createPrefetchHandler(importFn: () => Promise<any>) {
  let prefetched = false;
  
  return () => {
    if (!prefetched) {
      prefetched = true;
      prefetchRoute(importFn);
    }
  };
}

/**
 * Check if a value has changed for memoization purposes
 * Useful for custom comparison in React.memo
 * 
 * @param prev - Previous value
 * @param next - Next value
 * @returns true if values are equal (should NOT re-render)
 */
export function shallowEqual<T extends Record<string, any>>(prev: T, next: T): boolean {
  const prevKeys = Object.keys(prev);
  const nextKeys = Object.keys(next);
  
  if (prevKeys.length !== nextKeys.length) {
    return false;
  }
  
  return prevKeys.every(key => prev[key] === next[key]);
}

/**
 * Create a stable callback that only changes when dependencies change
 * This is a helper to reduce boilerplate with useCallback
 * 
 * Note: This is just a type helper, actual implementation uses React.useCallback
 */
export type StableCallback<T extends (...args: any[]) => any> = T;

/**
 * Debounce a function call
 * Useful for expensive operations like search or resize handlers
 * 
 * @param fn - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Throttle a function call
 * Ensures function is called at most once per specified interval
 * 
 * @param fn - Function to throttle
 * @param interval - Minimum interval between calls in milliseconds
 * @returns Throttled function
 */
export function throttle<T extends (...args: any[]) => unknown>(
  fn: T,
  interval: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= interval) {
      lastCall = now;
      fn(...args);
    }
  };
}

/**
 * Measure component render time (development only)
 * 
 * @param componentName - Name of the component being measured
 * @param callback - Function to measure
 */
export function measureRender(componentName: string, callback: () => void): void {
  if (import.meta.env.DEV) {
    const start = performance.now();
    callback();
    const end = performance.now();
    const duration = end - start;
    
    if (duration > 16) { // Longer than one frame (60fps)
      console.warn(`[Performance] ${componentName} render took ${duration.toFixed(2)}ms`);
    }
  } else {
    callback();
  }
}

/**
 * Check if the browser supports a feature
 * Useful for progressive enhancement
 */
export const browserSupports = {
  intersectionObserver: typeof IntersectionObserver !== 'undefined',
  webp: (() => {
    if (typeof document === 'undefined') return false;
    const canvas = document.createElement('canvas');
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  })(),
  lazyLoading: typeof HTMLImageElement !== 'undefined' && 'loading' in HTMLImageElement.prototype,
};

/**
 * Get optimal image size based on viewport width
 * 
 * @param viewportWidth - Current viewport width
 * @returns Recommended image width
 */
export function getOptimalImageSize(viewportWidth: number): number {
  if (viewportWidth < 640) return 640;
  if (viewportWidth < 1024) return 1024;
  if (viewportWidth < 1536) return 1536;
  return 2048;
}

/**
 * Generate srcset string for responsive images
 * 
 * @param baseUrl - Base URL of the image
 * @param sizes - Array of image widths to include
 * @returns srcset string
 */
export function generateSrcSet(baseUrl: string, sizes: number[]): string {
  return sizes
    .map(size => {
      const url = baseUrl.includes('?') 
        ? `${baseUrl}&w=${size}` 
        : `${baseUrl}?w=${size}`;
      return `${url} ${size}w`;
    })
    .join(', ');
}

/**
 * Generate sizes attribute for responsive images
 * 
 * @param breakpoints - Object mapping breakpoints to sizes
 * @returns sizes string
 */
export function generateSizes(breakpoints: Record<string, string>): string {
  const entries = Object.entries(breakpoints);
  if (entries.length === 0) {
    return '100vw';
  }
  const mediaQueries = entries.slice(0, -1).map(([bp, size]) => `(max-width: ${bp}) ${size}`);
  const defaultSize = entries[entries.length - 1]?.[1] || '100vw';
  
  return [...mediaQueries, defaultSize].join(', ');
}
