import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  Stack,
} from '@mui/material';
import { Button } from '../../../components/ui';
import OrderStatusBadge from './OrderStatusBadge';
import type { Order } from '../../../types';
import { ROUTES } from '../../../constants';

interface OrderCardProps {
  order: Order;
}

/**
 * Order card component
 * Displays order summary in list view
 * Validates: Requirements 18.1
 */
export default function OrderCard({ order }: OrderCardProps) {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <Card
      sx={{
        mb: 2,
        '&:hover': {
          boxShadow: 3,
          cursor: 'pointer',
        },
        transition: 'box-shadow 0.2s',
      }}
      onClick={() => navigate(`${ROUTES.ORDERS}/${order.id}`)}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h6" gutterBottom>
              Order #{order.id.slice(0, 8).toUpperCase()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Placed on {formatDate(order.createdAt)}
            </Typography>
          </Box>
          <OrderStatusBadge status={order.status} />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Stack spacing={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Items:
            </Typography>
            <Typography variant="body2">
              {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Total:
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              {formatCurrency(order.totalAmount)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Payment:
            </Typography>
            <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
              {order.paymentStatus.toLowerCase()}
            </Typography>
          </Box>
        </Stack>

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`${ROUTES.ORDERS}/${order.id}`);
            }}
          >
            View Details
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
