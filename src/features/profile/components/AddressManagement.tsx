import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Add, Edit, Delete, Star, StarBorder } from '@mui/icons-material';
import {
  useGetAddressesQuery,
  useDeleteAddressMutation,
  useSetDefaultAddressMutation,
} from '../api';
import AddressForm from './AddressForm';
import type { UserAddress } from '../types';
import toast from 'react-hot-toast';

/**
 * Address Management Component
 * 
 * Displays and manages user addresses with add, edit, delete, and set default functionality.
 * Validates: Requirements 3.1
 */
export default function AddressManagement() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(null);
  const [deletingAddressId, setDeletingAddressId] = useState<string | null>(null);

  const { data: addresses, isLoading, error } = useGetAddressesQuery();
  const [deleteAddress, { isLoading: isDeleting }] = useDeleteAddressMutation();
  const [setDefaultAddress, { isLoading: isSettingDefault }] = useSetDefaultAddressMutation();

  const handleDelete = async (id: string) => {
    try {
      await deleteAddress(id).unwrap();
      toast.success('Address deleted successfully');
      setDeletingAddressId(null);
    } catch (error) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || 'Failed to delete address');
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultAddress(id).unwrap();
      toast.success('Default address updated');
    } catch (error) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || 'Failed to set default address');
    }
  };

  const handleAddSuccess = () => {
    setIsAddDialogOpen(false);
    toast.success('Address added successfully');
  };

  const handleEditSuccess = () => {
    setEditingAddress(null);
    toast.success('Address updated successfully');
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Failed to load addresses. Please try again later.
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Saved Addresses</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setIsAddDialogOpen(true)}
        >
          Add Address
        </Button>
      </Box>

      {/* Address List */}
      {addresses && addresses.length === 0 ? (
        <Alert severity="info">
          No addresses saved yet. Add your first address to get started.
        </Alert>
      ) : (
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
          {addresses?.map((address) => (
            <Card key={address.id} variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {address.label && (
                      <Chip label={address.label} size="small" color="primary" />
                    )}
                    {address.isDefault && (
                      <Chip label="Default" size="small" color="success" />
                    )}
                  </Box>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handleSetDefault(address.id)}
                      disabled={address.isDefault || isSettingDefault}
                      title="Set as default"
                    >
                      {address.isDefault ? <Star color="primary" /> : <StarBorder />}
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => setEditingAddress(address)}
                      title="Edit address"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => setDeletingAddressId(address.id)}
                      title="Delete address"
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {address.street}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {address.city}, {address.state} {address.postalCode}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {address.country}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Add Address Dialog */}
      <Dialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Address</DialogTitle>
        <DialogContent>
          <AddressForm onSuccess={handleAddSuccess} onCancel={() => setIsAddDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit Address Dialog */}
      <Dialog
        open={!!editingAddress}
        onClose={() => setEditingAddress(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Address</DialogTitle>
        <DialogContent>
          {editingAddress && (
            <AddressForm
              address={editingAddress}
              onSuccess={handleEditSuccess}
              onCancel={() => setEditingAddress(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deletingAddressId}
        onClose={() => setDeletingAddressId(null)}
      >
        <DialogTitle>Delete Address</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this address? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeletingAddressId(null)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            onClick={() => deletingAddressId && handleDelete(deletingAddressId)}
            color="error"
            variant="contained"
            disabled={isDeleting}
          >
            {isDeleting ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
