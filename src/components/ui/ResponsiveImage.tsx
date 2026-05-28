/**
 * ResponsiveImage component
 * Renders images with responsive srcset and sizes for optimal loading
 * 
 * Validates: Requirements 12.4, 16.2
 */

import React, { useState } from 'react';
import { LazyImage } from './LazyImage';

export interface ResponsiveImageProps {
  src: string;
  alt: string;
  /**
   * Array of image sources with different widths
   * Example: [{ url: 'image-400.jpg', width: 400 }, { url: 'image-800.jpg', width: 800 }]
   */
  sources?: Array<{ url: string; width: number }>;
  /**
   * Sizes attribute for responsive images
   * Example: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
   */
  sizes?: string;
  className?: string;
  aspectRatio?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Default sizes based on common breakpoints
 */
const DEFAULT_SIZES = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 33vw, 25vw';

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  sources,
  sizes = DEFAULT_SIZES,
  className = '',
  aspectRatio,
  objectFit = 'cover',
  loading = 'lazy',
  onLoad,
  onError,
}) => {
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  const handleLoad = () => {
    onLoad?.();
  };


  if (hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-200 dark:bg-gray-700 ${className}`}
        style={{ aspectRatio }}
      >
        <span className="text-gray-400 text-sm">Image not available</span>
      </div>
    );
  }


  const srcSet = sources && sources.length > 0 
    ? sources.map(({ url, width }) => `${url} ${width}w`).join(', ')
    : undefined;


  if (loading === 'lazy') {
    return (
      <LazyImage
        src={src}
        alt={alt}
        className={className}
        style={{
          aspectRatio,
          objectFit,
        }}
        onLoad={handleLoad}
        onError={handleError}

        {...(srcSet && { srcSet })}
        {...(srcSet && { sizes })}
      />
    );
  }


  return (
    <img
      src={src}
      alt={alt}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      className={className}
      style={{
        aspectRatio,
        objectFit,
        width: '100%',
        height: 'auto',
      }}
      loading="eager"
      onLoad={handleLoad}
      onError={handleError}
    />
  );
};
