import React from 'react';
import { 
  BuildingOfficeIcon,
  ClockIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const StatsCards = ({ stats }) => {
  const statItems = [
    {
      label: 'Total',
      value: stats.total,
      icon: BuildingOfficeIcon,
      color: 'blue',
      borderColor: 'border-blue-500',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      valueColor: 'text-gray-900'
    },
    {
      label: 'Applied',
      value: stats.applied,
      icon: ClockIcon,
      color: 'blue',
      borderColor: 'border-blue-500',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      valueColor: 'text-blue-600'
    },
    {
      label: 'Interviewing',
      value: stats.interviewing,
      icon: EyeIcon,
      color: 'yellow',
      borderColor: 'border-yellow-500',
      bgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      valueColor: 'text-yellow-600'
    },
    {
      label: 'Offers',
      value: stats.offers,
      icon: CheckCircleIcon,
      color: 'green',
      borderColor: 'border-green-500',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      valueColor: 'text-green-600'
    },
    {
      label: 'Rejected',
      value: stats.rejected,
      icon: XCircleIcon,
      color: 'red',
      borderColor: 'border-red-500',
      bgColor: 'bg-red-100',
      iconColor: 'text-red-600',
      valueColor: 'text-red-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {statItems.map((item) => {
        const IconComponent = item.icon;
        return (
          <div 
            key={item.label}
            className={`bg-white rounded-lg shadow p-4 border-l-4 ${item.borderColor}`}
            role="region"
            aria-label={`${item.label} applications: ${item.value}`}
          >
            <div className="flex items-center">
              <div className={`p-2 ${item.bgColor} rounded-lg`}>
                <IconComponent className={`h-6 w-6 ${item.iconColor}`} />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">{item.label}</p>
                <p className={`text-2xl font-bold ${item.valueColor}`}>{item.value}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards; 