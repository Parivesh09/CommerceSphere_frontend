import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { CartItem } from '../../features/cart/types';
import { STORAGE_KEYS } from '../../constants';

interface CartState {
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  itemCount: number;
  isGuest: boolean;
}

const TAX_RATE = 0.08;
const SHIPPING_THRESHOLD = 50;
const SHIPPING_COST = 5.99;

const calculateTotals = (
  items: CartItem[]
): { subtotal: number; tax: number; shipping: number; total: number; itemCount: number } => {
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const tax = subtotal * TAX_RATE;
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + tax + shipping;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return { subtotal, tax, shipping, total, itemCount };
};

const loadGuestCartFromStorage = (): CartItem[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.CART);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return parsed.items || [];
    } catch {
      return [];
    }
  }
  return [];
};

const saveGuestCartToStorage = (items: CartItem[]) => {
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify({ items }));
};

const initialItems = loadGuestCartFromStorage();
const initialTotals = calculateTotals(initialItems);

const initialState: CartState = {
  items: initialItems,
  ...initialTotals,
  isGuest: true,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {

    addToGuestCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        (item) =>
          item.productId === action.payload.productId &&
          item.variantId === action.payload.variantId
      );

      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }

      const totals = calculateTotals(state.items);
      state.subtotal = totals.subtotal;
      state.tax = totals.tax;
      state.shipping = totals.shipping;
      state.total = totals.total;
      state.itemCount = totals.itemCount;

      saveGuestCartToStorage(state.items);
    },

    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        (item) =>
          item.productId === action.payload.productId &&
          item.variantId === action.payload.variantId
      );

      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }

      const totals = calculateTotals(state.items);
      state.subtotal = totals.subtotal;
      state.tax = totals.tax;
      state.shipping = totals.shipping;
      state.total = totals.total;
      state.itemCount = totals.itemCount;

      saveGuestCartToStorage(state.items);
    },

    updateGuestCartQuantity: (
      state,
      action: PayloadAction<{ productId: string; variantId?: string | undefined; quantity: number }>
    ) => {
      const item = state.items.find(
        (item) =>
          item.productId === action.payload.productId &&
          item.variantId === action.payload.variantId
      );

      if (item) {
        if (action.payload.quantity <= 0) {

          state.items = state.items.filter(
            (i) =>
              !(
                i.productId === action.payload.productId &&
                i.variantId === action.payload.variantId
              )
          );
        } else {
          item.quantity = action.payload.quantity;
        }

        const totals = calculateTotals(state.items);
        state.subtotal = totals.subtotal;
        state.tax = totals.tax;
        state.shipping = totals.shipping;
        state.total = totals.total;
        state.itemCount = totals.itemCount;

        saveGuestCartToStorage(state.items);
      }
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const item = state.items.find((i) => i.productId === action.payload.id);
      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter((i) => i.productId !== action.payload.id);
        } else {
          item.quantity = action.payload.quantity;
        }
        const totals = calculateTotals(state.items);
        state.subtotal = totals.subtotal;
        state.tax = totals.tax;
        state.shipping = totals.shipping;
        state.total = totals.total;
        state.itemCount = totals.itemCount;
        saveGuestCartToStorage(state.items);
      }
    },

    removeFromGuestCart: (
      state,
      action: PayloadAction<{ productId: string; variantId?: string | undefined }>
    ) => {
      state.items = state.items.filter(
        (item) =>
          !(
            item.productId === action.payload.productId &&
            item.variantId === action.payload.variantId
          )
      );

      const totals = calculateTotals(state.items);
      state.subtotal = totals.subtotal;
      state.tax = totals.tax;
      state.shipping = totals.shipping;
      state.total = totals.total;
      state.itemCount = totals.itemCount;

      saveGuestCartToStorage(state.items);
    },

    removeFromCart: (
      state,
      action: PayloadAction<string>
    ) => {
      state.items = state.items.filter((i) => i.productId !== action.payload);
      const totals = calculateTotals(state.items);
      state.subtotal = totals.subtotal;
      state.tax = totals.tax;
      state.shipping = totals.shipping;
      state.total = totals.total;
      state.itemCount = totals.itemCount;
      saveGuestCartToStorage(state.items);
    },

    clearGuestCart: (state) => {
      state.items = [];
      state.subtotal = 0;
      state.tax = 0;
      state.shipping = 0;
      state.total = 0;
      state.itemCount = 0;
      localStorage.removeItem(STORAGE_KEYS.CART);
    },

    clearCart: (state) => {
      state.items = [];
      state.subtotal = 0;
      state.tax = 0;
      state.shipping = 0;
      state.total = 0;
      state.itemCount = 0;
      localStorage.removeItem(STORAGE_KEYS.CART);
    },

    setCartAuthenticated: (state) => {
      state.isGuest = false;

      localStorage.removeItem(STORAGE_KEYS.CART);
    },


    syncCartFromApi: (
      state,
      action: PayloadAction<{
        items: CartItem[];
        subtotal: number;
        tax: number;
        shipping: number;
        total: number;
      }>
    ) => {
      state.items = action.payload.items;
      state.subtotal = action.payload.subtotal;
      state.tax = action.payload.tax;
      state.shipping = action.payload.shipping;
      state.total = action.payload.total;
      state.itemCount = action.payload.items.reduce((sum, item) => sum + item.quantity, 0);
      state.isGuest = false;
    },
  },
});

export const {
  addToGuestCart,
  addToCart,
  updateGuestCartQuantity,
  updateQuantity,
  removeFromGuestCart,
  removeFromCart,
  clearGuestCart,
  clearCart,
  setCartAuthenticated,
  syncCartFromApi,
} = cartSlice.actions;

export default cartSlice.reducer;