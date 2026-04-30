import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useSearchParams } from 'react-router-dom';
import { Category, useGetListings } from '_entities/listing';

export const useHome = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') as Category | null;

  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState<Category[]>(
    initialCategory ? [initialCategory] : []
  );

  const { getAllListings } = useGetListings(page, perPage, search, categories);

  const { data, isError, isLoading, error } = getAllListings;

  const handleOnSearch = useDebouncedCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
      setPage(1);
    },
    500
  );

  const handleSetCategory = (category: Category) => {
    setCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((item) => item !== category);
      }
      return [...prev, category];
    });
    setPage(1);
  };

  const clearCategories = () => {
    setCategories([]);
    setPage(1);
  };

  return {
    listings: data?.listings,
    totalPages: data?.meta.totalPages,
    isLoading,
    isError,
    error,
    page,
    setPage,
    handleOnSearch,
    search,
    handleSetCategory,
    clearCategories,
    categories,
  };
};
