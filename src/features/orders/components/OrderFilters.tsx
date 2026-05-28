import { useState } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Stack,
} from '@mui/material';
import { Button } from '../../../components/ui';
import type { OrderStatus } from '../../../types';

export interface OrderFilterValues {
  status?: OrderStatus | '';
  startDate?: string;
  endDate?: string;
}

interface OrderFiltersProps {
  onFilterChange: (filters: OrderFilterValues) => void;
}

/**
 * Order filters component
 * Allows filtering orders by status and date range
 * Validates: Requirements 18.5
 */
export default function OrderFilters({ onFilterChange }: OrderFiltersProps) {
  const [filters, setFilters] = useState<OrderFilterValues>({
    status: '',
    startDate: '',
    endDate: '',
  });

  const handleStatusChange = (status: OrderStatus | '') => {
    const newFilters = { ...filters, status };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters: OrderFilterValues = { status: '', startDate: '', endDate: '' };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = filters.status || filters.startDate || filters.endDate;

  return (
    <Box sx={{ mb: 3 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: 'flex-end' }}>
        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel id="status-filter-label">Status</InputLabel>
          <Select
            labelId="status-filter-label"
            id="status-filter"
            value={filters.status}
            label="Status"
            onChange={(e) => handleStatusChange(e.target.value as OrderStatus | '')}
          >
            <MenuItem value="">All Statuses</MenuItem>
            <MenuItem value="CREATED">Created</MenuItem>
            <MenuItem value="PENDING_PAYMENT">Pending Payment</MenuItem>
            <MenuItem value="PAID">Paid</MenuItem>
            <MenuItem value="PROCESSING">Processing</MenuItem>
            <MenuItem value="SHIPPED">Shipped</MenuItem>
            <MenuItem value="DELIVERED">Delivered</MenuItem>
            <MenuItem value="CANCELLED">Cancelled</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Start Date"
          type="date"
          size="small"
          value={filters.startDate}
          onChange={(e) => handleDateChange('startDate', e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{ minWidth: 160 }}
        />

        <TextField
          label="End Date"
          type="date"
          size="small"
          value={filters.endDate}
          onChange={(e) => handleDateChange('endDate', e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{ minWidth: 160 }}
        />

        {hasActiveFilters && (
          <Button variant="outline" onClick={handleClearFilters}>
            Clear Filters
          </Button>
        )}
      </Stack>
    </Box>
  );
}
