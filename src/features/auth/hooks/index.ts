import { useAppSelector } from '../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { logout as logoutAction } from '../../../store/slices/authSlice';
import { useLogoutMutation } from '../api';
import { useCallback } from 'react';
import { baseApi } from '../../../services/api/baseApi';

/**
 * Hook to access authentication state
 * 
 * Provides convenient access to auth state from Redux store
 * Validates: Requirements 3.1, 3.3
 */
export const useAuth = () => {
  const auth = useAppSelector((state) => state.auth);
  
  return {
    user: auth.user,
    accessToken: auth.accessToken,
    refreshToken: auth.refreshToken,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    isAdmin: auth.user?.role === 'admin',
    isCustomer: auth.user?.role === 'customer',
  };
};

/**
 * Hook to handle logout functionality
 * 
 * Provides a logout function that:
 * 1. Calls the logout API endpoint
 * 2. Clears Redux auth state
 * 3. Invalidates all API caches
 * 
 * Validates: Requirements 3.4, 3.5
 */
export const useLogout = () => {
  const dispatch = useAppDispatch();
  const [logoutMutation] = useLogoutMutation();

  const logout = useCallback(async () => {
    try {

      await logoutMutation().unwrap();
    } catch (error) {

      console.error('Logout API call failed:', error);
    } finally {

      dispatch(logoutAction());
      

      dispatch(baseApi.util.resetApiState());
    }
  }, [dispatch, logoutMutation]);

  return logout;
};

/**
 * Hook to check if user has required role
 * 
 * Validates: Requirements 10.5
 */
export const useRequireRole = (requiredRole: 'admin' | 'customer' | 'moderator') => {
  const { user, isAuthenticated } = useAuth();
  
  const hasRole = isAuthenticated && user?.role === requiredRole;
  
  return {
    hasRole,
    isAuthenticated,
    userRole: user?.role,
  };
};
