import React, { createContext, useContext, useState } from 'react';

const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
  const [searchFilters, setSearchFilters] = useState(null);

  const applyFilters = (filters) => {
    setSearchFilters(filters);
  };

  const clearFilters = () => {
    setSearchFilters(null);
  };

  return (
    <FilterContext.Provider value={{ searchFilters, applyFilters, clearFilters }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => useContext(FilterContext);
