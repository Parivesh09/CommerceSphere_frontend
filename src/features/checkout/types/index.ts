import type { Address } from '../../../types';

export type CheckoutStep = 'address' | 'shipping' | 'payment' | 'review';

export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'stripe';
  name: string;
  icon?: string;
}

export interface CheckoutState {
  currentStep: CheckoutStep;
  shippingAddress: Address | null;
  billingAddress: Address | null;
  useSameAddress: boolean;
  selectedShippingMethod: ShippingMethod | null;
  selectedPaymentMethod: PaymentMethod | null;
  isProcessing: boolean;
}

export interface CreateOrderRequest {
  shippingAddress: Address;
  billingAddress: Address;
  shippingMethodId: string;
  paymentMethodId: string;
  paymentDetails?: {
    stripePaymentMethodId?: string;
    paypalOrderId?: string;
  };
}

export interface CreateOrderResponse {
  orderId: string;
  status: string;
  totalAmount: number;
  message?: string;
}

export interface CheckoutFormData {

  shippingAddress: Address;
  billingAddress: Address;
  useSameAddress: boolean;
  

  shippingMethodId: string;
  

  paymentMethodId: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvc?: string;
  cardName?: string;
}
