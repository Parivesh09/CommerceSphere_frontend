/**
 * useTouchGestures hook
 * Provides touch gesture support for mobile devices
 * 
 * Validates: Requirements 12.3
 */

import { useRef, useEffect, useCallback, useMemo } from 'react';

export interface TouchGestureHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onTap?: () => void;
  onDoubleTap?: () => void;
  onLongPress?: () => void;
}

export interface TouchGestureOptions {
  /**
   * Minimum distance in pixels to register a swipe
   * @default 50
   */
  swipeThreshold?: number;
  /**
   * Maximum time in ms for a swipe gesture
   * @default 300
   */
  swipeTimeout?: number;
  /**
   * Time in ms to register a long press
   * @default 500
   */
  longPressDelay?: number;
  /**
   * Maximum time in ms between taps for double tap
   * @default 300
   */
  doubleTapDelay?: number;
}

const DEFAULT_OPTIONS: Required<TouchGestureOptions> = {
  swipeThreshold: 50,
  swipeTimeout: 300,
  longPressDelay: 500,
  doubleTapDelay: 300,
};

/**
 * Hook to handle touch gestures on an element
 */
export function useTouchGestures<T extends HTMLElement = HTMLDivElement>(
  handlers: TouchGestureHandlers,
  options: TouchGestureOptions = {}
) {
  const elementRef = useRef<T>(null);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const lastTapRef = useRef<number>(0);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const opts = useMemo(() => ({ ...DEFAULT_OPTIONS, ...options }), [options]);

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };


      if (handlers.onLongPress) {
        longPressTimerRef.current = setTimeout(() => {
          handlers.onLongPress?.();
          touchStartRef.current = null; // Prevent other gestures
        }, opts.longPressDelay);
      }
    },
    [handlers, opts.longPressDelay]
  );

  const handleTouchMove = useCallback(() => {

    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {

      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }

      if (!touchStartRef.current) return;

      const touch = e.changedTouches[0];
      if (!touch) return;
      
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;
      const deltaTime = Date.now() - touchStartRef.current.time;

      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);


      if (deltaTime < opts.swipeTimeout) {
        if (absDeltaX > opts.swipeThreshold && absDeltaX > absDeltaY) {

          if (deltaX > 0) {
            handlers.onSwipeRight?.();
          } else {
            handlers.onSwipeLeft?.();
          }
          touchStartRef.current = null;
          return;
        } else if (absDeltaY > opts.swipeThreshold && absDeltaY > absDeltaX) {

          if (deltaY > 0) {
            handlers.onSwipeDown?.();
          } else {
            handlers.onSwipeUp?.();
          }
          touchStartRef.current = null;
          return;
        }
      }


      if (absDeltaX < 10 && absDeltaY < 10 && deltaTime < 300) {
        const now = Date.now();
        const timeSinceLastTap = now - lastTapRef.current;

        if (timeSinceLastTap < opts.doubleTapDelay && handlers.onDoubleTap) {

          handlers.onDoubleTap();
          lastTapRef.current = 0; // Reset to prevent triple tap
        } else {

          handlers.onTap?.();
          lastTapRef.current = now;
        }
      }

      touchStartRef.current = null;
    },
    [handlers, opts]
  );

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;


    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);


      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return elementRef;
}

/**
 * Detect if device supports touch
 */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0
  );
}

/**
 * Hook to detect if current device is touch-enabled
 */
export function useIsTouchDevice(): boolean {
  return isTouchDevice();
}
