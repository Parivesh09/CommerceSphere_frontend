/**
 * Products API endpoints using RTK Query
 * 
 * Features:
 * - getProducts: Fetch paginated products with filters and sorting
 * - getProductById: Fetch single product details
 * - Tag-based cache invalidation
 * 
 * Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5, 4.6
 */

import { baseApi } from '../../../services/api/baseApi';
import { API_TAGS } from '../../../constants';
import type { Product, ProductFilters, PaginatedResponse } from '../types';

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<PaginatedResponse<Product>, ProductFilters>({
      query: (filters) => {
        const params = new URLSearchParams();
        
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.pageSize) params.append('pageSize', filters.pageSize.toString());
        if (filters.category) params.append('category', filters.category);
        if (filters.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
        if (filters.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());
        if (filters.minRating !== undefined) params.append('minRating', filters.minRating.toString());
        if (filters.sortBy) params.append('sortBy', filters.sortBy);
        if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
        if (filters.search) params.append('search', filters.search);
        if (filters.tags && filters.tags.length > 0) {
          filters.tags.forEach(tag => params.append('tags', tag));
        }
        
        return {
          url: '/products',
          params,
        };
      },

      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Product' as const, id })),
              { type: 'Products' as const, id: 'LIST' },
            ]
          : [{ type: 'Products' as const, id: 'LIST' }],
    }),
    
    getProductById: builder.query<Product, string>({
      query: (id) => `/products/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Product' as const, id }],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useLazyGetProductsQuery,
} = productsApi;
