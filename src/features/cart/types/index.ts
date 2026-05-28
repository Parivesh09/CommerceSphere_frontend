import type { Product } from '../../../types';

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string | undefined;
  quantity: number;
  unitPrice: number;
  product?: Product;
}

export interface Cart {
  id?: string;
  userId?: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  updatedAt?: string;
}

export interface AddToCartRequest {
  productId: string;
  variantId?: string | undefined;
  quantity: number;
}

export interface UpdateCartItemRequest {
  productId: string;
  variantId?: string | undefined;
  quantity: number;
}

export interface RemoveFromCartRequest {
  productId: string;
  variantId?: string | undefined;
}

export interface CartApiResponse {
  cart: Cart;
  message?: string;
}
