import { useCallback } from 'react';
import {
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} from '../api';

export const useWishlist = () => {
  const {
    data: wishlist,
    isLoading,
    error,
  } = useGetWishlistQuery(undefined);

  const [addToWishlistMutation] = useAddToWishlistMutation();
  const [removeFromWishlistMutation] = useRemoveFromWishlistMutation();

  const addToWishlist = useCallback(
    async (productId: string) => {
      return addToWishlistMutation({ productId }).unwrap();
    },
    [addToWishlistMutation]
  );

  const removeFromWishlist = useCallback(
    async (productId: string) => {
      return removeFromWishlistMutation({ productId }).unwrap();
    },
    [removeFromWishlistMutation]
  );

  const isInWishlist = useCallback(
    (productId: string): boolean => {
      return wishlist?.items?.some((item) => item.productId === productId) ?? false;
    },
    [wishlist]
  );

  const wishlistItems = wishlist?.items ?? [];
  const wishlistCount = wishlist?.items?.length ?? 0;

  return {
    wishlistItems,
    wishlistCount,
    isLoading,
    error,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  };
};

export default useWishlist;
