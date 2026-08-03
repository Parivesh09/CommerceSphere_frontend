import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGetProductsQuery } from '../../../services/api/productApi';
import { useCart } from '../../cart/hooks';
import { toggleWishlistItem } from '../../../features/wishlist/slice';
import { useAppSelector } from '../../../hooks/useAppSelector';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useGetCategoriesQuery } from '@/services/api';

export default function ProductListPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams();
  const { addToCart } = useCart();
  const wishlistItems = useAppSelector((state) => state.wishlist.items);

  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || 'all');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(5000);
  const [sortBy, setSortBy] = useState<'price' | 'createdAt' | 'popularity'>('price');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('search') || '');

  const { data: responseData, isLoading, isError, refetch } = useGetProductsQuery({
    page,
    pageSize: 8,
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    minPrice: minPrice > 0 ? minPrice : undefined,
    maxPrice: maxPrice < 5000 ? maxPrice : undefined,
    sortBy,
    sortOrder,
    search: searchQuery || undefined,
  });

  const { data: categoriesData } = useGetCategoriesQuery()

  const sampleProducts = [
    {
      id: 'prod-1',
      title: 'Matrix Point 2.0 Terminal',
      description: 'The benchmark for enterprise transactions with instant settlement.',
      price: 1299,
      categoryId: 'terminals',
      inventoryQuantity: 25,
      images: [{ id: '1', productId: 'prod-1', url: 'https://images.unsplash.com/photo-1556742049-0a67daf64f42?auto=format&fit=crop&w=600&q=80', displayOrder: 0, createdAt: '' }],
    },
    {
      id: 'prod-2',
      title: 'Quantum Scan Pro',
      description: 'Sub-millisecond barcode & QR code inventory tracking unit.',
      price: 849,
      categoryId: 'logistics',
      inventoryQuantity: 40,
      images: [{ id: '2', productId: 'prod-2', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80', displayOrder: 0, createdAt: '' }],
    },
    {
      id: 'prod-3',
      title: 'CommerceSphere Founder Kit',
      description: 'Complete retail foundation package with hardware & IoT hubs.',
      price: 4500,
      categoryId: 'bundles',
      inventoryQuantity: 12,
      images: [{ id: '3', productId: 'prod-3', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80', displayOrder: 0, createdAt: '' }],
    },
    {
      id: 'prod-4',
      title: 'Core Tablet Gen 3',
      description: 'Mobile management device with ultra-thin bezel & biometric security.',
      price: 1199,
      categoryId: 'management',
      inventoryQuantity: 18,
      images: [{ id: '4', productId: 'prod-4', url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80', displayOrder: 0, createdAt: '' }],
    },
    {
      id: 'prod-5',
      title: 'Premium Wireless Noise-Canceling Headphones',
      description: 'High-fidelity audio with spatial spatial tracking and 40-hour battery life.',
      price: 349,
      categoryId: 'audio',
      inventoryQuantity: 60,
      images: [{ id: '5', productId: 'prod-5', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80', displayOrder: 0, createdAt: '' }],
    },
    {
      id: 'prod-6',
      title: 'Smart RFID Warehouse Scanner',
      description: 'Long-range batch RFID inventory scanner with industrial casing.',
      price: 950,
      categoryId: 'logistics',
      inventoryQuantity: 30,
      images: [{ id: '6', productId: 'prod-6', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80', displayOrder: 0, createdAt: '' }],
    },
  ];

  const productsList = isError
    ? import.meta.env.DEV ? sampleProducts : []
    : (responseData?.data ?? []);

  const totalPages = isError ? 1 : (responseData?.totalPages || 1);

  const handleAddToCart = (product: typeof sampleProducts[0]) => {
    addToCart({
      productId: product.id,
      quantity: 1,
      unitPrice: product.price,
    });
    toast.success(`${product.title} added to cart!`);
  };

  const handleToggleWishlist = (product: typeof sampleProducts[0]) => {
    dispatch(
      toggleWishlistItem({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.images[0]?.url,
        inStock: product.inventoryQuantity > 0,
      })
    );
    toast.success('Wishlist updated');
  };

  const isWishlisted = (id: string) => wishlistItems.some((item) => item.id === id);

  return (
    <div className="page-bg pt-24 pb-16">
      <main className="max-w-7xl mx-auto px-4 md:px-10">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-(--color-on-surface)">Enterprise Catalog</h1>
            <p className="text-sm text-on-surface-variant mt-1">Browse CommerceSphere enterprise hardware, IoT, and software tools.</p>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search catalog..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 rounded-xl border border-outline-variant bg-surface text-(--color-on-surface) text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [sb, so] = e.target.value.split('-') as ['price' | 'createdAt' | 'popularity', 'asc' | 'desc'];
                setSortBy(sb);
                setSortOrder(so);
              }}
              className="px-4 py-2 rounded-xl border border-outline-variant bg-surface text-(--color-on-surface) text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="createdAt-desc">Newest Arrivals</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 shrink-0">
            <div className="glass-card rounded-xl p-6 sticky top-24 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-on-surface)]">Filters</h2>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setMinPrice(0);
                    setMaxPrice(5000);
                    setSearchQuery('');
                  }}
                  className="text-xs text-[var(--color-primary)] font-semibold hover:underline"
                >
                  Reset
                </button>
              </div>

              {/* Categories */}
              <div>
                <h3 className="text-xs uppercase tracking-wider font-semibold text-[var(--color-on-surface-variant)] mb-6">Categories</h3>
                <div className="space-y-2">
                  {categoriesData?.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                        selectedCategory === cat.id
                          ? 'bg-primary text-on-primary font-medium'
                          : 'hover:bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)]'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <h3 className="text-xs uppercase tracking-wider font-semibold text-[var(--color-on-surface-variant)] mb-6">Max Price (${maxPrice})</h3>
                <input
                  type="range"
                  min="100"
                  max="5000"
                  step="100"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[var(--color-primary)]"
                />
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="grow">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-80 glass-card rounded-2xl animate-pulse"></div>
                ))}
              </div>
            ) : isError ? (
              <div className="glass-card rounded-2xl p-12 text-center max-w-lg mx-auto space-y-4">
                <span className="material-symbols-outlined text-[48px] text-error">error_outline</span>
                <h2 className="text-lg font-bold text-on-surface">Couldn't Load Products</h2>
                <p className="text-sm text-on-surface-variant">
                  {import.meta.env.DEV
                    ? 'The catalog service is offline. Showing sample products for development preview.'
                    : 'We couldn\'t reach the catalog service. Please try again.'}
                </p>
                {!import.meta.env.DEV && (
                  <button
                    onClick={() => refetch()}
                    className="px-4 py-2 bg-primary text-on-primary text-xs font-semibold rounded-xl hover:brightness-90 transition-colors"
                  >
                    Retry
                  </button>
                )}
              </div>
            ) : productsList.length === 0 ? (
              <div className="glass-card rounded-2xl p-12 text-center max-w-lg mx-auto space-y-4">
                <span className="material-symbols-outlined text-[48px] text-outline-variant">search_off</span>
                <h2 className="text-lg font-bold text-on-surface">No Products Found</h2>
                <p className="text-sm text-on-surface-variant">Try adjusting your filters or search query.</p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setMinPrice(0);
                    setMaxPrice(5000);
                    setSearchQuery('');
                    setPage(1);
                  }}
                  className="px-4 py-2 bg-primary text-on-primary text-xs font-semibold rounded-xl hover:brightness-90 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {productsList.map((product) => (
                  <div
                    key={product.id}
                    className="bg-surface-container-lowest rounded-xl overflow-hidden hover:shadow-xl border border-[var(--color-outline-variant)]/20 flex flex-col group transition-all"
                  >
                    <div
                      onClick={() => navigate(`/products/${product.id}`)}
                      className="relative aspect-square overflow-hidden cursor-pointer bg-[var(--color-surface-container-low)]"
                    >
                      <img
                        src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleWishlist(product);
                        }}
                        className={`absolute top-3 right-3 p-2 rounded-full shadow transition-colors ${
                          isWishlisted(product.id)
                            ? 'bg-primary text-on-primary'
                            : 'bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)] hover:bg-primary hover:text-on-primary'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[18px]">favorite</span>
                      </button>
                    </div>

                    <div className="flex-grow px-4 pt-3 pb-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-[var(--color-primary-container)]/10 border border-[var(--color-primary)]/20 text-[var(--color-primary)] text-xs font-semibold uppercase tracking-widest">
                        {product.categoryId || 'Hardware'}
                      </span>
                      <h3
                        onClick={() => navigate(`/products/${product.id}`)}
                        className="text-base font-bold text-[var(--color-on-surface)] mt-3 cursor-pointer hover:text-[var(--color-primary)] transition-colors"
                      >
                        {product.title}
                      </h3>
                      <p className="text-xs text-[var(--color-on-surface-variant)] mt-1 line-clamp-2">{product.description}</p>
                    </div>

                    <div className="flex justify-between items-center px-4 pb-4 pt-4 border-t border-[var(--color-outline-variant)]/30 mt-auto">
                      <span className="text-xl font-bold text-[var(--color-on-surface)]">${product.price.toLocaleString()}</span>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="bg-primary text-on-primary rounded-xl text-sm px-4 py-2 hover:shadow-lg active:scale-95 transition-all font-medium"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-3 mt-20">
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPage(idx + 1)}
                    className={`w-10 h-10 rounded-xl font-medium transition-colors ${
                      page === idx + 1
                        ? 'bg-primary text-on-primary'
                        : 'glass-card text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-high)]'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
