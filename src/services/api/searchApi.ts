import { baseApi } from './baseApi';
import type { Product } from '../../types';

export interface SearchParams {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  page?: number;
  pageSize?: number;
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'created_desc';
}

export interface SearchResponse {
  results: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const searchApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    search: builder.query<SearchResponse, SearchParams>({
      query: (params) => ({
        url: '/search',
        params,
      }),
      providesTags: [{ type: 'Search', id: 'RESULTS' }],
    }),

    getAutocomplete: builder.query<{ suggestions: string[] }, string>({
      query: (query) => ({
        url: '/search/autocomplete',
        params: { query },
      }),
    }),

    indexProduct: builder.mutation<void, Partial<Product>>({
      query: (product) => ({
        url: '/search/index',
        method: 'POST',
        body: product,
      }),
      invalidatesTags: [{ type: 'Search', id: 'RESULTS' }],
    }),

    removeProductFromIndex: builder.mutation<void, string>({
      query: (id) => ({
        url: `/search/index/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Search', id: 'RESULTS' }],
    }),
  }),
});

export const {
  useSearchQuery,
  useGetAutocompleteQuery,
  useIndexProductMutation,
  useRemoveProductFromIndexMutation,
  useLazySearchQuery,
  useLazyGetAutocompleteQuery,
} = searchApi;
