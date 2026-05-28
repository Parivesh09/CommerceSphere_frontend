/**
 * Hook to detect user's motion preferences
 * 
 * Respects the prefers-reduced-motion media query to provide
 * accessible animations for users with motion sensitivity.
 * 
 * Validates: Requirement 11.5
 */

import { useEffect, useState } from 'react';
import type { Variants } from 'framer-motion';

/**
 * Custom hook to detect if user prefers reduced motion
 * 
 * @returns boolean indicating if reduced motion is preferred
 * 
 * @example
 * ```tsx
 * const prefersReducedMotion = useReducedMotion();
 * 
 * <motion.div
 *   animate={prefersReducedMotion ? {} : { scale: 1.1 }}
 * />
 * ```
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {

    if (typeof window === 'undefined' || !window.matchMedia) {
      return false;
    }
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {

    if (typeof window === 'undefined' || !window.matchMedia) {
      return undefined;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');


    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };


    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }

    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
    return undefined;
  }, []);

  return prefersReducedMotion;
}

/**
 * Get animation configuration based on reduced motion preference
 * 
 * @param prefersReducedMotion - Whether user prefers reduced motion
 * @returns Animation configuration object
 * 
 * @example
 * ```tsx
 * const prefersReducedMotion = useReducedMotion();
 * const animationConfig = getAnimationConfig(prefersReducedMotion);
 * 
 * <motion.div {...animationConfig} />
 * ```
 */
export function getAnimationConfig(prefersReducedMotion: boolean) {
  if (prefersReducedMotion) {
    return {
      initial: false,
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.01 },
    };
  }
  
  return {};
}

/**
 * Conditionally apply animation variants based on reduced motion preference
 * 
 * @param prefersReducedMotion - Whether user prefers reduced motion
 * @param variants - Animation variants to apply
 * @returns Variants or minimal animation
 * 
 * @example
 * ```tsx
 * const prefersReducedMotion = useReducedMotion();
 * 
 * <motion.div
 *   variants={applyReducedMotion(prefersReducedMotion, fadeInUp)}
 *   initial="initial"
 *   animate="animate"
 * />
 * ```
 */
export function applyReducedMotion(
  prefersReducedMotion: boolean,
  variants: Variants
): Variants {
  if (prefersReducedMotion) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    };
  }
  
  return variants;
}
