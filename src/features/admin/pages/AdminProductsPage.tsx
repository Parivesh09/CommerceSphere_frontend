import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {
  useGetAdminProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from '../api';
import {
  ProductTable,
  ProductForm,
  DeleteProductDialog,
  ProductFilters,
} from '../components';
import type { AdminProductFilters, CreateProductInput, UpdateProductInput } from '../types';
import type { Product } from '../../products/types';
import { ROUTES } from '../../../constants';
import { toast } from 'react-hot-toast';
import { CreateProductFormData, UpdateProductFormData } from '../validation';

/**
 * Admin Products Page
 * 
 * Main page for managing products with CRUD operations
 * Validates: Requirements 10.3
 */

export const AdminProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<AdminProductFilters>({
    page: 1,
    pageSize: 25,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { data, isLoading, error } = useGetAdminProductsQuery(filters);
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const handleCreateClick = () => {
    setCreateDialogOpen(true);
  };

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  };

  const handleViewClick = (product: Product) => {
    navigate(ROUTES.PRODUCT_DETAIL.replace(':id', product.id));
  };

  const handleCreateSubmit = async (data: CreateProductFormData | UpdateProductFormData) => {
    try {
      await createProduct(data as CreateProductInput).unwrap();
      toast.success('Product created successfully');
      setCreateDialogOpen(false);
    } catch (error) {
      toast.error('Failed to create product');
      console.error('Create product error:', error);
    }
  };

  const handleUpdateSubmit = async (data: CreateProductFormData | UpdateProductFormData) => {
    try {
      await updateProduct(data as UpdateProductInput).unwrap();
      toast.success('Product updated successfully');
      setEditDialogOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      toast.error('Failed to update product');
      console.error('Update product error:', error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProduct) return;

    try {
      await deleteProduct(selectedProduct.id).unwrap();
      toast.success('Product deleted successfully');
      setDeleteDialogOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      toast.error('Failed to delete product');
      console.error('Delete product error:', error);
    }
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  const handlePageSizeChange = (pageSize: number) => {
    setFilters({ ...filters, pageSize, page: 1 });
  };

  const handleSortChange = (sortBy: AdminProductFilters['sortBy']) => {
    if (!sortBy) return;
    setFilters({
      ...filters,
      sortBy,
      sortOrder: filters.sortBy === sortBy && filters.sortOrder === 'asc' ? 'desc' : 'asc',
    });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Product Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreateClick}
        >
          Create Product
        </Button>
      </Box>

      <ProductFilters filters={filters} onFiltersChange={setFilters} />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load products. Please try again.
        </Alert>
      )}

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : data ? (
        <ProductTable
          products={data.data}
          total={data.total}
          page={filters.page || 1}
          pageSize={filters.pageSize || 25}
          sortBy={filters.sortBy}
          sortOrder={filters.sortOrder}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onSortChange={handleSortChange}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          onView={handleViewClick}
        />
      ) : null}

      {/* Create Product Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create New Product</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <ProductForm
              onSubmit={handleCreateSubmit}
              onCancel={() => setCreateDialogOpen(false)}
              isLoading={isCreating}
            />
          </Box>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setSelectedProduct(null);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <ProductForm
              product={selectedProduct || undefined}
              onSubmit={handleUpdateSubmit}
              onCancel={() => {
                setEditDialogOpen(false);
                setSelectedProduct(null);
              }}
              isLoading={isUpdating}
            />
          </Box>
        </DialogContent>
      </Dialog>

      {/* Delete Product Dialog */}
      <DeleteProductDialog
        open={deleteDialogOpen}
        product={selectedProduct}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setSelectedProduct(null);
        }}
        isLoading={isDeleting}
      />
    </Container>
  );
};
