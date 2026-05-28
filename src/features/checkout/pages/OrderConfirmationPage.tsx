import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import { Button } from '../../../components/ui';
import { ROUTES } from '../../../constants';

/**
 * Order confirmation page
 * Validates: Requirements 7.4
 */
export default function OrderConfirmationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!orderId) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper elevation={0} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            No Order Found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            We couldn't find an order confirmation. Please check your orders page.
          </Typography>
          <Button variant="primary" onClick={() => navigate(ROUTES.ORDERS)}>
            View Orders
          </Button>
        </Paper>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={0} sx={{ p: 4, textAlign: 'center' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: 3,
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              bgcolor: 'success.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 48,
            }}
          >
            ✓
          </Box>
        </Box>

        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          Order Confirmed!
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
          Thank you for your purchase. Your order has been successfully placed.
        </Typography>

        <Typography variant="h6" color="primary" sx={{ mb: 4 }}>
          Order #{orderId}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          We've sent a confirmation email with your order details. You can track your
          order status from your orders page.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="primary"
            onClick={() => navigate(`${ROUTES.ORDERS}/${orderId}`)}
          >
            View Order Details
          </Button>
          <Button variant="outline" onClick={() => navigate(ROUTES.PRODUCTS)}>
            Continue Shopping
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
