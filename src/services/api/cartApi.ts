import { baseApi } from './baseApi';
import type { Cart, CartItem, ApiResponse } from '../../types';

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<ApiResponse<Cart>, void>({
      query: () => '/cart',
      providesTags: [{ type: 'Cart', id: 'CURRENT' }],
    }),

    addToCart: builder.mutation<ApiResponse<Cart>, { productId: string; quantity: number; variantId?: string }>({
      query: (item) => ({
        url: '/cart/items',
        method: 'POST',
        body: item,
      }),
      invalidatesTags: [{ type: 'Cart', id: 'CURRENT' }],
    }),

    updateCartItem: builder.mutation<ApiResponse<Cart>, { itemId: string; quantity: number }>({
      query: ({ itemId, quantity }) => ({
        url: `/cart/items/${itemId}`,
        method: 'PUT',
        body: { quantity },
      }),
      invalidatesTags: [{ type: 'Cart', id: 'CURRENT' }],
    }),

    removeFromCart: builder.mutation<ApiResponse<Cart>, string>({
      query: (itemId) => ({
        url: `/cart/items/${itemId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Cart', id: 'CURRENT' }],
    }),

    clearCart: builder.mutation<ApiResponse<void>, void>({
      query: () => ({
        url: '/cart',
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Cart', id: 'CURRENT' }],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
} = cartApi;
