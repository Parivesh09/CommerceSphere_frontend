import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import { useReducedMotion } from '@/animations/useReducedMotion';
import { transitions } from '@/animations/variants';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  position?: 'left' | 'right' | 'top' | 'bottom';
  size?: 'sm' | 'md' | 'lg' | 'full';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  position = 'right',
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
}) => {
  const prefersReducedMotion = useReducedMotion();
  
  useEffect(() => {
    if (!closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, closeOnEscape]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const sizeStyles = {
    left: {
      sm: 'w-64',
      md: 'w-80',
      lg: 'w-96',
      full: 'w-full',
    },
    right: {
      sm: 'w-64',
      md: 'w-80',
      lg: 'w-96',
      full: 'w-full',
    },
    top: {
      sm: 'h-64',
      md: 'h-80',
      lg: 'h-96',
      full: 'h-full',
    },
    bottom: {
      sm: 'h-64',
      md: 'h-80',
      lg: 'h-96',
      full: 'h-full',
    },
  };

  const positionStyles = {
    left: 'left-0 top-0 h-full',
    right: 'right-0 top-0 h-full',
    top: 'top-0 left-0 w-full',
    bottom: 'bottom-0 left-0 w-full',
  };

  const slideVariants = {
    left: {
      initial: prefersReducedMotion ? { opacity: 0 } : { x: '-100%' },
      animate: prefersReducedMotion ? { opacity: 1 } : { x: 0 },
      exit: prefersReducedMotion ? { opacity: 0 } : { x: '-100%' },
    },
    right: {
      initial: prefersReducedMotion ? { opacity: 0 } : { x: '100%' },
      animate: prefersReducedMotion ? { opacity: 1 } : { x: 0 },
      exit: prefersReducedMotion ? { opacity: 0 } : { x: '100%' },
    },
    top: {
      initial: prefersReducedMotion ? { opacity: 0 } : { y: '-100%' },
      animate: prefersReducedMotion ? { opacity: 1 } : { y: 0 },
      exit: prefersReducedMotion ? { opacity: 0 } : { y: '-100%' },
    },
    bottom: {
      initial: prefersReducedMotion ? { opacity: 0 } : { y: '100%' },
      animate: prefersReducedMotion ? { opacity: 1 } : { y: 0 },
      exit: prefersReducedMotion ? { opacity: 0 } : { y: '100%' },
    },
  };

  const drawerContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={prefersReducedMotion ? { duration: 0.01 } : { duration: 0.2 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeOnOverlayClick ? onClose : undefined}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            initial={slideVariants[position].initial}
            animate={slideVariants[position].animate}
            exit={slideVariants[position].exit}
            transition={prefersReducedMotion ? { duration: 0.01 } : transitions.springSmooth}
            className={clsx(
              'absolute flex flex-col bg-white shadow-2xl dark:bg-gray-800',
              positionStyles[position],
              sizeStyles[position][size]
            )}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'drawer-title' : undefined}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                {title && (
                  <h2
                    id="drawer-title"
                    className="text-xl font-semibold text-gray-900 dark:text-gray-100"
                  >
                    {title}
                  </h2>
                )}
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                    aria-label="Close drawer"
                  >
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(drawerContent, document.body);
};

Drawer.displayName = 'Drawer';
