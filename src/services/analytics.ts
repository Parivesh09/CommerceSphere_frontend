import * as Sentry from '@sentry/react';

/**
 * Analytics service for tracking user behavior and events
 * 
 * Provides a unified interface for sending analytics events to
 * Google Analytics, Mixpanel, or other analytics platforms
 * 
 * Validates: Requirement 14.4 (Analytics tracking)
 */

export interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  metadata?: Record<string, unknown>;
}

export interface UserProperties {
  userId?: string;
  email?: string;
  name?: string;
  role?: string;
  [key: string]: unknown;
}

class AnalyticsService {
  private isInitialized = false;
  private userProperties: UserProperties = {};

  /**
   * Initialize analytics service
   * 
   * Sets up Google Analytics or other analytics platforms
   */
  initialize(): void {
    if (this.isInitialized) {
      return;
    }

    const enableAnalytics = import.meta.env.VITE_ENABLE_ANALYTICS === 'true';
    const analyticsId = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;

    if (enableAnalytics && analyticsId) {
      this.initializeGoogleAnalytics(analyticsId);
    }

    this.isInitialized = true;
    console.log('Analytics service initialized');
  }

  /**
   * Initialize Google Analytics
   * 
   * @param measurementId - Google Analytics measurement ID
   */
  private initializeGoogleAnalytics(measurementId: string): void {

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);


    (window as any).dataLayer = (window as any).dataLayer || [];
    function gtag(...args: any[]) {
      (window as any).dataLayer.push(args);
    }
    (window as any).gtag = gtag;

    gtag('js', new Date());
    gtag('config', measurementId, {
      send_page_view: false, // We'll manually track page views
      anonymize_ip: true, // Privacy-friendly
    });

