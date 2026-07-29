import { baseApi } from './baseApi';
import type { Order, OrderStatus, ApiResponse, PaginatedResponse, Address } from '../../types';

export interface TrackingStep {
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
  current: boolean;
}

export interface TrackingInfo {
  orderId: string;
  trackingNumber: string;
  carrier: string;
  estimatedDelivery: string;
  status: OrderStatus;
  timeline: TrackingStep[];
}

export interface CreateOrderRequest {
  userId?: string;
  items: Array<{ productId: string; quantity: number; variantId?: string; unitPrice: number }>;
  shippingAddress: Address;
}

export interface GetOrdersParams {
  page?: number;
  pageSize?: number;
  status?: OrderStatus;
}

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<PaginatedResponse<Order>, GetOrdersParams>({
      query: (params) => ({
        url: '/orders',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Orders' as const, id })),
              { type: 'Orders' as const, id: 'LIST' },
            ]
          : [{ type: 'Orders' as const, id: 'LIST' }],
    }),

    getOrderById: builder.query<ApiResponse<Order>, string>({
      query: (id) => `/orders/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Order' as const, id }],
    }),

    createOrder: builder.mutation<ApiResponse<Order>, CreateOrderRequest>({
      query: (orderData) => ({
        url: '/orders',
        method: 'POST',
        body: orderData,
      }),
      invalidatesTags: [
        { type: 'Orders' as const, id: 'LIST' },
        { type: 'Cart' as const, id: 'CURRENT' },
      ],
    }),

    updateOrderStatus: builder.mutation<ApiResponse<Order>, { id: string; status: OrderStatus }>({
      query: ({ id, status }) => ({
        url: `/orders/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Order' as const, id },
        { type: 'Orders' as const, id: 'LIST' },
      ],
    }),

    cancelOrder: builder.mutation<ApiResponse<Order>, { id: string; reason?: string }>({
      query: ({ id, reason }) => ({
        url: `/orders/${id}/cancel`,
        method: 'POST',
        body: { userId: '', reason },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Order' as const, id },
        { type: 'Orders' as const, id: 'LIST' },
      ],
    }),

    shipOrder: builder.mutation<ApiResponse<Order>, { id: string; trackingNumber?: string; carrier?: string }>({
      query: ({ id, trackingNumber, carrier }) => ({
        url: `/orders/${id}/ship`,
        method: 'POST',
        body: { trackingNumber, carrier },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Order' as const, id },
        { type: 'Orders' as const, id: 'LIST' },
      ],
    }),

    deliverOrder: builder.mutation<ApiResponse<Order>, { id: string; deliveredAt?: string }>({
      query: ({ id, deliveredAt }) => ({
        url: `/orders/${id}/deliver`,
        method: 'POST',
        body: { deliveredAt },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Order' as const, id },
        { type: 'Orders' as const, id: 'LIST' },
      ],
    }),

    trackOrder: builder.query<ApiResponse<TrackingInfo>, string>({
      query: (idOrTracking) => `/orders/track/${idOrTracking}`,
      providesTags: (_result, _error, id) => [{ type: 'Order' as const, id: `track-${id}` }],
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
  useTrackOrderQuery,
} = orderApi;
