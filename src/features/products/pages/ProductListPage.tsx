/**
 * ProductListPage component
 * Main product listing page with filters, sorting, and infinite scroll
 * 
 * Features:
 * - Responsive grid layout
 * - Infinite scroll with intersection observer
 * - Filter sidebar (category, price, rating)
 * - Sorting dropdown
 * - Skeleton loaders during data fetching
 * 
 * Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5, 4.6
 */

import { useState, useMemo } from 'react';
import { Container, Box, Typography, Select, MenuItem, FormControl, InputLabel, IconButton, Drawer } from '@mui/material';
import { FilterList as FilterListIcon } from '@mui/icons-material';
import { useGetProductsQuery } from '../api';
import { ProductCard } from '../components/ProductCard';
import { ProductFiltersComponent } from '../components/ProductFilters';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { SkeletonProductCard } from '../../../components/ui/Skeleton';
import type { ProductFilters, Product } from '../types';
import { SORT_OPTIONS } from '../types';

const DEFAULT_PAGE_SIZE = 12;

export default function ProductListPage() {

  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    sortBy: 'newest',
    sortOrder: 'desc',
  });


  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);


  const { data, isLoading, isFetching, error } = useGetProductsQuery(filters);


  const allProducts = useMemo(() => {
    if (!data) return [];
    


    return data.data;
  }, [data]);


  const handleLoadMore = () => {
    if (data?.hasMore && !isFetching) {
      setFilters((prev) => ({
        ...prev,
        page: (prev.page || 1) + 1,
      }));
    }
  };


  const { loadMoreRef } = useInfiniteScroll({
    onLoadMore: handleLoadMore,
    hasMore: data?.hasMore || false,
    isLoading: isFetching,
  });


  const handleFiltersChange = (newFilters: ProductFilters) => {
    setFilters(newFilters);
  };


  const handleSortChange = (sortValue: string) => {
    const sortOption = SORT_OPTIONS.find((opt) => opt.value === sortValue);
    if (sortOption) {
      setFilters((prev) => {
        const newFilters: ProductFilters = {
          ...prev,
          page: 1,
        };
        if (sortOption.sortBy) {
          newFilters.sortBy = sortOption.sortBy;
        }
        if (sortOption.sortOrder) {
          newFilters.sortOrder = sortOption.sortOrder;
        }
        return newFilters;
      });
    }
  };


  const currentSortValue = useMemo(() => {
    const option = SORT_OPTIONS.find(
      (opt) => opt.sortBy === filters.sortBy && opt.sortOrder === filters.sortOrder
    );
    return option?.value || 'newest';
  }, [filters.sortBy, filters.sortOrder]);


  const renderSkeletons = () => (
    <>
      {Array.from({ length: DEFAULT_PAGE_SIZE }).map((_, index) => (
        <div key={`skeleton-${index}`}>
          <SkeletonProductCard />
        </div>
      ))}
    </>
  );


  const renderProducts = () => (
    <>
      {allProducts.map((product: Product) => (
        <div key={product.id}>
          <ProductCard product={product} />
        </div>
      ))}
    </>
  );


  const filterSidebar = (
    <ProductFiltersComponent
      filters={filters}
      onFiltersChange={handleFiltersChange}
    />
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Products
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Discover our collection of premium products
        </Typography>
      </Box>

      <div className="flex gap-6">
        {/* Desktop Filter Sidebar */}
        <div className="hidden md:block md:w-64 flex-shrink-0">
          {filterSidebar}
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Toolbar */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
              gap: 2,
            }}
          >
            {/* Mobile Filter Button */}
            <IconButton
              onClick={() => setIsFilterDrawerOpen(true)}
              sx={{ display: { xs: 'flex', md: 'none' } }}
              aria-label="Open filters"
            >
              <FilterListIcon />
            </IconButton>

            {/* Results Count */}
            <Typography variant="body2" color="text.secondary">
              {data && !isLoading
                ? `Showing ${allProducts.length} of ${data.total} products`
                : 'Loading...'}
            </Typography>

            {/* Sort Dropdown */}
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel id="sort-label">Sort By</InputLabel>
              <Select
                labelId="sort-label"
                id="sort-select"
                value={currentSortValue}
                label="Sort By"
                onChange={(e) => handleSortChange(e.target.value)}
              >
                {SORT_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Error State */}
          {error && (
            <Box
              sx={{
                p: 4,
                textAlign: 'center',
                bgcolor: 'error.light',
                borderRadius: 2,
              }}
            >
              <Typography color="error">
                Failed to load products. Please try again.
              </Typography>
            </Box>
          )}

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isLoading && filters.page === 1 ? renderSkeletons() : renderProducts()}
          </div>

          {/* Loading More Indicator */}
          {isFetching && filters.page! > 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={`loading-${index}`}>
                  <SkeletonProductCard />
                </div>
              ))}
            </div>
          )}

          {/* Infinite Scroll Sentinel */}
          <div ref={loadMoreRef} style={{ height: '20px', margin: '20px 0' }} />

          {/* No More Products Message */}
          {!isFetching && allProducts.length > 0 && !data?.hasMore && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" color="text.secondary">
                You've reached the end of the list
              </Typography>
            </Box>
          )}

          {/* No Products Found */}
          {!isLoading && allProducts.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" gutterBottom>
                No products found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your filters or search criteria
              </Typography>
            </Box>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <Drawer
        anchor="left"
        open={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: '80%',
            maxWidth: 360,
            p: 2,
          },
        }}
      >
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Filters</Typography>
          <IconButton onClick={() => setIsFilterDrawerOpen(false)} aria-label="Close filters">
            ✕
          </IconButton>
        </Box>
        {filterSidebar}
      </Drawer>
    </Container>
  );
}
