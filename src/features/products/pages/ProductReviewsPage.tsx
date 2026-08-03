/**
 * ProductReviewsPage component
 *
 * Displays all reviews for a product with a summary header.
 * Falls back to sample reviews in development when the reviews API is
 * not yet served by the backend.
 *
 * Validates: Requirements 4.5
 */

import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetProductQuery, useGetProductReviewsQuery } from '../../../services/api/productApi';
import { ROUTES } from '../../../constants';
import type { Review } from '../../../types';

const FALLBACK_REVIEWS: Review[] = [
  {
    id: '1',
    productId: '',
    userId: 'u1',
    userName: 'Sarah Jenkins',
    rating: 5,
    title: 'Outstanding build quality',
    comment:
      'Outstanding build quality and noise cancellation. Essential for long flights and deep work.',
    verified: true,
    helpful: 42,
    createdAt: '2 days ago',
    updatedAt: '2 days ago',
  },
  {
    id: '2',
    productId: '',
    userId: 'u2',
    userName: 'Marcus Vance',
    rating: 5,
    title: 'Worth every dollar',
    comment: 'Fast pairing and incredible soundstage clarity. Worth every dollar.',
    verified: true,
    helpful: 28,
    createdAt: '1 week ago',
    updatedAt: '1 week ago',
  },
  {
    id: '3',
    productId: '',
    userId: 'u3',
    userName: 'Priya Raman',
    rating: 4,
    title: 'Great, minor quibbles',
    comment:
      'Excellent sound and comfort. Battery life is slightly below the advertised figure.',
    verified: false,
    helpful: 15,
    createdAt: '3 weeks ago',
    updatedAt: '3 weeks ago',
  },
];

export default function ProductReviewsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const productId = id || 'prod-1';

  const { data: product } = useGetProductQuery(productId);
  const { data: reviewsData, isLoading, isError } = useGetProductReviewsQuery({ productId, page: 1, pageSize: 20 });

  const reviews = useMemo(() => {
    if (reviewsData?.data && reviewsData.data.length > 0) {
      return reviewsData.data;
    }
    return import.meta.env.DEV && isError ? FALLBACK_REVIEWS : [];
  }, [reviewsData, isError]);

  const productName = product?.title || product?.name || 'Product';
  const averageRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 'No ratings yet';

  return (
    <div className="page-bg pt-28 pb-16 min-h-screen">
      <main className="max-w-5xl mx-auto px-4 md:px-10">
        {/* Breadcrumb */}
        <nav className="text-xs text-[var(--color-on-surface-variant)] mb-8 flex items-center gap-2">
          <button onClick={() => navigate(ROUTES.PRODUCTS)} className="hover:underline text-[var(--color-primary)]">Products</button>
          <span className="text-[var(--color-outline)]">/</span>
          <button
            onClick={() => navigate(ROUTES.PRODUCT_DETAIL.replace(':id', productId))}
            className="hover:underline text-[var(--color-primary)] truncate max-w-xs"
          >
            {productName}
          </button>
          <span className="text-[var(--color-outline)]">/</span>
          <span className="text-[var(--color-on-surface)] font-medium">Reviews</span>
        </nav>

        {/* Header */}
        <div className="glass-card rounded-2xl p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-semibold uppercase text-primary tracking-wider">Customer Reviews</span>
              <h1 className="text-3xl font-bold text-[var(--color-on-surface)] mt-1">{productName}</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-4xl font-extrabold text-[var(--color-on-surface)]">{averageRating}</div>
                <div className="text-xs text-[var(--color-on-surface-variant)] mt-1">
                  {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                </div>
              </div>
              <div className="flex text-warning">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className={`h-6 w-6 ${
                      i < Math.round(Number(averageRating) || 0)
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
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <button
              onClick={() => navigate(ROUTES.PRODUCT_DETAIL.replace(':id', productId))}
              className="px-4 py-2 bg-primary text-on-primary text-xs font-semibold rounded-xl shadow-glow hover:brightness-110 transition-all"
            >
              Back to Product
            </button>
          </div>
        </div>

        {/* Reviews List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 glass-card rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center space-y-4">
            <span className="material-symbols-outlined text-[48px] text-outline-variant">rate_review</span>
            <h2 className="text-lg font-bold text-[var(--color-on-surface)]">No reviews yet</h2>
            <p className="text-sm text-[var(--color-on-surface-variant)]">
              Be the first to review this product.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-6 rounded-2xl glass-card">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-sm text-[var(--color-on-surface)]">{rev.userName}</span>
                  <span className="text-xs text-[var(--color-on-surface-variant)]">{rev.createdAt}</span>
                </div>
                {rev.title && (
                  <h3 className="text-sm font-semibold text-[var(--color-on-surface)] mt-1">{rev.title}</h3>
                )}
                <div className="text-warning text-xs mb-2 mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={`material-symbols-outlined text-[16px] ${
                        i < rev.rating ? 'text-warning' : 'text-on-surface-variant'
                      }`}
                    >
                      star
                    </span>
                  ))}
                </div>
                <p className="text-xs text-[var(--color-on-surface-variant)]">{rev.comment}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-[var(--color-on-surface-variant)]">
                  {rev.verified && (
                    <span className="inline-flex items-center gap-1 text-success">
                      <span className="material-symbols-outlined text-[14px]">verified</span> Verified Purchase
                    </span>
                  )}
                  {rev.helpful > 0 && (
                    <span className="inline-flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">thumb_up</span> {rev.helpful} found this helpful
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
