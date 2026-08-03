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
import { useCart } from '../../cart/hooks';
import toast from 'react-hot-toast';

export const WishlistPage: React.FC = () => {
  const navigate = useNavigate();
  const { wishlistItems, isLoading, wishlistCount } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (product: { id: string; name: string; price: number; stock: number }) => {
    if (product.stock === 0) return;
    addToCart({ productId: product.id, quantity: 1, unitPrice: product.price });
    toast.success(`${product.name} added to cart!`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen page-bg text-[var(--color-on-surface)] mx-auto px-4 md:px-10 py-20">
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-on-surface)] mb-8">
          My Wishlist
        </h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Card key={index} padding="none">
              <Skeleton className="aspect-square w-full" />
              <div className="p-6">
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
      <div className="min-h-screen page-bg text-[var(--color-on-surface)] flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full glass-card rounded-2xl p-8 gap-6 flex flex-col items-center">
          <span className="material-symbols-outlined text-[48px] text-[var(--color-on-surface-variant)]">favorite</span>
          <h2 className="text-xl font-bold text-[var(--color-on-surface)]">
            Your wishlist is empty
          </h2>
          <p className="text-sm text-[var(--color-on-surface-variant)]">
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
    <div className="min-h-screen page-bg text-[var(--color-on-surface)] mx-auto px-4 md:px-10 py-20">
      <div className="mb-8 flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-on-surface)]">
            My Wishlist
          </h1>
          <div className="h-1 w-20 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full" />
        </div>
        <p className="text-sm text-[var(--color-on-surface-variant)]">
          {wishlistCount} {wishlistCount === 1 ? 'item' : 'items'}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
              <div className="relative aspect-square overflow-hidden bg-[var(--color-surface-container-low)]">
                {primaryImage ? (
                  <img
                    src={primaryImage.url}
                    alt={primaryImage.alt || product.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[var(--color-on-surface-variant)] text-sm">
                    <span className="material-symbols-outlined text-[36px]">image</span>
                  </div>
                )}

                {/* Wishlist Button */}
                <div className="absolute right-2 top-2">
                  <WishlistButton productId={product.id} size="md" />
                </div>

                {/* Discount Badge */}
                {hasDiscount && (
                  <div className="absolute left-2 top-2 rounded-full bg-error px-2 py-1 text-xs font-semibold text-on-error">
                    -{discountPercentage}%
                  </div>
                )}

                {/* Out of Stock Badge */}
                {product.stock === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <span className="rounded-xl bg-surface px-4 py-2 text-sm font-bold text-on-surface">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-6 gap-3 flex flex-col">
                {/* Category */}
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-on-surface-variant)]">
                  {product.category}
                </p>

                {/* Product Name */}
                <h3 className="line-clamp-2 text-sm font-bold text-[var(--color-on-surface)]">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <svg
                        key={index}
                        className={`h-4 w-4 ${
                          index < Math.floor(product.rating)
                            ? 'text-warning'
                            : 'text-on-surface-variant'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-[var(--color-on-surface-variant)]">
                    ({product.reviewCount})
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold text-[var(--color-on-surface)]">
                    ${product.price.toFixed(2)}
                  </span>
                  {hasDiscount && (
                    <span className="text-sm text-[var(--color-on-surface-variant)] line-through">
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
                    handleAddToCart(product);
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
