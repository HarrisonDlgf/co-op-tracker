import React from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const SortControls = ({ sortBy, setSortBy, sortOrder, setSortOrder }) => {
  const sortOptions = [
    { value: 'applied_date', label: 'Date Applied' },
    { value: 'company', label: 'Company' },
    { value: 'position', label: 'Position' },
    { value: 'status', label: 'Status' }
  ];

  const handleSortOrderToggle = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="flex items-center space-x-2" role="group" aria-label="Sort applications">
      <label htmlFor="sort-select" className="text-sm font-medium text-gray-700">
        Sort by:
      </label>
      <select
        id="sort-select"
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        aria-describedby="sort-help"
      >
        {sortOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <button
        onClick={handleSortOrderToggle}
        className="p-1 text-gray-400 hover:text-gray-600 transition-colors rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
        aria-label={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
        title={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
      >
        {sortOrder === 'asc' ? (
          <ChevronUpIcon className="h-4 w-4" />
        ) : (
          <ChevronDownIcon className="h-4 w-4" />
        )}
      </button>
      <p id="sort-help" className="sr-only">
        Choose how to sort your applications and click the arrow to change sort direction
      </p>
    </div>
  );
};

export default SortControls; 