import { baseApi } from './baseApi';
import type { ProductVariant } from '../../types';

export const variantsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProductVariants: builder.query<ProductVariant[], string>({
      query: (productId) => `/products/${productId}/variants`,
      providesTags: (_result, _error, productId) => [{ type: 'Products', id: `VARIANTS_${productId}` }],
    }),

    getVariant: builder.query<ProductVariant, string>({
      query: (id) => `/variants/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Products', id: `VARIANT_${id}` }],
    }),

    createVariant: builder.mutation<ProductVariant, { productId: string; sku: string; attributes: Record<string, string>; price?: number; inventoryQuantity: number }>({
      query: ({ productId, ...data }) => ({
        url: `/products/${productId}/variants`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (_result, _error, { productId }) => [
        { type: 'Products', id: `VARIANTS_${productId}` },
        { type: 'Products', id: productId },
      ],
    }),

    updateVariant: builder.mutation<ProductVariant, { id: string; sku?: string; attributes?: Record<string, string>; price?: number; inventoryQuantity?: number }>({
      query: ({ id, ...data }) => ({
        url: `/variants/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Products', id: `VARIANT_${id}` },
      ],
    }),

    deleteVariant: builder.mutation<void, string>({
      query: (id) => ({
        url: `/variants/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Products'],
    }),
  }),
});

export const {
  useGetProductVariantsQuery,
  useGetVariantQuery,
  useCreateVariantMutation,
  useUpdateVariantMutation,
  useDeleteVariantMutation,
} = variantsApi;
