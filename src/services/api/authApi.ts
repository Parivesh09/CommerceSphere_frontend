import { baseApi } from './baseApi';
import type { User, LoginFormData, RegisterFormData, ApiResponse } from '../../types';
import { setCredentials, logout } from '../../store/slices/authSlice';

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<ApiResponse<AuthResponse>, LoginFormData>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response: AuthResponse): ApiResponse<AuthResponse> => ({
        data: response,
        success: true,
      }),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.data) {
            dispatch(
              setCredentials({
                user: data.data.user,
                accessToken: data.data.accessToken,
                refreshToken: data.data.refreshToken,
              })
            );
          }
        } catch {
        }
      },
      invalidatesTags: [{ type: 'Auth', id: 'CURRENT' }, { type: 'Profile', id: 'USER' }],
    }),

    register: builder.mutation<ApiResponse<AuthResponse>, RegisterFormData>({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
      transformResponse: (response: AuthResponse): ApiResponse<AuthResponse> => ({
        data: response,
        success: true,
      }),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.data?.accessToken) {
            dispatch(
              setCredentials({
                user: data.data.user,
                accessToken: data.data.accessToken,
                refreshToken: data.data.refreshToken,
              })
            );
          }
        } catch {
        }
      },
      invalidatesTags: [{ type: 'Auth', id: 'CURRENT' }],
    }),

    getCurrentUser: builder.query<ApiResponse<User>, void>({
      query: () => '/auth/me',
      transformResponse: (response: { user: User }): ApiResponse<User> => ({
        data: response.user,
        success: true,
      }),
      providesTags: [{ type: 'Profile', id: 'USER' }],
    }),

    updateProfile: builder.mutation<ApiResponse<User>, Partial<User>>({
      query: (profileData) => ({
        url: '/auth/profile',
        method: 'PUT',
        body: profileData,
      }),
      transformResponse: (response: { user: User }): ApiResponse<User> => ({
        data: response.user,
        success: true,
      }),
      invalidatesTags: [{ type: 'Profile', id: 'USER' }],
    }),

    logoutUser: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          dispatch(logout());
        }
      },
      invalidatesTags: [{ type: 'Auth', id: 'CURRENT' }],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetCurrentUserQuery,
  useUpdateProfileMutation,
  useLogoutUserMutation,
} = authApi;