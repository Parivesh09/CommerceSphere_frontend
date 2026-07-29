import { baseApi } from '../../../services/api/baseApi';
import type { AnalyticsData, AnalyticsFilters, AdminProductFilters, CreateProductInput, UpdateProductInput, AdminOrderFilters, OrderAnalytics } from '../types';
import type { Product, PaginatedResponse } from '../../products/types';
import type { Order } from '../../../types';
import { API_TAGS } from '../../../constants';

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAnalytics: builder.query<AnalyticsData, AnalyticsFilters | void>({
      query: (filters = {}) => ({
        url: '/analytics/dashboard',
        params: filters,
      }),
      providesTags: [API_TAGS.ANALYTICS],
    }),

    getSalesAnalytics: builder.query<unknown, { startDate?: string; endDate?: string; interval?: string }>({
      query: (params) => ({
        url: '/analytics/sales',
        params,
      }),
      providesTags: [API_TAGS.ANALYTICS],
    }),

    getTopProducts: builder.query<unknown, { startDate?: string; endDate?: string; limit?: number; sortBy?: string }>({
      query: (params) => ({
        url: '/analytics/products/top',
        params,
      }),
      providesTags: [API_TAGS.ANALYTICS],
    }),

    getTopCustomers: builder.query<unknown, { limit?: number; sortBy?: string }>({
      query: (params) => ({
        url: '/analytics/customers/top',
        params,
      }),
      providesTags: [API_TAGS.ANALYTICS],
    }),

    getAdminProducts: builder.query<PaginatedResponse<Product>, AdminProductFilters | void>({
      query: (filters = {}) => ({
        url: '/products',
        params: { ...filters, page: filters?.page || 1, limit: filters?.pageSize || 20 },
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
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: API_TAGS.PRODUCT, id }],
    }),

    createProduct: builder.mutation<Product, CreateProductInput>({
      query: (product) => ({
        url: '/products',
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
        url: `/products/${id}`,
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
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: API_TAGS.PRODUCT, id },
        { type: API_TAGS.PRODUCTS, id: 'ADMIN_LIST' },
        { type: API_TAGS.PRODUCTS, id: 'LIST' },
      ],
    }),

    uploadProductImage: builder.mutation<{ url: string; key: string }, { productId: string; fileExtension: string }>({
      query: ({ productId, fileExtension }) => ({
        url: `/products/${productId}/images/upload-url`,
        method: 'POST',
        body: { fileExtension },
      }),
    }),

    confirmProductImage: builder.mutation<Product, { productId: string; key: string; displayOrder?: number }>({
      query: ({ productId, key, displayOrder }) => ({
        url: `/products/${productId}/images`,
        method: 'POST',
        body: { key, displayOrder },
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: API_TAGS.PRODUCT, id: productId },
        { type: API_TAGS.PRODUCTS, id: 'ADMIN_LIST' },
      ],
    }),

    getAdminOrders: builder.query<PaginatedResponse<Order>, AdminOrderFilters | void>({
      query: (filters = {}) => ({
        url: '/orders',
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
      query: (id) => `/orders/${id}`,
      providesTags: (result, error, id) => [{ type: API_TAGS.ORDER, id }],
    }),

    updateAdminOrderStatus: builder.mutation<Order, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/orders/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: API_TAGS.ORDER, id },
        { type: API_TAGS.ORDERS, id: 'ADMIN_LIST' },
        { type: API_TAGS.ORDERS, id: 'LIST' },
      ],
    }),

    shipAdminOrder: builder.mutation<Order, { id: string; trackingNumber?: string; carrier?: string }>({
      query: ({ id, trackingNumber, carrier }) => ({
        url: `/orders/${id}/ship`,
        method: 'POST',
        body: { trackingNumber, carrier },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: API_TAGS.ORDER, id },
        { type: API_TAGS.ORDERS, id: 'ADMIN_LIST' },
      ],
    }),

    deliverAdminOrder: builder.mutation<Order, { id: string }>({
      query: ({ id }) => ({
        url: `/orders/${id}/deliver`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: API_TAGS.ORDER, id },
        { type: API_TAGS.ORDERS, id: 'ADMIN_LIST' },
      ],
    }),

    getOrderAnalytics: builder.query<OrderAnalytics, void>({
      query: () => '/analytics/dashboard',
      providesTags: [API_TAGS.ANALYTICS],
    }),
  }),
});

export const {
  useGetAnalyticsQuery,
  useGetSalesAnalyticsQuery,
  useGetTopProductsQuery,
  useGetTopCustomersQuery,
  useGetAdminProductsQuery,
  useGetAdminProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUploadProductImageMutation,
  useConfirmProductImageMutation,
  useGetAdminOrdersQuery,
  useGetAdminOrderByIdQuery,
  useUpdateAdminOrderStatusMutation,
  useShipAdminOrderMutation,
  useDeliverAdminOrderMutation,
  useGetOrderAnalyticsQuery,
} = adminApi;
