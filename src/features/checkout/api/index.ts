import { baseApi } from '../../../services/api/baseApi';
import { API_TAGS } from '../../../constants';
import type {
  ShippingMethod,
  PaymentMethod,
  CreateOrderRequest,
  CreateOrderResponse,
} from '../types';

/**
 * Checkout API endpoints
 * Validates: Requirements 7.1, 7.3, 7.4
 */
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


    processStripePayment: builder.mutation<
      { clientSecret: string },
      { orderId: string; amount: number }
    >({
      query: (paymentData) => ({
        url: '/payments/stripe/create-intent',
        method: 'POST',
        body: paymentData,
      }),
    }),


    processPayPalPayment: builder.mutation<
      { approvalUrl: string; orderId: string },
      { orderId: string; amount: number }
    >({
      query: (paymentData) => ({
        url: '/payments/paypal/create-order',
        method: 'POST',
        body: paymentData,
      }),
    }),
  }),
});

export const {
  useGetShippingMethodsQuery,
  useGetPaymentMethodsQuery,
  useCreateOrderMutation,
  useProcessStripePaymentMutation,
  useProcessPayPalPaymentMutation,
} = checkoutApi;
