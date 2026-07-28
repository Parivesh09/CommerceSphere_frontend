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

    getRelatedProducts: builder.query<ApiResponse<Product[]>, { productId: string; limit?: number }>({
      query: ({ productId, limit = 4 }) => ({
        url: `/recommendations/related/${productId}`,
        params: { limit },
      }),
      providesTags: (_result, _error, { productId }) => [{ type: 'Products', id: `related-${productId}` }],
    }),
  }),
});

export const {
  useGetPersonalizedRecommendationsQuery,
  useGetRelatedProductsQuery,
} = recommendationApi;
