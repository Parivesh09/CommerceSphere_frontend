import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Alert,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Button } from '../../../components/ui';
import { useGetOrderByIdQuery } from '../api';
import { OrderStatusBadge, TrackingProgress } from '../components';
import { useOrderPolling } from '../hooks';
import { ROUTES } from '../../../constants';

/**
 * Order detail page
 * Displays detailed order information with tracking
 * Validates: Requirements 18.2, 18.3, 18.4
 */
export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: order, isLoading, error } = useGetOrderByIdQuery(id || '', {
    skip: !id,
  });


  useOrderPolling(id || '', order?.status || 'CREATED');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !order) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load order details. Please try again later.
        </Alert>
        <Button variant="outline" onClick={() => navigate(ROUTES.ORDERS)}>
          Back to Orders
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">
          Order #{order.id.slice(0, 8).toUpperCase()}
        </Typography>
        <Button variant="outline" onClick={() => navigate(ROUTES.ORDERS)}>
          Back to Orders
        </Button>
      </Box>

      {/* Order Status and Tracking */}
      <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Order Status</Typography>
          <OrderStatusBadge status={order.status} />
        </Box>
        <TrackingProgress
          status={order.status}
          updatedAt={order.updatedAt}
        />
      </Paper>

      {/* Order Information */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3 }}>
        <Box sx={{ flex: 1 }}>
          <Paper elevation={0} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Order Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={1.5}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Order Date
                </Typography>
                <Typography variant="body2">{formatDate(order.createdAt)}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Last Updated
                </Typography>
                <Typography variant="body2">{formatDate(order.updatedAt)}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Payment Status
                </Typography>
                <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                  {order.paymentStatus.toLowerCase()}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Paper elevation={0} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Shipping Address
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body2">
              {order.shippingAddress.street}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
              {order.shippingAddress.postalCode}
              <br />
              {order.shippingAddress.country}
            </Typography>
          </Paper>
        </Box>
      </Box>

      {/* Order Items */}
      <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Order Items
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell align="center">Quantity</TableCell>
                <TableCell align="right">Unit Price</TableCell>
                <TableCell align="right">Subtotal</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Typography variant="body2">Product ID: {item.productId}</Typography>
                    {item.variantId && (
                      <Typography variant="caption" color="text.secondary">
                        Variant: {item.variantId}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="center">{item.quantity}</TableCell>
                  <TableCell align="right">{formatCurrency(item.unitPrice)}</TableCell>
                  <TableCell align="right">{formatCurrency(item.subtotal)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Order Summary */}
      <Paper elevation={0} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Order Summary
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Stack spacing={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2">Subtotal:</Typography>
            <Typography variant="body2">
              {formatCurrency(
                order.items.reduce((sum, item) => sum + item.subtotal, 0)
              )}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              Total:
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              {formatCurrency(order.totalAmount)}
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
}
