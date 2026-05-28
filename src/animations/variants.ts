/**
 * Animation Variants for Framer Motion
 * 
 * Provides reusable animation configurations following design principles:
 * - Duration: 200-300ms for micro-interactions, 400-600ms for page transitions
 * - Easing: Spring physics for natural feel, ease-out for exits
 * - Stagger: 50-100ms delay between list items
 * 
 * Validates: Requirements 11.1, 11.2, 11.3, 11.4, 11.5
 */

import type { Variants, Transition } from 'framer-motion';

/**
 * Fade in animation from opacity 0 to 1
 */
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

/**
 * Fade in with upward motion
 */
export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

/**
 * Fade in with downward motion
 */
export const fadeInDown: Variants = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

/**
 * Slide in from left
 */
export const slideInLeft: Variants = {
  initial: { x: -100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -100, opacity: 0 },
};

/**
 * Slide in from right
 */
export const slideInRight: Variants = {
  initial: { x: 100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: 100, opacity: 0 },
};

/**
 * Scale animation for modals and popovers
 */
export const scaleIn: Variants = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.9, opacity: 0 },
};

/**
 * Scale animation for cards and interactive elements
 */
export const scaleOnHover: Variants = {
  initial: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

/**
 * Elevation animation for cards
 */
export const elevateOnHover: Variants = {
  initial: { y: 0, boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' },
  hover: { 
    y: -8, 
    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    transition: { duration: 0.2 }
  },
};

/**
 * Container for staggered children animations
 */
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

/**
 * Fast stagger for smaller lists
 */
export const staggerContainerFast: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.02,
    },
  },
};

/**
 * Slow stagger for hero sections
 */
export const staggerContainerSlow: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

/**
 * Child item for stagger animations
 */
export const staggerItem: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

/**
 * Page transition variants
 */
export const pageTransition: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

/**
 * Drawer slide in from right (for cart drawer)
 */
export const drawerSlideRight: Variants = {
  initial: { x: '100%' },
  animate: { x: 0 },
  exit: { x: '100%' },
};

/**
 * Drawer slide in from left
 */
export const drawerSlideLeft: Variants = {
  initial: { x: '-100%' },
  animate: { x: 0 },
  exit: { x: '-100%' },
};

/**
 * Backdrop fade for modals and drawers
 */
export const backdropFade: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

/**
 * Rotation animation for loading spinners
 */
export const rotate: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

/**
 * Pulse animation for notifications
 */
export const pulse: Variants = {
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

/**
 * Bounce animation for attention-grabbing elements
 */
export const bounce: Variants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

/**
 * Transition configurations
 */
export const transitions = {

  fast: {
    duration: 0.2,
    ease: 'easeOut',
  } as Transition,
  

  default: {
    duration: 0.3,
    ease: 'easeOut',
  } as Transition,
  

  slow: {
    duration: 0.5,
    ease: 'easeInOut',
  } as Transition,
  

  spring: {
    type: 'spring',
    stiffness: 300,
    damping: 30,
  } as Transition,
  

  springBouncy: {
    type: 'spring',
    stiffness: 400,
    damping: 20,
  } as Transition,
  

  springSmooth: {
    type: 'spring',
    stiffness: 200,
    damping: 25,
  } as Transition,
};

/**
 * Fly-to-cart animation for add to cart action
 * Used when adding products to cart
 */
export const flyToCart: Variants = {
  initial: { scale: 1, opacity: 1 },
  animate: {
    scale: 0.3,
    opacity: 0,
    x: 'calc(100vw - 100px)',
    y: -100,
    transition: {
      duration: 0.6,
      ease: 'easeInOut',
    },
  },
};

/**
 * Notification slide in from top
 */
export const notificationSlideDown: Variants = {
  initial: { y: -100, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -100, opacity: 0 },
};

/**
 * Accordion expand/collapse
 */
export const accordionExpand: Variants = {
  collapsed: { height: 0, opacity: 0 },
  expanded: { height: 'auto', opacity: 1 },
};

/**
 * Tab content transition
 */
export const tabContent: Variants = {
  initial: { opacity: 0, x: -10 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 10 },
};
