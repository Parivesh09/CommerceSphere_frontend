/**
 * Search utility functions
 * Validates: Requirements 9.5
 */

import { storage } from '../../../services/storage';
import type { RecentSearch } from '../types';

const RECENT_SEARCHES_KEY = 'recent_searches';
const MAX_RECENT_SEARCHES = 10;

/**
 * Get recent searches from localStorage
 */
export function getRecentSearches(): RecentSearch[] {
  const searches = storage.get<RecentSearch[]>(RECENT_SEARCHES_KEY);
  return searches || [];
}

/**
 * Add a search query to recent searches
 * Deduplicates and maintains max limit
 */
export function addRecentSearch(query: string): void {
  if (!query.trim()) return;

  const searches = getRecentSearches();
  

  const filtered = searches.filter((s) => s.query.toLowerCase() !== query.toLowerCase());
  

  const newSearch: RecentSearch = {
    id: Date.now().toString(),
    query: query.trim(),
    timestamp: Date.now(),
  };
  
  const updated = [newSearch, ...filtered].slice(0, MAX_RECENT_SEARCHES);
  storage.set(RECENT_SEARCHES_KEY, updated);
}

/**
 * Clear all recent searches
 */
export function clearRecentSearches(): void {
  storage.remove(RECENT_SEARCHES_KEY);
}

/**
 * Remove a specific recent search
 */
export function removeRecentSearch(id: string): void {
  const searches = getRecentSearches();
  const filtered = searches.filter((s) => s.id !== id);
  storage.set(RECENT_SEARCHES_KEY, filtered);
}

/**
 * Highlight matching text in a string
 * Returns HTML string with <mark> tags around matches
 */
export function highlightMatch(text: string, query: string): string {
  if (!query.trim()) return text;
  
  const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

/**
 * Escape special regex characters
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
