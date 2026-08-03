import { baseApi } from '../../../services/api/baseApi';
import type { Product } from '../types';

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProductById: builder.query<Product, string>({
      query: (id) => `/products/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Product' as const, id }],
    }),
  }),
});

export const {
  useGetProductByIdQuery,
} = productsApi;