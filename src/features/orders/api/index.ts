import { baseApi } from '../../../services/api/baseApi';
import type { Order, OrderStatus, ApiResponse, PaginatedResponse } from '../../../types';

interface OrderResponse {
  order: Order;
}

interface OrdersListResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
}

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<PaginatedResponse<Order>, { userId?: string; status?: OrderStatus; page?: number; limit?: number }>({
      query: ({ userId, ...params }) => ({
        url: '/orders',
        params: { userId, ...params },
      }),
      transformResponse: (response: OrdersListResponse, _meta, arg): PaginatedResponse<Order> => ({
        data: response.orders,
        total: response.total,
        page: response.page || arg.page || 1,
        pageSize: response.limit || arg.limit || 20,
        totalPages: Math.ceil(response.total / (response.limit || arg.limit || 20)),
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Order' as const, id })),
              { type: 'Orders', id: 'LIST' },
            ]
          : [{ type: 'Orders', id: 'LIST' }],
    }),

    getOrderById: builder.query<ApiResponse<Order>, string | { id: string; userId?: string }>({
      query: (arg) => {
        const id = typeof arg === 'string' ? arg : arg.id;
        const userId = typeof arg === 'string' ? undefined : arg.userId;
        return {
          url: `/orders/${id}`,
          params: userId ? { userId } : undefined,
        };
      },
      transformResponse: (response: OrderResponse): ApiResponse<Order> => ({
        data: response.order,
        success: true,
      }),
      providesTags: (_result, _error, arg) => [{ type: 'Order', id: typeof arg === 'string' ? arg : arg.id }],
    }),

    createOrder: builder.mutation<ApiResponse<Order>, { userId?: string; items: Array<{ productId: string; quantity: number; variantId?: string; unitPrice: number }>; shippingAddress: { street: string; city: string; state: string; postalCode: string; country: string } }>({
      query: (order) => ({
        url: '/orders',
        method: 'POST',
        body: order,
      }),
      transformResponse: (response: OrderResponse): ApiResponse<Order> => ({
        data: response.order,
        success: true,
      }),
      invalidatesTags: [{ type: 'Orders', id: 'LIST' }],
    }),

    updateOrderStatus: builder.mutation<{ message: string }, { id: string; status: OrderStatus }>({
      query: ({ id, status }) => ({
        url: `/orders/${id}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Order', id },
        { type: 'Orders', id: 'LIST' },
      ],
    }),

    cancelOrder: builder.mutation<ApiResponse<Order>, { id: string; reason?: string }>({
      query: ({ id, reason }) => ({
        url: `/orders/${id}/cancel`,
        method: 'POST',
        body: { reason },
      }),
      transformResponse: (response: OrderResponse): ApiResponse<Order> => ({
        data: response.order,
        success: true,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Order', id },
        { type: 'Orders', id: 'LIST' },
      ],
    }),

    shipOrder: builder.mutation<ApiResponse<Order>, { id: string; trackingNumber?: string; carrier?: string }>({
      query: ({ id, trackingNumber, carrier }) => ({
        url: `/orders/${id}/ship`,
        method: 'POST',
        body: { trackingNumber, carrier },
      }),
      transformResponse: (response: OrderResponse): ApiResponse<Order> => ({
        data: response.order,
        success: true,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Order', id },
        { type: 'Orders', id: 'LIST' },
      ],
    }),

    deliverOrder: builder.mutation<ApiResponse<Order>, { id: string; deliveredAt?: string }>({
      query: ({ id, deliveredAt }) => ({
        url: `/orders/${id}/deliver`,
        method: 'POST',
        body: { deliveredAt },
      }),
      transformResponse: (response: OrderResponse): ApiResponse<Order> => ({
        data: response.order,
        success: true,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Order', id },
        { type: 'Orders', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,
  useShipOrderMutation,
  useDeliverOrderMutation,
} = ordersApi;
