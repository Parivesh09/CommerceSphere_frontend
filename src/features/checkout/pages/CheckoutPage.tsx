import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography } from '@mui/material';
import { toast } from 'react-hot-toast';
import {
  CheckoutWizard,
  AddressForm,
  ShippingMethodSelector,
  PaymentMethodSelector,
  OrderReview,
} from '../components';
import type { CheckoutStep } from '../types';
import type { Address } from '../../../types';
import type { ShippingAddressFormData, ShippingMethodFormData, PaymentMethodFormData } from '../validation';
import { useCreateOrderMutation, useGetShippingMethodsQuery, useGetPaymentMethodsQuery } from '../api';
import { useAppSelector } from '../../../hooks';
import { ROUTES } from '../../../constants';

/**
 * Main checkout page with multi-step wizard
 * Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5
 */
export default function CheckoutPage() {
  const navigate = useNavigate();
  const cart = useAppSelector((state) => state.cart);
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('address');


  const [shippingAddress, setShippingAddress] = useState<Address | null>(null);
  const [billingAddress, setBillingAddress] = useState<Address | null>(null);
  const [useSameAddress, setUseSameAddress] = useState(true);
  const [selectedShippingMethodId, setSelectedShippingMethodId] = useState<string | null>(null);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string | null>(null);


  const { data: shippingMethods } = useGetShippingMethodsQuery();
  const { data: paymentMethods } = useGetPaymentMethodsQuery();
  const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation();


  useEffect(() => {
    if (cart.items.length === 0) {
      toast.error('Your cart is empty');
      navigate(ROUTES.CART);
    }
  }, [cart.items.length, navigate]);


  const selectedShippingMethod = shippingMethods?.find(
    (m) => m.id === selectedShippingMethodId
  );
  const selectedPaymentMethod = paymentMethods?.find(
    (m) => m.id === selectedPaymentMethodId
  );


  const handleAddressSubmit = (data: ShippingAddressFormData) => {
    setShippingAddress(data.shippingAddress);
    setBillingAddress(data.useSameAddress ? data.shippingAddress : data.billingAddress);
    setUseSameAddress(data.useSameAddress);
    setCurrentStep('shipping');
  };

  const handleShippingSubmit = (data: ShippingMethodFormData) => {
    setSelectedShippingMethodId(data.shippingMethodId);
    setCurrentStep('payment');
  };

  const handlePaymentSubmit = (data: PaymentMethodFormData) => {
    setSelectedPaymentMethodId(data.paymentMethodId);
    setCurrentStep('review');
  };

  const handlePlaceOrder = async () => {
    if (!shippingAddress || !billingAddress || !selectedShippingMethodId || !selectedPaymentMethodId) {
      toast.error('Please complete all checkout steps');
      return;
    }

    try {
      const result = await createOrder({
        shippingAddress,
        billingAddress,
        shippingMethodId: selectedShippingMethodId,
        paymentMethodId: selectedPaymentMethodId,
      }).unwrap();

      toast.success('Order placed successfully!');
      navigate(`${ROUTES.CHECKOUT}/confirmation?orderId=${result.orderId}`);
    } catch (error) {
      console.error('Order creation failed:', error);
      const errorMessage = error && typeof error === 'object' && 'data' in error && 
        error.data && typeof error.data === 'object' && 'message' in error.data
        ? String(error.data.message)
        : 'Failed to place order. Please try again.';
      toast.error(errorMessage);
    }
  };


  const handleBack = () => {
    const steps: CheckoutStep[] = ['address', 'shipping', 'payment', 'review'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  if (cart.items.length === 0) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        Checkout
      </Typography>

      <CheckoutWizard currentStep={currentStep}>
        {currentStep === 'address' && (
          <AddressForm
            initialData={{
              shippingAddress: shippingAddress ?? undefined,
              billingAddress: billingAddress ?? undefined,
              useSameAddress,
            }}
            onSubmit={handleAddressSubmit}
          />
        )}

        {currentStep === 'shipping' && (
          <ShippingMethodSelector
            initialData={{ shippingMethodId: selectedShippingMethodId ?? undefined }}
            onSubmit={handleShippingSubmit}
            onBack={handleBack}
          />
        )}

        {currentStep === 'payment' && (
          <PaymentMethodSelector
            initialData={{ paymentMethodId: selectedPaymentMethodId ?? undefined }}
            onSubmit={handlePaymentSubmit}
            onBack={handleBack}
          />
        )}

        {currentStep === 'review' &&
          shippingAddress &&
          billingAddress &&
          selectedShippingMethod &&
          selectedPaymentMethod && (
            <OrderReview
              cart={cart}
              shippingAddress={shippingAddress}
              billingAddress={billingAddress}
              shippingMethod={selectedShippingMethod}
              paymentMethod={selectedPaymentMethod}
              onSubmit={handlePlaceOrder}
              onBack={handleBack}
              isLoading={isCreatingOrder}
            />
          )}
      </CheckoutWizard>
    </Container>
  );
}
