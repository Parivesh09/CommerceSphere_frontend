import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Divider,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import { useGetAdminOrderByIdQuery } from '../api';
import { UpdateOrderStatusDialog } from '../components/UpdateOrderStatusDialog';
import OrderStatusBadge from '../../orders/components/OrderStatusBadge';
import type { OrderItem } from '../../../types';

/**
 * Admin Order Detail Page
 * 
 * Displays comprehensive order information for administrators
 * with ability to update order status.
 * 
 * Validates: Requirements 10.4
 */
export function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);

  const { data: order, isLoading, error } = useGetAdminOrderByIdQuery(id!);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'FAILED':
        return 'error';
      case 'REFUNDED':
        return 'info';
      default:
        return 'default';
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress sx={{ color: 'var(--color-primary)' }} />
      </Box>
    );
  }

  if (error || !order) {
    return (
      <Box>
        <Alert severity="error" sx={{ backgroundColor: 'var(--color-error-container)', color: 'var(--color-on-error-container)' }}>
          Failed to load order details. Please try again later.
        </Alert>
        <Button
          onClick={() => navigate('/admin/orders')}
          sx={{ mt: 2, color: 'var(--color-primary)', textTransform: 'none', fontWeight: 600 }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20, marginRight: 4 }}>arrow_back</span>
          Back to Orders
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Button
            onClick={() => navigate('/admin/orders')}
            sx={{ mb: 2, color: 'var(--color-primary)', textTransform: 'none', fontWeight: 600 }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20, marginRight: 4 }}>arrow_back</span>
            Back to Orders
          </Button>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'var(--color-on-surface)' }}>
            Order #{order.id.slice(0, 8)}
          </Typography>
          <Typography variant="body1" sx={{ color: 'var(--color-on-surface-variant)' }}>
            Placed on {formatDate(order.createdAt)}
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={() => setStatusDialogOpen(true)}
          sx={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)', textTransform: 'none', fontWeight: 600, '&:hover': { backgroundColor: 'var(--color-primary-container)' } }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20, marginRight: 4 }}>edit</span>
          Update Status
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Order Status */}
        
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3, mb: 3, backgroundColor: 'var(--color-surface-container-lowest)', border: '1px solid var(--color-outline-variant)', borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'var(--color-on-surface)', fontWeight: 700 }}>
              Order Status
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 2 }}>
              <Box>
                <Typography variant="body2" sx={{ color: 'var(--color-on-surface-variant)' }} gutterBottom>
                  Order Status
                </Typography>
                <OrderStatusBadge status={order.status} />
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: 'var(--color-on-surface-variant)' }} gutterBottom>
                  Payment Status
                </Typography>
                <Chip
                  label={order.paymentStatus}
                  color={getPaymentStatusColor(order.paymentStatus)}
                  size="small"
                />
              </Box>
              <Box sx={{ ml: 'auto' }}>
                <Typography variant="body2" sx={{ color: 'var(--color-on-surface-variant)' }} gutterBottom>
                  Last Updated
                </Typography>
                <Typography variant="body2" sx={{ color: 'var(--color-on-surface)' }}>{formatDate(order.updatedAt)}</Typography>
              </Box>
            </Box>
          </Paper>

          {/* Order Items */}
          <Paper sx={{ p: 3, backgroundColor: 'var(--color-surface-container-lowest)', border: '1px solid var(--color-outline-variant)', borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'var(--color-on-surface)', fontWeight: 700 }}>
              Order Items
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: 'var(--color-on-surface-variant)', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>Product</TableCell>
                    <TableCell align="center" sx={{ color: 'var(--color-on-surface-variant)', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>Quantity</TableCell>
                    <TableCell align="right" sx={{ color: 'var(--color-on-surface-variant)', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>Unit Price</TableCell>
                    <TableCell align="right" sx={{ color: 'var(--color-on-surface-variant)', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>Subtotal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items.map((item: OrderItem) => (
                    <TableRow key={item.id} sx={{ '&:hover': { backgroundColor: 'var(--color-surface-container-low)' } }}>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: 'var(--color-on-surface)' }}>Product ID: {item.productId}</Typography>
                        {item.variantId && (
                          <Typography variant="caption" sx={{ color: 'var(--color-on-surface-variant)' }}>
                            Variant: {item.variantId}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="center" sx={{ color: 'var(--color-on-surface)' }}>{item.quantity}</TableCell>
                      <TableCell align="right" sx={{ color: 'var(--color-on-surface)' }}>{formatCurrency(item.unitPrice)}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: 'var(--color-primary)' }}>{formatCurrency(item.subtotal)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Divider sx={{ my: 2, borderColor: 'var(--color-outline-variant)' }} />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Box sx={{ minWidth: 200 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="h6" sx={{ color: 'var(--color-on-surface)' }}>Total</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'var(--color-primary)' }}>
                    {formatCurrency(order.totalAmount)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Customer & Shipping Info */}
        
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, mb: 3, backgroundColor: 'var(--color-surface-container-lowest)', border: '1px solid var(--color-outline-variant)', borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'var(--color-on-surface)', fontWeight: 700 }}>
              Customer Information
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ color: 'var(--color-on-surface-variant)' }} gutterBottom>
                Customer ID
              </Typography>
              <Typography variant="body2" sx={{ color: 'var(--color-on-surface)' }} gutterBottom>
                {order.userId}
              </Typography>
            </Box>
          </Paper>

          <Paper sx={{ p: 3, backgroundColor: 'var(--color-surface-container-lowest)', border: '1px solid var(--color-outline-variant)', borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'var(--color-on-surface)', fontWeight: 700 }}>
              Shipping Address
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ color: 'var(--color-on-surface)' }}>{order.shippingAddress.street}</Typography>
              <Typography variant="body2" sx={{ color: 'var(--color-on-surface)' }}>
                {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                {order.shippingAddress.postalCode}
              </Typography>
              <Typography variant="body2" sx={{ color: 'var(--color-on-surface)' }}>{order.shippingAddress.country}</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Update Status Dialog */}
      <UpdateOrderStatusDialog
        open={statusDialogOpen}
        order={order}
        onClose={() => setStatusDialogOpen(false)}
      />
    </Box>
  );
}
