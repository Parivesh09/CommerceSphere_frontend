
import type { CartItem } from '../types';

export const TAX_RATE = 0.08; // 8% tax rate
export const SHIPPING_THRESHOLD = 50; // Free shipping over $50
export const SHIPPING_COST = 5.99;

/**
 * Calculate cart totals
 */
export function calculateCartTotals(items: CartItem[]): {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  itemCount: number;
} {
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const tax = subtotal * TAX_RATE;
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + tax + shipping;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    subtotal: Number(subtotal.toFixed(2)),
    tax: Number(tax.toFixed(2)),
    shipping: Number(shipping.toFixed(2)),
    total: Number(total.toFixed(2)),
    itemCount,
  };
}

/**
 * Format currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

/**
 * Check if item is in cart
 */
export function isItemInCart(
  items: CartItem[],
  productId: string,
  variantId?: string
): boolean {
  return items.some(
    (item) => item.productId === productId && item.variantId === variantId
  );
}

/**
 * Get item from cart
 */
export function getCartItem(
  items: CartItem[],
  productId: string,
  variantId?: string
): CartItem | undefined {
  return items.find(
    (item) => item.productId === productId && item.variantId === variantId
  );
}

/**
 * Get total quantity for a product (across all variants)
 */
export function getProductQuantity(items: CartItem[], productId: string): number {
  return items
    .filter((item) => item.productId === productId)
    .reduce((sum, item) => sum + item.quantity, 0);
}

