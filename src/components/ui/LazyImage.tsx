/**
 * LazyImage Component
 * 
 * Implements lazy loading for images using Intersection Observer
 * Provides blur-up placeholder effect and responsive image support
 * 
 * Validates: Requirements 16.2, 12.4
 */

import { useState, useRef, ImgHTMLAttributes } from 'react';
import { useInView } from 'react-intersection-observer';
import { generateSrcSet, generateSizes, browserSupports } from '@/utils/performance';

interface LazyImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'sizes'> {

  src: string;

  alt: string;

  placeholder?: string;

  responsiveSizes?: number[];

  sizesConfig?: Record<string, string>;

  aspectRatio?: number;

  onLoad?: () => void;

  onError?: () => void;

  className?: string;
}

/**
 * LazyImage component with intersection observer-based lazy loading
 * 
 * Features:
 * - Lazy loads images when they enter viewport
 * - Blur-up placeholder effect
 * - Responsive image support with srcset
 * - Fallback for browsers without IntersectionObserver
 * - Native lazy loading fallback
 */
export function LazyImage({
  src,
  alt,
  placeholder,
  responsiveSizes = [640, 1024, 1536, 2048],
  sizesConfig,
  aspectRatio,
  onLoad,
  onError,
  className = '',
  ...props
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  

  const { ref: inViewRef, inView } = useInView({
    triggerOnce: true,
    threshold: 0.01,
    rootMargin: '50px', // Start loading 50px before entering viewport
  });
  

  const setRefs = (element: HTMLImageElement | null) => {
    imgRef.current = element;
    inViewRef(element);
  };
  

  const srcSet = responsiveSizes.length > 0 ? generateSrcSet(src, responsiveSizes) : undefined;
  const sizes = sizesConfig ? generateSizes(sizesConfig) : undefined;
  

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };
  

  const handleError = () => {
    setHasError(true);
    onError?.();
  };
  

  const shouldLoad = !browserSupports.intersectionObserver || inView;
  

  const currentSrc = shouldLoad ? src : placeholder;
  
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={aspectRatio ? { paddingBottom: `${(1 / aspectRatio) * 100}%` } : undefined}
    >
      {/* Placeholder with blur effect */}
      {placeholder && !isLoaded && !hasError && (
        <img
          src={placeholder}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover blur-sm scale-110 transition-opacity duration-300"
          style={{ opacity: shouldLoad ? 0 : 1 }}
        />
      )}
      
      {/* Main image */}
      {!hasError && (
        <img
          ref={setRefs}
          src={currentSrc}
          srcSet={shouldLoad ? srcSet : undefined}
          sizes={shouldLoad ? sizes : undefined}
          alt={alt}
          loading={browserSupports.lazyLoading ? 'lazy' : undefined}
          onLoad={handleLoad}
          onError={handleError}
          className={`
            absolute inset-0 w-full h-full object-cover
            transition-opacity duration-300
            ${isLoaded ? 'opacity-100' : 'opacity-0'}
          `}
          {...props}
        />
      )}
      
      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-surface-container-high)]">
          <div className="text-center text-[var(--color-on-surface-variant)]">
            <svg
              className="w-12 h-12 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm">Failed to load image</p>
          </div>
        </div>
      )}
      
      {/* Loading skeleton */}
      {!isLoaded && !hasError && !placeholder && (
        <div className="absolute inset-0 bg-[var(--color-surface-container-high)] animate-pulse" />
      )}
    </div>
  );
}

/**
 * Simple lazy image without responsive features
 * Useful for avatars, icons, etc.
 */
export function SimpleLazyImage({
  src,
  alt,
  className = '',
  ...props
}: Omit<LazyImageProps, 'responsiveSizes' | 'sizesConfig' | 'aspectRatio'>) {
  return (
    <LazyImage
      src={src}
      alt={alt}
      className={className}
      responsiveSizes={[]}
      {...props}
    />
  );
}
