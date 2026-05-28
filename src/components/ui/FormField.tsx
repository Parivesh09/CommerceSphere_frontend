/**
 * FormField Component
 * 
 * A reusable form field component that integrates with React Hook Form
 * and displays inline error messages with proper accessibility.
 * 
 * Validates: Requirements 19.1, 19.2, 19.3
 */

import { forwardRef } from 'react';
import { TextField, TextFieldProps, } from '@mui/material';
import type { FieldError } from 'react-hook-form';

export interface FormFieldProps extends Omit<TextFieldProps, 'error' | 'helperText'> {
  /**
   * Field error from React Hook Form
   */
  error?: FieldError;
  /**
   * Whether async validation is in progress
   */
  isValidating?: boolean;
  /**
   * Custom helper text to show when no error
   */
  helperText?: string;
}

/**
 * FormField component with inline error display and validation state
 * 
 * @example
 * ```tsx
 * <FormField
 *   label="Email"
 *   {...register('email')}
 *   error={errors.email}
 *   isValidating={isValidatingEmail}
 * />
 * ```
 */
export const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
  ({ error,  helperText, ...props }, ref) => {
    const hasError = !!error;
    const displayHelperText = hasError ? error.message : helperText;

    return (
      <TextField
        ref={ref}
        error={hasError}
        helperText={displayHelperText}










        {...props}
      />
    );
  }
);

FormField.displayName = 'FormField';
