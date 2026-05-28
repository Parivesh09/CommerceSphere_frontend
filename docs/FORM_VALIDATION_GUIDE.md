# Form Validation System Guide

## Overview

This document describes the comprehensive form validation system implemented in the premium e-commerce frontend. The system uses **Zod** for schema validation, **React Hook Form** for form state management, and custom hooks for async validation with debouncing.

**Validates: Requirements 19.1, 19.2, 19.3, 19.4, 19.5**

## Features

### ✅ 1. Zod Schema Validation

All forms use Zod schemas for type-safe validation with automatic TypeScript type inference.

**Location:** `src/features/*/validation/index.ts`

**Example:**
```typescript
import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
```

### ✅ 2. React Hook Form Integration

All forms use React Hook Form with Zod resolver for seamless integration.

**Example:**
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm<LoginFormData>({
  resolver: zodResolver(loginSchema),
  mode: 'onBlur', // Validate on blur
});
```

### ✅ 3. Inline Error Message Display

All form fields display inline error messages below the input with proper ARIA attributes for accessibility.

**Example:**
```tsx
<TextField
  fullWidth
  label="Email"
  {...register('email')}
  error={!!errors.email}
  helperText={errors.email?.message}
/>
```

### ✅ 4. Async Validation with Debouncing

Custom `useAsyncValidation` hook provides debounced async validation for checking email/username availability.

**Location:** `src/hooks/useAsyncValidation.ts`

**Example:**
```typescript
import { useAsyncValidation } from '../../../hooks';
import { useLazyCheckEmailAvailabilityQuery } from '../api';

const [checkEmail] = useLazyCheckEmailAvailabilityQuery();

const { isValidating, validate } = useAsyncValidation({
  validationFn: async (email: string) => {
    if (!email || !email.includes('@')) return true;
    
    const result = await checkEmail(email).unwrap();
    return result.available || 'This email is already registered';
  },
  debounceMs: 500,
});


<TextField
  {...register('email', { validate })}
  helperText={
    errors.email?.message || 
    (isValidating ? 'Checking availability...' : '')
  }
/>
```

### ✅ 5. Form Submission Prevention

React Hook Form automatically prevents form submission when validation errors exist.

**Example:**
```typescript
const {
  formState: { isValid, isSubmitting },
} = useForm({
  resolver: zodResolver(schema),
  mode: 'onChange',
});

<Button
  type="submit"
  disabled={!isValid || isSubmitting}
>
  Submit
</Button>
```

### ✅ 6. Field-Level and Form-Level Validation

- **Field-level:** Individual field validation rules in Zod schema
- **Form-level:** Cross-field validation using `.refine()`

**Example:**
```typescript
const schema = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });
```

## Validation Schemas by Feature

### Auth Forms
- **Location:** `src/features/auth/validation/index.ts`
- **Schemas:**
  - `loginSchema` - Email and password validation
  - `registerSchema` - Registration with password strength and confirmation

### Checkout Forms
- **Location:** `src/features/checkout/validation/index.ts`
- **Schemas:**
  - `addressSchema` - Address validation
  - `shippingAddressSchema` - Shipping and billing addresses
  - `shippingMethodSchema` - Shipping method selection
  - `paymentMethodSchema` - Payment method and card details
  - `checkoutSchema` - Complete checkout validation

### Profile Forms
- **Location:** `src/features/profile/validation/index.ts`
- **Schemas:**
  - `profileUpdateSchema` - Profile information updates
  - `passwordChangeSchema` - Password change with strength validation
  - `addressSchema` - Address management

### Admin Forms
- **Location:** `src/features/admin/validation/index.ts`
- **Schemas:**
  - `createProductSchema` - Product creation with images and variants
  - `updateProductSchema` - Product updates

## Validation Utilities

**Location:** `src/utils/validation.ts`

Common validation helper functions:

- `isValidEmail(email)` - Email format validation
- `validatePasswordStrength(password)` - Password strength analysis
- `isValidPhoneNumber(phone)` - Phone number validation
- `isValidPostalCode(postalCode)` - Postal code validation
- `isValidCreditCard(cardNumber)` - Credit card validation with Luhn algorithm
- `isValidUrl(url)` - URL format validation
- `sanitizeInput(input)` - XSS prevention
- `isValidFileSize(file, maxSizeMB)` - File size validation
- `isValidFileType(file, allowedTypes)` - File type validation
- `validateImageDimensions(file, maxWidth, maxHeight)` - Image dimension validation
- And many more...

## Async Validation Hook

**Location:** `src/hooks/useAsyncValidation.ts`

### Features:
- ✅ Debouncing (default 500ms)
- ✅ Request cancellation on new input
- ✅ Loading state management
- ✅ Error state management
- ✅ Abort controller for cleanup

### API:
```typescript
interface UseAsyncValidationOptions<T> {
  validationFn: (value: T) => Promise<boolean | string>;
  debounceMs?: number;
  enabled?: boolean;
}

