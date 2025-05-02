// context/SearchContext.js

import React, { createContext, useState, useContext } from 'react';

// Create the SearchContext
const SearchContext = createContext();

// Create a custom hook to access the context
export const useSearch = () => {
  return useContext(SearchContext);
};

// Create a SearchProvider component
export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Update search query
  const updateSearchQuery = (query) => {
    setSearchQuery(query);
  };

  return (
    <SearchContext.Provider value={{ searchQuery, updateSearchQuery }}>
      {children}
    </SearchContext.Provider>
  );
};
