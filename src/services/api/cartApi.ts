import { baseApi } from './baseApi';
import { API_TAGS } from '../../constants';

interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  quantity: number;
  unitPrice: number;
}

interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  updatedAt?: string;
}

interface AddToCartRequest {
  productId: string;
  variantId?: string;
  quantity: number;
  unitPrice: number;
}

interface UpdateCartItemRequest {
  productId: string;
  variantId?: string;
  quantity: number;
  unitPrice?: number;
}

interface RemoveFromCartRequest {
  productId: string;
  variantId?: string;
}

interface CartResponse {
  cart: Cart;
  message?: string;
}

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<Cart, void>({
      query: () => '/cart',
      providesTags: [API_TAGS.CART],
    }),

    addToCart: builder.mutation<CartResponse, AddToCartRequest>({
      query: (item) => ({
        url: '/cart/items',
        method: 'POST',
        body: item,
      }),
      invalidatesTags: [API_TAGS.CART],
    }),

    updateCartItem: builder.mutation<CartResponse, UpdateCartItemRequest>({
      query: (item) => ({
        url: '/cart/items',
        method: 'PUT',
        body: item,
      }),
      invalidatesTags: [API_TAGS.CART],
    }),

    removeFromCart: builder.mutation<CartResponse, RemoveFromCartRequest>({
      query: (item) => ({
        url: '/cart/items',
        method: 'DELETE',
        body: item,
      }),
      invalidatesTags: [API_TAGS.CART],
    }),

    clearCart: builder.mutation<{ cart: Cart; message: string }, void>({
      query: () => ({
        url: '/cart',
        method: 'DELETE',
      }),
      invalidatesTags: [API_TAGS.CART],
    }),

    syncCart: builder.mutation<{ cart: Cart; message: string }, { items: AddToCartRequest[] }>({
      query: (data) => ({
        url: '/cart/sync',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [API_TAGS.CART],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
  useSyncCartMutation,
} = cartApi;
