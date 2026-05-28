/**
 * Example component demonstrating performance optimizations
 * 
 * This component showcases:
 * - Virtual scrolling for long lists
 * - Lazy image loading
 * - Memoization with React.memo, useMemo, useCallback
 * - Responsive images with srcset
 * 
 * Validates: Requirements 16.1, 16.2, 16.3, 16.4, 12.4
 */

import { memo, useCallback, useMemo } from 'react';
import { VirtualList, useVirtualization, LazyImage } from '@/components/ui';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

interface ProductItemProps {
  product: Product;
  onAddToCart: (productId: string) => void;
  isInCart: boolean;
}

/**
 * Memoized product item component
 * Only re-renders when props actually change
 */
const ProductItem = memo<ProductItemProps>(({ product, onAddToCart, isInCart }) => {

  const handleAddToCart = useCallback(() => {
    onAddToCart(product.id);
  }, [product.id, onAddToCart]);
  
  return (
    <div className="p-4 border rounded-lg hover:shadow-lg transition-shadow">
      {/* Lazy-loaded responsive image */}
      <LazyImage
        src={product.image}
        alt={product.name}
        responsiveSizes={[320, 640, 1024]}
        sizesConfig={{
          '640px': '100vw',
          '1024px': '50vw',
          '1536px': '33vw',
        }}
        aspectRatio={1}
        className="w-full rounded-lg mb-4"
      />
      
      <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
        {product.description}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
        <button
          onClick={handleAddToCart}
          disabled={isInCart}
          className={`
            px-4 py-2 rounded-lg font-medium transition-colors
            ${isInCart 
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
            }
          `}
        >
          {isInCart ? 'In Cart' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {

  return (
    prevProps.product.id === nextProps.product.id &&
    prevProps.isInCart === nextProps.isInCart
  );
});

ProductItem.displayName = 'ProductItem';

interface PerformanceOptimizedListProps {
  products: Product[];
  cartItems: Set<string>;
  onAddToCart: (productId: string) => void;
}

/**
 * Performance-optimized product list component
 * 
 * Features:
 * - Virtual scrolling for lists with 50+ items
 * - Memoized calculations
 * - Optimized callbacks
 * - Lazy-loaded images
 */
export function PerformanceOptimizedList({
  products,
  cartItems,
  onAddToCart,
}: PerformanceOptimizedListProps) {

  const shouldVirtualize = useVirtualization(products.length, 50);
  

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => a.name.localeCompare(b.name));
  }, [products]);
  

  const isInCart = useMemo(() => {
    return (productId: string) => cartItems.has(productId);
  }, [cartItems]);
  

  const handleAddToCart = useCallback((productId: string) => {
    onAddToCart(productId);
  }, [onAddToCart]);
  

  const renderProduct = useCallback((product: Product, _index: number, style: React.CSSProperties) => {
    return (
      <div key={product.id} style={style}>
        <ProductItem
          product={product}
          onAddToCart={handleAddToCart}
          isInCart={isInCart(product.id)}
        />
      </div>
    );
  }, [handleAddToCart, isInCart]);
  

  if (shouldVirtualize) {
    return (
      <div className="h-screen">
        <VirtualList
          items={sortedProducts}
          itemHeight={320}
          height={window.innerHeight - 200}
          renderItem={renderProduct}
          overscanCount={3}
          className="px-4"
        />
      </div>
    );
  }
  

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
      {sortedProducts.map((product: Product) => (
        <ProductItem
          key={product.id}
          product={product}
          onAddToCart={handleAddToCart}
          isInCart={isInCart(product.id)}
        />
      ))}
    </div>
  );
}

/**
 * Example usage with prefetching
 */
export function ProductListWithPrefetch() {

  const products: Product[] = [];
  const cartItems = new Set<string>();
  
  const handleAddToCart = useCallback((productId: string) => {
    console.log('Adding to cart:', productId);

    import('@/features/checkout/pages/CheckoutPage');
  }, []);
  
  return (
    <PerformanceOptimizedList
      products={products}
      cartItems={cartItems}
      onAddToCart={handleAddToCart}
    />
  );
}
