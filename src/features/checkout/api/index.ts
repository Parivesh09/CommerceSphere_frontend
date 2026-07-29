import { baseApi } from '../../../services/api/baseApi';
import { API_TAGS } from '../../../constants';
import type {
  ShippingMethod,
  PaymentMethod,
  CreateOrderRequest,
  CreateOrderResponse,
} from '../types';

export const checkoutApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getShippingMethods: builder.query<ShippingMethod[], void>({
      query: () => '/checkout/shipping-methods',
      providesTags: [{ type: API_TAGS.ORDERS, id: 'SHIPPING_METHODS' }],
    }),

    getPaymentMethods: builder.query<PaymentMethod[], void>({
      query: () => '/checkout/payment-methods',
      providesTags: [{ type: API_TAGS.ORDERS, id: 'PAYMENT_METHODS' }],
    }),

    createOrder: builder.mutation<CreateOrderResponse, CreateOrderRequest>({
      query: (orderData) => ({
        url: '/orders',
        method: 'POST',
        body: orderData,
      }),
      invalidatesTags: [
        { type: API_TAGS.ORDERS, id: 'LIST' },
        { type: API_TAGS.CART, id: 'CURRENT' },
      ],
    }),

    processPayment: builder.mutation<
      { id: string; orderId: string; status: string; amount: number; currency: string; createdAt: string },
      { orderId: string; userId: string; amount: number; currency?: string; paymentMethodId: string }
    >({
      query: (paymentData) => ({
        url: '/payments',
        method: 'POST',
        body: paymentData,
      }),
    }),

    getPayment: builder.query<
      { id: string; orderId: string; userId: string; amount: number; currency: string; status: string; paymentMethod: string; gatewayTransactionId?: string; createdAt: string; updatedAt: string },
      string
    >({
      query: (id) => `/payments/${id}`,
      providesTags: (_result, _error, id) => [{ type: API_TAGS.ORDERS, id: `payment-${id}` }],
    }),

    refundPayment: builder.mutation<
      { id: string; paymentId: string; amount: number; status: string; createdAt: string },
      { id: string; amount?: number; reason?: string }
    >({
      query: ({ id, ...body }) => ({
        url: `/payments/${id}/refund`,
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useGetShippingMethodsQuery,
  useGetPaymentMethodsQuery,
  useCreateOrderMutation,
  useProcessPaymentMutation,
  useGetPaymentQuery,
  useRefundPaymentMutation,
} = checkoutApi;
