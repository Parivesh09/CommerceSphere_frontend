import { baseApi } from './baseApi';

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  createdAt: string;
}

export const categoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      query: () => '/categories',
      transformResponse: (response: Category[]) => response,
      providesTags: [{ type: 'Products', id: 'CATEGORIES' }],
    }),

    getCategory: builder.query<Category, string>({
      query: (id) => `/categories/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Products', id: `CATEGORY_${id}` }],
    }),

    createCategory: builder.mutation<Category, { name: string; slug: string; parentId?: string }>({
      query: (data) => ({
        url: '/categories',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Products', id: 'CATEGORIES' }],
    }),

    updateCategory: builder.mutation<Category, { id: string; name?: string; slug?: string; parentId?: string }>({
      query: ({ id, ...data }) => ({
        url: `/categories/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Products', id: 'CATEGORIES' },
        { type: 'Products', id: `CATEGORY_${id}` },
      ],
    }),

    deleteCategory: builder.mutation<void, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Products', id: 'CATEGORIES' }],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi;
