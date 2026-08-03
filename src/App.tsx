import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { store } from './store';
import { ThemeProvider } from './providers/ThemeProvider';
import { WebSocketProvider } from './services/websocket';
import { SkipNavigation, WebSocketStatus } from './components/ui';
import { NetworkStatusIndicator } from './components/NetworkStatusIndicator';
import { ErrorBoundary, RootErrorFallback, RouteErrorFallback } from './components/error';
import { ROUTES } from './constants';

import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import SellerLayout from './layouts/SellerLayout';

import {
  LazyHomePage,
  LazyProductListPage,
  LazyProductDetailPage,
  LazySearchResultsPage,
  LazyCategoriesPage,
  LazyCompareProductsPage,
  LazyCartPage,
  LazyCheckoutPage,
  LazyOrderConfirmationPage,
  LazyOrdersPage,
  LazyOrderDetailPage,
  LazyTrackOrderPage,
  LazyInvoiceBillingPage,
  LazyProfilePage,
  LazyWishlistPage,
  LazyLoginPage,
  LazyRegisterPage,
  LazyAdminDashboard,
  LazyAdminProductsPage,
  LazyAdminProductEditorPage,
  LazyAdminOrdersPage,
  LazyAdminOrderDetailPage,
  LazyAdminInventoryPage,
  LazyAdminUsersPage,
  LazyAdminAnalyticsPage,
  LazyAdminVendorsPage,
  LazyAdminRolesPage,
  LazyEnterpriseLandingPage,
  LazyApiPortalPage,
  LazySupportCenterPage,
  LazySellerDashboard,
  LazySellerProductsPage,
  LazySellerProductEditorPage,
  LazySellerOrdersPage,
  LazySellerInventoryPage,
  LazySellerAnalyticsPage,
  LazySellerReviewsPage,
  LazyNotFoundPage,
  LazyMaintenancePage,
  prefetchLikelyRoutes,
} from './routes/lazyRoutes';

import { ProtectedRoute } from './features/auth/components';
import './styles/index.css';

function usePrefetchRoutes() {
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      prefetchLikelyRoutes(location.pathname);
    }, 1000);

    return () => clearTimeout(timer);
  }, [location.pathname]);
}

