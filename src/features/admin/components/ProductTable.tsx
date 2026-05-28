import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Avatar,
  TablePagination,
  TableSortLabel,
  Box,
  Tooltip,
} from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import type { Product } from '../../products/types';
import type { AdminProductFilters } from '../types';

/**
 * Product Table Component
 * 
 * Displays admin product list with sorting, pagination, and actions
 * Validates: Requirements 10.3
 */

interface ProductTableProps {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  sortBy?: AdminProductFilters['sortBy'];
  sortOrder?: AdminProductFilters['sortOrder'];
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSortChange: (sortBy: AdminProductFilters['sortBy']) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onView: (product: Product) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  total,
  page,
  pageSize,
  sortBy = 'createdAt',
  sortOrder = 'desc',
  onPageChange,
  onPageSizeChange,
  onSortChange,
  onEdit,
  onDelete,
  onView,
}) => {
  const handleSort = (column: AdminProductFilters['sortBy']) => {
    onSortChange(column);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === 'name'}
                  direction={sortBy === 'name' ? sortOrder : 'asc'}
                  onClick={() => handleSort('name')}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={sortBy === 'price'}
                  direction={sortBy === 'price' ? sortOrder : 'asc'}
                  onClick={() => handleSort('price')}
                >
                  Price
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={sortBy === 'stock'}
                  direction={sortBy === 'stock' ? sortOrder : 'asc'}
                  onClick={() => handleSort('stock')}
                >
                  Stock
                </TableSortLabel>
              </TableCell>
              <TableCell>Tags</TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === 'createdAt'}
                  direction={sortBy === 'createdAt' ? sortOrder : 'asc'}
                  onClick={() => handleSort('createdAt')}
                >
                  Created
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} hover>
                <TableCell>
                  <Avatar
                    src={product.images[0]?.url}
                    alt={product.images[0]?.alt}
                    variant="rounded"
                    sx={{ width: 56, height: 56 }}
                  />
                </TableCell>
                <TableCell>
                  <Box>
                    <Box sx={{ fontWeight: 500 }}>{product.name}</Box>
                    <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                      ID: {product.id}
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell align="right">
                  <Box>
                    <Box sx={{ fontWeight: 500 }}>{formatPrice(product.price)}</Box>
                    {product.compareAtPrice && (
                      <Box
                        sx={{
                          fontSize: '0.875rem',
                          color: 'text.secondary',
                          textDecoration: 'line-through',
                        }}
                      >
                        {formatPrice(product.compareAtPrice)}
                      </Box>
                    )}
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Chip
                    label={product.stock}
                    size="small"
                    color={product.stock > 10 ? 'success' : product.stock > 0 ? 'warning' : 'error'}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {product.tags.slice(0, 2).map((tag) => (
                      <Chip key={tag} label={tag} size="small" variant="outlined" />
                    ))}
                    {product.tags.length > 2 && (
                      <Chip label={`+${product.tags.length - 2}`} size="small" variant="outlined" />
                    )}
                  </Box>
                </TableCell>
                <TableCell>{formatDate(product.createdAt)}</TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                    <Tooltip title="View">
                      <IconButton size="small" onClick={() => onView(product)} color="info">
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => onEdit(product)} color="primary">
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" onClick={() => onDelete(product)} color="error">
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={total}
        page={page - 1}
        onPageChange={(_, newPage) => onPageChange(newPage + 1)}
        rowsPerPage={pageSize}
        onRowsPerPageChange={(e) => onPageSizeChange(parseInt(e.target.value, 10))}
        rowsPerPageOptions={[10, 25, 50, 100]}
      />
    </Paper>
  );
};
