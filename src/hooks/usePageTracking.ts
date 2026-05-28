import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analytics } from '@/services/analytics';

/**
 * Hook to track page views with analytics
 * 
 * Automatically tracks page views when the route changes
 * 
 * Usage:
 * ```tsx
 * function App() {
 *   usePageTracking();
 *   return <Routes>...</Routes>;
 * }
 * ```
 */
export function usePageTracking(): void {
  const location = useLocation();

  useEffect(() => {

    analytics.trackPageView(location.pathname + location.search);
  }, [location]);
}
