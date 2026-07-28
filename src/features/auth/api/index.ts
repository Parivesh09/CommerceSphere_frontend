import { baseApi } from '../../../services/api/baseApi';
import { API_TAGS } from '../../../constants';
import type { User } from '../../../types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getMe: builder.query<User, void>({
      query: () => '/auth/me',
      transformResponse: (response: { user: User }) => response.user,
      providesTags: [API_TAGS.AUTH, API_TAGS.USER],
    }),

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

    checkEmailAvailability: builder.query<{ available: boolean }, string>({
      query: (email) => ({
        url: '/auth/check-email',
        params: { email },
      }),
    }),

    checkUsernameAvailability: builder.query<{ available: boolean }, string>({
      query: (username) => ({
        url: '/auth/check-username',
        params: { username },
      }),
    }),
  }),
});

export const {
  useGetMeQuery,
  useRefreshTokenMutation,
  useLazyCheckEmailAvailabilityQuery,
  useLazyCheckUsernameAvailabilityQuery,
} = authApi;