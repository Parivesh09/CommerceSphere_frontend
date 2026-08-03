import { useCallback } from 'react';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { toggleWishlistItem, removeFromGuestWishlist } from '../slice';

export interface WishlistDisplayItem {
  id: string;
  title: string;
  price: number;
  image: string;
  inStock: boolean;
}

/**
 * Wishlist hook backed by the local guest wishlist slice (persisted to
 * localStorage). No backend wishlist service exists yet, so the wishlist is
 * stored per-browser and the UI never issues failing API requests.
 */
export const useWishlist = () => {
  const dispatch = useAppDispatch();
  const wishlist = useAppSelector((state) => state.wishlist);

  const addToWishlist = useCallback(
    (item: WishlistDisplayItem) => {
      dispatch(toggleWishlistItem(item));
    },
    [dispatch]
  );

  const removeFromWishlist = useCallback(
    (productId: string) => {
      dispatch(removeFromGuestWishlist(productId));
    },
    [dispatch]
  );

  const isInWishlist = useCallback(
    (productId: string): boolean => {
      return wishlist.guestWishlist.includes(productId);
    },
    [wishlist.guestWishlist]
  );

  const wishlistItems = wishlist.items;
  const wishlistCount = wishlist.items.length;

  return {
    wishlistItems,
    wishlistCount,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  };
};

export default useWishlist;
