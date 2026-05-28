import { Container, Paper, Typography, TextField, Button, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRegisterMutation, type RegisterData, useLazyCheckEmailAvailabilityQuery } from '../api';
import toast from 'react-hot-toast';
import { ROUTES } from '../../../constants';
import { registerSchema, type RegisterFormData } from '../validation';
import { useAsyncValidation } from '../../../hooks';

/**
 * Register Page Component
 * 
 * Provides user registration with comprehensive form validation using Zod and React Hook Form.
 * Includes async email validation with debouncing to check email availability.
 * Validates password strength and confirmation matching.
 * 
 * Validates: Requirements 3.1, 19.1, 19.2, 19.3, 19.4
 */
export default function RegisterPage() {
  const navigate = useNavigate();
  const [register, { isLoading, error }] = useRegisterMutation();
  const [checkEmail] = useLazyCheckEmailAvailabilityQuery();

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
  });


  const { isValidating: isValidatingEmail, validate: validateEmail } = useAsyncValidation({
    validationFn: async (email: string) => {

      if (!email || !email.includes('@')) {
        return true;
      }

      try {
        const result = await checkEmail(email).unwrap();
        return result.available || 'This email is already registered';
      } catch {

        return true;
      }
    },
    debounceMs: 500,
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {


      const { confirmPassword, ...registerData } = data;
      await register(registerData as RegisterData).unwrap();
      toast.success('Registration successful! Please login.');
      navigate(ROUTES.LOGIN);
    } catch {
      toast.error('Registration failed. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Register
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Registration failed. Please check your information and try again.
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }} noValidate>
          <TextField
            fullWidth
            label="Name"
            margin="normal"
            autoComplete="name"
            {...registerField('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            margin="normal"
            autoComplete="email"
            {...registerField('email', {
              validate: validateEmail,
            })}
            error={!!errors.email}
            helperText={
              errors.email?.message || 
              (isValidatingEmail ? 'Checking email availability...' : '')
            }
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            autoComplete="new-password"
            {...registerField('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            margin="normal"
            autoComplete="new-password"
            {...registerField('confirmPassword')}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3 }}
            disabled={isLoading}
          >
            {isLoading ? 'Registering...' : 'Register'}
          </Button>
          <Button 
            fullWidth 
            sx={{ mt: 2 }} 
            onClick={() => navigate(ROUTES.LOGIN)}
            disabled={isLoading}
          >
            Already have an account? Login
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
