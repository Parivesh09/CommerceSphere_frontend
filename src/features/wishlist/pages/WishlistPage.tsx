/**
 * WishlistPage component
 * 
 * Displays user's wishlist items in a responsive grid
 * Shows empty state when wishlist is empty
 * 
 * Validates: Requirements 17.2, 17.3
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../hooks';
import { WishlistButton } from '../components/WishlistButton';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Skeleton } from '../../../components/ui/Skeleton';
import { ROUTES } from '../../../constants';

export const WishlistPage: React.FC = () => {
  const navigate = useNavigate();
  const { wishlistItems, isLoading, wishlistCount } = useWishlist();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-on-surface mx-auto px-margin-mobile md:px-margin-desktop py-xl">
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-8">
          My Wishlist
        </h1>
        <div className="grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Card key={index} padding="none">
              <Skeleton className="aspect-square w-full" />
              <div className="p-md">
                <Skeleton className="mb-2 h-4 w-3/4" />
                <Skeleton className="mb-2 h-6 w-1/2" />
                <Skeleton className="h-10 w-full" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (wishlistCount === 0) {
    return (
      <div className="min-h-screen bg-background text-on-surface flex items-center justify-center p-md text-center">
        <div className="max-w-md w-full glass-card rounded-2xl p-lg gap-gutter flex flex-col items-center">
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant">favorite</span>
          <h2 className="font-headline-md text-headline-md text-on-surface">
            Your wishlist is empty
          </h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Start adding products you love to your wishlist
          </p>
          <Button
            variant="primary"
            size="lg"
            className="mt-8"
            onClick={() => navigate(ROUTES.PRODUCTS)}
          >
            Browse Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-surface mx-auto px-margin-mobile md:px-margin-desktop py-xl">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-headline-lg text-headline-lg text-on-surface">
          My Wishlist
        </h1>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          {wishlistCount} {wishlistCount === 1 ? 'item' : 'items'}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {wishlistItems.map((item) => {
          const product = item.product;
          const primaryImage = product.images?.find((img) => img.order === 0) || product.images?.[0];
          const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
          const discountPercentage = hasDiscount
            ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
            : 0;

          return (
            <Card
              key={item.id}
              hoverable
              padding="none"
              className="group overflow-hidden glass-card rounded-2xl"
              onClick={() => navigate(ROUTES.PRODUCT_DETAIL.replace(':id', product.id))}
            >
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden bg-surface-variant">
                {primaryImage ? (
                  <img
                    src={primaryImage.url}
                    alt={primaryImage.alt || product.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-on-surface-variant font-body-sm text-body-sm">
                    <span className="material-symbols-outlined text-[36px]">image</span>
                  </div>
                )}

                {/* Wishlist Button */}
                <div className="absolute right-sm top-sm">
                  <WishlistButton productId={product.id} size="md" />
                </div>

                {/* Discount Badge */}
                {hasDiscount && (
                  <div className="absolute left-sm top-sm rounded-full bg-red-500 px-2 py-1 font-label-md text-label-md text-on-primary">
                    -{discountPercentage}%
                  </div>
                )}

                {/* Out of Stock Badge */}
                {product.stock === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <span className="rounded-xl bg-surface px-4 py-2 font-body-sm text-body-sm font-bold text-on-surface">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-md gap-sm flex flex-col">
                {/* Category */}
                <p className="font-label-md text-label-md uppercase tracking-wide text-on-surface-variant">
                  {product.category}
                </p>

                {/* Product Name */}
                <h3 className="line-clamp-2 font-body-sm text-body-sm font-bold text-on-surface">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-sm">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <svg
                        key={index}
                        className={`h-4 w-4 ${
                          index < Math.floor(product.rating)
                            ? 'text-yellow-400'
                            : 'text-on-surface-variant'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    ({product.reviewCount})
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-sm">
                  <span className="font-headline-md text-headline-md text-on-surface">
                    ${product.price.toFixed(2)}
                  </span>
                  {hasDiscount && (
                    <span className="font-body-sm text-body-sm text-on-surface-variant line-through">
                      ${product.compareAtPrice!.toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Add to Cart Button */}
                <Button
                  variant="primary"
                  size="sm"
                  fullWidth
                  className="mt-3"
                  disabled={product.stock === 0}
                  onClick={(e) => {
                    e.stopPropagation();

                    console.log('Add to cart:', product.id);
                  }}
                >
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
