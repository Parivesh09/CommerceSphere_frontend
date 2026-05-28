import React from 'react';
import {
  Box,
  TextField,
  MenuItem,
  InputAdornment,
  Paper,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import type { AdminProductFilters } from '../types';

/**
 * Product Filters Component
 * 
 * Provides filtering controls for admin product list
 * Validates: Requirements 10.3
 */

interface ProductFiltersProps {
  filters: AdminProductFilters;
  onFiltersChange: (filters: AdminProductFilters) => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onFiltersChange,
}) => {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, search: event.target.value, page: 1 });
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    onFiltersChange({ ...filters, category: value || undefined, page: 1 });
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value as AdminProductFilters['status'];
    onFiltersChange({
      ...filters,
      status: value || undefined,
      page: 1,
    });
  };

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search products..."
          value={filters.search || ''}
          onChange={handleSearchChange}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            },
          }}
          sx={{ flexGrow: 1, minWidth: 250 }}
        />
        <TextField
          select
          label="Category"
          value={filters.category || ''}
          onChange={handleCategoryChange}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">All Categories</MenuItem>
          <MenuItem value="electronics">Electronics</MenuItem>
          <MenuItem value="clothing">Clothing</MenuItem>
          <MenuItem value="home">Home & Garden</MenuItem>
          <MenuItem value="sports">Sports & Outdoors</MenuItem>
          <MenuItem value="books">Books</MenuItem>
          <MenuItem value="toys">Toys & Games</MenuItem>
        </TextField>
        <TextField
          select
          label="Status"
          value={filters.status || 'all'}
          onChange={handleStatusChange}
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
        </TextField>
      </Box>
    </Paper>
  );
};
