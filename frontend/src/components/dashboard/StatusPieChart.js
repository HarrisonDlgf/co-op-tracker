import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title
} from 'chart.js';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, Title);

const StatusPieChart = ({ applications }) => {
  const statusCounts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {});
  const totalApplications = applications.length;
  
  if (totalApplications === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No Applications Yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Apply to more positions to view your application status breakdown.
          </p>
        </div>
      </div>
    );
  }

  const statusColors = {
    'Applied': '#3B82F6',      
    'Interviewing': '#F59E0B',  
    'Offer': '#10B981',        
    'Rejected': '#EF4444',     
    'Ghosted': '#6B7280',      
    'Withdrawn': '#8B5CF6'     
  };

  const chartData = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        data: Object.values(statusCounts),
        backgroundColor: Object.keys(statusCounts).map(status => statusColors[status] || '#9CA3AF'),
        borderColor: Object.keys(statusCounts).map(status => statusColors[status] || '#9CA3AF'),
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: true,
        text: 'Application Status Breakdown',
        font: {
          size: 16,
          weight: 'bold',
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const percentage = ((value / totalApplications) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="h-64">
        <Pie data={chartData} options={options} />
      </div>
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Total Applications: <span className="font-semibold">{totalApplications}</span>
        </p>
      </div>
    </div>
  );
};

export default StatusPieChart; 