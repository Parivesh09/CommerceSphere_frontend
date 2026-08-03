import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetProductQuery, useGetProductReviewsQuery } from '../../../services/api/productApi';
import { useGetSimilarProductsQuery } from '../../../services/api/recommendationApi';
import { useCart } from '../../cart/hooks';
import { toggleWishlistItem } from '../../../features/wishlist/slice';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import toast from 'react-hot-toast';
import { ROUTES } from '../../../constants';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'specs' | 'reviews' | 'shipping'>('specs');

  const productId = id || 'prod-1';
  const { data: productData, isLoading } = useGetProductQuery(productId);
  const { data: reviewsData } = useGetProductReviewsQuery({ productId });
  const { data: relatedData } = useGetSimilarProductsQuery({ productId, limit: 4 });

  const fallbackProduct = {
    id: productId,
    title: 'Premium Wireless Noise-Canceling Headphones',
    description: 'Experience pure sonic clarity with active noise cancellation, custom-tuned 40mm beryllium drivers, and up to 40 hours of battery life. Designed for audiophiles and high-velocity professionals.',
    price: 349.00,
    categoryId: 'audio',
    inventoryQuantity: 45,
    status: 'active' as const,
    images: [
      { id: '1', productId, url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80', displayOrder: 0, createdAt: '' },
      { id: '2', productId, url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80', displayOrder: 1, createdAt: '' },
      { id: '3', productId, url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80', displayOrder: 2, createdAt: '' },
    ],
    createdAt: '',
    updatedAt: '',
  };

  const product = productData || fallbackProduct;
  const mainImage = product.images?.[selectedImageIndex]?.url || fallbackProduct.images[0].url;

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      quantity,
      unitPrice: product.price,
    });
    toast.success(`${quantity} x ${product.title} added to cart!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate(ROUTES.CART);
  };

  const handleWishlist = () => {
    dispatch(
      toggleWishlistItem({
        id: product.id,
        title: product.title,
        price: product.price,
        image: mainImage,
        inStock: product.inventoryQuantity > 0,
      })
    );
    toast.success('Wishlist updated!');
  };

  if (isLoading) {
    return (
      <div className="page-bg pt-28 pb-16 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="page-bg pt-28 pb-16">
      <main className="max-w-7xl mx-auto px-4 md:px-10">
        {/* Breadcrumb */}
        <nav className="text-xs text-[var(--color-on-surface-variant)] mb-8 flex items-center gap-2">
          <button onClick={() => navigate(ROUTES.HOME)} className="hover:underline text-[var(--color-primary)]">Home</button>
          <span className="text-[var(--color-outline)]">/</span>
          <button onClick={() => navigate(ROUTES.PRODUCTS)} className="hover:underline text-[var(--color-primary)]">Products</button>
          <span className="text-[var(--color-outline)]">/</span>
          <span className="text-[var(--color-on-surface)] font-medium truncate max-w-xs">{product.title}</span>
        </nav>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          {/* Gallery */}
          <div className="lg:col-span-7 space-y-4">
            <div className="glass-card rounded-2xl overflow-hidden aspect-square flex items-center justify-center p-4">
              <img
                src={mainImage}
                alt={product.title}
                className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {product.images?.map((img, idx) => (
                <button
                  key={img.id || idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 rounded-xl glass-card overflow-hidden shrink-0 border-2 transition-all ${
                    selectedImageIndex === idx ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/20' : 'border-transparent'
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Details Column */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-[var(--color-tertiary-container)]/10 border border-[var(--color-tertiary)]/20 text-[var(--color-tertiary)] text-xs font-semibold uppercase tracking-widest">
                In Stock ({product.inventoryQuantity} available)
              </span>
              <h1 className="text-3xl font-bold text-[var(--color-on-surface)] leading-tight mt-3">{product.title}</h1>

              {/* Rating */}
              <div className="flex items-center gap-1 mt-3 text-amber-500 text-sm">
                <span className="material-symbols-outlined text-[18px]">star</span>
                <span className="material-symbols-outlined text-[18px]">star</span>
                <span className="material-symbols-outlined text-[18px]">star</span>
                <span className="material-symbols-outlined text-[18px]">star</span>
                <span className="material-symbols-outlined text-[18px]">star_half</span>
                <span className="text-[var(--color-on-surface-variant)] text-xs font-medium ml-1">(4.9 rating / 128 enterprise reviews)</span>
              </div>
            </div>

            <div className="p-6 glass-card rounded-xl space-y-3">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-[var(--color-primary)]">${product.price.toLocaleString()}</span>
                <span className="text-sm text-[var(--color-on-surface-variant)] line-through">${(product.price * 1.25).toFixed(2)}</span>
                <span className="text-xs font-bold text-[var(--color-tertiary)] bg-[var(--color-tertiary-container)]/10 px-2 py-0.5 rounded-full">Save 20%</span>
              </div>
              <p className="text-xs text-[var(--color-on-surface-variant)]">Includes enterprise warranty & free express shipping.</p>
            </div>

            <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">{product.description}</p>

            {/* Quantity Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[var(--color-on-surface)] uppercase tracking-wider">Quantity</label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-[var(--color-outline-variant)] rounded-xl glass-card">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-lg font-bold hover:bg-[var(--color-surface-container-high)] rounded-l-xl text-[var(--color-on-surface)]"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-bold text-sm text-[var(--color-on-surface)]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center text-lg font-bold hover:bg-[var(--color-surface-container-high)] rounded-r-xl text-[var(--color-on-surface)]"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={handleWishlist}
                  className="p-2.5 glass-card rounded-xl text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">favorite</span>
                </button>
                <button
                  onClick={() => navigate(ROUTES.COMPARE)}
                  className="p-2.5 glass-card rounded-xl text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors"
                  title="Compare"
                >
                  <span className="material-symbols-outlined text-[20px]">compare_arrows</span>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <button
                onClick={handleAddToCart}
                className="glass-card rounded-xl text-sm font-medium py-3 px-4 text-[var(--color-on-surface)] hover:shadow-lg active:scale-95 transition-all"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="bg-primary text-on-primary rounded-xl text-sm font-medium py-3 px-4 hover:shadow-lg active:scale-95 transition-all"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Tabs section: Specs, Reviews, Shipping */}
        <div className="glass-card rounded-2xl p-6 mb-16">
          <div className="flex border-b border-[var(--color-outline-variant)] mb-6 gap-6">
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-3 text-sm font-bold transition-colors ${
                activeTab === 'specs' ? 'border-b-2 border-[var(--color-primary)] text-[var(--color-primary)]' : 'text-[var(--color-on-surface-variant)]'
              }`}
            >
              Specifications
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 text-sm font-bold transition-colors ${
                activeTab === 'reviews' ? 'border-b-2 border-[var(--color-primary)] text-[var(--color-primary)]' : 'text-[var(--color-on-surface-variant)]'
              }`}
            >
              Customer Reviews (128)
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`pb-3 text-sm font-bold transition-colors ${
                activeTab === 'shipping' ? 'border-b-2 border-[var(--color-primary)] text-[var(--color-primary)]' : 'text-[var(--color-on-surface-variant)]'
              }`}
            >
              Shipping & Return Policies
            </button>
          </div>

          {activeTab === 'specs' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="flex justify-between py-2 border-b border-[var(--color-outline-variant)]/30">
                <span className="text-[var(--color-on-surface-variant)]">Driver Diameter</span>
                <span className="font-semibold text-[var(--color-on-surface)]">40mm Beryllium</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[var(--color-outline-variant)]/30">
                <span className="text-[var(--color-on-surface-variant)]">Frequency Response</span>
                <span className="font-semibold text-[var(--color-on-surface)]">10 Hz - 40,000 Hz</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[var(--color-outline-variant)]/30">
                <span className="text-[var(--color-on-surface-variant)]">Battery Life</span>
                <span className="font-semibold text-[var(--color-on-surface)]">40 Hours (ANC On)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[var(--color-outline-variant)]/30">
                <span className="text-[var(--color-on-surface-variant)]">Wireless Range</span>
                <span className="font-semibold text-[var(--color-on-surface)]">Bluetooth 5.3 (Up to 30m)</span>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4">
              {(reviewsData?.data || [
                { id: '1', userName: 'Sarah Jenkins', rating: 5, comment: 'Outstanding build quality and noise cancellation. Essential for long flights and deep work.', createdAt: '2 days ago' },
                { id: '2', userName: 'Marcus Vance', rating: 5, comment: 'Fast pairing and incredible soundstage clarity. Worth every dollar.', createdAt: '1 week ago' },
              ]).map((rev) => (
                <div key={rev.id} className="p-4 rounded-xl glass-card">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-sm text-[var(--color-on-surface)]">{rev.userName}</span>
                    <span className="text-xs text-[var(--color-on-surface-variant)]">{rev.createdAt}</span>
                  </div>
                  <div className="text-amber-500 text-xs mb-2">
                    {[...Array(rev.rating)].map((_, i) => (
                      <span key={i} className="material-symbols-outlined text-[16px] text-amber-500">star</span>
                    ))}
                  </div>
                  <p className="text-xs text-[var(--color-on-surface-variant)]">{rev.comment}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="text-sm text-[var(--color-on-surface-variant)] space-y-2">
              <p>• Free standard delivery on all enterprise orders above $500.</p>
              <p>• Expedited overnight shipping available at checkout.</p>
              <p>• 30-day money-back guarantee with zero restocking fee.</p>
            </div>
          )}
        </div>

        {/* Related Products */}
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-on-surface)] mb-6">Recommended Recommendations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {(relatedData?.data || [
              { id: 'prod-2', title: 'Quantum Scan Pro', price: 849, image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80' },
              { id: 'prod-4', title: 'Core Tablet Gen 3', price: 1199, image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80' },
            ]).map((rel) => (
              <div
                key={rel.id}
                onClick={() => navigate(`/products/${rel.id}`)}
                className="glass-card rounded-xl p-4 cursor-pointer hover:shadow-lg transition-all"
              >
                <img src={rel.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'} alt="" className="w-full h-40 object-cover rounded-xl mb-3" />
                <h4 className="font-bold text-sm text-[var(--color-on-surface)]">{rel.title}</h4>
                <p className="text-xs text-[var(--color-primary)] font-semibold mt-1">${rel.price}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
