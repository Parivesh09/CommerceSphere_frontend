import { baseApi } from './baseApi';
import type { Order, OrderStatus, ApiResponse, PaginatedResponse, Address } from '../../types';

export interface CreateOrderRequest {
  items: Array<{ productId: string; quantity: number; variantId?: string; unitPrice: number }>;
  shippingAddress: Address;
  paymentMethod: string;
}

export interface GetOrdersParams {
  page?: number;
  pageSize?: number;
  status?: OrderStatus;
}

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

    trackOrder: builder.query<ApiResponse<TrackingInfo>, string>({
      query: (idOrTracking) => `/orders/track/${idOrTracking}`,
      providesTags: (_result, _error, id) => [{ type: 'Order' as const, id: `track-${id}` }],
    }),

    cancelOrder: builder.mutation<ApiResponse<Order>, { id: string; reason?: string }>({
      query: ({ id, reason }) => ({
        url: `/orders/${id}/cancel`,
        method: 'POST',
        body: { reason },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Order' as const, id },
        { type: 'Orders' as const, id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useUpdateOrderStatusMutation,
  useTrackOrderQuery,
  useCancelOrderMutation,
} = orderApi;
