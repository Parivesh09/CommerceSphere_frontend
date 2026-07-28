import { baseApi } from './baseApi';
import type { User, Product, ApiResponse } from '../../types';

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
        url: '/admin/analytics/overview',
        params,
      }),
      providesTags: [{ type: 'Analytics', id: 'OVERVIEW' }],
    }),

    getInventoryList: builder.query<ApiResponse<InventoryItem[]>, void>({
      query: () => '/admin/inventory',
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
  useGetInventoryListQuery,
  useUpdateStockLevelMutation,
  useGetVendorsQuery,
  useUpdateVendorStatusMutation,
  useGetRolesListQuery,
  useGetAdminUsersListQuery,
  useUpdateUserRoleMutation,
} = adminApi;
