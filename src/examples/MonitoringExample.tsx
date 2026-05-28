/**
 * Example component demonstrating monitoring and analytics integration
 * 
 * This file shows how to use the monitoring services in your components
 */

import { useEffect } from 'react';
import { monitoring, analytics, performanceMonitor } from '@/services/monitoring';

export function MonitoringExample() {
  useEffect(() => {

    performanceMonitor.mark('component-mount-start');

    return () => {
      performanceMonitor.mark('component-mount-end');
      performanceMonitor.measure(
        'component-mount-duration',
        'component-mount-start',
        'component-mount-end'
      );
    };
  }, []);

  const handleProductView = (productId: string) => {

    analytics.trackProductView(
      productId,
      'Example Product',
      'Electronics',
      99.99
    );
  };

  const handleAddToCart = (productId: string) => {
    try {




      analytics.trackAddToCart(
        productId,
        'Example Product',
        99.99,
        1
      );
    } catch (error) {

      monitoring.errors.logError(error as Error, {
        component: 'MonitoringExample',
        action: 'add_to_cart',
        metadata: {
          productId,
        },
      });
    }
  };

  const handleSearch = (query: string) => {

    analytics.trackSearch(query, 42);
  };

  const handleLogin = (userId: string, email: string, name: string) => {

    monitoring.setUser(userId, email, name, 'customer');


    analytics.trackLogin('email');
  };

  const handleLogout = () => {

    analytics.trackLogout();


    monitoring.clearUser();
  };

  const handleCustomEvent = () => {

    analytics.trackEvent({
      category: 'User Interaction',
      action: 'button_click',
      label: 'Example Button',
      value: 1,
      metadata: {
        page: 'example',
        timestamp: Date.now(),
      },
    });
  };

  return (
    <div>
      <h1>Monitoring Example</h1>
      <p>This component demonstrates monitoring and analytics integration.</p>
      
      <button onClick={() => handleProductView('prod-123')}>
        Track Product View
      </button>
      
      <button onClick={() => handleAddToCart('prod-123')}>
        Track Add to Cart
      </button>
      
      <button onClick={() => handleSearch('example query')}>
        Track Search
      </button>
      
      <button onClick={() => handleLogin('user-123', 'user@example.com', 'John Doe')}>
        Track Login
      </button>
      
      <button onClick={handleLogout}>
        Track Logout
      </button>
      
      <button onClick={handleCustomEvent}>
        Track Custom Event
      </button>
    </div>
  );
}