interface UseAsyncValidationResult {
  isValidating: boolean;
  error: string | null;
  validate: (value: any) => Promise<boolean | string>;
  clear: () => void;
}
```

## API Endpoints for Async Validation

**Location:** `src/features/auth/api/index.ts`

### Endpoints:
- `checkEmailAvailability(email)` - Check if email is available
- `checkUsernameAvailability(username)` - Check if username is available

### Usage:
```typescript
const [checkEmail] = useLazyCheckEmailAvailabilityQuery();

const result = await checkEmail('user@example.com').unwrap();

```

## Validation Demo

**Location:** `src/features/auth/components/ValidationDemo.tsx`

A comprehensive demo component showcasing all validation features:
- Zod schema validation
- Inline error messages
- Async validation with debouncing
- Password strength indicator
- Form-level validation
- Submission prevention

## Best Practices

### 1. Always Use Zod Schemas
```typescript

const schema = z.object({
  email: z.string().email(),
});


const validate = (email) => {
  if (!email.includes('@')) return 'Invalid email';
};
```

### 2. Use Type Inference
```typescript

export type FormData = z.infer<typeof schema>;


export interface FormData {
  email: string;
}
```

### 3. Debounce Async Validation
```typescript

useAsyncValidation({
  validationFn: checkEmail,
  debounceMs: 500,
});


register('email', {
  validate: async (email) => await checkEmail(email),
});
```

### 4. Show Validation State
```typescript

<TextField
  helperText={
    error?.message || 
    (isValidating ? 'Checking...' : '')
  }
/>


<TextField
  helperText={error?.message}
/>
```

### 5. Prevent Invalid Submission
```typescript

<Button
  type="submit"
  disabled={!isValid || isSubmitting}
>
  Submit
</Button>


<Button type="submit">
  Submit
</Button>
```

## Validation Modes

React Hook Form supports different validation modes:

- `onSubmit` (default) - Validate on form submission
- `onBlur` - Validate when field loses focus
- `onChange` - Validate on every change
- `onTouched` - Validate on first blur, then on every change
- `all` - Validate on blur and change

**Recommendation:** Use `onBlur` for better UX (less intrusive) or `onChange` for immediate feedback.

## Error Handling

### Field Errors
```typescript
{errors.email && (
  <p className="text-red-600">{errors.email.message}</p>
)}
```

### Form-Level Errors
```typescript
{Object.keys(errors).length > 0 && (
  <Alert severity="error">
    Please fix validation errors
  </Alert>
)}
```

### API Errors
```typescript
const [register, { error }] = useRegisterMutation();

{error && (
  <Alert severity="error">
    Registration failed. Please try again.
  </Alert>
)}
```

## Accessibility

All form validation includes proper accessibility features:

- ✅ ARIA labels on all inputs
- ✅ `aria-invalid` on error fields
- ✅ `aria-describedby` linking errors to fields
- ✅ `role="alert"` on error messages
- ✅ Keyboard navigation support
- ✅ Screen reader announcements

## Testing

### Unit Tests
Test Zod schemas with valid and invalid inputs:

```typescript
describe('loginSchema', () => {
  it('should validate correct email', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: 'Password123',
    });
    expect(result.success).toBe(true);
  });

  it('should reject invalid email', () => {
    const result = loginSchema.safeParse({
      email: 'invalid',
      password: 'Password123',
    });
    expect(result.success).toBe(false);
  });
});
```

### Integration Tests
Test form submission with validation:

```typescript
it('should prevent submission with invalid data', async () => {
  render(<LoginForm />);
  
  const submitButton = screen.getByRole('button', { name: /submit/i });
  fireEvent.click(submitButton);
  
  expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
});
```

## Summary

The form validation system provides:

1. ✅ **Type-safe validation** with Zod schemas
2. ✅ **Seamless integration** with React Hook Form
3. ✅ **Inline error messages** with accessibility
4. ✅ **Async validation** with debouncing for email/username checks
5. ✅ **Automatic submission prevention** when errors exist
6. ✅ **Field-level and form-level** validation
7. ✅ **Comprehensive utilities** for common validation patterns
8. ✅ **Excellent UX** with loading states and clear feedback

All requirements (19.1, 19.2, 19.3, 19.4, 19.5) are fully implemented and documented.
