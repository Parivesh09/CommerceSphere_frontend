/**
 * Hook for async validation with debouncing
 * Validates: Requirements 19.4
 */

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseAsyncValidationOptions<T> {
  /**
   * The validation function that returns a promise
   * Should return true if valid, or an error message string if invalid
   */
  validationFn: (value: T) => Promise<boolean | string>;
  /**
   * Debounce delay in milliseconds
   */
  debounceMs?: number;
  /**
   * Whether validation is enabled
   */
  enabled?: boolean;
}

export interface UseAsyncValidationResult {
  /**
   * Whether validation is currently in progress
   */
  isValidating: boolean;
  /**
   * Error message if validation failed, null if valid or not yet validated
   */
  error: string | null;
  /**
   * Function to trigger validation manually
   */
  validate: (value: unknown) => Promise<boolean | string>;
  /**
   * Function to clear validation state
   */
  clear: () => void;
}

/**
 * Hook for async validation with debouncing
 * 
 * @example
 * ```tsx
 * const { isValidating, error, validate } = useAsyncValidation({
 *   validationFn: async (email) => {
 *     const response = await checkEmailAvailability(email);
 *     return response.available || 'Email is already taken';
 *   },
 *   debounceMs: 500,
 * });
 * 
 * // In React Hook Form
 * <TextField
 *   {...register('email', {
 *     validate: validate
 *   })}
 *   error={!!error}
 *   helperText={error || (isValidating ? 'Checking...' : '')}
 * />
 * ```
 */
export function useAsyncValidation<T = string>({
  validationFn,
  debounceMs = 500,
  enabled = true,
}: UseAsyncValidationOptions<T>): UseAsyncValidationResult {
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);


  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const validate = useCallback(
    async (value: unknown): Promise<boolean | string> => {
      if (!enabled) {
        return true;
      }


      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }


      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }


      return new Promise((resolve) => {
        timeoutRef.current = setTimeout(async () => {
          setIsValidating(true);
          setError(null);


          abortControllerRef.current = new AbortController();

          try {
            const result = await validationFn(value as T);
            

            if (abortControllerRef.current.signal.aborted) {
              resolve(true);
              return;
            }

            if (result === true) {
              setError(null);
              resolve(true);
            } else {
              const errorMessage = typeof result === 'string' ? result : 'Validation failed';
              setError(errorMessage);
              resolve(errorMessage);
            }
          } catch (err) {

            if (abortControllerRef.current?.signal.aborted) {
              resolve(true);
              return;
            }

            const errorMessage = err instanceof Error ? err.message : 'Validation failed';
            setError(errorMessage);
            resolve(errorMessage);
          } finally {
            setIsValidating(false);
          }
        }, debounceMs);
      });
    },
    [validationFn, debounceMs, enabled]
  );

  const clear = useCallback(() => {
    setIsValidating(false);
    setError(null);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  return {
    isValidating,
    error,
    validate,
    clear,
  };
}
