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
} from '@mui/material';
import { Button } from '../../../components/ui';
import { shippingMethodSchema, type ShippingMethodFormData } from '../validation';
import { useGetShippingMethodsQuery } from '../api';

interface ShippingMethodSelectorProps {
  initialData?: { shippingMethodId?: string };
  onSubmit: (data: ShippingMethodFormData) => void;
  onBack: () => void;
  isLoading?: boolean;
}

/**
 * Shipping method selector component
 * Validates: Requirements 7.1, 7.2
 */
export function ShippingMethodSelector({
  initialData,
  onSubmit,
  onBack,
  isLoading = false,
}: ShippingMethodSelectorProps) {
  const {
    data: shippingMethods,
    isLoading: isLoadingMethods,
    error: methodsError,
  } = useGetShippingMethodsQuery();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingMethodFormData>({
    resolver: zodResolver(shippingMethodSchema),
    defaultValues: {
      shippingMethodId: initialData?.shippingMethodId || '',
    },
  });

  if (isLoadingMethods) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (methodsError || !shippingMethods) {
    return (
      <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
        <Typography color="error">
          Failed to load shipping methods. Please try again.
        </Typography>
      </Paper>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Select Shipping Method
        </Typography>
        <Controller
          name="shippingMethodId"
          control={control}
          render={({ field }) => (
            <FormControl error={!!errors.shippingMethodId} fullWidth>
              <RadioGroup {...field}>
                {shippingMethods.map((method) => (
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
                        <Box sx={{ width: '100%', ml: 1 }}>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                              {method.name}
                            </Typography>
                            <Typography variant="h6" color="primary">
                              ${method.price.toFixed(2)}
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {method.description}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ mt: 0.5, display: 'block' }}
                          >
                            Estimated delivery: {method.estimatedDays}
                          </Typography>
                        </Box>
                      }
                      sx={{ width: '100%', m: 0 }}
                    />
                  </Paper>
                ))}
              </RadioGroup>
              {errors.shippingMethodId && (
                <FormHelperText>{errors.shippingMethodId.message}</FormHelperText>
              )}
            </FormControl>
          )}
        />
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading}>
          Continue to Payment
        </Button>
      </Box>
    </form>
  );
}
