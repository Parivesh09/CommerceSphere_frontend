import { baseApi } from './baseApi';
import type { Product, PaginatedResponse, Review } from '../../types';

interface GetProductsParams {
  page?: number;
  pageSize?: number;
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price' | 'createdAt' | 'popularity';
  sortOrder?: 'asc' | 'desc';
}

interface GetReviewsParams {
  productId: string;
  page?: number;
  pageSize?: number;
}

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<PaginatedResponse<Product>, GetProductsParams>({
      query: (params) => ({
        url: '/products',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Products' as const, id })),
              { type: 'Products' as const, id: 'LIST' },
            ]
          : [{ type: 'Products' as const, id: 'LIST' }],
    }),

    getProduct: builder.query<Product, string>({
      query: (id) => `/products/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Products' as const, id }],
    }),

    createProduct: builder.mutation<Product, Partial<Product>>({
      query: (product) => ({
        url: '/products',
        method: 'POST',
        body: product,
      }),
      invalidatesTags: [{ type: 'Products' as const, id: 'LIST' }],
    }),

    updateProduct: builder.mutation<Product, { id: string; data: Partial<Product> }>({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Products' as const, id },
        { type: 'Products' as const, id: 'LIST' },
      ],
    }),

    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Products' as const, id: 'LIST' }],
    }),

    getProductReviews: builder.query<PaginatedResponse<Review>, GetReviewsParams>({
      query: ({ productId, page = 1, pageSize = 10 }) => ({
        url: `/products/${productId}/reviews`,
        params: { page, pageSize },
      }),
      providesTags: (result, _error, { productId }) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Reviews' as const, id })),
              { type: 'Reviews' as const, id: productId },
            ]
          : [{ type: 'Reviews' as const, id: productId }],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductReviewsQuery,
} = productApi;
