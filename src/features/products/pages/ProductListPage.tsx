import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGetProductsQuery } from '../../../services/api/productApi';
import { useCart } from '../../cart/hooks';
import { toggleWishlistItem } from '../../../features/wishlist/slice';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useGetCategoriesQuery } from '@/services/api';
import toast from 'react-hot-toast';
import { sampleProducts } from '@/constants/genral';

export default function ProductListPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const { addToCart } = useCart();
  const wishlistItems = useAppSelector((state) => state.wishlist.items);

  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get('category') || 'all'
  );
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(5000);
  const [sortBy, setSortBy] = useState<'price' | 'createdAt' | 'popularity'>('price');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('search') || '');

  const {
    data: responseData,
    isLoading,
    isError,
    refetch,
  } = useGetProductsQuery({
    page,
    pageSize: 8,
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    minPrice: minPrice > 0 ? minPrice : undefined,
    maxPrice: maxPrice < 5000 ? maxPrice : undefined,
    sortBy,
    sortOrder,
    search: searchQuery || undefined,
  });

  const { data: categoriesData } = useGetCategoriesQuery();

  const productsList = isError
    ? import.meta.env.DEV
      ? sampleProducts
      : []
    : (responseData?.data ?? []);

  const totalPages = isError ? 1 : responseData?.totalPages || 1;

  const handleAddToCart = (product: (typeof sampleProducts)[0]) => {
    addToCart({
      productId: product.id,
      quantity: 1,
      unitPrice: product.price,
    });
    toast.success(`${product.title} added to cart!`);
  };

  const handleToggleWishlist = (product: (typeof sampleProducts)[0]) => {
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
            <h1 className="text-3xl font-bold text-[var(--color-on-surface)]">
              Enterprise Catalog
            </h1>
            <p className="text-sm text-on-surface-variant mt-1">
              Browse CommerceSphere enterprise hardware, IoT, and software tools.
            </p>
            <div className="h-1 w-20 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full mt-4" />
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search catalog..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 rounded-xl border border-outline-variant bg-surface text-[var(--color-on-surface)] text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [sb, so] = e.target.value.split('-') as [
                  'price' | 'createdAt' | 'popularity',
                  'asc' | 'desc',
                ];
                setSortBy(sb);
                setSortOrder(so);
              }}
              className="px-4 py-2 rounded-xl border border-outline-variant bg-surface text-[var(--color-on-surface)] text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
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
            <div className="glass-card rounded-2xl p-6 sticky top-24 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-on-surface)]">
                  Filters
                </h2>
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
                <h3 className="text-xs uppercase tracking-wider font-semibold text-[var(--color-on-surface-variant)] mb-6">
                  Categories
                </h3>
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
                <h3 className="text-xs uppercase tracking-wider font-semibold text-[var(--color-on-surface-variant)] mb-6">
                  Max Price (${maxPrice})
                </h3>
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
                <span className="material-symbols-outlined text-[48px] text-error">
                  error_outline
                </span>
                <h2 className="text-lg font-bold text-on-surface">Couldn't Load Products</h2>
                <p className="text-sm text-on-surface-variant">
                  {import.meta.env.DEV
                    ? 'The catalog service is offline. Showing sample products for development preview.'
                    : "We couldn't reach the catalog service. Please try again."}
                </p>
                {!import.meta.env.DEV && (
                  <button
                    onClick={() => refetch()}
                    className="px-4 py-2 bg-primary text-on-primary text-xs font-semibold rounded-xl shadow-glow hover:brightness-110 transition-colors"
                  >
                    Retry
                  </button>
                )}
              </div>
            ) : productsList.length === 0 ? (
              <div className="glass-card rounded-2xl p-12 text-center max-w-lg mx-auto space-y-4">
                <span className="material-symbols-outlined text-[48px] text-outline-variant">
                  search_off
                </span>
                <h2 className="text-lg font-bold text-on-surface">No Products Found</h2>
                <p className="text-sm text-on-surface-variant">
                  Try adjusting your filters or search query.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setMinPrice(0);
                    setMaxPrice(5000);
                    setSearchQuery('');
                    setPage(1);
                  }}
                  className="px-4 py-2 bg-primary text-on-primary text-xs font-semibold rounded-xl shadow-glow hover:brightness-110 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {productsList.map((product) => (
                  <div
                    key={product.id}
                    className="glass-card rounded-2xl overflow-hidden flex flex-col group transition-all"
                  >
                    <div
                      onClick={() => navigate(`/products/${product.id}`)}
                      className="relative aspect-square overflow-hidden cursor-pointer bg-[var(--color-surface-container-low)]"
                    >
                      <img
                        src={
                          product.images?.[0]?.url ||
                          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'
                        }
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
                            : 'bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-high)]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[18px]">favorite</span>
                      </button>
                    </div>

                    <div className="flex-grow px-4 pt-3 pb-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-[var(--color-primary-container)] text-[var(--color-primary)] text-xs font-semibold uppercase tracking-widest">
                        {product.categoryId || 'Hardware'}
                      </span>
                      <h3
                        onClick={() => navigate(`/products/${product.id}`)}
                        className="text-base font-bold text-[var(--color-on-surface)] mt-3 cursor-pointer hover:text-[var(--color-primary)] transition-colors"
                      >
                        {product.title}
                      </h3>
                      <p className="text-xs text-[var(--color-on-surface-variant)] mt-1 line-clamp-2">
                        {product.description}
                      </p>
                    </div>

                    <div className="flex justify-between items-center px-4 pb-4 pt-4 border-t border-[var(--color-outline-variant)]/30 mt-auto">
                      <span className="text-xl font-bold text-[var(--color-on-surface)]">
                        ${product.price.toLocaleString()}
                      </span>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="bg-primary text-on-primary rounded-xl text-sm px-4 py-2 shadow-glow hover:brightness-110 active:scale-95 transition-all font-medium"
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
