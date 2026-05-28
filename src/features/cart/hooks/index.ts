
import { useEffect } from 'react';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useSyncCartMutation,
} from '../api';
import {
  addToGuestCart,
  updateGuestCartQuantity,
  removeFromGuestCart,
  syncCartFromApi,
} from '../../../store/slices/cartSlice';
import { setCartDrawerOpen } from '../../../store/slices/uiSlice';
import type { AddToCartRequest } from '../types';
import toast from 'react-hot-toast';

/**
 * Custom hook for cart operations
 * 
 * Handles:
 * - Guest vs authenticated cart logic
 * - Automatic cart sync on login
 * - Optimistic updates with rollback
 * - Cart drawer management
 * 
 * Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5, 6.6
 */
export function useCart() {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const localCart = useAppSelector((state) => state.cart);


  const {
    data: apiCart,
    isLoading,
    refetch,
  } = useGetCartQuery(undefined, {
    skip: !isAuthenticated,
    refetchOnMountOrArgChange: true,
  });

  const [addToCartApi] = useAddToCartMutation();
  const [updateCartItemApi] = useUpdateCartItemMutation();
  const [removeFromCartApi] = useRemoveFromCartMutation();
  const [syncCartApi] = useSyncCartMutation();


  useEffect(() => {
    if (isAuthenticated && localCart.isGuest && localCart.items.length > 0) {
      const syncGuestCart = async () => {
        try {
          const items: AddToCartRequest[] = localCart.items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
          }));

          const result = await syncCartApi({ items }).unwrap();
          dispatch(syncCartFromApi(result.cart));
          toast.success('Cart synced successfully');
        } catch (error) {
          console.error('Failed to sync cart:', error);
          toast.error('Failed to sync cart');
        }
      };

      syncGuestCart();
    } else if (isAuthenticated && apiCart) {

      dispatch(syncCartFromApi(apiCart));
    }
  }, [isAuthenticated, localCart.isGuest, apiCart, dispatch, syncCartApi, localCart.items]);

  const addToCart = async (request: AddToCartRequest) => {
    if (isAuthenticated) {
      try {
        await addToCartApi(request).unwrap();
        toast.success('Added to cart');
        dispatch(setCartDrawerOpen(true));
      } catch (error) {
        console.error('Failed to add to cart:', error);
        toast.error('Failed to add to cart');
      }
    } else {

      dispatch(
        addToGuestCart({
          id: `guest-${Date.now()}`,
          productId: request.productId,
          variantId: request.variantId,
          quantity: request.quantity,
          unitPrice: 0, // Will be set when product data is available
        })
      );
      toast.success('Added to cart');
      dispatch(setCartDrawerOpen(true));
    }
  };

  const updateQuantity = async (productId: string, variantId: string | undefined, quantity: number) => {
    if (isAuthenticated) {
      try {
        await updateCartItemApi({ productId, variantId, quantity }).unwrap();
      } catch (error) {
        console.error('Failed to update quantity:', error);
        toast.error('Failed to update quantity');
      }
    } else {
      dispatch(updateGuestCartQuantity({ productId, variantId, quantity }));
    }
  };

  const removeItem = async (productId: string, variantId?: string | undefined) => {
    if (isAuthenticated) {
      try {
        await removeFromCartApi({ productId, variantId }).unwrap();
        toast.success('Removed from cart');
      } catch (error) {
        console.error('Failed to remove item:', error);
        toast.error('Failed to remove item');
      }
    } else {
      dispatch(removeFromGuestCart({ productId, variantId }));
      toast.success('Removed from cart');
    }
  };

  const openCartDrawer = () => {
    dispatch(setCartDrawerOpen(true));
  };

  const closeCartDrawer = () => {
    dispatch(setCartDrawerOpen(false));
  };


  const cart = isAuthenticated && apiCart ? apiCart : localCart;

  return {
    cart,
    isLoading,
    addToCart,
    updateQuantity,
    removeItem,
    openCartDrawer,
    closeCartDrawer,
    refetch,
  };
}

