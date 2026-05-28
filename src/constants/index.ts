export const API_BASE_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:3000';
export const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3000';
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'CommerceSphere';
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';

export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id',
  CATEGORIES: '/categories',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDERS: '/orders',
  ORDER_DETAIL: '/orders/:id',
  PROFILE: '/profile',
  WISHLIST: '/wishlist',
  SEARCH: '/search',
  LOGIN: '/login',
  REGISTER: '/register',
  ADMIN: '/admin',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_USERS: '/admin/users',
  ADMIN_ANALYTICS: '/admin/analytics',
  ADMIN_SETTINGS: '/admin/settings',
} as const;

export const API_TAGS = {
  AUTH: 'Auth',
  PRODUCTS: 'Products',
  PRODUCT: 'Product',
  CART: 'Cart',
  ORDERS: 'Orders',
  ORDER: 'Order',
  WISHLIST: 'Wishlist',
  USER: 'User',
  PROFILE: 'Profile',
  REVIEWS: 'Reviews',
  SEARCH: 'Search',
  ANALYTICS: 'Analytics',
  NOTIFICATIONS: 'Notifications',
} as const;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  CART: 'cart',
  WISHLIST: 'wishlist',
  THEME: 'theme',
} as const;
