import { useGetProfileQuery } from '../api';
import type { UserProfile } from '../types';

/**
 * Custom hook for accessing user profile
 * 
 * Provides convenient access to the user's profile data with loading and error states.
 * Validates: Requirements 3.1
 */
export function useProfile() {
  const { data: profile, isLoading, error, refetch } = useGetProfileQuery();

  return {
    profile: profile as UserProfile | undefined,
    isLoading,
    error,
    refetch,
  };
}
