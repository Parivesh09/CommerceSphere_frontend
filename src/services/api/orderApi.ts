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

const TRACKING_STEPS: Array<{ key: OrderStatus; label: string }> = [
  { key: 'PENDING_PAYMENT', label: 'Order Placed' },
  { key: 'PAID', label: 'Payment Confirmed' },
  { key: 'PROCESSING', label: 'Warehouse Processing' },
  { key: 'SHIPPED', label: 'Order Shipped' },
  { key: 'DELIVERED', label: 'Order Delivered' },
];

const STATUS_ORDER: OrderStatus[] = ['CREATED', 'PENDING_PAYMENT', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

export function buildTrackingTimeline(order: Order): TrackingStep[] {
  if (order.status === 'CANCELLED') {
    return [
      {
        title: 'Order Cancelled',
        description: 'This order has been cancelled.',
        timestamp: order.updatedAt || order.createdAt,
        completed: true,
        current: false,
      },
    ];
  }

  const currentIndex = STATUS_ORDER.indexOf(order.status);
  if (currentIndex === -1) return [];

  return TRACKING_STEPS.map((step, idx) => ({
    title: step.label,
    description: step.label,
    timestamp: idx <= currentIndex ? new Date(order.updatedAt || order.createdAt).toISOString() : '',
    completed: idx <= currentIndex,
    current: idx === currentIndex,
  }));
}

export interface CreateOrderRequest {
  userId?: string;
  items: Array<{ productId: string; quantity: number; variantId?: string; unitPrice: number }>;
  shippingAddress: Address;
}

interface OrderResponse {
  order: Order;
}

interface OrdersListResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
}

export const orderApi = baseApi.injectEndpoints({
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
              ...result.data.map(({ id }) => ({ type: 'Orders' as const, id })),
              { type: 'Orders' as const, id: 'LIST' },
            ]
          : [{ type: 'Orders' as const, id: 'LIST' }],
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
      providesTags: (_result, _error, arg) => [{ type: 'Order' as const, id: typeof arg === 'string' ? arg : arg.id }],
    }),

    createOrder: builder.mutation<ApiResponse<Order>, CreateOrderRequest>({
      query: (orderData) => ({
        url: '/orders',
        method: 'POST',
        body: orderData,
      }),
      transformResponse: (response: OrderResponse): ApiResponse<Order> => ({
        data: response.order,
        success: true,
      }),
      invalidatesTags: [
        { type: 'Orders' as const, id: 'LIST' },
        { type: 'Cart' as const, id: 'CURRENT' },
      ],
    }),

    updateOrderStatus: builder.mutation<{ message: string }, { id: string; status: OrderStatus }>({
      query: ({ id, status }) => ({
        url: `/orders/${id}/status`,
        method: 'PUT',
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
        body: { reason },
      }),
      transformResponse: (response: OrderResponse): ApiResponse<Order> => ({
        data: response.order,
        success: true,
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
      transformResponse: (response: OrderResponse): ApiResponse<Order> => ({
        data: response.order,
        success: true,
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
      transformResponse: (response: OrderResponse): ApiResponse<Order> => ({
        data: response.order,
        success: true,
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
  useCancelOrderMutation,
  useShipOrderMutation,
  useDeliverOrderMutation,
} = orderApi;
