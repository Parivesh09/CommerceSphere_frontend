/**
 * ProductFilters component
 * Sidebar with category, price, and rating filters
 * 
 * Validates: Requirements 4.3
 */

import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import type { ProductFilters } from '../types';

export interface ProductFiltersProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  categories?: string[];
}

export const ProductFiltersComponent: React.FC<ProductFiltersProps> = ({
  filters,
  onFiltersChange,
  categories = ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Toys'],
}) => {
  const [localMinPrice, setLocalMinPrice] = useState(filters.minPrice?.toString() || '');
  const [localMaxPrice, setLocalMaxPrice] = useState(filters.maxPrice?.toString() || '');

  const handleCategoryChange = (category: string) => {
    const newFilters: ProductFilters = {
      ...filters,
      page: 1, // Reset to first page when filters change
    };
    
    if (filters.category === category) {
      delete newFilters.category;
    } else {
      newFilters.category = category;
    }
    
    onFiltersChange(newFilters);
  };

  const handleRatingChange = (rating: number) => {
    const newFilters: ProductFilters = {
      ...filters,
      page: 1,
    };
    
    if (filters.minRating === rating) {
      delete newFilters.minRating;
    } else {
      newFilters.minRating = rating;
    }
    
    onFiltersChange(newFilters);
  };

  const handlePriceApply = () => {
    const newFilters: ProductFilters = {
      ...filters,
      page: 1,
    };
    
    if (localMinPrice) {
      newFilters.minPrice = parseFloat(localMinPrice);
    } else {
      delete newFilters.minPrice;
    }
    
    if (localMaxPrice) {
      newFilters.maxPrice = parseFloat(localMaxPrice);
    } else {
      delete newFilters.maxPrice;
    }

    onFiltersChange(newFilters);
  };

  const handleClearFilters = () => {
    setLocalMinPrice('');
    setLocalMaxPrice('');
    const newFilters: ProductFilters = {
      page: 1,
    };
    if (filters.pageSize) {
      newFilters.pageSize = filters.pageSize;
    }
    onFiltersChange(newFilters);
  };

  const hasActiveFilters = !!(
    filters.category ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.minRating
  );

  return (
    <div className="space-y-6">
      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          fullWidth
          onClick={handleClearFilters}
        >
          Clear All Filters
        </Button>
      )}

      {/* Categories */}
      <Card padding="md">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Categories
        </h3>
        <div className="mt-4 space-y-2">
          {categories.map((category) => (
            <label
              key={category}
              className="flex cursor-pointer items-center gap-2 rounded-lg p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <input
                type="checkbox"
                checked={filters.category === category}
                onChange={() => handleCategoryChange(category)}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {category}
              </span>
            </label>
          ))}
        </div>
      </Card>

      {/* Price Range */}
      <Card padding="md">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Price Range
        </h3>
        <div className="mt-4 space-y-3">
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400">
              Min Price
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={localMinPrice}
              onChange={(e) => setLocalMinPrice(e.target.value)}
              placeholder="$0"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400">
              Max Price
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={localMaxPrice}
              onChange={(e) => setLocalMaxPrice(e.target.value)}
              placeholder="Any"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
          <Button
            variant="primary"
            size="sm"
            fullWidth
            onClick={handlePriceApply}
          >
            Apply
          </Button>
        </div>
      </Card>

      {/* Rating Filter */}
      <Card padding="md">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Minimum Rating
        </h3>
        <div className="mt-4 space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <label
              key={rating}
              className="flex cursor-pointer items-center gap-2 rounded-lg p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <input
                type="radio"
                name="rating"
                checked={filters.minRating === rating}
                onChange={() => handleRatingChange(rating)}
                className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <svg
                    key={index}
                    className={`h-4 w-4 ${
                      index < rating
                        ? 'text-yellow-400'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                  & up
                </span>
              </div>
            </label>
          ))}
        </div>
      </Card>
    </div>
  );
};
