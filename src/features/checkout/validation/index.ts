import { z } from 'zod';

/**
 * Address validation schema
 * Validates: Requirements 7.2, 19.1, 19.2
 */
export const addressSchema = z.object({
  street: z
    .string()
    .min(1, 'Street address is required')
    .min(5, 'Street address must be at least 5 characters')
    .max(200, 'Street address must not exceed 200 characters'),
  city: z
    .string()
    .min(1, 'City is required')
    .min(2, 'City must be at least 2 characters')
    .max(100, 'City must not exceed 100 characters'),
  state: z
    .string()
    .min(1, 'State/Province is required')
    .min(2, 'State/Province must be at least 2 characters')
    .max(100, 'State/Province must not exceed 100 characters'),
  postalCode: z
    .string()
    .min(1, 'Postal code is required')
    .regex(/^[A-Z0-9\s-]{3,10}$/i, 'Invalid postal code format'),
  country: z
    .string()
    .min(1, 'Country is required')
    .min(2, 'Country must be at least 2 characters')
    .max(100, 'Country must not exceed 100 characters'),
});

/**
 * Shipping address step validation schema
 * Validates: Requirements 7.1, 7.2
 */
export const shippingAddressSchema = z.object({
  shippingAddress: addressSchema,
  billingAddress: addressSchema,
  useSameAddress: z.boolean(),
});

/**
 * Shipping method step validation schema
 * Validates: Requirements 7.1, 7.2
 */
export const shippingMethodSchema = z.object({
  shippingMethodId: z.string().min(1, 'Please select a shipping method'),
});

/**
 * Payment method step validation schema
 * Validates: Requirements 7.2, 7.3
 */
export const paymentMethodSchema = z.object({
  paymentMethodId: z.string().min(1, 'Please select a payment method'),

  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvc: z.string().optional(),
  cardName: z.string().optional(),
});

/**
 * Complete checkout validation schema
 * Validates: Requirements 7.1, 7.2, 7.3
 */
export const checkoutSchema = z.object({
  shippingAddress: addressSchema,
  billingAddress: addressSchema,
  useSameAddress: z.boolean(),
  shippingMethodId: z.string().min(1, 'Please select a shipping method'),
  paymentMethodId: z.string().min(1, 'Please select a payment method'),
});

export type AddressFormData = z.infer<typeof addressSchema>;
export type ShippingAddressFormData = z.infer<typeof shippingAddressSchema>;
export type ShippingMethodFormData = z.infer<typeof shippingMethodSchema>;
export type PaymentMethodFormData = z.infer<typeof paymentMethodSchema>;
export type CheckoutFormData = z.infer<typeof checkoutSchema>;
