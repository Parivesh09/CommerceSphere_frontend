/**
 * Lazy-loaded route components
 * 
 * Implements route-based code splitting using React.lazy
 * Reduces initial bundle size and improves load time
 * 
 * Validates: Requirements 16.1, 16.5
 */

import { lazy, Suspense, type ComponentType, type ReactNode } from 'react';
import { Skeleton } from '@/components/ui';

/**
 * Wrapper component that adds Suspense boundary with loading fallback
 */
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

/**
 * Default loading fallback for page transitions
 */
function PageLoadingFallback() {
  return (
    <div className="min-h-screen p-8">
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

/**
 * Lazy-loaded page components
 * Each page is split into its own chunk and loaded on demand
 */


export const LazyHomePage = withSuspense(
  lazy(() => import('@/features/products/pages/HomePage'))
);

export const LazyProductListPage = withSuspense(
  lazy(() => import('@/features/products/pages/ProductListPage'))
);

export const LazyProductDetailPage = withSuspense(
  lazy(() => import('@/features/products/pages/ProductDetailPage'))
);


export const LazyCartPage = withSuspense(
  lazy(() => import('@/features/cart/pages/CartPage'))
);

export const LazyCheckoutPage = withSuspense(
  lazy(() => import('@/features/checkout/pages/CheckoutPage'))
);

export const LazyOrderConfirmationPage = withSuspense(
  lazy(() => import('@/features/checkout/pages/OrderConfirmationPage'))
);


export const LazyOrdersPage = withSuspense(
  lazy(() => import('@/features/orders/pages/OrdersPage'))
);

export const LazyOrderDetailPage = withSuspense(
  lazy(() => import('@/features/orders/pages/OrderDetailPage'))
);


export const LazyProfilePage = withSuspense(
  lazy(() => import('@/features/profile/pages/ProfilePage'))
);


export const LazyWishlistPage = withSuspense(
  lazy(() => import('@/features/wishlist/pages').then(m => ({ default: m.WishlistPage })))
);


export const LazyLoginPage = withSuspense(
  lazy(() => import('@/features/auth/pages/LoginPage'))
);

export const LazyRegisterPage = withSuspense(
  lazy(() => import('@/features/auth/pages/RegisterPage'))
);


export const LazyAdminDashboard = withSuspense(
  lazy(() => import('@/features/admin/pages/AdminDashboard'))
);

export const LazyAdminProductsPage = withSuspense(
  lazy(() => import('@/features/admin/pages/AdminProductsPage').then(m => ({ default: m.AdminProductsPage })))
);

export const LazyAdminOrdersPage = withSuspense(
  lazy(() => import('@/features/admin/pages/AdminOrdersPage').then(m => ({ default: m.AdminOrdersPage })))
);

export const LazyAdminOrderDetailPage = withSuspense(
  lazy(() => import('@/features/admin/pages/AdminOrderDetailPage').then(m => ({ default: m.AdminOrderDetailPage })))
);

/**
 * Route prefetch functions
 * Call these to preload routes before navigation
 */
export const prefetchRoutes = {
  home: () => import('@/features/products/pages/HomePage'),
  products: () => import('@/features/products/pages/ProductListPage'),
  productDetail: () => import('@/features/products/pages/ProductDetailPage'),
  cart: () => import('@/features/cart/pages/CartPage'),
  checkout: () => import('@/features/checkout/pages/CheckoutPage'),
  orders: () => import('@/features/orders/pages/OrdersPage'),
  profile: () => import('@/features/profile/pages/ProfilePage'),
  wishlist: () => import('@/features/wishlist/pages'),
  login: () => import('@/features/auth/pages/LoginPage'),
  register: () => import('@/features/auth/pages/RegisterPage'),
  adminDashboard: () => import('@/features/admin/pages/AdminDashboard'),
  adminProducts: () => import('@/features/admin/pages/AdminProductsPage'),
  adminOrders: () => import('@/features/admin/pages/AdminOrdersPage'),
};

/**
 * Prefetch likely next routes based on current route
 * This improves perceived performance by loading routes before user navigates
 */
export function prefetchLikelyRoutes(currentPath: string): void {

  if (currentPath === '/') {

    prefetchRoutes.products();
  } else if (currentPath.startsWith('/products') && !currentPath.includes('/products/')) {

    prefetchRoutes.productDetail();
  } else if (currentPath.startsWith('/products/')) {

    prefetchRoutes.cart();
  } else if (currentPath === '/cart') {

    prefetchRoutes.checkout();
  } else if (currentPath === '/login') {

    prefetchRoutes.profile();
    prefetchRoutes.products();
  }
}
