/**
 * Product-related type definitions
 * Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5, 4.6
 */

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  order: number;
}

export interface VariantOption {
  name: string;
  value: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  options: VariantOption[];
  price?: number;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: ProductImage[];
  variants: ProductVariant[];
  category: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}

export interface ProductFilters {
  page?: number;
  pageSize?: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sortBy?: 'price' | 'rating' | 'newest' | 'name';
  sortOrder?: 'asc' | 'desc';
  search?: string;
  tags?: string[];
}

export type SortOption = {
  value: string;
  label: string;
  sortBy: ProductFilters['sortBy'];
  sortOrder: ProductFilters['sortOrder'];
};

export const SORT_OPTIONS: SortOption[] = [
  { value: 'newest', label: 'Newest', sortBy: 'newest', sortOrder: 'desc' },
  { value: 'price-asc', label: 'Price: Low to High', sortBy: 'price', sortOrder: 'asc' },
  { value: 'price-desc', label: 'Price: High to Low', sortBy: 'price', sortOrder: 'desc' },
  { value: 'rating', label: 'Highest Rated', sortBy: 'rating', sortOrder: 'desc' },
  { value: 'name', label: 'Name: A to Z', sortBy: 'name', sortOrder: 'asc' },
];
