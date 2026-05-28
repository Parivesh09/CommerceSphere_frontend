/**
 * Search-specific hooks
 * Validates: Requirements 9.1, 9.5
 */

import { useState, useCallback, useEffect } from 'react';
import { useLazyGetSearchSuggestionsQuery } from '../api';
import { getRecentSearches, addRecentSearch, removeRecentSearch, clearRecentSearches } from '../utils';
import type { RecentSearch } from '../types';

/**
 * Hook for debounced search input
 * Validates: Requirements 9.1
 */
export function useDebouncedSearch(delay: number = 300) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, delay]);

  return {
    searchTerm,
    debouncedTerm,
    setSearchTerm,
  };
}

/**
 * Hook for search suggestions with debouncing
 * Validates: Requirements 9.1, 9.2
 */
export function useSearchSuggestions(query: string, enabled: boolean = true) {
  const [trigger, { data: suggestions, isLoading, isFetching }] = useLazyGetSearchSuggestionsQuery();

  useEffect(() => {
    if (enabled && query.trim().length >= 2) {
      trigger(query);
    }
  }, [query, enabled, trigger]);

  return {
    suggestions: suggestions || [],
    isLoading: isLoading || isFetching,
  };
}

/**
 * Hook for managing recent searches
 * Validates: Requirements 9.5
 */
export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>(() => {

    return getRecentSearches();
  });

  const addSearch = useCallback((query: string) => {
    addRecentSearch(query);
    setRecentSearches(getRecentSearches());
  }, []);

  const removeSearch = useCallback((id: string) => {
    removeRecentSearch(id);
    setRecentSearches(getRecentSearches());
  }, []);

  const clearAll = useCallback(() => {
    clearRecentSearches();
    setRecentSearches([]);
  }, []);

  return {
    recentSearches,
    addSearch,
    removeSearch,
    clearAll,
  };
}
