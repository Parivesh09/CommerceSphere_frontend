import { baseApi } from './baseApi';
import type { User, ApiResponse } from '../../types';

export interface AdminAnalyticsMetrics {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
  revenueGrowthPercentage: number;
  ordersGrowthPercentage: number;
  recentSales: Array<{
    id: string;
    customerName: string;
    amount: number;
    status: string;
    date: string;
  }>;
  topProducts: Array<{
    id: string;
    title: string;
    salesCount: number;
    revenue: number;
  }>;
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  companyName: string;
  status: 'active' | 'pending' | 'suspended';
  rating: number;
  productCount: number;
  totalSales: number;
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  productId: string;
  productTitle: string;
  sku: string;
  quantity: number;
  reservedQuantity: number;
  reorderPoint: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  lastUpdated: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
}

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAnalyticsOverview: builder.query<ApiResponse<AdminAnalyticsMetrics>, { timeframe?: string }>({
      query: (params) => ({
        url: '/analytics/dashboard',
        params,
      }),
      providesTags: [{ type: 'Analytics', id: 'OVERVIEW' }],
    }),

    getSalesAnalytics: builder.query<ApiResponse<unknown>, { startDate?: string; endDate?: string; interval?: string }>({
      query: (params) => ({
        url: '/analytics/sales',
        params,
      }),
      providesTags: [{ type: 'Analytics', id: 'SALES' }],
    }),

    getTopProducts: builder.query<ApiResponse<unknown[]>, { startDate?: string; endDate?: string; limit?: number; sortBy?: string }>({
      query: (params) => ({
        url: '/analytics/products/top',
        params,
      }),
      providesTags: [{ type: 'Analytics', id: 'TOP_PRODUCTS' }],
    }),

    getTopCustomers: builder.query<ApiResponse<unknown[]>, { limit?: number; sortBy?: string }>({
      query: (params) => ({
        url: '/analytics/customers/top',
        params,
      }),
      providesTags: [{ type: 'Analytics', id: 'TOP_CUSTOMERS' }],
    }),

    getInventoryList: builder.query<ApiResponse<InventoryItem[]>, void>({
      query: () => '/inventory',
      providesTags: [{ type: 'Products', id: 'INVENTORY' }],
    }),

    updateStockLevel: builder.mutation<ApiResponse<InventoryItem>, { sku: string; quantity: number }>({
      query: ({ sku, quantity }) => ({
        url: `/admin/inventory/${sku}`,
        method: 'PATCH',
        body: { quantity },
      }),
      invalidatesTags: [{ type: 'Products', id: 'INVENTORY' }, { type: 'Products', id: 'LIST' }],
    }),

    getVendors: builder.query<ApiResponse<Vendor[]>, void>({
      query: () => '/admin/vendors',
      providesTags: [{ type: 'User', id: 'VENDORS' }],
    }),

    updateVendorStatus: builder.mutation<ApiResponse<Vendor>, { id: string; status: Vendor['status'] }>({
      query: ({ id, status }) => ({
        url: `/admin/vendors/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: [{ type: 'User', id: 'VENDORS' }],
    }),

    getRolesList: builder.query<ApiResponse<Role[]>, void>({
      query: () => '/admin/roles',
      providesTags: [{ type: 'User', id: 'ROLES' }],
    }),

    getAdminUsersList: builder.query<ApiResponse<User[]>, void>({
      query: () => '/admin/users',
      providesTags: [{ type: 'User', id: 'ADMIN_LIST' }],
    }),

    updateUserRole: builder.mutation<ApiResponse<User>, { userId: string; role: User['role'] }>({
      query: ({ userId, role }) => ({
        url: `/admin/users/${userId}/role`,
        method: 'PATCH',
        body: { role },
      }),
      invalidatesTags: [{ type: 'User', id: 'ADMIN_LIST' }],
    }),
  }),
});

export const {
  useGetAnalyticsOverviewQuery,
  useGetSalesAnalyticsQuery,
  useGetTopProductsQuery,
  useGetTopCustomersQuery,
  useGetInventoryListQuery,
  useUpdateStockLevelMutation,
  useGetVendorsQuery,
  useUpdateVendorStatusMutation,
  useGetRolesListQuery,
  useGetAdminUsersListQuery,
  useUpdateUserRoleMutation,
} = adminApi;
