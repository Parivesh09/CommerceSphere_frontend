import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { passwordChangeSchema, type PasswordChangeFormData } from '../validation';
import { useChangePasswordMutation } from '../api';
import toast from 'react-hot-toast';

interface PasswordChangeFormProps {
  onSuccess?: () => void;
}

/**
 * Password Change Form Component
 * 
 * Allows users to change their password with validation.
 * Validates: Requirements 3.1
 */
export default function PasswordChangeForm({ onSuccess }: PasswordChangeFormProps) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<PasswordChangeFormData>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: PasswordChangeFormData) => {
    try {
      await changePassword(data).unwrap();
      toast.success('Password changed successfully');
      reset();
      onSuccess?.();
    } catch (error) {
      const err = error as { data?: { message?: string; errors?: Record<string, string> } };
      if (err?.data?.message === 'Current password is incorrect') {
        setError('currentPassword', {
          type: 'server',
          message: 'Current password is incorrect',
        });
      } else if (err?.data?.errors) {

        Object.entries(err.data.errors).forEach(([field, message]) => {
          setError(field as keyof PasswordChangeFormData, {
            type: 'server',
            message: message as string,
          });
        });
      } else {
        toast.error(err?.data?.message || 'Failed to change password');
      }
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Alert severity="info" sx={{ mb: 3 }}>
        Password must be at least 8 characters and include uppercase, lowercase, number, and
        special character.
      </Alert>

      {/* Current Password */}
      <TextField
        {...register('currentPassword')}
        label="Current Password"
        type={showCurrentPassword ? 'text' : 'password'}
        fullWidth
        margin="normal"
        error={!!errors.currentPassword}
        helperText={errors.currentPassword?.message}
        disabled={isLoading}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle current password visibility"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  edge="end"
                >
                  {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

      {/* New Password */}
      <TextField
        {...register('newPassword')}
        label="New Password"
        type={showNewPassword ? 'text' : 'password'}
        fullWidth
        margin="normal"
        error={!!errors.newPassword}
        helperText={errors.newPassword?.message}
        disabled={isLoading}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle new password visibility"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  edge="end"
                >
                  {showNewPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

      {/* Confirm Password */}
      <TextField
        {...register('confirmPassword')}
        label="Confirm New Password"
        type={showConfirmPassword ? 'text' : 'password'}
        fullWidth
        margin="normal"
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message}
        disabled={isLoading}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle confirm password visibility"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  edge="end"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

      {/* Submit Button */}
      <Box sx={{ mt: 3 }}>
        <Button type="submit" variant="contained" disabled={isLoading} fullWidth>
          {isLoading ? <CircularProgress size={24} /> : 'Change Password'}
        </Button>
      </Box>
    </Box>
  );
}
