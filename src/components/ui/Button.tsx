import React from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/animations/useReducedMotion';
import { transitions } from '@/animations/variants';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  animated?: boolean;
  'aria-label'?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      animated = true,
      className,
      disabled,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion();
    
    const baseStyles =
      'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary disabled:opacity-50 disabled:cursor-not-allowed touch-target';

    const variantStyles = {
      primary:
        'bg-primary text-on-primary shadow-glow hover:brightness-110 focus-visible:ring-primary active:brightness-95',
      secondary:
        'bg-secondary text-on-secondary hover:brightness-110 focus-visible:ring-secondary active:brightness-95',
      outline:
        'border-2 border-primary text-primary hover:bg-primary-container/40 focus-visible:ring-primary',
      ghost:
        'text-on-surface hover:bg-surface-container-high focus-visible:ring-primary',
      danger:
        'bg-error text-on-error hover:brightness-110 focus-visible:ring-error active:brightness-95',
    };

    const sizeStyles = {
      sm: 'text-sm px-3 py-1.5 gap-1.5 min-h-[44px]',
      md: 'text-base px-4 py-2 gap-2 min-h-[44px]',
      lg: 'text-lg px-6 py-3 gap-2.5 min-h-[44px]',
    };

    const widthStyles = fullWidth ? 'w-full' : '';


    const shouldAnimate = animated && !prefersReducedMotion;

    if (shouldAnimate) {
      return (
        <motion.button
          ref={ref}
          className={clsx(
            baseStyles,
            variantStyles[variant],
            sizeStyles[size],
            widthStyles,
            className
          )}
          disabled={disabled || isLoading}
          aria-label={ariaLabel}
          aria-busy={isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={transitions.fast}
          {...(props as any)}
        >
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Loading...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="inline-flex" aria-hidden="true">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="inline-flex" aria-hidden="true">{rightIcon}</span>}
          </>
        )}
      </motion.button>
      );
    }

    return (
      <button
        ref={ref}
        className={clsx(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          widthStyles,
          className
        )}
        disabled={disabled || isLoading}
        aria-label={ariaLabel}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Loading...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="inline-flex" aria-hidden="true">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="inline-flex" aria-hidden="true">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
