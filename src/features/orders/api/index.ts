import { baseApi } from '../../../services/api/baseApi';
import type { Order, PaginatedResponse } from '../../../types';

export interface OrderFilters {
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<PaginatedResponse<Order>, OrderFilters | void>({
      query: (filters) => ({
        url: '/orders',
        params: filters || {},
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Order' as const, id })),
              { type: 'Orders', id: 'LIST' },
            ]
          : [{ type: 'Orders', id: 'LIST' }],
    }),

    getOrderById: builder.query<Order, string>({
      query: (id) => `/orders/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Order', id }],
    }),

    createOrder: builder.mutation<Order, { items: Array<{ productId: string; quantity: number; variantId?: string; unitPrice: number }>; shippingAddress: { street: string; city: string; state: string; postalCode: string; country: string } }>({
      query: (order) => ({
        url: '/orders',
        method: 'POST',
        body: order,
      }),
      invalidatesTags: [{ type: 'Orders', id: 'LIST' }],
    }),

    updateOrderStatus: builder.mutation<Order, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/orders/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Order', id },
        { type: 'Orders', id: 'LIST' },
      ],
    }),

    cancelOrder: builder.mutation<Order, { id: string; reason?: string }>({
      query: ({ id, reason }) => ({
        url: `/orders/${id}/cancel`,
        method: 'POST',
        body: { userId: '', reason },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Order', id },
        { type: 'Orders', id: 'LIST' },
      ],
    }),

    shipOrder: builder.mutation<Order, { id: string; trackingNumber?: string; carrier?: string }>({
      query: ({ id, trackingNumber, carrier }) => ({
        url: `/orders/${id}/ship`,
        method: 'POST',
        body: { trackingNumber, carrier },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Order', id },
        { type: 'Orders', id: 'LIST' },
      ],
    }),

    deliverOrder: builder.mutation<Order, { id: string }>({
      query: ({ id }) => ({
        url: `/orders/${id}/deliver`,
        method: 'POST',
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
