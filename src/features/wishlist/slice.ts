import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { STORAGE_KEYS } from '../../constants';

/**
 * Wishlist slice for managing guest wishlist state
 * 
 * Features:
 * - Guest wishlist stored in localStorage
 * - Sync with backend on authentication
 * - Optimistic updates
 * 
 * Validates: Requirements 17.5
 */

interface WishlistState {
  guestWishlist: string[]; // Array of product IDs
}


const loadGuestWishlist = (): string[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.WISHLIST);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const initialState: WishlistState = {
  guestWishlist: loadGuestWishlist(),
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToGuestWishlist: (state, action: PayloadAction<string>) => {
      if (!state.guestWishlist.includes(action.payload)) {
        state.guestWishlist.push(action.payload);
        localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(state.guestWishlist));
      }
    },
    
    removeFromGuestWishlist: (state, action: PayloadAction<string>) => {
      state.guestWishlist = state.guestWishlist.filter((id) => id !== action.payload);
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(state.guestWishlist));
    },
    
    clearGuestWishlist: (state) => {
      state.guestWishlist = [];
      localStorage.removeItem(STORAGE_KEYS.WISHLIST);
    },
    
    setGuestWishlist: (state, action: PayloadAction<string[]>) => {
      state.guestWishlist = action.payload;
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(state.guestWishlist));
    },
  },
});

export const {
  addToGuestWishlist,
  removeFromGuestWishlist,
  clearGuestWishlist,
  setGuestWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
