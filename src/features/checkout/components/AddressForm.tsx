import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Grid,
  Typography,
  Checkbox,
  FormControlLabel,
  Paper,
} from '@mui/material';
import { Input, Button } from '../../../components/ui';
import { shippingAddressSchema, type ShippingAddressFormData } from '../validation';
import type { Address } from '../../../types';

interface AddressFormProps {
  initialData?: {
    shippingAddress?: Address;
    billingAddress?: Address;
    useSameAddress?: boolean;
  };
  onSubmit: (data: ShippingAddressFormData) => void;
  onBack?: () => void;
  isLoading?: boolean;
}

/**
 * Address form component for checkout
 * Validates: Requirements 7.1, 7.2, 19.1, 19.2, 19.3
 */
export function AddressForm({
  initialData,
  onSubmit,
  onBack,
  isLoading = false,
}: AddressFormProps) {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ShippingAddressFormData>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: {
      shippingAddress: initialData?.shippingAddress || {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
      },
      billingAddress: initialData?.billingAddress || {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
      },
      useSameAddress: initialData?.useSameAddress ?? true,
    },
  });

  const useSameAddress = watch('useSameAddress');

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Shipping Address
        </Typography>
        <Grid container spacing={2}>
          
        <Grid size={{ xs: 12 }}>
            <Controller
              name="shippingAddress.street"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Street Address"
                  placeholder="123 Main St, Apt 4B"
                  error={errors.shippingAddress?.street?.message || ''}
                  fullWidth
                  required
                />
              )}
            />
          </Grid>
          
        <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="shippingAddress.city"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="City"
                  placeholder="New York"
                  error={errors.shippingAddress?.city?.message || ''}
                  fullWidth
                  required
                />
              )}
            />
          </Grid>
          
        <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="shippingAddress.state"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="State/Province"
                  placeholder="NY"
                  error={errors.shippingAddress?.state?.message || ''}
                  fullWidth
                  required
                />
              )}
            />
          </Grid>
          
        <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="shippingAddress.postalCode"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Postal Code"
                  placeholder="10001"
                  error={errors.shippingAddress?.postalCode?.message || ''}
                  fullWidth
                  required
                />
              )}
            />
          </Grid>
          
        <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="shippingAddress.country"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Country"
                  placeholder="United States"
                  error={errors.shippingAddress?.country?.message || ''}
                  fullWidth
                  required
                />
              )}
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
        <Controller
          name="useSameAddress"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={<Checkbox {...field} checked={field.value} />}
              label="Billing address is the same as shipping address"
            />
          )}
        />

        {!useSameAddress && (
          <>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Billing Address
            </Typography>
            <Grid container spacing={2}>
              
        <Grid size={{ xs: 12 }}>
                <Controller
                  name="billingAddress.street"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Street Address"
                      placeholder="123 Main St, Apt 4B"
                      error={errors.billingAddress?.street?.message || ''}
                      fullWidth
                      required
                    />
                  )}
                />
              </Grid>
              
        <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="billingAddress.city"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="City"
                      placeholder="New York"
                      error={errors.billingAddress?.city?.message || ''}
                      fullWidth
                      required
                    />
                  )}
                />
              </Grid>
              
        <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="billingAddress.state"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="State/Province"
                      placeholder="NY"
                      error={errors.billingAddress?.state?.message || ''}
                      fullWidth
                      required
                    />
                  )}
                />
              </Grid>
              
        <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="billingAddress.postalCode"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Postal Code"
                      placeholder="10001"
                      error={errors.billingAddress?.postalCode?.message || ''}
                      fullWidth
                      required
                    />
                  )}
                />
              </Grid>
              
        <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="billingAddress.country"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Country"
                      placeholder="United States"
                      error={errors.billingAddress?.country?.message || ''}
                      fullWidth
                      required
                    />
                  )}
                />
              </Grid>
            </Grid>
          </>
        )}
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        {onBack && (
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          style={{ marginLeft: 'auto' }}
        >
          Continue to Shipping
        </Button>
      </Box>
    </form>
  );
}
