import { baseApi } from './baseApi';

export const passwordApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    requestPasswordReset: builder.mutation<{ message: string }, { email: string }>({
      query: (data) => ({
        url: '/auth/password-reset-request',
        method: 'POST',
        body: data,
      }),
    }),

    resetPassword: builder.mutation<{ message: string }, { token: string; newPassword: string }>({
      query: (data) => ({
        url: '/auth/password-reset',
        method: 'POST',
        body: data,
      }),
    }),

    changePassword: builder.mutation<{ message: string }, { currentPassword: string; newPassword: string }>({
      query: (data) => ({
        url: '/auth/me/password',
        method: 'PUT',
        body: data,
      }),
    }),
  }),
});

export const {
  useRequestPasswordResetMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
} = passwordApi;
