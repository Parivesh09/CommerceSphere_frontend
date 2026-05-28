import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Typography,
  Alert,
} from '@mui/material';
import type { Order, OrderStatus } from '../../../types';
import { useUpdateAdminOrderStatusMutation } from '../api';
import toast from 'react-hot-toast';

interface UpdateOrderStatusDialogProps {
  open: boolean;
  order: Order | null;
  onClose: () => void;
}

const statusOptions: { value: OrderStatus; label: string; description: string }[] = [
  {
    value: 'CREATED',
    label: 'Created',
    description: 'Order has been created but not yet paid',
  },
  {
    value: 'PENDING_PAYMENT',
    label: 'Pending Payment',
    description: 'Awaiting payment confirmation',
  },
  {
    value: 'PAID',
    label: 'Paid',
    description: 'Payment has been received',
  },
  {
    value: 'PROCESSING',
    label: 'Processing',
    description: 'Order is being prepared for shipment',
  },
  {
    value: 'SHIPPED',
    label: 'Shipped',
    description: 'Order has been shipped to customer',
  },
  {
    value: 'DELIVERED',
    label: 'Delivered',
    description: 'Order has been delivered to customer',
  },
  {
    value: 'CANCELLED',
    label: 'Cancelled',
    description: 'Order has been cancelled',
  },
];

export function UpdateOrderStatusDialog({ open, order, onClose }: UpdateOrderStatusDialogProps) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | ''>('');
  const [updateOrderStatus, { isLoading }] = useUpdateAdminOrderStatusMutation();

  const handleStatusChange = (status: OrderStatus) => {
    setSelectedStatus(status);
  };

  const handleSubmit = async () => {
    if (!order || !selectedStatus) return;

    try {
      await updateOrderStatus({
        id: order.id,
        status: selectedStatus,
      }).unwrap();

      toast.success(`Order status updated to ${selectedStatus}`);
      onClose();
      setSelectedStatus('');
    } catch (error) {
      toast.error('Failed to update order status');
      console.error('Error updating order status:', error);
    }
  };

  const handleClose = () => {
    setSelectedStatus('');
    onClose();
  };

  if (!order) return null;

  const currentStatusOption = statusOptions.find((opt) => opt.value === order.status);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Update Order Status</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3, mt: 1 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Order ID: #{order.id.slice(0, 8)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Current Status: <strong>{currentStatusOption?.label}</strong>
          </Typography>
        </Box>

        <Alert severity="info" sx={{ mb: 3 }}>
          Changing the order status will notify the customer via email and update their order
          tracking information.
        </Alert>

        <TextField
          fullWidth
          select
          label="New Status"
          value={selectedStatus}
          onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
          helperText={
            selectedStatus
              ? statusOptions.find((opt) => opt.value === selectedStatus)?.description
              : 'Select a new status for this order'
          }
        >
          {statusOptions.map((option) => (
            <MenuItem
              key={option.value}
              value={option.value}
              disabled={option.value === order.status}
            >
              <Box>
                <Typography variant="body2">{option.label}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {option.description}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!selectedStatus || selectedStatus === order.status || isLoading}
        >
          {isLoading ? 'Updating...' : 'Update Status'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
