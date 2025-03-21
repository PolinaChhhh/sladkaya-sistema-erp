
import { useState, useCallback } from 'react';

// Local storage key
const SEARCH_QUERY_KEY = 'production_search_query';

export const useProductionSearch = () => {
  // Load saved search query from localStorage
  const getInitialSearchQuery = () => {
    try {
      const saved = localStorage.getItem(SEARCH_QUERY_KEY);
      return saved || '';
    } catch (e) {
      return '';
    }
  };
  
  const [searchQuery, setSearchQuery] = useState(getInitialSearchQuery);
  
  // Persist search query to localStorage
  const updateSearchQuery = useCallback((query: string) => {
    setSearchQuery(query);
    try {
      localStorage.setItem(SEARCH_QUERY_KEY, query);
    } catch (e) {
      console.error('Failed to save search query to localStorage', e);
    }
  }, []);
  
  return {
    searchQuery,
    setSearchQuery: updateSearchQuery
  };
};