    console.log('Google Analytics initialized');
  }

  /**
   * Track a page view
   * 
   * @param path - The page path
   * @param title - The page title (optional)
   */
  trackPageView(path: string, title?: string): void {
    if (!this.isInitialized) {
      return;
    }


    if (typeof window !== 'undefined' && 'gtag' in window) {
      const gtag = (window as any).gtag;
      gtag('event', 'page_view', {
        page_path: path,
        page_title: title || document.title,
      });
    }


    if (import.meta.env.VITE_ENABLE_ERROR_TRACKING === 'true') {
      Sentry.addBreadcrumb({
        category: 'navigation',
        message: `Navigated to ${path}`,
        level: 'info',
      });
    }

    if (import.meta.env.DEV) {
      console.log('[Analytics] Page View:', { path, title });
    }
  }

  /**
   * Track a custom event
   * 
   * @param event - The event to track
   */
  trackEvent(event: AnalyticsEvent): void {
    if (!this.isInitialized) {
      return;
    }

    const { category, action, label, value, metadata } = event;


    if (typeof window !== 'undefined' && 'gtag' in window) {
      const gtag = (window as any).gtag;
      gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
        ...metadata,
      });
    }


    if (import.meta.env.VITE_ENABLE_ERROR_TRACKING === 'true') {
      Sentry.addBreadcrumb({
        category: 'user-action',
        message: `${category}: ${action}`,
        level: 'info',
        data: { label, value, ...metadata },
      });
    }

    if (import.meta.env.DEV) {
      console.log('[Analytics] Event:', event);
    }
  }

  /**
   * Track e-commerce events
   */

  /**
   * Track product view
   * 
   * @param productId - Product ID
   * @param productName - Product name
   * @param category - Product category
   * @param price - Product price
   */
  trackProductView(
    productId: string,
    productName: string,
    category: string,
    price: number
  ): void {
    this.trackEvent({
      category: 'E-commerce',
      action: 'view_item',
      label: productName,
      value: price,
      metadata: {
        product_id: productId,
        product_name: productName,
        product_category: category,
        price,
      },
    });
  }

  /**
   * Track add to cart
   * 
   * @param productId - Product ID
   * @param productName - Product name
   * @param price - Product price
   * @param quantity - Quantity added
   */
  trackAddToCart(
    productId: string,
    productName: string,
    price: number,
    quantity: number
  ): void {
    this.trackEvent({
      category: 'E-commerce',
      action: 'add_to_cart',
      label: productName,
      value: price * quantity,
      metadata: {
        product_id: productId,
        product_name: productName,
        price,
        quantity,
      },
    });
  }

  /**
   * Track remove from cart
   * 
   * @param productId - Product ID
   * @param productName - Product name
   * @param price - Product price
   * @param quantity - Quantity removed
   */
  trackRemoveFromCart(
    productId: string,
    productName: string,
    price: number,
    quantity: number
  ): void {
    this.trackEvent({
      category: 'E-commerce',
      action: 'remove_from_cart',
      label: productName,
      value: price * quantity,
      metadata: {
        product_id: productId,
        product_name: productName,
        price,
        quantity,
      },
    });
  }

  /**
   * Track checkout initiation
   * 
   * @param cartValue - Total cart value
   * @param itemCount - Number of items
   */
  trackBeginCheckout(cartValue: number, itemCount: number): void {
    this.trackEvent({
      category: 'E-commerce',
      action: 'begin_checkout',
      value: cartValue,
      metadata: {
        cart_value: cartValue,
        item_count: itemCount,
      },
    });
  }

  /**
   * Track purchase completion
   * 
   * @param orderId - Order ID
   * @param revenue - Total revenue
   * @param tax - Tax amount
   * @param shipping - Shipping cost
   */
  trackPurchase(
    orderId: string,
    revenue: number,
    tax: number,
    shipping: number
  ): void {
    this.trackEvent({
      category: 'E-commerce',
      action: 'purchase',
      label: orderId,
      value: revenue,
      metadata: {
        transaction_id: orderId,
        revenue,
        tax,
        shipping,
      },
    });


    if (typeof window !== 'undefined' && 'gtag' in window) {
      const gtag = (window as any).gtag;
      gtag('event', 'purchase', {
        transaction_id: orderId,
        value: revenue,
        tax,
        shipping,
        currency: 'USD',
      });
    }
  }

  /**
   * Track search
   * 
   * @param searchTerm - The search query
   * @param resultCount - Number of results (optional)
   */
  trackSearch(searchTerm: string, resultCount?: number): void {
    this.trackEvent({
      category: 'Search',
      action: 'search',
      label: searchTerm,
      value: resultCount,
      metadata: {
        search_term: searchTerm,
        result_count: resultCount,
      },
    });
  }

  /**
   * Track user authentication events
   */

  /**
   * Track user login
   * 
   * @param method - Login method (e.g., 'email', 'google', 'facebook')
   */
  trackLogin(method: string): void {
    this.trackEvent({
      category: 'Authentication',
      action: 'login',
      label: method,
      metadata: {
        method,
      },
    });
  }

  /**
   * Track user registration
   * 
   * @param method - Registration method
   */
  trackSignUp(method: string): void {
    this.trackEvent({
      category: 'Authentication',
      action: 'sign_up',
      label: method,
      metadata: {
        method,
      },
    });
  }

  /**
   * Track user logout
   */
  trackLogout(): void {
    this.trackEvent({
      category: 'Authentication',
      action: 'logout',
    });
  }

  /**
   * Set user properties
   * 
   * @param properties - User properties to set
   */
  setUserProperties(properties: UserProperties): void {
    this.userProperties = { ...this.userProperties, ...properties };


    if (typeof window !== 'undefined' && 'gtag' in window) {
      const gtag = (window as any).gtag;
      gtag('set', 'user_properties', properties);
    }


    if (import.meta.env.VITE_ENABLE_ERROR_TRACKING === 'true' && properties.userId) {
      Sentry.setUser({
        id: properties.userId,
        email: properties.email,
        username: properties.name,
      });
    }

    if (import.meta.env.DEV) {
      console.log('[Analytics] User Properties Set:', properties);
    }
  }

  /**
   * Clear user properties (e.g., on logout)
   */
  clearUserProperties(): void {
    this.userProperties = {};


    if (import.meta.env.VITE_ENABLE_ERROR_TRACKING === 'true') {
      Sentry.setUser(null);
    }

    if (import.meta.env.DEV) {
      console.log('[Analytics] User Properties Cleared');
    }
  }

  /**
   * Track timing
   * 
   * @param category - Timing category
   * @param variable - Timing variable name
   * @param value - Time in milliseconds
   * @param label - Optional label
   */
  trackTiming(
    category: string,
    variable: string,
    value: number,
    label?: string
  ): void {
    if (typeof window !== 'undefined' && 'gtag' in window) {
      const gtag = (window as any).gtag;
      gtag('event', 'timing_complete', {
        name: variable,
        value: Math.round(value),
        event_category: category,
        event_label: label,
      });
    }

    if (import.meta.env.DEV) {
      console.log('[Analytics] Timing:', { category, variable, value, label });
    }
  }

  /**
   * Track exception
   * 
   * @param description - Error description
   * @param fatal - Whether the error is fatal
   */
  trackException(description: string, fatal: boolean = false): void {
    if (typeof window !== 'undefined' && 'gtag' in window) {
      const gtag = (window as any).gtag;
      gtag('event', 'exception', {
        description,
        fatal,
      });
    }

    if (import.meta.env.DEV) {
      console.log('[Analytics] Exception:', { description, fatal });
    }
  }
}


export const analytics = new AnalyticsService();


if (typeof window !== 'undefined') {
  analytics.initialize();
}
