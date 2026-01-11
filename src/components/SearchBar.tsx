import React from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  value, 
  onChange
}) => {
  return (
    <input
      type="text"
      placeholder="Search cities..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="search-input"
    />
  );
};

export default SearchBar;