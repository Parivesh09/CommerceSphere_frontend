/**
 * SearchBar component with debounced input and suggestions
 * Validates: Requirements 9.1, 9.2, 9.5
 */

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Paper, List, ListItem, ListItemButton, ListItemText, IconButton, Typography, Box, Chip } from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon, History as HistoryIcon, TrendingUp as TrendingIcon } from '@mui/icons-material';
import { useDebouncedSearch, useSearchSuggestions, useRecentSearches } from '../hooks';
import { ROUTES } from '../../../constants';

interface SearchBarProps {
  placeholder?: string;
  autoFocus?: boolean;
  onSearch?: (query: string) => void;
  className?: string;
}

export function SearchBar({ placeholder = 'Search products...', autoFocus = false, onSearch, className }: SearchBarProps) {
  const navigate = useNavigate();
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { searchTerm, debouncedTerm, setSearchTerm } = useDebouncedSearch(300);
  const { suggestions, isLoading } = useSearchSuggestions(debouncedTerm, showSuggestions && debouncedTerm.length >= 2);
  const { recentSearches, addSearch, removeSearch, clearAll } = useRecentSearches();


  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setIsFocused(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (query: string) => {
    if (!query.trim()) return;

    addSearch(query);
    setShowSuggestions(false);
    setIsFocused(false);

    if (onSearch) {
      onSearch(query);
    } else {
      navigate(`${ROUTES.SEARCH}?q=${encodeURIComponent(query)}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchTerm);
  };

  const handleFocus = () => {
    setIsFocused(true);
    setShowSuggestions(true);
  };

  const handleClear = () => {
    setSearchTerm('');
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (text: string) => {
    setSearchTerm(text);
    handleSearch(text);
  };

  const handleRecentSearchClick = (query: string) => {
    setSearchTerm(query);
    handleSearch(query);
  };

  const handleRemoveRecentSearch = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    removeSearch(id);
  };

  const showRecentSearches = isFocused && recentSearches.length > 0 && !searchTerm.trim();
  const showSuggestionsDropdown = showSuggestions && debouncedTerm.length >= 2 && suggestions.length > 0;

  return (
    <Box ref={containerRef} className={className} sx={{ position: 'relative', width: '100%' }}>
      <form onSubmit={handleSubmit}>
        <TextField
          inputRef={inputRef}
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={handleFocus}
          placeholder={placeholder}
          autoFocus={autoFocus}
          slotProps={{
            input: {
              startAdornment: <SearchIcon sx={{ color: 'var(--color-on-surface-variant)', mr: 1 }} />,
              endAdornment: searchTerm && (
                <IconButton size="small" onClick={handleClear} edge="end">
                  <ClearIcon />
                </IconButton>
              ),
            },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'var(--color-surface)',
            },
          }}
        />
      </form>

      {/* Recent Searches Dropdown */}
      {showRecentSearches && (
        <Paper
          className="glass-card"
          elevation={3}
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            mt: 1,
            maxHeight: 400,
            overflow: 'auto',
            zIndex: 1300,
            backgroundColor: 'transparent',
          }}
        >
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 1, borderColor: 'var(--color-outline-variant)' }}>
            <Typography variant="subtitle2" color="var(--color-on-surface-variant)">
              Recent Searches
            </Typography>
            <Chip label="Clear All" size="small" onClick={clearAll} sx={{ cursor: 'pointer' }} />
          </Box>
          <List>
            {recentSearches.map((search) => (
              <ListItem
                key={search.id}
                disablePadding
                secondaryAction={
                  <IconButton edge="end" size="small" onClick={(e) => handleRemoveRecentSearch(e, search.id)}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                }
              >
                <ListItemButton onClick={() => handleRecentSearchClick(search.query)}>
                  <HistoryIcon sx={{ mr: 2, color: 'var(--color-on-surface-variant)' }} />
                  <ListItemText primary={search.query} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {/* Search Suggestions Dropdown */}
      {showSuggestionsDropdown && (
        <Paper
          className="glass-card"
          elevation={3}
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            mt: 1,
            maxHeight: 400,
            overflow: 'auto',
            zIndex: 1300,
            backgroundColor: 'transparent',
          }}
        >
          <List>
            {suggestions.map((suggestion) => (
              <ListItem key={suggestion.id} disablePadding>
                <ListItemButton onClick={() => handleSuggestionClick(suggestion.text)}>
                  {suggestion.type === 'product' ? (
                    <SearchIcon sx={{ mr: 2, color: 'var(--color-on-surface-variant)' }} />
                  ) : (
                    <TrendingIcon sx={{ mr: 2, color: 'var(--color-on-surface-variant)' }} />
                  )}
                  <ListItemText
                    primary={
                      <span
                        dangerouslySetInnerHTML={{
                          __html: highlightText(suggestion.text, debouncedTerm),
                        }}
                      />
                    }
                    secondary={suggestion.type === 'category' ? 'Category' : undefined}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {/* Loading indicator */}
      {isLoading && showSuggestions && debouncedTerm.length >= 2 && (
        <Paper
          className="glass-card"
          elevation={3}
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            mt: 1,
            p: 2,
            zIndex: 1300,
            backgroundColor: 'transparent',
          }}
        >
          <Typography variant="body2" color="var(--color-on-surface-variant)" align="center">
            Loading suggestions...
          </Typography>
        </Paper>
      )}
    </Box>
  );
}

/**
 * Highlight matching text in suggestions
 * Validates: Requirements 9.2
 */
function highlightText(text: string, query: string): string {
  if (!query.trim()) return text;

  const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
  return text.replace(regex, '<mark style="background-color: color-mix(in srgb, var(--color-warning) 30%, transparent); font-weight: 600;">$1</mark>');
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
