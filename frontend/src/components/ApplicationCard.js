import React, { useState, memo } from 'react';
import { 
  PencilIcon, 
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const ApplicationCard = memo(({ 
  app, 
  editApplication, 
  deleteApplication 
}) => {
  const [showNotes, setShowNotes] = useState(false);

  // Status color helper
  const getStatusColor = (status) => {
    switch (status) {
      case 'Applied': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Interviewing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Offer': return 'bg-green-100 text-green-800 border-green-200';
      case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Status icon helper
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Applied': return <ClockIcon className="h-4 w-4" />;
      case 'Interviewing': return <EyeIcon className="h-4 w-4" />;
      case 'Offer': return <CheckCircleIcon className="h-4 w-4" />;
      case 'Rejected': return <XCircleIcon className="h-4 w-4" />;
      default: return <ClockIcon className="h-4 w-4" />;
    }
  };

  const handleEdit = () => {
    editApplication(app);
  };

  const handleDelete = () => {
    deleteApplication(app.id);
  };

  const toggleNotes = () => {
    setShowNotes(!showNotes);
  };

  return (
    <article 
      className="bg-white rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow"
      aria-labelledby={`app-${app.id}-title`}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h4 
                id={`app-${app.id}-title`}
                className="text-lg font-semibold text-gray-900"
              >
                {app.company}
              </h4>
              <span 
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(app.status)}`}
                aria-label={`Status: ${app.status}`}
              >
                {getStatusIcon(app.status)}
                <span className="ml-1">{app.status}</span>
              </span>
            </div>
            <p className="text-gray-600 font-medium">{app.position}</p>
            {app.applied_date && (
              <div className="flex items-center text-sm text-gray-500 mt-2">
                <CalendarIcon className="h-4 w-4 mr-1" aria-hidden="true" />
                <span>Applied: {new Date(app.applied_date).toLocaleDateString()}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={handleEdit}
              className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              title="Edit application"
              aria-label={`Edit application for ${app.company}`}
            >
              <PencilIcon className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50 focus:ring-2 focus:ring-red-500 focus:outline-none"
              title="Delete application"
              aria-label={`Delete application for ${app.company}`}
            >
              <TrashIcon className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
        
        {app.notes && (
          <div className="mt-4">
            <button
              onClick={toggleNotes}
              className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none rounded"
              aria-expanded={showNotes}
              aria-controls={`notes-${app.id}`}
            >
              {showNotes ? (
                <EyeSlashIcon className="h-4 w-4 mr-1" aria-hidden="true" />
              ) : (
                <EyeIcon className="h-4 w-4 mr-1" aria-hidden="true" />
              )}
              {showNotes ? 'Hide' : 'Show'} Notes
            </button>
            {showNotes && (
              <div 
                id={`notes-${app.id}`}
                className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200"
                role="region"
                aria-label="Application notes"
              >
                <p className="text-sm text-gray-700">{app.notes}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
});

ApplicationCard.displayName = 'ApplicationCard';

export default ApplicationCard; 