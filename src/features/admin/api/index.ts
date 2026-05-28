import { baseApi } from '../../../services/api/baseApi';
import type { AnalyticsData, AnalyticsFilters, AdminProductFilters, CreateProductInput, UpdateProductInput, AdminOrderFilters, OrderAnalytics } from '../types';
import type { Product, PaginatedResponse } from '../../products/types';
import type { Order } from '../../../types';
import { API_TAGS } from '../../../constants';

/**
 * Admin API Endpoints
 * 
 * Provides API endpoints for admin dashboard analytics and management
 * Validates: Requirements 10.1, 10.2, 10.3, 10.4
 */
export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAnalytics: builder.query<AnalyticsData, AnalyticsFilters | void>({
      query: (filters = {}) => ({
        url: '/admin/analytics',
        params: filters,
      }),
      providesTags: [API_TAGS.ANALYTICS],
    }),


    getAdminProducts: builder.query<PaginatedResponse<Product>, AdminProductFilters | void>({
      query: (filters = {}) => ({
        url: '/admin/products',
        params: filters,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: API_TAGS.PRODUCT, id } as const)),
              { type: API_TAGS.PRODUCTS, id: 'ADMIN_LIST' } as const,
            ]
          : [{ type: API_TAGS.PRODUCTS, id: 'ADMIN_LIST' } as const],
    }),

    getAdminProductById: builder.query<Product, string>({
      query: (id) => `/admin/products/${id}`,
      providesTags: (result, error, id) => [{ type: API_TAGS.PRODUCT, id }],
    }),

    createProduct: builder.mutation<Product, CreateProductInput>({
      query: (product) => ({
        url: '/admin/products',
        method: 'POST',
        body: product,
      }),
      invalidatesTags: [
        { type: API_TAGS.PRODUCTS, id: 'ADMIN_LIST' },
        { type: API_TAGS.PRODUCTS, id: 'LIST' },
      ],
    }),

    updateProduct: builder.mutation<Product, UpdateProductInput>({
      query: ({ id, ...product }) => ({
        url: `/admin/products/${id}`,
        method: 'PUT',
        body: product,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: API_TAGS.PRODUCT, id },
        { type: API_TAGS.PRODUCTS, id: 'ADMIN_LIST' },
        { type: API_TAGS.PRODUCTS, id: 'LIST' },
      ],
    }),

    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: API_TAGS.PRODUCT, id },
        { type: API_TAGS.PRODUCTS, id: 'ADMIN_LIST' },
        { type: API_TAGS.PRODUCTS, id: 'LIST' },
      ],
    }),

    uploadProductImage: builder.mutation<{ url: string }, FormData>({
      query: (formData) => ({
        url: '/admin/products/upload-image',
        method: 'POST',
        body: formData,
      }),
    }),


    getAdminOrders: builder.query<PaginatedResponse<Order>, AdminOrderFilters | void>({
      query: (filters = {}) => ({
        url: '/admin/orders',
        params: filters,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: API_TAGS.ORDER, id } as const)),
              { type: API_TAGS.ORDERS, id: 'ADMIN_LIST' } as const,
            ]
          : [{ type: API_TAGS.ORDERS, id: 'ADMIN_LIST' } as const],
    }),

    getAdminOrderById: builder.query<Order, string>({
      query: (id) => `/admin/orders/${id}`,
      providesTags: (result, error, id) => [{ type: API_TAGS.ORDER, id }],
    }),

    updateAdminOrderStatus: builder.mutation<Order, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/admin/orders/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: API_TAGS.ORDER, id },
        { type: API_TAGS.ORDERS, id: 'ADMIN_LIST' },
        { type: API_TAGS.ORDERS, id: 'LIST' },
      ],
    }),

    getOrderAnalytics: builder.query<OrderAnalytics, void>({
      query: () => '/admin/orders/analytics',
      providesTags: [API_TAGS.ANALYTICS],
    }),
  }),
});

export const {
  useGetAnalyticsQuery,
  useGetAdminProductsQuery,
  useGetAdminProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUploadProductImageMutation,
  useGetAdminOrdersQuery,
  useGetAdminOrderByIdQuery,
  useUpdateAdminOrderStatusMutation,
  useGetOrderAnalyticsQuery,
} = adminApi;
