/**
 * Search API endpoints
 * Validates: Requirements 9.1, 9.2, 9.3, 9.4
 */

import { baseApi } from '../../../services/api/baseApi';
import { API_TAGS } from '../../../constants';
import type { SearchQuery, SearchSuggestion } from '../types';
import type { Product, PaginatedResponse } from '../../products/types';

export const searchApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Search for products
     * Validates: Requirements 9.3, 9.4
     */
    searchProducts: builder.query<PaginatedResponse<Product>, SearchQuery>({
      query: ({ query, page = 1, pageSize = 20, ...filters }) => ({
        url: '/search',
        params: {
          query,
          page,
          pageSize,
          ...filters,
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Product' as const, id })),
              { type: 'Search' as const, id: 'LIST' },
            ]
          : [{ type: 'Search' as const, id: 'LIST' }],
    }),

    /**
     * Get search suggestions
     * Validates: Requirements 9.1, 9.2
     */
    getSearchSuggestions: builder.query<SearchSuggestion[], string>({
      query: (query) => ({
        url: '/search/autocomplete',
        params: { query },
      }),
      providesTags: [{ type: API_TAGS.SEARCH, id: 'SUGGESTIONS' }],
    }),
  }),
});

export const { useSearchProductsQuery, useGetSearchSuggestionsQuery, useLazySearchProductsQuery, useLazyGetSearchSuggestionsQuery } = searchApi;
