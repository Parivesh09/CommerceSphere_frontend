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

/**
 * Profile API endpoints
 * 
 * Provides user profile management endpoints using RTK Query endpoint injection.
 * All endpoints automatically include authentication tokens via baseApi configuration.
 * 
 * Validates: Requirements 3.1
 */
export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Get user profile
     * Fetches the authenticated user's complete profile
     */
    getProfile: builder.query<UserProfile, void>({
      query: () => '/users/profile',
      providesTags: [API_TAGS.PROFILE, API_TAGS.USER],
    }),

    /**
     * Update user profile
     * Updates basic profile information (name, phone, avatar)
     */
    updateProfile: builder.mutation<UserProfile, ProfileUpdateData>({
      query: (data) => ({
        url: '/users/profile',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: [API_TAGS.PROFILE, API_TAGS.USER],
    }),

    /**
     * Change password
     * Updates the user's password
     */
    changePassword: builder.mutation<void, PasswordChangeData>({
      query: (data) => ({
        url: '/users/profile/password',
        method: 'PUT',
        body: data,
      }),
    }),

    /**
     * Upload avatar
     * Uploads a new profile avatar image
     */
    uploadAvatar: builder.mutation<{ avatarUrl: string }, FormData>({
      query: (formData) => ({
        url: '/users/profile/avatar',
        method: 'POST',
        body: formData,

        prepareHeaders: (headers: Headers) => {
          headers.delete('Content-Type');
          return headers;
        },
      }),
      invalidatesTags: ['Profile', 'User'],
    }),

    /**
     * Get user addresses
     * Fetches all addresses for the authenticated user
     */
    getAddresses: builder.query<UserAddress[], void>({
      query: () => '/users/profile/addresses',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Profile' as const, id })),
              { type: 'Profile' as const, id: 'ADDRESSES' },
            ]
          : [{ type: 'Profile' as const, id: 'ADDRESSES' }],
    }),

    /**
     * Add address
     * Creates a new address for the user
     */
    addAddress: builder.mutation<UserAddress, AddressCreateData>({
      query: (data) => ({
        url: '/users/profile/addresses',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: API_TAGS.PROFILE, id: 'ADDRESSES' }],
    }),

    /**
     * Update address
     * Updates an existing address
     */
    updateAddress: builder.mutation<UserAddress, AddressUpdateData>({
      query: ({ id, ...data }) => ({
        url: `/users/profile/addresses/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Profile' as const, id },
        { type: 'Profile' as const, id: 'ADDRESSES' },
      ],
    }),

    /**
     * Delete address
     * Removes an address from the user's profile
     */
    deleteAddress: builder.mutation<void, string>({
      query: (id) => ({
        url: `/users/profile/addresses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Profile' as const, id },
        { type: 'Profile' as const, id: 'ADDRESSES' },
      ],
    }),

    /**
     * Set default address
     * Marks an address as the default
     */
    setDefaultAddress: builder.mutation<UserAddress, string>({
      query: (id) => ({
        url: `/users/profile/addresses/${id}/default`,
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
