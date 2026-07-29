import { baseApi } from './baseApi';

export interface ReserveInventoryRequest {
  orderId: string;
  items: Array<{ productId: string; variantId?: string; quantity: number }>;
}

export interface ReserveInventoryResponse {
  success: boolean;
  reservations: Array<{ productId: string; quantity: number; reservedUntil: string }>;
  message: string;
}

export const inventoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    reserveInventory: builder.mutation<ReserveInventoryResponse, ReserveInventoryRequest>({
      query: (data) => ({
        url: '/inventory/reserve',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Products', id: 'INVENTORY' }],
    }),

    releaseInventory: builder.mutation<{ success: boolean; message: string }, { orderId: string }>({
      query: ({ orderId }) => ({
        url: '/inventory/release',
        method: 'POST',
        body: { orderId },
      }),
      invalidatesTags: [{ type: 'Products', id: 'INVENTORY' }],
    }),

    convertInventory: builder.mutation<{ success: boolean; message: string }, { orderId: string }>({
      query: ({ orderId }) => ({
        url: '/inventory/convert',
        method: 'POST',
        body: { orderId },
      }),
      invalidatesTags: [{ type: 'Products', id: 'INVENTORY' }],
    }),

    getReservationsByOrder: builder.query<ReserveInventoryResponse, string>({
      query: (orderId) => `/inventory/reservations/${orderId}`,
      providesTags: (_result, _error, orderId) => [{ type: 'Products', id: `RESERVATIONS_${orderId}` }],
    }),
  }),
});

export const {
  useReserveInventoryMutation,
  useReleaseInventoryMutation,
  useConvertInventoryMutation,
  useGetReservationsByOrderQuery,
} = inventoryApi;
