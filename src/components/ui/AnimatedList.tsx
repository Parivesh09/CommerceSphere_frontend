/**
 * Animated List Component
 * 
 * Provides stagger animations for list items.
 * Respects user's motion preferences.
 * 
 * Validates: Requirements 11.3, 11.5
 */

import React from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, staggerContainerFast, staggerContainerSlow, staggerItem } from '@/animations/variants';
import { useReducedMotion, applyReducedMotion } from '@/animations/useReducedMotion';

interface AnimatedListProps {
  children: React.ReactNode;
  className?: string;
  staggerSpeed?: 'fast' | 'normal' | 'slow';
  as?: keyof React.JSX.IntrinsicElements;
}

/**
 * Container component for staggered list animations
 * 
 * Animates children with a stagger effect, where each item
 * appears slightly after the previous one.
 * 
 * @example
 * ```tsx
 * <AnimatedList>
 *   {items.map(item => (
 *     <AnimatedListItem key={item.id}>
 *       {item.content}
 *     </AnimatedListItem>
 *   ))}
 * </AnimatedList>
 * ```
 */
export const AnimatedList: React.FC<AnimatedListProps> = ({ 
  children, 
  className,
  staggerSpeed = 'normal',
  as = 'div'
}) => {
  const prefersReducedMotion = useReducedMotion();
  
  const variants = {
    fast: staggerContainerFast,
    normal: staggerContainer,
    slow: staggerContainerSlow,
  }[staggerSpeed];
  
  const Component = motion[as] as any;
  
  return (
    <Component
      variants={applyReducedMotion(prefersReducedMotion, variants)}
      initial="initial"
      animate="animate"
      exit="exit"
      className={className}
    >
      {children}
    </Component>
  );
};

interface AnimatedListItemProps {
  children: React.ReactNode;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}

/**
 * Individual list item component for stagger animations
 * 
 * Must be used as a child of AnimatedList to work properly.
 * 
 * @example
 * ```tsx
 * <AnimatedListItem>
 *   <ProductCard product={product} />
 * </AnimatedListItem>
 * ```
 */
export const AnimatedListItem: React.FC<AnimatedListItemProps> = ({ 
  children, 
  className,
  as = 'div'
}) => {
  const prefersReducedMotion = useReducedMotion();
  
  const Component = motion[as] as any;
  
  return (
    <Component
      variants={applyReducedMotion(prefersReducedMotion, staggerItem)}
      className={className}
    >
      {children}
    </Component>
  );
};
