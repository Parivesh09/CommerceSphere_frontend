/**
 * Performance optimization hooks
 * 
 * Provides hooks for optimizing component re-renders
 * 
 * Validates: Requirement 16.4
 */

import { useCallback, useMemo, useRef, useEffect, useState } from 'react';

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
  
   
  return useCallback(((...args: unknown[]) => callbackRef.current(...args)) as T, []);
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
    ((...args: unknown[]) => {
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
    }) as T,
    [callback, interval]
  );
}

/**
 * Hook that tracks previous value
 * Useful for comparing current and previous values
 * 
 * @param value - Current value
 * @returns Previous value
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  
  useEffect(() => {
    ref.current = value;
  }, [value]);
  
  return ref.current;
}

/**
 * Hook that only updates when value actually changes (deep comparison)
 * Useful for preventing unnecessary re-renders with object/array props
 * 
 * @param value - Value to memoize
 * @returns Memoized value that only changes when deeply different
 */
export function useDeepMemo<T>(value: T): T {
  const ref = useRef<T>(value);
  const prevValueRef = useRef<string | undefined>(undefined);
  
  const currentValue = useMemo(() => JSON.stringify(value), [value]);
  
  useEffect(() => {
    if (prevValueRef.current !== currentValue) {
      ref.current = value;
      prevValueRef.current = currentValue;
    }
  }, [value, currentValue]);
  
  return ref.current;
}

/**
 * Hook that measures component render time (development only)
 * 
 * @param componentName - Name of the component
 */
export function useRenderTime(componentName: string): void {
  const renderStart = useRef<number>(0);
  

  renderStart.current = performance.now();
  
  useEffect(() => {
    if (import.meta.env.DEV) {
      const renderEnd = performance.now();
      const duration = renderEnd - renderStart.current;
      
      if (duration > 16) { // Longer than one frame (60fps)
        console.warn(`[Performance] ${componentName} render took ${duration.toFixed(2)}ms`);
      }
    }
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

