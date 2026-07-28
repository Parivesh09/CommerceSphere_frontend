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
      <div className="min-h-screen bg-background text-on-surface">
        <div className="max-w-6xl mx-auto px-margin-mobile md:px-margin-desktop py-xl">
          <SearchBar autoFocus />
          <div className="text-center mt-lg">
            <p className="font-headline-md text-headline-md text-on-surface-variant">
              Enter a search query to find products
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <div className="max-w-6xl mx-auto px-margin-mobile md:px-margin-desktop py-xl">
        {/* Search Bar */}
        <div className="mb-gutter">
          <SearchBar />
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-center flex-wrap gap-sm mb-gutter">
          <p className="font-headline-md text-headline-md text-on-surface">
            {isLoading ? 'Searching...' : `Results for "${query}"`}
            {data && (
              <span className="font-body-sm text-body-sm text-on-surface-variant ml-sm">
                ({data.total} products)
              </span>
            )}
          </p>

          {/* Sort Dropdown */}
          <FormControl size="small" sx={{ minWidth: 200, '& .MuiInputLabel-root': { color: 'var(--color-on-surface-variant)', fontFamily: 'inherit', fontWeight: 600, fontSize: '12px' }, '& .MuiOutlinedInput-root': { borderRadius: '12px', backgroundColor: 'var(--color-surface)', '& fieldset': { borderColor: 'var(--color-outline-variant)' }, '&:hover fieldset': { borderColor: 'var(--color-primary)' }, '&.Mui-focused fieldset': { borderColor: 'var(--color-primary)' } }, '& .MuiSelect-select': { color: 'var(--color-on-surface)', fontFamily: 'inherit', fontSize: '14px' }, '& .MuiSvgIcon-root': { color: 'var(--color-on-surface-variant)' } }}>
            <InputLabel sx={{ color: 'var(--color-on-surface-variant)', fontFamily: 'inherit', fontSize: '12px', fontWeight: 600 }}>Sort By</InputLabel>
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
        </div>

        <div className="flex gap-gutter flex-col md:flex-row">
          {/* Filters Sidebar */}
          <div className="w-full md:w-1/4">
            <Paper sx={{ p: '24px', position: 'sticky', top: 80, backgroundColor: 'var(--color-surface)', borderRadius: '16px', border: '1px solid var(--color-outline-variant)', boxShadow: 'none' }}>
              <div className="flex justify-between items-center mb-gutter">
                <p className="font-headline-md text-headline-md text-on-surface flex items-center gap-sm">
                  <span className="material-symbols-outlined text-[20px]">filter_list</span> Filters
                </p>
                {hasActiveFilters && (
                  <button onClick={handleClearFilters} className="font-label-md text-label-md text-primary flex items-center gap-xs">
                    <span className="material-symbols-outlined text-[16px]">close</span> Clear
                  </button>
                )}
              </div>

              {/* Price Range Filter */}
              <div className="mb-gutter">
                <p className="font-label-md text-label-md text-on-surface-variant mb-sm">Price Range</p>
                <Slider
                  value={priceRange}
                  onChange={handlePriceRangeChange}
                  onChangeCommitted={handlePriceRangeCommit}
                  valueLabelDisplay="auto"
                  min={0}
                  max={1000}
                  step={10}
                  valueLabelFormat={(value) => `$${value}`}
                  sx={{ color: 'var(--color-primary)', '& .MuiSlider-thumb': { backgroundColor: 'var(--color-primary)' }, '& .MuiSlider-track': { backgroundColor: 'var(--color-primary)' }, '& .MuiSlider-rail': { backgroundColor: 'var(--color-outline-variant)' }, '& .MuiSlider-valueLabel': { backgroundColor: 'var(--color-primary)', fontFamily: 'inherit', fontSize: '12px' } }}
                />
                <div className="flex justify-between mt-sm">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">${priceRange[0]}</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">${priceRange[1]}</span>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-gutter">
                <p className="font-label-md text-label-md text-on-surface-variant mb-sm">Minimum Rating</p>
                <div className="flex flex-col gap-sm">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <Chip
                      key={rating}
                      label={`${rating}+ Stars`}
                      onClick={() => handleRatingChange(rating)}
                      color={filters.minRating === rating ? 'primary' : 'default'}
                      variant={filters.minRating === rating ? 'filled' : 'outlined'}
                      sx={{ justifyContent: 'flex-start', fontFamily: 'inherit', fontWeight: 600, fontSize: '12px', backgroundColor: filters.minRating === rating ? 'var(--color-primary)' : 'transparent', color: filters.minRating === rating ? 'var(--color-on-primary)' : 'var(--color-on-surface)', borderColor: 'var(--color-outline-variant)', borderRadius: '12px', '&:hover': { backgroundColor: filters.minRating === rating ? 'var(--color-primary)' : 'var(--color-surface)' } }}
                    />
                  ))}
                </div>
              </div>
            </Paper>
          </div>

          {/* Results Grid */}
          <div className="flex-1">
            {error && (
              <div className="glass-card rounded-2xl p-md mb-gutter font-body-sm text-body-sm" style={{ color: 'var(--color-error, #dc2626)', backgroundColor: 'rgba(220, 38, 38, 0.08)' }}>
                <span className="material-symbols-outlined text-[16px] mr-sm">error</span> Failed to load search results. Please try again.
              </div>
            )}

            {isLoading ? (
              <div className="flex justify-center py-xl">
                <CircularProgress sx={{ color: 'var(--color-primary)' }} />
              </div>
            ) : data && data.data.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-gutter">
                  {data.data.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {data.hasMore && (
                  <div className="flex justify-center mt-gutter">
                    <button
                      onClick={() => setPage((p) => p + 1)}
                      disabled={isFetching}
                      className="px-6 py-3 bg-primary text-on-primary font-label-md text-label-md rounded-xl hover:brightness-90 disabled:opacity-50 transition-all"
                    >
                      {isFetching ? 'Loading...' : 'Load More'}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-xl glass-card rounded-2xl p-lg">
                <span className="material-symbols-outlined text-[48px] text-on-surface-variant">search_off</span>
                <p className="font-headline-md text-headline-md text-on-surface mt-sm">No products found</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
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
      className="glass-card"
      sx={{
        p: '16px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        borderRadius: '16px',
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-outline-variant)',
        boxShadow: 'none',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        },
      }}
    >
      <div className="relative w-full mb-sm" style={{ paddingTop: '100%', backgroundColor: 'var(--color-surface-variant)', borderRadius: '8px' }}>
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
              borderRadius: 8,
            }}
          />
        )}
      </div>
      <p className="font-body-sm text-body-sm text-on-surface font-bold truncate mb-sm">
        {product.name}
      </p>
      <p className="font-headline-md text-headline-md text-primary">
        ${product.price.toFixed(2)}
      </p>
      {product.rating && (
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          <span className="material-symbols-outlined text-[14px] align-text-bottom">star</span> {product.rating} ({product.reviewCount} reviews)
        </p>
      )}
    </Paper>
  );
}
