/**
 * Performance optimization hooks
 * 
 * Provides hooks for optimizing component re-renders
 * 
 * Validates: Requirement 16.4
 */

import { useCallback, useRef, useEffect, useState } from 'react';

/**
 * Hook that returns a stable callback reference that always calls the latest version
 * Useful when you want a stable reference but don't want to memoize dependencies
 * 
 * @param callback - The callback function
 * @returns Stable callback reference
 */
export function useStableCallback<T extends (...args: unknown[]) => unknown>(
  callback: T
): T {
  const callbackRef = useRef(callback);
  
  useEffect(() => {
    callbackRef.current = callback;
  });
  
   
  return useCallback((...args: unknown[]) => callbackRef.current(...args), []) as T;
}

/**
 * Hook that debounces a value
 * Useful for search inputs, resize handlers, etc.
 * 
 * @param value - Value to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
}

/**
 * Hook that throttles a callback
 * Ensures callback is called at most once per interval
 * 
 * @param callback - Callback to throttle
 * @param interval - Minimum interval between calls in milliseconds
 * @returns Throttled callback
 */
export function useThrottle<T extends (...args: unknown[]) => unknown>(
  callback: T,
  interval: number
): T {
  const lastCall = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  
   
  return useCallback(
    (...args: unknown[]) => {
      const now = Date.now();
      const timeSinceLastCall = now - lastCall.current;
      
      if (timeSinceLastCall >= interval) {
        lastCall.current = now;
        callback(...args);
      } else {

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          lastCall.current = Date.now();
          callback(...args);
        }, interval - timeSinceLastCall);
      }
    },
    [callback, interval]
  ) as T;
}

/**
 * Hook that tracks previous value
 * Useful for comparing current and previous values
 * 
 * @param value - Current value
 * @returns Previous value
 */
export function usePrevious<T>(value: T): T | undefined {
  const [state, setState] = useState<{ value: T; prev: T | undefined }>({ value, prev: undefined });
  if (state.value !== value) {
    setState({ value, prev: state.value });
  }
  return state.prev;
}

/**
 * Hook that only updates when value actually changes (deep comparison)
 * Useful for preventing unnecessary re-renders with object/array props
 * 
 * @param value - Value to memoize
 * @returns Memoized value that only changes when deeply different
 */
export function useDeepMemo<T>(value: T): T {
  const [state, setState] = useState<{ value: T; memoized: T }>({ value, memoized: value });
  if (JSON.stringify(state.value) !== JSON.stringify(value)) {
    setState({ value, memoized: value });
  }
  return state.memoized;
}

/**
 * Hook that measures component render time (development only)
 * 
 * @param componentName - Name of the component
 */
export function useRenderTime(componentName: string): void {
  const lastRunRef = useRef<number>(0);

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const now = performance.now();
    const duration = lastRunRef.current > 0 ? now - lastRunRef.current : 0;
    if (duration > 16) {
      console.warn(`[Performance] ${componentName} render cycle took ${duration.toFixed(2)}ms`);
    }
    lastRunRef.current = now;
  });
}

/**
 * Hook that tracks component mount/unmount for debugging
 * 
 * @param componentName - Name of the component
 */
export function useComponentLifecycle(componentName: string): void {
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log(`[Lifecycle] ${componentName} mounted`);
      
      return () => {
        console.log(`[Lifecycle] ${componentName} unmounted`);
      };
    }
    return undefined;
  }, [componentName]);
}

