import { baseApi } from '../../../services/api/baseApi';
import { API_TAGS } from '../../../constants';
import type {
  Wishlist,
  AddToWishlistRequest,
  RemoveFromWishlistRequest,
  WishlistApiResponse,
} from '../types';

/**
 * Wishlist API endpoints with optimistic updates
 * 
 * Features:
 * - Optimistic updates for immediate UI feedback
 * - Automatic rollback on failure
 * - Tag-based cache invalidation
 * - Guest wishlist support with localStorage
 * 
 * Validates: Requirements 17.1, 17.2, 17.3, 17.4, 17.5
 */
export const wishlistApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getWishlist: builder.query<Wishlist, void>({
      query: () => '/wishlist',
      providesTags: [API_TAGS.WISHLIST],

      keepUnusedDataFor: 60, // 60 seconds
    }),


    addToWishlist: builder.mutation<WishlistApiResponse, AddToWishlistRequest>({
      query: (item) => ({
        url: '/wishlist/items',
        method: 'POST',
        body: item,
      }),

      async onQueryStarted(item, { dispatch, queryFulfilled }) {

        const patchResult = dispatch(
          wishlistApi.util.updateQueryData('getWishlist', undefined, (draft) => {

            const exists = draft.items.some((i) => i.productId === item.productId);
            
            if (!exists) {

              draft.items.push({
                id: `temp-${Date.now()}`,
                productId: item.productId,
                product: {} as any, // Will be populated from server
                addedAt: new Date().toISOString(),
              });
              draft.updatedAt = new Date().toISOString();
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {

          patchResult.undo();
        }
      },
      invalidatesTags: [API_TAGS.WISHLIST],
    }),


    removeFromWishlist: builder.mutation<WishlistApiResponse, RemoveFromWishlistRequest>({
      query: (item) => ({
        url: '/wishlist/items',
        method: 'DELETE',
        body: item,
      }),

      async onQueryStarted(item, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          wishlistApi.util.updateQueryData('getWishlist', undefined, (draft) => {
            draft.items = draft.items.filter((i) => i.productId !== item.productId);
            draft.updatedAt = new Date().toISOString();
          })
        );

        try {
          await queryFulfilled;
        } catch {

          patchResult.undo();
        }
      },
      invalidatesTags: [API_TAGS.WISHLIST],
    }),


    clearWishlist: builder.mutation<WishlistApiResponse, void>({
      query: () => ({
        url: '/wishlist',
        method: 'DELETE',
      }),
      invalidatesTags: [API_TAGS.WISHLIST],
    }),


    syncWishlist: builder.mutation<WishlistApiResponse, { productIds: string[] }>({
      query: (data) => ({
        url: '/wishlist/sync',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [API_TAGS.WISHLIST],
    }),
  }),
});

export const {
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useClearWishlistMutation,
  useSyncWishlistMutation,
} = wishlistApi;
