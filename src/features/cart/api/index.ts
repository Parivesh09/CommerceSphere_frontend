import { baseApi } from '../../../services/api/baseApi';
import { API_TAGS } from '../../../constants';
import type {
  Cart,
  AddToCartRequest,
  UpdateCartItemRequest,
  RemoveFromCartRequest,
  CartApiResponse,
} from '../types';

/**
 * Cart API endpoints with optimistic updates
 * 
 * Features:
 * - Optimistic updates for immediate UI feedback
 * - Automatic rollback on failure
 * - Tag-based cache invalidation
 * - Guest cart support
 * 
 * Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5, 6.6
 */
export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getCart: builder.query<Cart, void>({
      query: () => '/cart',
      providesTags: [API_TAGS.CART],

      keepUnusedDataFor: 60, // 60 seconds
    }),


    addToCart: builder.mutation<CartApiResponse, AddToCartRequest>({
      query: (item) => ({
        url: '/cart/items',
        method: 'POST',
        body: item,
      }),

      async onQueryStarted(item, { dispatch, queryFulfilled }) {

        const patchResult = dispatch(
          cartApi.util.updateQueryData('getCart', undefined, (draft) => {
            const existingItem = draft.items.find(
              (i) => i.productId === item.productId && i.variantId === item.variantId
            );

            if (existingItem) {
              existingItem.quantity += item.quantity;
              existingItem.unitPrice = item.unitPrice;
            } else {
              draft.items.push({
                id: `temp-${Date.now()}`,
                productId: item.productId,
                variantId: item.variantId,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
              });
            }

            draft.subtotal = draft.items.reduce(
              (sum, i) => sum + i.unitPrice * i.quantity,
              0
            );
            draft.total = draft.subtotal + draft.tax + draft.shipping;
          })
        );

        try {
          await queryFulfilled;
        } catch {

          patchResult.undo();
        }
      },
      invalidatesTags: [API_TAGS.CART],
    }),


    updateCartItem: builder.mutation<CartApiResponse, UpdateCartItemRequest>({
      query: (item) => ({
        url: '/cart/items',
        method: 'PUT',
        body: item,
      }),

      async onQueryStarted(item, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          cartApi.util.updateQueryData('getCart', undefined, (draft) => {
            const existingItem = draft.items.find(
              (i) => i.productId === item.productId && i.variantId === item.variantId
            );

            if (existingItem) {
              existingItem.quantity = item.quantity;


              draft.subtotal = draft.items.reduce(
                (sum, i) => sum + i.unitPrice * i.quantity,
                0
              );
              draft.total = draft.subtotal + draft.tax + draft.shipping;
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {

          patchResult.undo();
        }
      },
      invalidatesTags: [API_TAGS.CART],
    }),


    removeFromCart: builder.mutation<CartApiResponse, RemoveFromCartRequest>({
      query: (item) => ({
        url: '/cart/items',
        method: 'DELETE',
        body: item,
      }),

      async onQueryStarted(item, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          cartApi.util.updateQueryData('getCart', undefined, (draft) => {
            draft.items = draft.items.filter(
              (i) => !(i.productId === item.productId && i.variantId === item.variantId)
            );


            draft.subtotal = draft.items.reduce(
              (sum, i) => sum + i.unitPrice * i.quantity,
              0
            );
            draft.total = draft.subtotal + draft.tax + draft.shipping;
          })
        );

        try {
          await queryFulfilled;
        } catch {

          patchResult.undo();
        }
      },
      invalidatesTags: [API_TAGS.CART],
    }),


    clearCart: builder.mutation<CartApiResponse, void>({
      query: () => ({
        url: '/cart',
        method: 'DELETE',
      }),
      invalidatesTags: [API_TAGS.CART],
    }),


    syncCart: builder.mutation<CartApiResponse, { items: AddToCartRequest[] }>({
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

