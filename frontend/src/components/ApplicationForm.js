import React from 'react';
import { useForm } from 'react-hook-form';

const ApplicationForm = ({ 
  onSubmit, 
  onCancel, 
  editingApp, 
  isSubmitting = false 
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: editingApp || {}
  });

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      <h2 className="text-xl font-semibold mb-4">
        {editingApp ? 'Edit Application' : 'Add New Application'}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
              Company *
            </label>
            <input
              id="company"
              type="text"
              {...register('company', { required: 'Company is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-describedby={errors.company ? 'company-error' : undefined}
              aria-invalid={errors.company ? 'true' : 'false'}
            />
            {errors.company && (
              <p id="company-error" className="text-red-500 text-sm mt-1" role="alert">
                {errors.company.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
              Position *
            </label>
            <input
              id="position"
              type="text"
              {...register('position', { required: 'Position is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-describedby={errors.position ? 'position-error' : undefined}
              aria-invalid={errors.position ? 'true' : 'false'}
            />
            {errors.position && (
              <p id="position-error" className="text-red-500 text-sm mt-1" role="alert">
                {errors.position.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status *
            </label>
            <select
              id="status"
              {...register('status', { required: 'Status is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-describedby={errors.status ? 'status-error' : undefined}
              aria-invalid={errors.status ? 'true' : 'false'}
            >
              <option value="">Select status</option>
              <option value="Applied">Applied</option>
              <option value="Interviewing">Interviewing</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
            {errors.status && (
              <p id="status-error" className="text-red-500 text-sm mt-1" role="alert">
                {errors.status.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="applied_date" className="block text-sm font-medium text-gray-700 mb-1">
              Applied Date
            </label>
            <input
              id="applied_date"
              type="date"
              {...register('applied_date')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            id="notes"
            {...register('notes')}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Add any notes about this application..."
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors focus:ring-2 focus:ring-gray-500 focus:outline-none"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
            aria-describedby={isSubmitting ? 'submitting-status' : undefined}
          >
            {isSubmitting ? 'Saving...' : (editingApp ? 'Update' : 'Add')} Application
          </button>
        </div>
        {isSubmitting && (
          <p id="submitting-status" className="sr-only">Saving application...</p>
        )}
      </form>
    </div>
  );
};

export default ApplicationForm; 