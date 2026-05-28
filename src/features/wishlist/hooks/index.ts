import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import {
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useSyncWishlistMutation,
} from '../api';
import {
  addToGuestWishlist,
  removeFromGuestWishlist,
  clearGuestWishlist,
} from '../slice';

/**
 * Custom hook for managing wishlist operations
 * 
 * Handles both authenticated and guest wishlist operations
 * Automatically syncs guest wishlist on authentication
 * 
 * Validates: Requirements 17.1, 17.2, 17.3, 17.4, 17.5
 */
export const useWishlist = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { guestWishlist } = useAppSelector((state) => state.wishlist);


  const {
    data: wishlist,
    isLoading,
    error,
  } = useGetWishlistQuery(undefined, {
    skip: !isAuthenticated,
  });

  const [addToWishlistMutation] = useAddToWishlistMutation();
  const [removeFromWishlistMutation] = useRemoveFromWishlistMutation();
  const [syncWishlistMutation] = useSyncWishlistMutation();


  useEffect(() => {
    if (isAuthenticated && guestWishlist.length > 0) {
      syncWishlistMutation({ productIds: guestWishlist })
        .unwrap()
        .then(() => {

          dispatch(clearGuestWishlist());
        })
        .catch((error) => {
          console.error('Failed to sync wishlist:', error);
        });
    }
  }, [isAuthenticated, guestWishlist, syncWishlistMutation, dispatch]);


  const addToWishlist = useCallback(
    async (productId: string) => {
      if (isAuthenticated) {
        return addToWishlistMutation({ productId }).unwrap();
      } else {
        dispatch(addToGuestWishlist(productId));
        return Promise.resolve();
      }
    },
    [isAuthenticated, addToWishlistMutation, dispatch]
  );


  const removeFromWishlist = useCallback(
    async (productId: string) => {
      if (isAuthenticated) {
        return removeFromWishlistMutation({ productId }).unwrap();
      } else {
        dispatch(removeFromGuestWishlist(productId));
        return Promise.resolve();
      }
    },
    [isAuthenticated, removeFromWishlistMutation, dispatch]
  );


  const isInWishlist = useCallback(
    (productId: string): boolean => {
      if (isAuthenticated) {
        return wishlist?.items.some((item) => item.productId === productId) ?? false;
      } else {
        return guestWishlist.includes(productId);
      }
    },
    [isAuthenticated, wishlist, guestWishlist]
  );


  const wishlistItems = isAuthenticated ? wishlist?.items ?? [] : [];
  const wishlistCount = isAuthenticated
    ? wishlist?.items.length ?? 0
    : guestWishlist.length;

  return {
    wishlistItems,
    wishlistCount,
    isLoading: isAuthenticated ? isLoading : false,
    error,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  };
};

export default useWishlist;
