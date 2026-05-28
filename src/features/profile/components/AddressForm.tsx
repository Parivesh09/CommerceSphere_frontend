import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  CircularProgress,
} from '@mui/material';
import { addressSchema, type AddressFormData } from '../validation';
import { useAddAddressMutation, useUpdateAddressMutation } from '../api';
import type { UserAddress } from '../types';
import toast from 'react-hot-toast';

interface AddressFormProps {
  address?: UserAddress;
  onSuccess?: () => void;
  onCancel?: () => void;
}

/**
 * Address Form Component
 * 
 * Form for adding or editing user addresses.
 * Validates: Requirements 3.1
 */
export default function AddressForm({ address, onSuccess, onCancel }: AddressFormProps) {
  const isEditing = !!address;
  const [addAddress, { isLoading: isAdding }] = useAddAddressMutation();
  const [updateAddress, { isLoading: isUpdating }] = useUpdateAddressMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: address
      ? {
          street: address.street,
          city: address.city,
          state: address.state,
          postalCode: address.postalCode,
          country: address.country,
          label: address.label || '',
          isDefault: address.isDefault,
        }
      : {
          street: '',
          city: '',
          state: '',
          postalCode: '',
          country: '',
          label: '',
          isDefault: false,
        },
  });

  const onSubmit = async (data: AddressFormData) => {
    try {
      if (isEditing) {
        const updateData = {
          id: address.id,
          ...data,
          label: data.label || undefined,
          isDefault: data.isDefault || undefined,
        };
        await updateAddress(updateData).unwrap();
      } else {
        const createData = {
          ...data,
          label: data.label || undefined,
          isDefault: data.isDefault || undefined,
        };
        await addAddress(createData).unwrap();
      }
      onSuccess?.();
    } catch (error) {
      const err = error as { data?: { message?: string; errors?: Record<string, string> } };
      if (err?.data?.errors) {

        Object.entries(err.data.errors).forEach(([field, message]) => {
          setError(field as keyof AddressFormData, {
            type: 'server',
            message: message as string,
          });
        });
      } else {
        toast.error(
          err?.data?.message || `Failed to ${isEditing ? 'update' : 'add'} address`
        );
      }
    }
  };

  const isLoading = isAdding || isUpdating;

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ pt: 2 }}>
      {/* Label */}
      <TextField
        {...register('label')}
        label="Label (Optional)"
        fullWidth
        margin="normal"
        placeholder="e.g., Home, Work"
        error={!!errors.label}
        helperText={errors.label?.message}
        disabled={isLoading}
      />

      {/* Street */}
      <TextField
        {...register('street')}
        label="Street Address"
        fullWidth
        margin="normal"
        error={!!errors.street}
        helperText={errors.street?.message}
        disabled={isLoading}
        required
      />

      {/* City */}
      <TextField
        {...register('city')}
        label="City"
        fullWidth
        margin="normal"
        error={!!errors.city}
        helperText={errors.city?.message}
        disabled={isLoading}
        required
      />

      {/* State and Postal Code */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          {...register('state')}
          label="State/Province"
          fullWidth
          margin="normal"
          error={!!errors.state}
          helperText={errors.state?.message}
          disabled={isLoading}
          required
        />
        <TextField
          {...register('postalCode')}
          label="Postal Code"
          fullWidth
          margin="normal"
          error={!!errors.postalCode}
          helperText={errors.postalCode?.message}
          disabled={isLoading}
          required
        />
      </Box>

      {/* Country */}
      <TextField
        {...register('country')}
        label="Country"
        fullWidth
        margin="normal"
        error={!!errors.country}
        helperText={errors.country?.message}
        disabled={isLoading}
        required
      />

      {/* Set as Default */}
      <FormControlLabel
        control={<Checkbox {...register('isDefault')} disabled={isLoading} />}
        label="Set as default address"
      />

      {/* Action Buttons */}
      <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        {onCancel && (
          <Button onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="contained" disabled={isLoading}>
          {isLoading ? (
            <CircularProgress size={24} />
          ) : isEditing ? (
            'Update Address'
          ) : (
            'Add Address'
          )}
        </Button>
      </Box>
    </Box>
  );
}
