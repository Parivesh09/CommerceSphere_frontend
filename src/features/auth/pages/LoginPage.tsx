import { Container, Paper, Typography, TextField, Button, Box, Alert } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLoginMutation } from '../api';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { setCredentials } from '../../../store/slices/authSlice';
import toast from 'react-hot-toast';
import { ROUTES } from '../../../constants';
import { loginSchema, type LoginFormData } from '../validation';

/**
 * Login Page Component
 * 
 * Provides user authentication with form validation using Zod and React Hook Form.
 * Automatically redirects to the previous page after successful login.
 * 
 * Validates: Requirements 3.1, 3.3, 19.1, 19.2, 19.3
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [login, { isLoading, error }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await login(data).unwrap();
      dispatch(setCredentials(result));
      toast.success('Login successful!');
      

      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || ROUTES.HOME;
      navigate(from, { replace: true });
    } catch {
      toast.error('Login failed. Please check your credentials.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Login
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Login failed. Please check your credentials and try again.
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }} noValidate>
          <TextField
            fullWidth
            label="Email"
            type="email"
            margin="normal"
            autoComplete="email"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            autoComplete="current-password"
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3 }}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
          <Button 
            fullWidth 
            sx={{ mt: 2 }} 
            onClick={() => navigate(ROUTES.REGISTER)}
            disabled={isLoading}
          >
            Don't have an account? Register
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
