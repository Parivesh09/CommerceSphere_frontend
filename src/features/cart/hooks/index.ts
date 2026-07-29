import { useAppSelector } from '../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import {
  addToGuestCart,
  updateGuestCartQuantity,
  removeFromGuestCart,
} from '../../../store/slices/cartSlice';
import { setCartDrawerOpen } from '../../../store/slices/uiSlice';
import {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
  useSyncCartMutation,
} from '../api';
import type { AddToCartRequest } from '../types';
import toast from 'react-hot-toast';

export function useCart() {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const { data: serverCart } = useGetCartQuery(undefined, {
    skip: !isAuthenticated,
  });

  const [addToCartApi] = useAddToCartMutation();
  const [updateCartItemApi] = useUpdateCartItemMutation();
  const [removeFromCartApi] = useRemoveFromCartMutation();
  const [clearCartApi] = useClearCartMutation();
  const [syncCartApi] = useSyncCartMutation();

  const activeCart = isAuthenticated
    ? serverCart ?? { items: [], subtotal: 0, tax: 0, shipping: 0, total: 0 }
    : cart;

  const addToCart = async (request: AddToCartRequest) => {
    if (isAuthenticated) {
      try {
        await addToCartApi(request).unwrap();
        toast.success('Added to cart');
        dispatch(setCartDrawerOpen(true));
      } catch {
        toast.error('Failed to add to cart');
      }
    } else {
      dispatch(
        addToGuestCart({
          id: `cart-${Date.now()}`,
          productId: request.productId,
          variantId: request.variantId,
          quantity: request.quantity,
          unitPrice: 0,
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
      } catch {
        toast.error('Failed to update cart');
      }
    } else {
      dispatch(updateGuestCartQuantity({ productId, variantId, quantity }));
    }
  };

  const removeItem = async (productId: string, variantId?: string) => {
    if (isAuthenticated) {
      try {
        await removeFromCartApi({ productId, variantId }).unwrap();
        toast.success('Removed from cart');
      } catch {
        toast.error('Failed to remove from cart');
      }
    } else {
      dispatch(removeFromGuestCart({ productId, variantId }));
      toast.success('Removed from cart');
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await clearCartApi().unwrap();
      } catch {
        toast.error('Failed to clear cart');
      }
    }
  };

  const syncGuestCart = async () => {
    if (isAuthenticated && cart.items.length > 0) {
      try {
        await syncCartApi({
          items: cart.items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
          })),
        }).unwrap();
        toast.success('Cart synced');
      } catch {
        toast.error('Failed to sync cart');
      }
    }
  };

  const openCartDrawer = () => dispatch(setCartDrawerOpen(true));
  const closeCartDrawer = () => dispatch(setCartDrawerOpen(false));

  return {
    cart: activeCart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    syncGuestCart,
    openCartDrawer,
    closeCartDrawer,
  };
}
