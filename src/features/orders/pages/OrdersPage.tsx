import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Pagination,
} from '@mui/material';
import { useGetOrdersQuery } from '../api';
import { OrderCard, OrderFilters } from '../components';
import type { OrderFilterValues } from '../components/OrderFilters';

/**
 * Orders list page
 * Displays user's order history with filtering and pagination
 * Validates: Requirements 18.1, 18.5
 */
export default function OrdersPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<OrderFilterValues>({});

  const queryParams = {
    page,
    pageSize: 10,
    ...(filters.status && { status: filters.status }),
    ...(filters.startDate && { startDate: filters.startDate }),
    ...(filters.endDate && { endDate: filters.endDate }),
  };

  const { data, isLoading, error } = useGetOrdersQuery(queryParams);

  const handleFilterChange = (newFilters: OrderFilterValues) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        My Orders
      </Typography>

      <OrderFilters onFilterChange={handleFilterChange} />

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load orders. Please try again later.
        </Alert>
      )}

      {!isLoading && !error && data && (
        <>
          {data.data.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No orders found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {filters.status || filters.startDate || filters.endDate
                  ? 'Try adjusting your filters'
                  : "You haven't placed any orders yet"}
              </Typography>
            </Box>
          ) : (
            <>
              <Box sx={{ mb: 3 }}>
                {data.data.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </Box>

              {data.totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={data.totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                  />
                </Box>
              )}
            </>
          )}
        </>
      )}
    </Container>
  );
}
