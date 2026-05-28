/**
 * Wishlist-related type definitions
 * Validates: Requirements 17.1, 17.2, 17.3, 17.4, 17.5
 */

import type { Product } from '../../products/types';

export interface WishlistItem {
  id: string;
  productId: string;
  product: Product;
  addedAt: string;
}

export interface Wishlist {
  id: string;
  userId?: string;
  items: WishlistItem[];
  updatedAt: string;
}

export interface AddToWishlistRequest {
  productId: string;
}

export interface RemoveFromWishlistRequest {
  productId: string;
}

export interface WishlistApiResponse {
  success: boolean;
  data: Wishlist;
  message?: string;
}
