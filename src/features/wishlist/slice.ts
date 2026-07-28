import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { STORAGE_KEYS } from '../../constants';

interface WishlistDisplayItem {
  id: string;
  title: string;
  price: number;
  image: string;
  inStock: boolean;
}

interface WishlistState {
  guestWishlist: string[];
  items: WishlistDisplayItem[];
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
  items: [],
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
      state.items = state.items.filter((item) => item.id !== action.payload);
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(state.guestWishlist));
    },
    
    clearGuestWishlist: (state) => {
      state.guestWishlist = [];
      state.items = [];
      localStorage.removeItem(STORAGE_KEYS.WISHLIST);
    },
    
    setGuestWishlist: (state, action: PayloadAction<string[]>) => {
      state.guestWishlist = action.payload;
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(state.guestWishlist));
    },

    toggleWishlistItem: (state, action: PayloadAction<{ id: string; title: string; price: number; image: string; inStock: boolean }>) => {
      const existing = state.items.find((item) => item.id === action.payload.id);
      if (existing) {
        state.items = state.items.filter((item) => item.id !== action.payload.id);
        state.guestWishlist = state.guestWishlist.filter((id) => id !== action.payload.id);
      } else {
        state.items.push(action.payload);
        if (!state.guestWishlist.includes(action.payload.id)) {
          state.guestWishlist.push(action.payload.id);
        }
      }
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(state.guestWishlist));
    },
  },
});

export const {
  addToGuestWishlist,
  removeFromGuestWishlist,
  clearGuestWishlist,
  setGuestWishlist,
  toggleWishlistItem,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;