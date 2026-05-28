import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import { Warning } from '@mui/icons-material';
import type { Product } from '../../products/types';

/**
 * Delete Product Confirmation Dialog
 * 
 * Displays confirmation dialog before deleting a product
 * Validates: Requirements 10.3
 */

interface DeleteProductDialogProps {
  open: boolean;
  product: Product | null;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const DeleteProductDialog: React.FC<DeleteProductDialogProps> = ({
  open,
  product,
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  if (!product) return null;

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Warning color="error" />
          Delete Product
        </Box>
      </DialogTitle>
      <DialogContent>
        <Alert severity="warning" sx={{ mb: 2 }}>
          This action cannot be undone. The product will be permanently deleted.
        </Alert>
        <Typography variant="body1" gutterBottom>
          Are you sure you want to delete the following product?
        </Typography>
        <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Product Name
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            {product.name}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            Product ID
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            {product.id}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            Category
          </Typography>
          <Typography variant="body1">
            {product.category}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained" disabled={isLoading}>
          {isLoading ? 'Deleting...' : 'Delete Product'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
