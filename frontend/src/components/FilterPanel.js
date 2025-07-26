import React, { useState, useEffect, useCallback } from 'react';

// Custom hook for debounced values
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const FilterPanel = ({ 
  filters, 
  setFilters, 
  showFilters, 
  clearFilters 
}) => {
  const [localFilters, setLocalFilters] = useState(filters);
  
  // Debounce text inputs
  const debouncedCompany = useDebounce(localFilters.company, 200);
  const debouncedPosition = useDebounce(localFilters.position, 200);

  // Update parent filters when debounced values change
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      company: debouncedCompany,
      position: debouncedPosition
    }));
  }, [debouncedCompany, debouncedPosition, setFilters]);

  // Update local filters when parent filters change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleLocalFilterChange = useCallback((field, value) => {
    setLocalFilters(prev => ({ ...prev, [field]: value }));
    
    // For non-text fields, update immediately
    if (field !== 'company' && field !== 'position') {
      setFilters(prev => ({ ...prev, [field]: value }));
    }
  }, [setFilters]);

  const handleClearFilters = useCallback(() => {
    const clearedFilters = {
      status: 'all',
      company: '',
      position: '',
      dateFrom: '',
      dateTo: ''
    };
    setLocalFilters(clearedFilters);
    clearFilters();
  }, [clearFilters]);

  // Validate date range
  const isDateRangeValid = !localFilters.dateFrom || !localFilters.dateTo || 
    new Date(localFilters.dateFrom) <= new Date(localFilters.dateTo);

  // Only render the filter controls when showFilters is true
  if (!showFilters) {
    return null;
  }

  return (
    <div 
      className="p-4 border-b border-gray-200 bg-gray-50"
      role="region"
      aria-label="Application filters"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status-filter"
            value={localFilters.status}
            onChange={(e) => handleLocalFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-describedby="status-help"
          >
            <option value="all">All Statuses</option>
            <option value="Applied">Applied</option>
            <option value="Interviewing">Interviewing</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
          <p id="status-help" className="sr-only">Filter applications by their current status</p>
        </div>
        
        <div>
          <label htmlFor="company-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Company
          </label>
          <input
            id="company-filter"
            type="text"
            placeholder="Search companies..."
            value={localFilters.company}
            onChange={(e) => handleLocalFilterChange('company', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-describedby="company-help"
          />
          <p id="company-help" className="sr-only">Search applications by company name</p>
        </div>
        
        <div>
          <label htmlFor="position-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Position
          </label>
          <input
            id="position-filter"
            type="text"
            placeholder="Search positions..."
            value={localFilters.position}
            onChange={(e) => handleLocalFilterChange('position', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-describedby="position-help"
          />
          <p id="position-help" className="sr-only">Search applications by position title</p>
        </div>
        
        <div>
          <label htmlFor="date-from-filter" className="block text-sm font-medium text-gray-700 mb-1">
            From Date
          </label>
          <input
            id="date-from-filter"
            type="date"
            value={localFilters.dateFrom}
            onChange={(e) => handleLocalFilterChange('dateFrom', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-describedby="date-from-help"
          />
          <p id="date-from-help" className="sr-only">Filter applications applied after this date</p>
        </div>
        
        <div>
          <label htmlFor="date-to-filter" className="block text-sm font-medium text-gray-700 mb-1">
            To Date
          </label>
          <input
            id="date-to-filter"
            type="date"
            value={localFilters.dateTo}
            onChange={(e) => handleLocalFilterChange('dateTo', e.target.value)}
            min={localFilters.dateFrom || undefined}
            className={`w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              isDateRangeValid ? 'border-gray-300' : 'border-red-300'
            }`}
            aria-describedby="date-to-help"
            aria-invalid={!isDateRangeValid}
          />
          <p id="date-to-help" className="sr-only">Filter applications applied before this date</p>
          {!isDateRangeValid && (
            <p className="text-red-500 text-xs mt-1">End date must be after start date</p>
          )}
        </div>
      </div>
      
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleClearFilters}
          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          aria-label="Clear all filters"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default FilterPanel; 