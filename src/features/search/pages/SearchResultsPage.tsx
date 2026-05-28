/**
 * Search Results Page
 * Validates: Requirements 9.3, 9.4
 */

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Button,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { FilterList as FilterIcon, Clear as ClearIcon } from '@mui/icons-material';
import { useSearchProductsQuery } from '../api';
import { SearchBar } from '../components/SearchBar';
import type { SearchQuery, SearchFilters } from '../types';
import type { Product } from '../../products/types';
import { SORT_OPTIONS } from '../../products/types';

export function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [filters, setFilters] = useState<SearchFilters>({
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : 0,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : 1000,
    minRating: searchParams.get('minRating') ? Number(searchParams.get('minRating')) : 0,
    sortBy: (searchParams.get('sortBy') as SearchQuery['sortBy']) || 'relevance',
    sortOrder: (searchParams.get('sortOrder') as SearchQuery['sortOrder']) || 'desc',
  });

  const [page, setPage] = useState(1);
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);

  const searchQuery: SearchQuery = {
    query,
    page,
    pageSize: 20,
    ...filters,
  };

  const { data, isLoading, isFetching, error } = useSearchProductsQuery(searchQuery, {
    skip: !query,
  });


  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (filters.category) params.set('category', filters.category);
    if (filters.minPrice) params.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice.toString());
    if (filters.minRating) params.set('minRating', filters.minRating.toString());
    if (filters.sortBy) params.set('sortBy', filters.sortBy);
    if (filters.sortOrder) params.set('sortOrder', filters.sortOrder);

    setSearchParams(params, { replace: true });
  }, [filters, query, setSearchParams]);

  const handleSortChange = (value: string) => {
    const option = SORT_OPTIONS.find((opt) => opt.value === value);
    if (option) {
      setFilters((prev) => ({
        ...prev,
        sortBy: option.sortBy as SearchQuery['sortBy'] || 'relevance',
        sortOrder: option.sortOrder || 'desc',
      }));
    }
  };

  const handlePriceRangeChange = (_event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
  };

  const handlePriceRangeCommit = () => {
    setFilters((prev) => ({
      ...prev,
      minPrice: priceRange[0] || 0,
      maxPrice: priceRange[1] || 1000,
    }));
  };

  const handleRatingChange = (rating: number) => {
    setFilters((prev) => ({
      ...prev,
      minRating: prev.minRating === rating ? 0 : rating,
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      category: '',
      minPrice: 0,
      maxPrice: 1000,
      minRating: 0,
      sortBy: 'relevance',
      sortOrder: 'desc',
    });
    setPriceRange([0, 1000]);
    setPage(1);
  };

  const hasActiveFilters = filters.category || filters.minPrice || filters.maxPrice || filters.minRating;

  if (!query) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <SearchBar autoFocus />
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="text.secondary">
            Enter a search query to find products
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Search Bar */}
      <Box sx={{ mb: 4 }}>
        <SearchBar />
      </Box>

      {/* Results Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h5">
          {isLoading ? 'Searching...' : `Results for "${query}"`}
          {data && (
            <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 2 }}>
              ({data.total} products)
            </Typography>
          )}
        </Typography>

        {/* Sort Dropdown */}
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={`${filters.sortBy}-${filters.sortOrder}`}
            label="Sort By"
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <MenuItem value="relevance-desc">Relevance</MenuItem>
            {SORT_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
        {/* Filters Sidebar */}
        <Box sx={{ width: { xs: '100%', md: '25%' } }}>
          <Paper sx={{ p: 2, position: 'sticky', top: 80 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FilterIcon /> Filters
              </Typography>
              {hasActiveFilters && (
                <Button size="small" startIcon={<ClearIcon />} onClick={handleClearFilters}>
                  Clear
                </Button>
              )}
            </Box>

            {/* Price Range Filter */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Price Range
              </Typography>
              <Slider
                value={priceRange}
                onChange={handlePriceRangeChange}
                onChangeCommitted={handlePriceRangeCommit}
                valueLabelDisplay="auto"
                min={0}
                max={1000}
                step={10}
                valueLabelFormat={(value) => `$${value}`}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="caption">${priceRange[0]}</Typography>
                <Typography variant="caption">${priceRange[1]}</Typography>
              </Box>
            </Box>

            {/* Rating Filter */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Minimum Rating
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <Chip
                    key={rating}
                    label={`${rating}+ Stars`}
                    onClick={() => handleRatingChange(rating)}
                    color={filters.minRating === rating ? 'primary' : 'default'}
                    variant={filters.minRating === rating ? 'filled' : 'outlined'}
                    sx={{ justifyContent: 'flex-start' }}
                  />
                ))}
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Results Grid */}
        <Box sx={{ flex: 1 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Failed to load search results. Please try again.
            </Alert>
          )}

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : data && data.data.length > 0 ? (
            <>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                  },
                  gap: 2,
                }}
              >
                {data.data.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </Box>

              {/* Pagination */}
              {data.hasMore && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Button
                    variant="outlined"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={isFetching}
                  >
                    {isFetching ? 'Loading...' : 'Load More'}
                  </Button>
                </Box>
              )}
            </>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No products found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search or filters
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  );
}

/**
 * Simple Product Card component
 * TODO: Replace with shared ProductCard component when available
 */
interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  return (
    <Paper
      sx={{
        p: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      <Box
        sx={{
          width: '100%',
          paddingTop: '100%',
          position: 'relative',
          mb: 2,
          backgroundColor: 'grey.100',
          borderRadius: 1,
        }}
      >
        {product.images?.[0] && (
          <img
            src={product.images[0].url}
            alt={product.name}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: 4,
            }}
          />
        )}
      </Box>
      <Typography variant="subtitle1" noWrap gutterBottom>
        {product.name}
      </Typography>
      <Typography variant="h6" color="primary">
        ${product.price.toFixed(2)}
      </Typography>
      {product.rating && (
        <Typography variant="caption" color="text.secondary">
          ⭐ {product.rating} ({product.reviewCount} reviews)
        </Typography>
      )}
    </Paper>
  );
}
