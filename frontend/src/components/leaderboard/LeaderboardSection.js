import React from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import LeaderboardCard from './LeaderboardCard';

const LeaderboardSection = ({ 
  title, 
  data, 
  type, 
  currentUserId, 
  isLoading, 
  onRefresh,
  lastUpdated 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            {lastUpdated && (
              <p className="text-sm text-gray-500 mt-1">
                Last updated: {new Date(lastUpdated).toLocaleString()}
              </p>
            )}
          </div>
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowPathIcon className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No data available</p>
          </div>
        ) : (
          <div className="space-y-4">
            {data.map((user) => (
              <LeaderboardCard
                key={`${type}-${user.user_id}`}
                user={user}
                rank={user.rank}
                type={type}
                isCurrentUser={user.user_id === currentUserId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardSection; 