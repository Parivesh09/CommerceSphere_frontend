import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { store } from './store';
import { ThemeProvider } from './providers/ThemeProvider';
import { WebSocketProvider } from './services/websocket';
import { WebSocketStatus, SkipNavigation } from './components/ui';
import { NetworkStatusIndicator } from './components/NetworkStatusIndicator';
import { ErrorBoundary, RootErrorFallback, RouteErrorFallback } from './components/error';
import { ROUTES } from './constants';


import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';


import {
  LazyHomePage,
  LazyProductListPage,
  LazyProductDetailPage,
  LazyCartPage,
  LazyCheckoutPage,
  LazyOrderConfirmationPage,
  LazyOrdersPage,
  LazyOrderDetailPage,
  LazyProfilePage,
  LazyWishlistPage,
  LazyLoginPage,
  LazyRegisterPage,
  LazyAdminDashboard,
  LazyAdminProductsPage,
  LazyAdminOrdersPage,
  LazyAdminOrderDetailPage,
  prefetchLikelyRoutes,
} from './routes/lazyRoutes';


import { ProtectedRoute } from './features/auth/components';

import './styles/index.css';

/**
 * Hook to prefetch likely next routes based on current location
 * Validates: Requirements 16.1, 16.5
 */
function usePrefetchRoutes() {
  const location = useLocation();
  
  useEffect(() => {

    const timer = setTimeout(() => {
      prefetchLikelyRoutes(location.pathname);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [location.pathname]);
}

/**
 * Routes component with error boundaries and network status
 * Must be inside Router to use useLocation
 * 
 * Validates: Requirements 11.1, 14.1, 14.3, 16.1, 16.5
 */
function AppRoutes() {
  const location = useLocation();
  

  usePrefetchRoutes();
  
  return (
    <>
      {/* Skip navigation for keyboard users */}
      <SkipNavigation />
      
      {/* Network status indicator for offline detection */}
      <NetworkStatusIndicator />
      
      {/* AnimatePresence enables exit animations for route changes */}
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          {/* Public Routes with route-level error boundaries */}
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

          {/* Main App Routes with route-level error boundaries */}
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
                  <LazyWishlistPage />
                </ErrorBoundary>
              }
            />
            
            {/* Protected Routes - Require Authentication */}
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

          {/* Admin Routes - Require Admin Role */}
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
              path={ROUTES.ADMIN_ORDERS}
              element={
                <ErrorBoundary level="route" fallback={RouteErrorFallback}>
                  <LazyAdminOrdersPage />
                </ErrorBoundary>
              }
            />
            <Route
              path={`${ROUTES.ADMIN_ORDERS}/:id`}
              element={
                <ErrorBoundary level="route" fallback={RouteErrorFallback}>
                  <LazyAdminOrderDetailPage />
                </ErrorBoundary>
              }
            />
            <Route
              path={ROUTES.ADMIN_USERS}
              element={
                <ErrorBoundary level="route" fallback={RouteErrorFallback}>
                  <div>Admin Users</div>
                </ErrorBoundary>
              }
            />
            <Route
              path={ROUTES.ADMIN_ANALYTICS}
              element={
                <ErrorBoundary level="route" fallback={RouteErrorFallback}>
                  <div>Admin Analytics</div>
                </ErrorBoundary>
              }
            />
          </Route>
        </Routes>
      </AnimatePresence>
      <WebSocketStatus />
    </>
  );
}

/**
 * App content with providers
 */
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

/**
 * Root App component with root-level error boundary
 * 
 * Validates: Requirement 14.1
 */
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
