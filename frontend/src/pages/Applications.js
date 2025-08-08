import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { PlusIcon, BuildingOfficeIcon, MagnifyingGlassIcon, ArrowUpTrayIcon, TrashIcon } from '@heroicons/react/24/outline';

// Import components
import StatsCards from '../components/dashboard/StatsCards';
import FilterPanel from '../components/applications/FilterPanel';
import SortControls from '../components/applications/SortControls';
import ApplicationCard from '../components/applications/ApplicationCard';
import ApplicationForm from '../components/applications/ApplicationForm';
import BulkImportModal from '../components/applications/BulkImportModal';

// Import custom hook
import useFilteredAndSorted from '../hooks/useFilteredAndSorted';

const Applications = () => {
  const { applications, addApplication, updateApplication, deleteApplication, fetchApplications, clearAllApplications } = useApp();
  const location = useLocation();
  
  // State management
  const [showForm, setShowForm] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const handleBulkImport = useCallback(() => {
    setShowBulkImport(true);
  }, []);

  const handleImportComplete = useCallback((result) => {
    fetchApplications();
    console.log('Import completed:', result);
  }, [fetchApplications]);

  const handleClearAll = useCallback(async () => {
    const confirmed = window.confirm(
      '⚠️ WARNING: This will permanently delete ALL your applications!\n\n' +
      'This action cannot be undone. You will lose:\n' +
      '• All application data\n' +
      '• Associated XP and achievements\n' +
      '• Application history\n\n' +
      'Are you absolutely sure you want to continue?'
    );
    
    if (confirmed) {
      try {
        await clearAllApplications();
      } catch (error) {
        console.error('Error clearing applications:', error);
      }
    }
  }, [clearAllApplications]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
          <p className="text-gray-600 mt-1">Track your co-op applications and progress</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleBulkImport}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
            aria-label="Bulk import applications"
          >
            <ArrowUpTrayIcon className="h-5 w-5 mr-2" aria-hidden="true" />
            Import from File
          </button>
          <button
            onClick={handleAddNew}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            aria-label="Add new application"
          >
            <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
            Add Application
          </button>
          {applications.length > 0 && (
            <button
              onClick={handleClearAll}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
              aria-label="Clear all applications"
            >
              <TrashIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              Clear All
            </button>
          )}
        </div>
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

      <BulkImportModal
        isOpen={showBulkImport}
        onClose={() => setShowBulkImport(false)}
        onImportComplete={handleImportComplete}
      />

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
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleAddNew}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none"
              aria-label="Add your first application"
            >
              <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              Add Your First Application
            </button>
            <button
              onClick={handleBulkImport}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors focus:ring-2 focus:ring-green-500 focus:outline-none"
              aria-label="Bulk import applications"
            >
              <ArrowUpTrayIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              Bulk Import
            </button>
          </div>
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
