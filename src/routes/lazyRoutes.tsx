import { lazy, Suspense, type ComponentType, type ReactNode } from 'react';
import { Skeleton } from '@/components/ui';

function withSuspense<P extends object>(
  Component: ComponentType<P>,
  fallback?: ReactNode
) {
  return (props: P) => (
    <Suspense fallback={fallback || <PageLoadingFallback />}>
      <Component {...props} />
    </Suspense>
  );
}

function PageLoadingFallback() {
  return (
    <div className="min-h-screen p-8 pt-28">
      <div className="max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Core Storefront Pages
export const LazyHomePage = withSuspense(
  lazy(() => import('@/features/products/pages/HomePage'))
);

export const LazyProductListPage = withSuspense(
  lazy(() => import('@/features/products/pages/ProductListPage'))
);

export const LazyProductDetailPage = withSuspense(
  lazy(() => import('@/features/products/pages/ProductDetailPage'))
);

export const LazyProductReviewsPage = withSuspense(
  lazy(() => import('@/features/products/pages/ProductReviewsPage'))
);

export const LazySearchResultsPage = withSuspense(
  lazy(() => import('@/features/search/pages/SearchResultsPage').then((m) => ({ default: m.SearchResultsPage })))
);

export const LazyCategoriesPage = withSuspense(
  lazy(() => import('@/features/products/pages/CategoriesPage'))
);

export const LazyCompareProductsPage = withSuspense(
  lazy(() => import('@/features/products/pages/CompareProductsPage'))
);

// Cart & Checkout
export const LazyCartPage = withSuspense(
  lazy(() => import('@/features/cart/pages/CartPage'))
);

export const LazyCheckoutPage = withSuspense(
  lazy(() => import('@/features/checkout/pages/CheckoutPage'))
);

export const LazyOrderConfirmationPage = withSuspense(
  lazy(() => import('@/features/checkout/pages/OrderConfirmationPage'))
);

// Orders & Tracking
export const LazyOrdersPage = withSuspense(
  lazy(() => import('@/features/orders/pages/OrdersPage'))
);

export const LazyOrderDetailPage = withSuspense(
  lazy(() => import('@/features/orders/pages/OrderDetailPage'))
);

export const LazyTrackOrderPage = withSuspense(
  lazy(() => import('@/features/orders/pages/TrackOrderPage'))
);

export const LazyInvoiceBillingPage = withSuspense(
  lazy(() => import('@/features/orders/pages/InvoiceBillingPage'))
);

// User & Auth
export const LazyProfilePage = withSuspense(
  lazy(() => import('@/features/profile/pages/ProfilePage'))
);

export const LazyWishlistPage = withSuspense(
  lazy(() => import('@/features/wishlist/pages/WishlistPage').then(m => ({ default: m.WishlistPage })))
);

export const LazyLoginPage = withSuspense(
  lazy(() => import('@/features/auth/pages/LoginPage'))
);

export const LazyRegisterPage = withSuspense(
  lazy(() => import('@/features/auth/pages/RegisterPage'))
);

// Admin Pages
export const LazyAdminDashboard = withSuspense(
  lazy(() => import('@/features/admin/pages/AdminDashboard'))
);

export const LazyAdminProductsPage = withSuspense(
  lazy(() => import('@/features/admin/pages/AdminProductsPage').then(m => ({ default: m.AdminProductsPage })))
);

export const LazyAdminProductEditorPage = withSuspense(
  lazy(() => import('@/features/admin/pages/AdminProductEditorPage').then(m => ({ default: m.AdminProductEditorPage })))
);

export const LazyAdminOrdersPage = withSuspense(
  lazy(() => import('@/features/admin/pages/AdminOrdersPage').then(m => ({ default: m.AdminOrdersPage })))
);

export const LazyAdminOrderDetailPage = withSuspense(
  lazy(() => import('@/features/admin/pages/AdminOrderDetailPage').then(m => ({ default: m.AdminOrderDetailPage })))
);

export const LazyAdminInventoryPage = withSuspense(
  lazy(() => import('@/features/admin/pages/AdminInventoryPage').then(m => ({ default: m.AdminInventoryPage })))
);

export const LazyAdminUsersPage = withSuspense(
  lazy(() => import('@/features/admin/pages/AdminUsersPage').then(m => ({ default: m.AdminUsersPage })))
);

export const LazyAdminAnalyticsPage = withSuspense(
  lazy(() => import('@/features/admin/pages/AdminAnalyticsPage').then(m => ({ default: m.AdminAnalyticsPage })))
);

export const LazyAdminVendorsPage = withSuspense(
  lazy(() => import('@/features/admin/pages/AdminVendorsPage').then(m => ({ default: m.AdminVendorsPage })))
);

export const LazyAdminRolesPage = withSuspense(
  lazy(() => import('@/features/admin/pages/AdminRolesPage').then(m => ({ default: m.AdminRolesPage })))
);

// Seller Pages
export const LazySellerDashboard = withSuspense(
  lazy(() => import('@/features/seller/pages/SellerDashboardPage'))
);

export const LazySellerProductsPage = withSuspense(
  lazy(() => import('@/features/seller/pages/SellerProductsPage'))
);

export const LazySellerProductEditorPage = withSuspense(
  lazy(() => import('@/features/seller/pages/SellerProductEditorPage'))
);

export const LazySellerOrdersPage = withSuspense(
  lazy(() => import('@/features/seller/pages/SellerOrdersPage'))
);

export const LazySellerInventoryPage = withSuspense(
  lazy(() => import('@/features/seller/pages/SellerInventoryPage'))
);

export const LazySellerAnalyticsPage = withSuspense(
  lazy(() => import('@/features/seller/pages/SellerAnalyticsPage'))
);

export const LazySellerReviewsPage = withSuspense(
  lazy(() => import('@/features/seller/pages/SellerReviewsPage'))
);

// Specialty & Informational Pages
export const LazyEnterpriseLandingPage = withSuspense(
  lazy(() => import('@/features/enterprise/pages/EnterpriseLandingPage').then(m => ({ default: m.EnterpriseLandingPage })))
);

export const LazyApiPortalPage = withSuspense(
  lazy(() => import('@/features/developer/pages/ApiPortalPage').then(m => ({ default: m.ApiPortalPage })))
);

export const LazySupportCenterPage = withSuspense(
  lazy(() => import('@/features/support/pages/SupportCenterPage').then(m => ({ default: m.SupportCenterPage })))
);

export const LazyNotFoundPage = withSuspense(
  lazy(() => import('@/features/common/pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })))
);

export const LazyMaintenancePage = withSuspense(
  lazy(() => import('@/features/common/pages/MaintenancePage').then(m => ({ default: m.MaintenancePage })))
);

export function prefetchLikelyRoutes(currentPath: string): void {
  if (currentPath === '/') {
    import('@/features/products/pages/ProductListPage');
  }
}
