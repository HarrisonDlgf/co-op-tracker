import { useMemo } from 'react';

const useFilteredAndSorted = (applications, filters, sortBy, sortOrder) => {
  return useMemo(() => {
    // Filter applications
    let filtered = applications.filter(app => {
      // Status filter
      if (filters.status !== 'all' && app.status !== filters.status) {
        return false;
      }
      
      // Company filter
      if (filters.company && !app.company.toLowerCase().includes(filters.company.toLowerCase())) {
        return false;
      }
      
      // Position filter
      if (filters.position && !app.position.toLowerCase().includes(filters.position.toLowerCase())) {
        return false;
      }
      
      // Date range filter
      if (filters.dateFrom && app.applied_date) {
        const appDate = new Date(app.applied_date);
        const fromDate = new Date(filters.dateFrom);
        if (appDate < fromDate) return false;
      }
      
      if (filters.dateTo && app.applied_date) {
        const appDate = new Date(app.applied_date);
        const toDate = new Date(filters.dateTo);
        if (appDate > toDate) return false;
      }
      
      return true;
    });

    // Sort applications
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'company':
          aValue = a.company.toLowerCase();
          bValue = b.company.toLowerCase();
          break;
        case 'position':
          aValue = a.position.toLowerCase();
          bValue = b.position.toLowerCase();
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'applied_date':
        default:
          aValue = a.applied_date ? new Date(a.applied_date) : new Date(0);
          bValue = b.applied_date ? new Date(b.applied_date) : new Date(0);
          break;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [applications, filters, sortBy, sortOrder]);
};

export default useFilteredAndSorted; 