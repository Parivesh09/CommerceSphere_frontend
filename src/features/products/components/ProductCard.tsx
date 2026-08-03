/**
 * ProductCard component
 * Displays a product in a card format with image, name, price, and rating.
 * Add-to-cart is wired to the shared cart hook (guest + authenticated).
 *
 * Validates: Requirements 4.1, 4.5, 17.1
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { WishlistButton } from '../../wishlist/components/WishlistButton';
import { useCart } from '../../cart/hooks';
import toast from 'react-hot-toast';
import { ROUTES } from '../../../constants';

export interface ProductCardProduct {
  id: string;
  title: string;
  category?: string;
  price: number;
  compareAtPrice?: number;
  description?: string;
  image?: string;
  rating?: number;
  reviewCount?: number;
  stock?: number;
}

export interface ProductCardProps {
  product: ProductCardProduct;
  handleAddToCart?: (product: ProductCardProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, handleAddToCart }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleClick = () => {
    navigate(ROUTES.PRODUCT_DETAIL.replace(':id', product.id));
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (handleAddToCart) {
      handleAddToCart(product);
      return;
    }
    addToCart({
      productId: product.id,
      quantity: 1,
      unitPrice: product.price,
    });
    toast.success(`${product.title} added to cart!`);
  };

  const primaryImage = product.image || '';
  const inStock = product.stock === undefined ? true : product.stock > 0;
  const hasDiscount =
    product.compareAtPrice !== undefined && product.compareAtPrice > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  return (
    <Card
      hoverable
      padding="none"
      className="group overflow-hidden"
      onClick={handleClick}
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-[var(--color-surface-container-low)]">
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[var(--color-on-surface-variant)]">
            No Image
          </div>
        )}

        {/* Wishlist Button */}
        <div className="absolute right-2 top-2">
          <WishlistButton
            productId={product.id}
            title={product.title}
            price={product.price}
            image={primaryImage}
            inStock={inStock}
            size="md"
          />
        </div>

        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute left-2 top-2 rounded-full bg-error px-2 py-1 text-xs font-semibold text-on-error">
            -{discountPercentage}%
          </div>
        )}

        {/* Out of Stock Badge */}
        {!inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="rounded-lg bg-surface px-4 py-2 text-sm font-semibold text-on-surface">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Category */}
        {product.category && (
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-on-surface-variant)]">
            {product.category}
          </p>
        )}

        {/* Product Name */}
        <h3 className="mt-1 line-clamp-2 text-base font-semibold text-[var(--color-on-surface)]">
          {product.title}
        </h3>

        {/* Rating */}
        {product.rating !== undefined && (
          <div className="mt-2 flex items-center gap-1">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, index) => (
                <svg
                  key={index}
                  className={`h-4 w-4 ${
                    index < Math.floor(product.rating!)
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
            {product.reviewCount !== undefined && (
              <span className="text-sm text-[var(--color-on-surface-variant)]">
                ({product.reviewCount})
              </span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-xl font-bold text-[var(--color-on-surface)]">
            ${product.price}
          </span>
          {hasDiscount && (
            <span className="text-sm text-[var(--color-on-surface-variant)] line-through">
              ${product.compareAtPrice!}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          variant="primary"
          size="sm"
          fullWidth
          className="mt-3"
          disabled={!inStock}
          onClick={handleAddToCartClick}
        >
          {!inStock ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </div>
    </Card>
  );
};
