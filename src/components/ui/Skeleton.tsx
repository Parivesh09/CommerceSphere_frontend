import React from 'react';
import clsx from 'clsx';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  animation = 'pulse',
  className,
  style,
  ...props
}) => {
  const baseStyles = 'bg-[var(--color-surface-container-high)]';

  const variantStyles = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: '',
    rounded: 'rounded-lg',
  };

  const animationStyles = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: '',
  };

  const inlineStyles: React.CSSProperties = {
    ...style,
    width: width || (variant === 'text' ? '100%' : undefined),
    height: height || (variant === 'circular' ? width : undefined),
  };

  return (
    <div
      className={clsx(
        baseStyles,
        variantStyles[variant],
        animationStyles[animation],
        className
      )}
      style={inlineStyles}
      {...props}
    />
  );
};

Skeleton.displayName = 'Skeleton';


export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({
  lines = 3,
  className,
}) => {
  return (
    <div className={clsx('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          variant="text"
          width={index === lines - 1 ? '80%' : '100%'}
        />
      ))}
    </div>
  );
};

SkeletonText.displayName = 'SkeletonText';

export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={clsx('space-y-4 rounded-xl bg-[var(--color-surface)] p-6', className)}>
      <Skeleton variant="rectangular" height={200} className="rounded-lg" />
      <div className="space-y-2">
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="text" width="40%" />
      </div>
    </div>
  );
};

SkeletonCard.displayName = 'SkeletonCard';

export const SkeletonAvatar: React.FC<{ size?: number; className?: string }> = ({
  size = 40,
  className,
}) => {
  return (
    <Skeleton
      variant="circular"
      width={size}
      height={size}
      className={className}
    />
  );
};

SkeletonAvatar.displayName = 'SkeletonAvatar';

export const SkeletonButton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <Skeleton
      variant="rounded"
      width={120}
      height={40}
      className={className}
    />
  );
};

SkeletonButton.displayName = 'SkeletonButton';

export const SkeletonProductCard: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={clsx('space-y-3 rounded-xl bg-[var(--color-surface)] p-4', className)}>
      <Skeleton variant="rectangular" height={240} className="rounded-lg" />
      <div className="space-y-2">
        <Skeleton variant="text" width="90%" />
        <Skeleton variant="text" width="60%" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton variant="text" width={80} />
          <Skeleton variant="rounded" width={100} height={36} />
        </div>
      </div>
    </div>
  );
};

SkeletonProductCard.displayName = 'SkeletonProductCard';
