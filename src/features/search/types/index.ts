/**
 * Search-related type definitions
 * Validates: Requirements 9.1, 9.2, 9.3, 9.4, 9.5
 */

import type { Product, PaginatedResponse } from '../../products/types';

export interface SearchSuggestion {
  id: string;
  text: string;
  type: 'product' | 'category' | 'query';
  productId?: string;
  categoryId?: string;
}

export interface SearchQuery {
  query: string;
  page?: number;
  pageSize?: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sortBy?: 'relevance' | 'price' | 'rating' | 'newest';
  sortOrder?: 'asc' | 'desc';
}

export interface SearchResult {
  products: PaginatedResponse<Product>;
  suggestions: SearchSuggestion[];
  query: string;
}

export interface RecentSearch {
  id: string;
  query: string;
  timestamp: number;
}

export interface SearchFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sortBy?: 'relevance' | 'price' | 'rating' | 'newest';
  sortOrder?: 'asc' | 'desc';
}
