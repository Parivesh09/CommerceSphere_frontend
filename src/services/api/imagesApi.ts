import { baseApi } from './baseApi';
import type { ProductImage } from '../../types';

export interface UploadUrlResponse {
  uploadUrl: string;
  key: string;
}

export const imagesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUploadUrl: builder.mutation<UploadUrlResponse, { productId: string; fileExtension: string }>({
      query: ({ productId, fileExtension }) => ({
        url: `/products/${productId}/images/upload-url`,
        method: 'POST',
        body: { fileExtension },
      }),
    }),

    confirmImage: builder.mutation<ProductImage, { productId: string; key: string; displayOrder?: number }>({
      query: ({ productId, key, displayOrder }) => ({
        url: `/products/${productId}/images`,
        method: 'POST',
        body: { key, displayOrder },
      }),
      invalidatesTags: (_result, _error, { productId }) => [
        { type: 'Products', id: `IMAGES_${productId}` },
        { type: 'Products', id: productId },
      ],
    }),

    getProductImages: builder.query<ProductImage[], string>({
      query: (productId) => `/products/${productId}/images`,
      providesTags: (_result, _error, productId) => [{ type: 'Products', id: `IMAGES_${productId}` }],
    }),

    updateImageOrder: builder.mutation<void, { id: string; displayOrder: number }>({
      query: ({ id, displayOrder }) => ({
        url: `/images/${id}/order`,
        method: 'PUT',
        body: { displayOrder },
      }),
      invalidatesTags: ['Products'],
    }),

    deleteImage: builder.mutation<void, string>({
      query: (id) => ({
        url: `/images/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Products'],
    }),
  }),
});

export const {
  useGetUploadUrlMutation,
  useConfirmImageMutation,
  useGetProductImagesQuery,
  useUpdateImageOrderMutation,
  useDeleteImageMutation,
} = imagesApi;
