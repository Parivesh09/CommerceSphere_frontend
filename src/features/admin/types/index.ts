/**
 * Admin Analytics Types
 * 
 * Types for admin dashboard analytics and metrics
 * Validates: Requirements 10.1, 10.2
 */

export interface DashboardMetrics {
  totalSales: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  conversionRate: number;
  averageOrderValue: number;
  revenueGrowth: number;
  orderGrowth: number;
}

export interface SalesDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface UserGrowthDataPoint {
  date: string;
  users: number;
  newUsers: number;
}

export interface ConversionDataPoint {
  date: string;
  visitors: number;
  conversions: number;
  rate: number;
}

export interface TopProduct {
  id: string;
  name: string;
  sales: number;
  revenue: number;
}

export interface AnalyticsData {
  metrics: DashboardMetrics;
  salesData: SalesDataPoint[];
  userGrowthData: UserGrowthDataPoint[];
  conversionData: ConversionDataPoint[];
  topProducts: TopProduct[];
}

export interface AnalyticsFilters {
  startDate?: string;
  endDate?: string;
  period?: 'day' | 'week' | 'month' | 'year';
}

/**
 * Admin Product Management Types
 * 
 * Types for admin product CRUD operations
 * Validates: Requirements 10.3
 */

export interface AdminProductFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string;
  status?: 'active' | 'inactive' | 'all';
  sortBy?: 'name' | 'price' | 'stock' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  tags: string[];
  stock: number;
  images: ProductImageInput[];
  variants?: ProductVariantInput[];
}

export interface UpdateProductInput extends Partial<CreateProductInput> {
  id: string;
}

export interface ProductImageInput {
  url: string;
  alt: string;
  order: number;
}

export interface ProductVariantInput {
  name: string;
  options: { name: string; value: string }[];
  price?: number;
  stock: number;
}

/**
 * Admin Order Management Types
 * 
 * Types for admin order management and analytics
 * Validates: Requirements 10.4
 */

export interface AdminOrderFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  paymentStatus?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  sortBy?: 'createdAt' | 'totalAmount' | 'status' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface OrderAnalytics {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  ordersByStatus: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
  recentOrders: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  revenueByDay: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
}
