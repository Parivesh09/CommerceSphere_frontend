import React from 'react';
import { Box, Stepper, Step, StepLabel, Paper } from '@mui/material';
import type { CheckoutStep } from '../types';

interface CheckoutWizardProps {
  currentStep: CheckoutStep;
  children: React.ReactNode;
}

const steps: { id: CheckoutStep; label: string }[] = [
  { id: 'address', label: 'Shipping Address' },
  { id: 'shipping', label: 'Shipping Method' },
  { id: 'payment', label: 'Payment' },
  { id: 'review', label: 'Review Order' },
];

/**
 * Multi-step checkout wizard component
 * Validates: Requirements 7.1
 */
export function CheckoutWizard({ currentStep, children }: CheckoutWizardProps) {
  const activeStepIndex = steps.findIndex((step) => step.id === currentStep);

  return (
    <Box sx={{ width: '100%' }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: 'background.paper' }}>
        <Stepper activeStep={activeStepIndex} alternativeLabel>
          {steps.map((step) => (
            <Step key={step.id}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>
      <Box>{children}</Box>
    </Box>
  );
}
