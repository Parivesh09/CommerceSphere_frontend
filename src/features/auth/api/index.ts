import { baseApi } from '../../../services/api/baseApi';
import { API_TAGS } from '../../../constants';
import type { User } from '../../../types';

/**
 * Login credentials type
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Registration data type (without confirmPassword)
 */
export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

/**
 * Auth API endpoints
 * 
 * Provides authentication-related API endpoints using RTK Query endpoint injection.
 * All endpoints automatically include authentication tokens via baseApi configuration.
 * 
 * Validates: Requirements 3.1, 3.2, 3.4, 3.5
 */
export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Login endpoint
     * Returns user data and authentication tokens
     */
    login: builder.mutation<
      { user: User; accessToken: string; refreshToken: string },
      LoginCredentials
    >({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: [API_TAGS.AUTH, API_TAGS.USER],
    }),

    /**
     * Register endpoint
     * Creates a new user account
     */
    register: builder.mutation<{ user: User }, RegisterData>({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: [API_TAGS.AUTH],
    }),

    /**
     * Logout endpoint
     * Invalidates the current session on the server
     */
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: [API_TAGS.AUTH, API_TAGS.USER],
    }),

    /**
     * Get current user endpoint
     * Fetches the authenticated user's profile
     */
    getMe: builder.query<User, void>({
      query: () => '/auth/me',
      providesTags: [API_TAGS.AUTH, API_TAGS.USER],
    }),

    /**
     * Refresh token endpoint
     * Obtains a new access token using the refresh token
     */
    refreshToken: builder.mutation<
      { accessToken: string; refreshToken: string; user: User },
      { refreshToken: string }
    >({
      query: (body) => ({
        url: '/auth/refresh',
        method: 'POST',
        body,
      }),
    }),

    /**
     * Check email availability endpoint
     * Validates if an email is available for registration
     * Validates: Requirements 19.4
     */
    checkEmailAvailability: builder.query<{ available: boolean }, string>({
      query: (email) => ({
        url: '/auth/check-email',
        params: { email },
      }),
    }),

    /**
     * Check username availability endpoint
     * Validates if a username is available for registration
     * Validates: Requirements 19.4
     */
    checkUsernameAvailability: builder.query<{ available: boolean }, string>({
      query: (username) => ({
        url: '/auth/check-username',
        params: { username },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetMeQuery,
  useRefreshTokenMutation,
  useLazyCheckEmailAvailabilityQuery,
  useLazyCheckUsernameAvailabilityQuery,
} = authApi;
