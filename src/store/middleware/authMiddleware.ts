import { isRejectedWithValue } from '@reduxjs/toolkit';
import type { Middleware } from '@reduxjs/toolkit';
import type { RootState } from '../index';
import { logout, setCredentials } from '../slices/authSlice';

/**
 * Auth middleware for automatic token refresh
 * 
 * This middleware intercepts 401 responses and attempts to refresh
 * the access token using the refresh token. If successful, it retries
 * the original request. If refresh fails, it logs out the user.
 * 
 * Validates: Requirements 2.5, 3.2
 */
export const authMiddleware: Middleware = (api) => (next) => async (action) => {

  if (isRejectedWithValue(action)) {
    const payload = action.payload as { status?: number };
    
    if (payload?.status === 401) {
      const state = api.getState() as RootState;
      const refreshToken = state.auth.refreshToken;


      const meta = action.meta as { arg?: { endpointName?: string; originalArgs?: unknown } };
      
      if (refreshToken && !meta?.arg?.endpointName?.includes('refresh')) {
        try {

          const refreshResponse = await fetch(`${import.meta.env.VITE_API_GATEWAY_URL}/auth/refresh`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
          });

          if (refreshResponse.ok) {
            const data = await refreshResponse.json();
            const { accessToken, refreshToken: newRefreshToken, user } = data;


            api.dispatch(
              setCredentials({
                user,
                accessToken,
                refreshToken: newRefreshToken || refreshToken,
              })
            );



            if (meta?.arg?.originalArgs) {

              return api.dispatch(meta.arg.originalArgs as any);
            }
          } else {

            api.dispatch(logout());
            

            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
          }
        } catch (error) {

          console.error('Token refresh failed:', error);
          api.dispatch(logout());
          

          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
      } else if (!refreshToken) {

        api.dispatch(logout());
        

        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }
  }

  return next(action);
};