function AppRoutes() {
  const location = useLocation();
  usePrefetchRoutes();

  return (
    <>
      <SkipNavigation />
      <NetworkStatusIndicator />
      <WebSocketStatus />

      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          {/* Public Auth Routes */}
          <Route
            path={ROUTES.LOGIN}
            element={
              <ErrorBoundary level="route" fallback={RouteErrorFallback}>
                <LazyLoginPage />
              </ErrorBoundary>
            }
          />
          <Route
            path={ROUTES.REGISTER}
            element={
              <ErrorBoundary level="route" fallback={RouteErrorFallback}>
                <LazyRegisterPage />
              </ErrorBoundary>
            }
          />

          {/* Standalone Pages */}
          <Route path={ROUTES.MAINTENANCE} element={<LazyMaintenancePage />} />

          {/* Main App Routes */}
          <Route element={<MainLayout />}>
            <Route
              path={ROUTES.HOME}
              element={
                <ErrorBoundary level="route" fallback={RouteErrorFallback}>
                  <LazyHomePage />
                </ErrorBoundary>
              }
            />
            <Route
              path={ROUTES.PRODUCTS}
              element={
                <ErrorBoundary level="route" fallback={RouteErrorFallback}>
                  <LazyProductListPage />
                </ErrorBoundary>
              }
            />
            <Route
              path={ROUTES.PRODUCT_DETAIL}
              element={
                <ErrorBoundary level="route" fallback={RouteErrorFallback}>
                  <LazyProductDetailPage />
                </ErrorBoundary>
              }
            />
            <Route
              path={ROUTES.CATEGORIES}
              element={
                <ErrorBoundary level="route" fallback={RouteErrorFallback}>
                  <LazyCategoriesPage />
                </ErrorBoundary>
              }
            />
            <Route
              path={ROUTES.SEARCH}
              element={
                <ErrorBoundary level="route" fallback={RouteErrorFallback}>
                  <LazySearchResultsPage />
                </ErrorBoundary>
              }
            />
            <Route
              path={ROUTES.COMPARE}
              element={
                <ErrorBoundary level="route" fallback={RouteErrorFallback}>
                  <LazyCompareProductsPage />
                </ErrorBoundary>
              }
            />
            <Route
              path={ROUTES.CART}
              element={
                <ErrorBoundary level="route" fallback={RouteErrorFallback}>
                  <LazyCartPage />
                </ErrorBoundary>
              }
            />
            <Route
              path={ROUTES.WISHLIST}
              element={
                <ErrorBoundary level="route" fallback={RouteErrorFallback}>
                  <ProtectedRoute>
                    <LazyWishlistPage />
                  </ProtectedRoute>
                </ErrorBoundary>
              }
            />
            <Route
              path={ROUTES.TRACK_ORDER}
              element={
                <ErrorBoundary level="route" fallback={RouteErrorFallback}>
                  <LazyTrackOrderPage />
                </ErrorBoundary>
              }
            />
            <Route
              path={ROUTES.ENTERPRISE}
              element={
                <ErrorBoundary level="route" fallback={RouteErrorFallback}>
                  <LazyEnterpriseLandingPage />
                </ErrorBoundary>
              }
            />
            <Route
              path={ROUTES.DEVELOPER}
              element={
                <ErrorBoundary level="route" fallback={RouteErrorFallback}>
                  <LazyApiPortalPage />
                </ErrorBoundary>
              }
            />
            <Route
              path={ROUTES.SUPPORT}
              element={
                <ErrorBoundary level="route" fallback={RouteErrorFallback}>
                  <LazySupportCenterPage />
                </ErrorBoundary>
              }
            />

            {/* Protected Routes */}
            <Route
              path={ROUTES.CHECKOUT}
              element={
                <ErrorBoundary level="route" fallback={RouteErrorFallback}>
                  <ProtectedRoute>
                    <LazyCheckoutPage />
                  </ProtectedRoute>
                </ErrorBoundary>
              }
            />
            <Route
              path={`${ROUTES.CHECKOUT}/confirmation`}
              element={
                <ErrorBoundary level="route" fallback={RouteErrorFallback}>
                  <ProtectedRoute>
                    <LazyOrderConfirmationPage />
                  </ProtectedRoute>
                </ErrorBoundary>
              }
            />
            <Route
              path={ROUTES.ORDERS}
              element={
                <ErrorBoundary level="route" fallback={RouteErrorFallback}>
                  <ProtectedRoute>
                    <LazyOrdersPage />
                  </ProtectedRoute>
                </ErrorBoundary>
              }
            />
            <Route
              path={ROUTES.ORDER_DETAIL}
              element={
                <ErrorBoundary level="route" fallback={RouteErrorFallback}>
                  <ProtectedRoute>
                    <LazyOrderDetailPage />
                  </ProtectedRoute>
                </ErrorBoundary>
              }
            />
            <Route
              path={ROUTES.INVOICE}
              element={
                <ErrorBoundary level="route" fallback={RouteErrorFallback}>
                  <ProtectedRoute>
                    <LazyInvoiceBillingPage />
                  </ProtectedRoute>
                </ErrorBoundary>
              }
            />
            <Route
              path={ROUTES.PROFILE}
              element={
                <ErrorBoundary level="route" fallback={RouteErrorFallback}>
                  <ProtectedRoute>
                    <LazyProfilePage />
                  </ProtectedRoute>
                </ErrorBoundary>
              }
            />
          </Route>

          {/* Admin Routes */}
          <Route
            path={ROUTES.ADMIN}
            element={
              <ErrorBoundary level="route" fallback={RouteErrorFallback}>
                <ProtectedRoute requireAdmin>
                  <AdminLayout />
                </ProtectedRoute>
              </ErrorBoundary>
            }
          >
            <Route
              index
              element={
                <ErrorBoundary level="route" fallback={RouteErrorFallback}>
                  <LazyAdminDashboard />
                </ErrorBoundary>
              }
            />
            <Route
              path={ROUTES.ADMIN_PRODUCTS}
              element={
                <ErrorBoundary level="route" fallback={RouteErrorFallback}>
                  <LazyAdminProductsPage />
                </ErrorBoundary>
              }
            />
            <Route
              path={ROUTES.ADMIN_PRODUCT_NEW}
              element={
                <ErrorBoundary level="route" fallback={RouteErrorFallback}>
                  <LazyAdminProductEditorPage />
                </ErrorBoundary>
              }
            />
            <Route
              path={ROUTES.ADMIN_PRODUCT_EDIT}
              element={
                <ErrorBoundary level="route" fallback={RouteErrorFallback}>
                  <LazyAdminProductEditorPage />
                </ErrorBoundary>
              }
            />
            <Route
              path={ROUTES.ADMIN_ORDERS}
              element={
                <ErrorBoundary level="route" fallback={RouteErrorFallback}>
                  <LazyAdminOrdersPage />
                </ErrorBoundary>
              }
            />
            <Route
              path={ROUTES.ADMIN_ORDER_DETAIL}
              element={
                <ErrorBoundary level="route" fallback={RouteErrorFallback}>
                  <LazyAdminOrderDetailPage />
                </ErrorBoundary>
              }
            />
            <Route
              path={ROUTES.ADMIN_INVENTORY}
              element={
                <ErrorBoundary level="route" fallback={RouteErrorFallback}>
                  <LazyAdminInventoryPage />
                </ErrorBoundary>
              }
            />
            <Route
              path={ROUTES.ADMIN_USERS}
              element={
                <ErrorBoundary level="route" fallback={RouteErrorFallback}>
                  <LazyAdminUsersPage />
                </ErrorBoundary>
              }
            />
            <Route
              path={ROUTES.ADMIN_ANALYTICS}
              element={
                <ErrorBoundary level="route" fallback={RouteErrorFallback}>
                  <LazyAdminAnalyticsPage />
                </ErrorBoundary>
              }
            />
            <Route
              path={ROUTES.ADMIN_VENDORS}
              element={
                <ErrorBoundary level="route" fallback={RouteErrorFallback}>
                  <LazyAdminVendorsPage />
                </ErrorBoundary>
              }
            />
            <Route
              path={ROUTES.ADMIN_ROLES}
              element={
                <ErrorBoundary level="route" fallback={RouteErrorFallback}>
                  <LazyAdminRolesPage />
                </ErrorBoundary>
              }
            />
          </Route>

          {/* Seller Routes */}
          <Route
            path={ROUTES.SELLER}
            element={
              <ErrorBoundary level="route" fallback={RouteErrorFallback}>
                <ProtectedRoute requireSeller>
                  <SellerLayout />
                </ProtectedRoute>
              </ErrorBoundary>
            }
          >
            <Route index element={<LazySellerDashboard />} />
            <Route path={ROUTES.SELLER_PRODUCTS} element={<LazySellerProductsPage />} />
            <Route path={ROUTES.SELLER_PRODUCT_NEW} element={<LazySellerProductEditorPage />} />
            <Route path={ROUTES.SELLER_PRODUCT_EDIT} element={<LazySellerProductEditorPage />} />
            <Route path={ROUTES.SELLER_ORDERS} element={<LazySellerOrdersPage />} />
            <Route path={ROUTES.SELLER_INVENTORY} element={<LazySellerInventoryPage />} />
            <Route path={ROUTES.SELLER_ANALYTICS} element={<LazySellerAnalyticsPage />} />
            <Route path={ROUTES.SELLER_REVIEWS} element={<LazySellerReviewsPage />} />
          </Route>

          {/* Catch-all 404 */}
          <Route path="*" element={<LazyNotFoundPage />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

function AppContent() {
  return (
    <ThemeProvider>
      <WebSocketProvider>
        <Router>
          <AppRoutes />
        </Router>
        <Toaster position="top-right" />
      </WebSocketProvider>
    </ThemeProvider>
  );
}

function App() {
  return (
    <ErrorBoundary level="root" fallback={RootErrorFallback}>
      <Provider store={store}>
        <AppContent />
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
