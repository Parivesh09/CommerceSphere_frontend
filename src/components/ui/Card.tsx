import React from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/animations/useReducedMotion';
import { transitions } from '@/animations/variants';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined';
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, variant = 'default', hoverable = false, padding = 'md', animated = true, className, ...props }, ref) => {
    const prefersReducedMotion = useReducedMotion();
    
    const baseStyles = 'rounded-2xl transition-all duration-200';

    const variantStyles = {
      default: 'glass-card',
      elevated: 'glass-card shadow-glow',
      outlined: 'bg-surface-container-lowest border border-outline-variant',
    };

    const paddingStyles = {
      none: '',
      sm: 'p-3',
      md: 'p-6',
      lg: 'p-8',
    };

    const hoverStyles = hoverable
      ? 'cursor-pointer hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02]'
      : '';


    const shouldAnimate = animated && !prefersReducedMotion;
    
    if (shouldAnimate && hoverable) {
      return (
        <motion.div
          ref={ref}
          className={clsx(
            baseStyles,
            variantStyles[variant],
            paddingStyles[padding],
            className
          )}
          whileHover={{ 
            y: -8, 
            scale: 1.02,
            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
          }}
          whileTap={{ scale: 0.98 }}
          transition={transitions.spring}
          {...(props as any)}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <div
        ref={ref}
        className={clsx(
          baseStyles,
          variantStyles[variant],
          paddingStyles[padding],
          hoverStyles,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export type CardHeaderProps = React.HTMLAttributes<HTMLDivElement> & {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
};

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  action,
  children,
  className,
  ...props
}) => {
  return (
    <div className={clsx('flex items-start justify-between', className)} {...props}>
      <div className="flex-1">
        {title && (
          <h3 className="text-lg font-bold text-on-surface">{title}</h3>
        )}
        {subtitle && (
          <p className="mt-1 text-sm text-on-surface-variant">{subtitle}</p>
        )}
        {children}
      </div>
      {action && <div className="ml-4">{action}</div>}
    </div>
  );
};

CardHeader.displayName = 'CardHeader';

export type CardContentProps = React.HTMLAttributes<HTMLDivElement>;

export const CardContent: React.FC<CardContentProps> = ({ children, className, ...props }) => {
  return (
    <div className={clsx('mt-4', className)} {...props}>
      {children}
    </div>
  );
};

CardContent.displayName = 'CardContent';

export type CardFooterProps = React.HTMLAttributes<HTMLDivElement>;

export const CardFooter: React.FC<CardFooterProps> = ({ children, className, ...props }) => {
  return (
    <div className={clsx('mt-6 flex items-center gap-3', className)} {...props}>
      {children}
    </div>
  );
};

CardFooter.displayName = 'CardFooter';
