import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { PlusIcon, BuildingOfficeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

// Import components
import StatsCards from '../components/StatsCards';
import FilterPanel from '../components/FilterPanel';
import SortControls from '../components/SortControls';
import ApplicationCard from '../components/ApplicationCard';
import ApplicationForm from '../components/ApplicationForm';

// Import custom hook
import useFilteredAndSorted from '../hooks/useFilteredAndSorted';

const Applications = () => {
  const { applications, addApplication, updateApplication, deleteApplication } = useApp();
  const location = useLocation();
  
  // State management
  const [showForm, setShowForm] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter state
  const [filters, setFilters] = useState({
    status: 'all',
    company: '',
    position: '',
    dateFrom: '',
    dateTo: ''
  });

  // Sort state
  const [sortBy, setSortBy] = useState('applied_date');
  const [sortOrder, setSortOrder] = useState('desc');

  // Handle URL parameters for pre-applied filters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const statusFilter = searchParams.get('status');
    
    if (statusFilter && ['Applied', 'Interviewing', 'Offer', 'Rejected'].includes(statusFilter)) {
      setFilters(prev => ({
        ...prev,
        status: statusFilter
      }));
      // Auto-show filters when coming from dashboard
      setShowFilters(true);
    }
  }, [location.search]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = applications.length;
    const applied = applications.filter(app => app.status === 'Applied').length;
    const interviewing = applications.filter(app => app.status === 'Interviewing').length;
    const offers = applications.filter(app => app.status === 'Offer').length;
    const rejected = applications.filter(app => app.status === 'Rejected').length;
    
    return { total, applied, interviewing, offers, rejected };
  }, [applications]);

  // Use custom hook for filtering and sorting
  const filteredAndSortedApps = useFilteredAndSorted(applications, filters, sortBy, sortOrder);

  // Memoized handlers with useCallback
  const handleSubmit = useCallback(async (data) => {
    setIsSubmitting(true);
    try {
      if (editingApp) {
        await updateApplication(editingApp.id, data);
      } else {
        await addApplication(data);
      }
      setShowForm(false);
      setEditingApp(null);
    } catch (error) {
      console.error('Error saving application:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [editingApp, addApplication, updateApplication]);

  const handleCancel = useCallback(() => {
    setShowForm(false);
    setEditingApp(null);
  }, []);

  const handleDeleteApplication = useCallback(async (id) => {
    if (!window.confirm('Are you sure you want to delete this application?')) return;
    try {
      await deleteApplication(id);
    } catch (error) {
      console.error('Error deleting application:', error);
    }
  }, [deleteApplication]);

  const editApplication = useCallback((app) => {
    setEditingApp(app);
    setShowForm(true);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      status: 'all',
      company: '',
      position: '',
      dateFrom: '',
      dateTo: ''
    });
  }, []);

  const handleAddNew = useCallback(() => {
    setShowForm(true);
    setEditingApp(null);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
          <p className="text-gray-600 mt-1">Track your co-op applications and progress</p>
        </div>
        <button
          onClick={handleAddNew}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          aria-label="Add new application"
        >
          <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
          Add Application
        </button>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Add/Edit Form */}
      {showForm && (
        <ApplicationForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          editingApp={editingApp}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Filters and Sort */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Applications ({filteredAndSortedApps.length})
              </h3>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors focus:ring-2 focus:ring-gray-500 focus:outline-none"
                aria-expanded={showFilters}
                aria-controls="filter-panel"
              >
                <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                </svg>
                Filters
              </button>
            </div>
            
            <SortControls
              sortBy={sortBy}
              setSortBy={setSortBy}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            />
          </div>
        </div>

        {/* Filter Panel */}
        <FilterPanel
          filters={filters}
          setFilters={setFilters}
          showFilters={showFilters}
          clearFilters={clearFilters}
        />
      </div>

      {/* Applications List */}
      {applications.length === 0 ? (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-8 text-center">
          <BuildingOfficeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" aria-hidden="true" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
          <p className="text-gray-500 mb-4">Add your first application to get started!</p>
          <button
            onClick={handleAddNew}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none"
            aria-label="Add your first application"
          >
            <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
            Add Your First Application
          </button>
        </div>
      ) : filteredAndSortedApps.length === 0 ? (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-8 text-center">
          <MagnifyingGlassIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" aria-hidden="true" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No applications match your filters</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search criteria or clear the filters.</p>
          <button
            onClick={clearFilters}
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors focus:ring-2 focus:ring-gray-500 focus:outline-none"
            aria-label="Clear all filters"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredAndSortedApps.map((app) => (
            <ApplicationCard
              key={app.id}
              app={app}
              editApplication={editApplication}
              deleteApplication={handleDeleteApplication}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Applications;
