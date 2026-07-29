import { baseApi } from '../../../services/api/baseApi';
import { API_TAGS } from '../../../constants';
import type {
  UserProfile,
  ProfileUpdateData,
  PasswordChangeData,
  AddressCreateData,
  AddressUpdateData,
  UserAddress,
} from '../types';

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<UserProfile, void>({
      query: () => '/auth/me',
      transformResponse: (response: { user: UserProfile }) => response.user,
      providesTags: [API_TAGS.PROFILE, API_TAGS.USER],
    }),

    updateProfile: builder.mutation<UserProfile, ProfileUpdateData>({
      query: (data) => ({
        url: '/auth/me',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: [API_TAGS.PROFILE, API_TAGS.USER],
    }),

    changePassword: builder.mutation<void, PasswordChangeData>({
      query: (data) => ({
        url: '/auth/password-reset',
        method: 'POST',
        body: { token: '', newPassword: data.newPassword },
      }),
    }),

    uploadAvatar: builder.mutation<{ avatarUrl: string }, FormData>({
      query: (formData) => ({
        url: '/auth/me/avatar',
        method: 'POST',
        body: formData,
        prepareHeaders: (headers: Headers) => {
          headers.delete('Content-Type');
          return headers;
        },
      }),
      invalidatesTags: [API_TAGS.PROFILE, API_TAGS.USER],
    }),

    getAddresses: builder.query<UserAddress[], void>({
      query: () => '/auth/me/addresses',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Profile' as const, id })),
              { type: 'Profile' as const, id: 'ADDRESSES' },
            ]
          : [{ type: 'Profile' as const, id: 'ADDRESSES' }],
    }),

    addAddress: builder.mutation<UserAddress, AddressCreateData>({
      query: (data) => ({
        url: '/auth/me/addresses',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: API_TAGS.PROFILE, id: 'ADDRESSES' }],
    }),

    updateAddress: builder.mutation<UserAddress, AddressUpdateData>({
      query: ({ id, ...data }) => ({
        url: `/auth/me/addresses/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Profile' as const, id },
        { type: 'Profile' as const, id: 'ADDRESSES' },
      ],
    }),

    deleteAddress: builder.mutation<void, string>({
      query: (id) => ({
        url: `/auth/me/addresses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Profile' as const, id },
        { type: 'Profile' as const, id: 'ADDRESSES' },
      ],
    }),

    setDefaultAddress: builder.mutation<UserAddress, string>({
      query: (id) => ({
        url: `/auth/me/addresses/${id}/default`,
        method: 'PUT',
      }),
      invalidatesTags: [{ type: API_TAGS.PROFILE, id: 'ADDRESSES' }],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useUploadAvatarMutation,
  useGetAddressesQuery,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useSetDefaultAddressMutation,
} = profileApi;
