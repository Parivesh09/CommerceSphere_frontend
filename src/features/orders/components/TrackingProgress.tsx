import { Box, Step, StepLabel, Stepper, Typography } from '@mui/material';
import type { OrderStatus } from '../../../types';

interface TrackingProgressProps {
  status: OrderStatus;
  updatedAt: string;
}

const orderSteps: { status: OrderStatus; label: string }[] = [
  { status: 'CREATED', label: 'Order Placed' },
  { status: 'PAID', label: 'Payment Confirmed' },
  { status: 'PROCESSING', label: 'Processing' },
  { status: 'SHIPPED', label: 'Shipped' },
  { status: 'DELIVERED', label: 'Delivered' },
];

/**
 * Tracking progress component
 * Displays visual shipment tracking progress
 * Validates: Requirements 18.4
 */
export default function TrackingProgress({
  status,
  updatedAt,
}: TrackingProgressProps) {

  const getActiveStep = () => {
    if (status === 'CANCELLED') return -1;
    const stepIndex = orderSteps.findIndex((step) => step.status === status);
    return stepIndex >= 0 ? stepIndex : 0;
  };

  const activeStep = getActiveStep();

  if (status === 'CANCELLED') {
    return (
      <Box sx={{ py: 3 }}>
        <Typography variant="body1" color="error" sx={{ textAlign: 'center' }}>
          This order has been cancelled
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 3 }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {orderSteps.map((step) => (
          <Step key={step.status}>
            <StepLabel>{step.label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          Last updated: {new Date(updatedAt).toLocaleString()}
        </Typography>
      </Box>
    </Box>
  );
}
