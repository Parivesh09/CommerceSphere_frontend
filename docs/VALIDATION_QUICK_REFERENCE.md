# Form Validation Quick Reference

## Quick Start

### 1. Create a Zod Schema

```typescript
import { z } from 'zod';

const mySchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Min 8 characters'),
});

export type MyFormData = z.infer<typeof mySchema>;
```

### 2. Use in React Hook Form

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const {
  register,
  handleSubmit,
  formState: { errors, isValid },
} = useForm<MyFormData>({
  resolver: zodResolver(mySchema),
  mode: 'onBlur',
});
```

### 3. Display Inline Errors

```tsx
<TextField
  {...register('email')}
  error={!!errors.email}
  helperText={errors.email?.message}
/>
```

### 4. Add Async Validation

```typescript
import { useAsyncValidation } from '@/hooks';

const { isValidating, validate } = useAsyncValidation({
  validationFn: async (email: string) => {
    const result = await checkEmail(email);
    return result.available || 'Email taken';
  },
  debounceMs: 500,
});

<TextField
  {...register('email', { validate })}
  helperText={
    errors.email?.message || 
    (isValidating ? 'Checking...' : '')
  }
/>
```

### 5. Prevent Invalid Submission

```tsx
<Button
  type="submit"
  disabled={!isValid || isSubmitting}
>
  Submit
</Button>
```

## Common Patterns

### Password Confirmation

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

### Conditional Validation

```typescript
const schema = z.object({
  price: z.number().positive(),
  compareAtPrice: z.number().positive().optional(),
}).refine(
  (data) => !data.compareAtPrice || data.compareAtPrice > data.price,
  {
    message: 'Compare price must be greater than price',
    path: ['compareAtPrice'],
  }
);
```

### Number Validation

```typescript
age: z
  .number({ invalid_type_error: 'Must be a number' })
  .int('Must be whole number')
  .min(18, 'Must be 18+')
  .max(120, 'Invalid age')


<TextField
  type="number"
  {...register('age', { valueAsNumber: true })}
/>
```

### Array Validation

```typescript
tags: z.array(z.string()).min(1, 'At least one tag required')
```

### Optional Fields

```typescript
phone: z.string().optional().or(z.literal(''))
```

## Validation Utilities

```typescript
import {
  isValidEmail,
  validatePasswordStrength,
  isValidPhoneNumber,
  isValidCreditCard,
} from '@/utils';


if (isValidEmail(email)) { /* ... */ }


const strength = validatePasswordStrength(password);



if (isValidPhoneNumber(phone)) { /* ... */ }


if (isValidCreditCard(cardNumber)) { /* ... */ }
```

## Validation Modes

```typescript
mode: 'onSubmit'  // Validate on submit (default)
mode: 'onBlur'    // Validate on blur (recommended)
mode: 'onChange'  // Validate on every change
mode: 'onTouched' // Validate on blur, then on change
mode: 'all'       // Validate on blur and change
```

## Error Display Patterns

### Basic Error

```tsx
{errors.email && (
  <p className="text-red-600">{errors.email.message}</p>
)}
```

### With Material UI

```tsx
<TextField
  error={!!errors.email}
  helperText={errors.email?.message}
/>
```

### Form-Level Errors

```tsx
{Object.keys(errors).length > 0 && (
  <Alert severity="error">
    Please fix validation errors
  </Alert>
)}
```

## Async Validation Hook API

```typescript
const {
  isValidating,  // boolean - validation in progress
  error,         // string | null - error message
  validate,      // function - trigger validation
  clear,         // function - clear state
} = useAsyncValidation({
  validationFn: async (value) => {


    return result.valid || 'Error message';
  },
  debounceMs: 500,    // optional, default 500
  enabled: true,      // optional, default true
});
```

## Common Zod Patterns

```typescript

z.string().min(1, 'Required')


z.string().email('Invalid email')


z.string().min(3).max(20)


z.string().regex(/^[a-zA-Z0-9]+$/, 'Alphanumeric only')


z.number().min(0).max(100)


z.enum(['option1', 'option2'])


z.string().optional()


z.string().nullable()


z.string().default('default')


z.string().transform((val) => val.toLowerCase())


z.string().refine((val) => val !== 'admin', {
  message: 'Cannot use admin',
})
```

## File Locations

- **Schemas:** `src/features/*/validation/index.ts`
- **Async Hook:** `src/hooks/useAsyncValidation.ts`
- **Utilities:** `src/utils/validation.ts`
- **Demo:** `src/features/auth/components/ValidationDemo.tsx`
- **Guide:** `frontend/FORM_VALIDATION_GUIDE.md`

## Resources

- [Zod Documentation](https://zod.dev/)
- [React Hook Form Documentation](https://react-hook-form.com/)
- [Form Validation Guide](./FORM_VALIDATION_GUIDE.md)
- [Task 23 Summary](./TASK_23_SUMMARY.md)
