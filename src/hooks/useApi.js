import { useState, useEffect, useCallback } from 'react';

// API 호출 상태를 관리하는 커스텀 훅
export const useApi = (apiFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  useEffect(() => {
    fetchData();
  }, dependencies);

  return { data, loading, error, refetch: fetchData };
};

// 즐겨찾기 토글을 위한 커스텀 훅
export const useFavoriteToggle = () => {
  const [isLoading, setIsLoading] = useState(false);

  const toggleFavorite = useCallback(async (apiFunction, id) => {
    try {
      setIsLoading(true);
      const result = await apiFunction(id);
      return result;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { toggleFavorite, isLoading };
};

// 검색을 위한 커스텀 훅
export const useSearch = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const performSearch = useCallback(async (searchAPI, keyword) => {
    if (!keyword.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      const result = await searchAPI(keyword);
      setSearchResults(result.data || []);
    } catch (error) {
      console.error('검색 실패:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  return { searchResults, isSearching, performSearch };
};
