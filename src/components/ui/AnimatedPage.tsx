/**
 * Animated Page Wrapper Component
 * 
 * Provides consistent page transition animations using Framer Motion.
 * Respects user's motion preferences.
 * 
 * Validates: Requirements 11.1, 11.5
 */

import { motion } from 'framer-motion';
import { pageTransition, transitions } from '@/animations/variants';
import { useReducedMotion, applyReducedMotion } from '@/animations/useReducedMotion';

interface AnimatedPageProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Wrapper component for page-level animations
 * 
 * Automatically applies fade and slide transitions when pages change.
 * Respects prefers-reduced-motion setting.
 * 
 * @example
 * ```tsx
 * <AnimatedPage>
 *   <h1>My Page Content</h1>
 * </AnimatedPage>
 * ```
 */
export const AnimatedPage: React.FC<AnimatedPageProps> = ({ children, className }) => {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <motion.div
      variants={applyReducedMotion(prefersReducedMotion, pageTransition)}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={prefersReducedMotion ? { duration: 0.01 } : transitions.default}
      className={className}
    >
      {children}
    </motion.div>
  );
};
