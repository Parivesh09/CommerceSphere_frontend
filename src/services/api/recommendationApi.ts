import { baseApi } from './baseApi';
import type { Product, ApiResponse } from '../../types';

export const recommendationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPersonalizedRecommendations: builder.query<ApiResponse<Product[]>, { limit?: number }>({
      query: (params) => ({
        url: '/recommendations/personalized',
        params,
      }),
      providesTags: [{ type: 'Products', id: 'RECOMMENDED' }],
    }),

    getSimilarProducts: builder.query<ApiResponse<Product[]>, { productId: string; limit?: number }>({
      query: ({ productId, limit = 4 }) => ({
        url: `/recommendations/similar/${productId}`,
        params: { limit },
      }),
      providesTags: (_result, _error, { productId }) => [{ type: 'Products', id: `similar-${productId}` }],
    }),

    getTrendingRecommendations: builder.query<ApiResponse<Product[]>, { limit?: number }>({
      query: (params) => ({
        url: '/recommendations/trending',
        params,
      }),
      providesTags: [{ type: 'Products', id: 'TRENDING' }],
    }),

    trackProductView: builder.mutation<void, { productId: string; userId?: string }>({
      query: (body) => ({
        url: '/recommendations/track-view',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useGetPersonalizedRecommendationsQuery,
  useGetSimilarProductsQuery,
  useGetTrendingRecommendationsQuery,
  useTrackProductViewMutation,
} = recommendationApi;
