import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { Category, useGetListings } from '_entities/listing';

export const useHome = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);

  const { getAllListings } = useGetListings(
    currentPage,
    10,
    search,
    categories
  );

  const { data, isError, isLoading } = getAllListings;

  const handleOnSearch = useDebouncedCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
      setCurrentPage(1);
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
  };

  return {
    listings: data?.listings,
    totalPages: data?.meta.totalPages,
    isLoading,
    isError,
    currentPage,
    setCurrentPage,
    handleOnSearch,
    search,
    handleSetCategory,
    categories,
  };
};
