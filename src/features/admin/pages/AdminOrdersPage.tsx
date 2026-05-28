import { useState } from 'react';
import { Box, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import { OrderFilters } from '../components/OrderFilters';
import { OrderTable } from '../components/OrderTable';
import { UpdateOrderStatusDialog } from '../components/UpdateOrderStatusDialog';
import { OrderAnalyticsCards } from '../components/OrderAnalyticsCards';
import { useGetAdminOrdersQuery, useGetOrderAnalyticsQuery } from '../api';
import type { AdminOrderFilters } from '../types';
import type { Order } from '../../../types';

/**
 * Admin Orders Page
 * 
 * Provides comprehensive order management interface for administrators
 * including filtering, searching, status updates, and analytics.
 * 
 * Validates: Requirements 10.4
 */
export function AdminOrdersPage() {
  const [filters, setFilters] = useState<AdminOrderFilters>({
    page: 1,
    pageSize: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);

  const {
    data: ordersData,
    isLoading: ordersLoading,
    error: ordersError,
  } = useGetAdminOrdersQuery(filters);

  const {
    data: analytics,
    isLoading: analyticsLoading,
  } = useGetOrderAnalyticsQuery();

  const handleFiltersChange = (newFilters: AdminOrderFilters) => {
    setFilters(newFilters);
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  const handlePageSizeChange = (pageSize: number) => {
    setFilters({ ...filters, pageSize, page: 1 });
  };

  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order);
    setStatusDialogOpen(true);
  };

  const handleCloseStatusDialog = () => {
    setStatusDialogOpen(false);
    setSelectedOrder(null);
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          Order Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage and track all customer orders
        </Typography>
      </Box>

      {/* Analytics Cards */}
      <OrderAnalyticsCards analytics={analytics} isLoading={analyticsLoading} />

      {/* Filters */}
      <OrderFilters filters={filters} onFiltersChange={handleFiltersChange} />

      {/* Orders Table */}
      {ordersError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load orders. Please try again later.
        </Alert>
      )}

      {ordersLoading ? (
        <Paper sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Paper>
      ) : ordersData ? (
        <OrderTable
          orders={ordersData.data}
          total={ordersData.total}
          page={filters.page || 1}
          pageSize={filters.pageSize || 10}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onEditOrder={handleEditOrder}
        />
      ) : null}

      {/* Update Status Dialog */}
      <UpdateOrderStatusDialog
        open={statusDialogOpen}
        order={selectedOrder}
        onClose={handleCloseStatusDialog}
      />
    </Box>
  );
}
