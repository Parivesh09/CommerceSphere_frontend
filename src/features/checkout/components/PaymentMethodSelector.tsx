import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Paper,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormHelperText,
  CircularProgress,
  Grid,
} from '@mui/material';
import { Button, Input } from '../../../components/ui';
import { paymentMethodSchema, type PaymentMethodFormData } from '../validation';
import { useGetPaymentMethodsQuery } from '../api';

interface PaymentMethodSelectorProps {
  initialData?: {
    paymentMethodId?: string;
    cardNumber?: string;
    cardExpiry?: string;
    cardCvc?: string;
    cardName?: string;
  };
  onSubmit: (data: PaymentMethodFormData) => void;
  onBack: () => void;
  isLoading?: boolean;
}

/**
 * Payment method selector component with Stripe/PayPal integration
 * Validates: Requirements 7.2, 7.3
 */
export function PaymentMethodSelector({
  initialData,
  onSubmit,
  onBack,
  isLoading = false,
}: PaymentMethodSelectorProps) {
  const {
    data: paymentMethods,
    isLoading: isLoadingMethods,
    error: methodsError,
  } = useGetPaymentMethodsQuery();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PaymentMethodFormData>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      paymentMethodId: initialData?.paymentMethodId || '',
      cardNumber: initialData?.cardNumber || '',
      cardExpiry: initialData?.cardExpiry || '',
      cardCvc: initialData?.cardCvc || '',
      cardName: initialData?.cardName || '',
    },
  });

  const selectedPaymentMethod = watch('paymentMethodId');
  const selectedMethod = paymentMethods?.find((m) => m.id === selectedPaymentMethod);
  const showCardFields = selectedMethod?.type === 'card' || selectedMethod?.type === 'stripe';

  if (isLoadingMethods) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (methodsError || !paymentMethods) {
    return (
      <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
        <Typography color="error">
          Failed to load payment methods. Please try again.
        </Typography>
      </Paper>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Select Payment Method
        </Typography>
        <Controller
          name="paymentMethodId"
          control={control}
          render={({ field }) => (
            <FormControl error={!!errors.paymentMethodId} fullWidth>
              <RadioGroup {...field}>
                {paymentMethods.map((method) => (
                  <Paper
                    key={method.id}
                    elevation={0}
                    sx={{
                      p: 2,
                      mb: 2,
                      border: '1px solid',
                      borderColor:
                        field.value === method.id ? 'primary.main' : 'divider',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: 'action.hover',
                      },
                    }}
                    onClick={() => field.onChange(method.id)}
                  >
                    <FormControlLabel
                      value={method.id}
                      control={<Radio />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                            {method.name}
                          </Typography>
                        </Box>
                      }
                      sx={{ width: '100%', m: 0 }}
                    />
                  </Paper>
                ))}
              </RadioGroup>
              {errors.paymentMethodId && (
                <FormHelperText>{errors.paymentMethodId.message}</FormHelperText>
              )}
            </FormControl>
          )}
        />

        {showCardFields && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Card Details
            </Typography>
            <Grid container spacing={2}>
              
        <Grid size={{ xs: 12 }}>
                <Controller
                  name="cardName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Cardholder Name"
                      placeholder="John Doe"
                      error={errors.cardName?.message || ''}
                      fullWidth
                    />
                  )}
                />
              </Grid>
              
        <Grid size={{ xs: 12 }}>
                <Controller
                  name="cardNumber"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Card Number"
                      placeholder="1234 5678 9012 3456"
                      error={errors.cardNumber?.message || ''}
                      fullWidth
                    />
                  )}
                />
              </Grid>
              
        <Grid size={{ xs: 6 }}>
                <Controller
                  name="cardExpiry"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Expiry Date"
                      placeholder="MM/YY"
                      error={errors.cardExpiry?.message || ''}
                      fullWidth
                    />
                  )}
                />
              </Grid>
              
        <Grid size={{ xs: 6 }}>
                <Controller
                  name="cardCvc"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="CVC"
                      placeholder="123"
                      error={errors.cardCvc?.message || ''}
                      fullWidth
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading}>
          Review Order
        </Button>
      </Box>
    </form>
  );
}
