/**
 * Validation Demo Component
 * 
 * Demonstrates all form validation features:
 * - Zod schema validation
 * - React Hook Form integration
 * - Inline error messages
 * - Async validation with debouncing
 * - Field-level and form-level validation
 * - Prevention of submission with errors
 * 
 * Validates: Requirements 19.1, 19.2, 19.3, 19.4, 19.5
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,

  Chip,
} from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';
import { useAsyncValidation } from '../../../hooks';
import { validatePasswordStrength } from '../../../utils';


const demoSchema = z
  .object({
    username: z
      .string()
      .min(1, 'Username is required')
      .min(3, 'Username must be at least 3 characters')
      .max(20, 'Username must not exceed 20 characters')
      .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Invalid email address'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    age: z
      .number('Age must be a number')
      .int('Age must be a whole number')
      .min(18, 'You must be at least 18 years old')
      .max(120, 'Please enter a valid age'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type DemoFormData = z.infer<typeof demoSchema>;

export function ValidationDemo() {
  const [submitResult, setSubmitResult] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm<DemoFormData>({
    resolver: zodResolver(demoSchema),
    mode: 'onChange', // Validate on every change for demo purposes
  });


  const password = watch('password', '');
  const passwordStrength = password ? validatePasswordStrength(password) : null;


  const { isValidating: isValidatingUsername, validate: validateUsername } = useAsyncValidation({
    validationFn: async (username: string) => {

      if (!username || username.length < 3) {
        return true;
      }


      await new Promise((resolve) => setTimeout(resolve, 1000));


      const takenUsernames = ['admin', 'user', 'test', 'demo'];
      const isTaken = takenUsernames.includes(username.toLowerCase());

      return !isTaken || 'This username is already taken';
    },
    debounceMs: 500,
  });


  const { isValidating: isValidatingEmail, validate: validateEmail } = useAsyncValidation({
    validationFn: async (email: string) => {

      if (!email || !email.includes('@')) {
        return true;
      }


      await new Promise((resolve) => setTimeout(resolve, 800));


      const takenEmails = ['admin@example.com', 'test@example.com'];
      const isTaken = takenEmails.includes(email.toLowerCase());

      return !isTaken || 'This email is already registered';
    },
    debounceMs: 500,
  });

  const onSubmit = async (data: DemoFormData) => {

    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSubmitResult(`Form submitted successfully! Data: ${JSON.stringify(data, null, 2)}`);
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto', my: 4 }}>
      <Typography variant="h5" gutterBottom>
        Form Validation Demo
      </Typography>
      <Typography variant="body2" color="secondary">
        This form demonstrates all validation features including Zod schemas, React Hook Form
        integration, inline errors, async validation with debouncing, and submission prevention.
      </Typography>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 3 }}>
        {/* Username with async validation */}
        <TextField
          fullWidth
          label="Username"
          margin="normal"
          {...register('username', {
            validate: validateUsername,
          })}
          error={!!errors.username}
          helperText={
            errors.username?.message ||
            (isValidatingUsername ? 'Checking username availability...' : 'Try: admin, user, test, demo (taken)')
          }





        />

        {/* Email with async validation */}
        <TextField
          fullWidth
          label="Email"
          type="email"
          margin="normal"
          {...register('email', {
            validate: validateEmail,
          })}
          error={!!errors.email}
          helperText={
            errors.email?.message ||
            (isValidatingEmail ? 'Checking email availability...' : 'Try: admin@example.com, test@example.com (taken)')
          }





        />

        {/* Password with strength indicator */}
        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          {...register('password')}
          error={!!errors.password}
          helperText={errors.password?.message}
        />

        {/* Password strength indicator */}
        {passwordStrength && (
          <Box sx={{ mt: 1, mb: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Password Strength:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
              <Chip
                size="small"
                label="8+ chars"
                color={passwordStrength.hasMinLength ? 'success' : 'default'}
                icon={passwordStrength.hasMinLength ? <CheckCircle /> : <Cancel />}
              />
              <Chip
                size="small"
                label="Uppercase"
                color={passwordStrength.hasUpperCase ? 'success' : 'default'}
                icon={passwordStrength.hasUpperCase ? <CheckCircle /> : <Cancel />}
              />
              <Chip
                size="small"
                label="Lowercase"
                color={passwordStrength.hasLowerCase ? 'success' : 'default'}
                icon={passwordStrength.hasLowerCase ? <CheckCircle /> : <Cancel />}
              />
              <Chip
                size="small"
                label="Number"
                color={passwordStrength.hasNumber ? 'success' : 'default'}
                icon={passwordStrength.hasNumber ? <CheckCircle /> : <Cancel />}
              />
            </Box>
          </Box>
        )}

        {/* Confirm Password */}
        <TextField
          fullWidth
          label="Confirm Password"
          type="password"
          margin="normal"
          {...register('confirmPassword')}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
        />

        {/* Age with number validation */}
        <TextField
          fullWidth
          label="Age"
          type="number"
          margin="normal"
          {...register('age', { valueAsNumber: true })}
          error={!!errors.age}
          helperText={errors.age?.message || 'Must be 18 or older'}
        />

        {/* Form-level validation info */}
        <Box sx={{ mt: 2, mb: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Form Status:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
            <Chip
              size="small"
              label={isDirty ? 'Modified' : 'Pristine'}
              color={isDirty ? 'primary' : 'default'}
            />
            <Chip
              size="small"
              label={isValid ? 'Valid' : 'Invalid'}
              color={isValid ? 'success' : 'error'}
            />
          </Box>
        </Box>

        {/* Submit button - disabled when form is invalid */}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={isSubmitting || !isValid || isValidatingUsername || isValidatingEmail}
          sx={{ mt: 2 }}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Form'}
        </Button>

        {/* Submission result */}
        {submitResult && (
          <Alert severity="success" sx={{ mt: 2 }}>
            <pre style={{ margin: 0, fontSize: '0.75rem' }}>{submitResult}</pre>
          </Alert>
        )}

        {/* Validation errors summary */}
        {Object.keys(errors).length > 0 && (
          <Alert severity="error" sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Please fix the following errors:
            </Typography>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {Object.entries(errors).map(([field, error]) => (
                <li key={field}>
                  <Typography variant="caption">
                    {field}: {error.message}
                  </Typography>
                </li>
              ))}
            </ul>
          </Alert>
        )}
      </Box>
    </Paper>
  );
}
