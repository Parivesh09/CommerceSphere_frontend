import { Chip } from '@mui/material';
import type { OrderStatus } from '../../../types';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const statusConfig: Record<
  OrderStatus,
  { label: string; color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' }
> = {
  CREATED: { label: 'Created', color: 'default' },
  PENDING_PAYMENT: { label: 'Pending Payment', color: 'warning' },
  PAID: { label: 'Paid', color: 'info' },
  PROCESSING: { label: 'Processing', color: 'primary' },
  SHIPPED: { label: 'Shipped', color: 'secondary' },
  DELIVERED: { label: 'Delivered', color: 'success' },
  CANCELLED: { label: 'Cancelled', color: 'error' },
};

/**
 * Order status badge component
 * Displays order status with appropriate color coding
 * Validates: Requirements 18.1
 */
export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.CREATED;

  return (
    <Chip
      label={config.label}
      color={config.color}
      size="small"
      sx={{ fontWeight: 'medium' }}
    />
  );
}
