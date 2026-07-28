import { baseApi } from './baseApi';
import type { Product, ApiResponse } from '../../types';

export const wishlistApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWishlist: builder.query<ApiResponse<Product[]>, void>({
      query: () => '/wishlist',
      providesTags: [{ type: 'Wishlist', id: 'LIST' }],
    }),

    addToWishlist: builder.mutation<ApiResponse<Product[]>, string>({
      query: (productId) => ({
        url: `/wishlist/${productId}`,
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'Wishlist', id: 'LIST' }],
    }),

    removeFromWishlist: builder.mutation<ApiResponse<Product[]>, string>({
      query: (productId) => ({
        url: `/wishlist/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Wishlist', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} = wishlistApi;
