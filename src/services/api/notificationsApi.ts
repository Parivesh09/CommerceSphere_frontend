import { baseApi } from './baseApi';

export interface NotificationPreferences {
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  channel: string;
  subject: string;
  content: string;
  status: string;
  sentAt?: string;
  createdAt: string;
}

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotificationPreferences: builder.query<NotificationPreferences, string>({
      query: (userId) => `/notifications/preferences/${userId}`,
      providesTags: (_result, _error, userId) => [{ type: 'Notifications', id: `PREFS_${userId}` }],
    }),

    updateNotificationPreferences: builder.mutation<NotificationPreferences, { userId: string; preferences: Partial<NotificationPreferences> }>({
      query: ({ userId, preferences }) => ({
        url: `/notifications/preferences/${userId}`,
        method: 'PUT',
        body: preferences,
      }),
      invalidatesTags: (_result, _error, { userId }) => [
        { type: 'Notifications', id: `PREFS_${userId}` },
      ],
    }),

    getNotificationHistory: builder.query<Notification[], { userId: string; limit?: number }>({
      query: ({ userId, limit = 50 }) => ({
        url: `/notifications/history/${userId}`,
        params: { limit },
      }),
      providesTags: (_result, _error, { userId }) => [{ type: 'Notifications', id: `HISTORY_${userId}` }],
    }),
  }),
});

export const {
  useGetNotificationPreferencesQuery,
  useUpdateNotificationPreferencesMutation,
  useGetNotificationHistoryQuery,
} = notificationsApi;
