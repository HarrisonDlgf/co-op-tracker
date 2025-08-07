import React from 'react';
import { TrophyIcon, StarIcon, FireIcon } from '@heroicons/react/24/outline';

const LeaderboardCard = ({ user, rank, type, isCurrentUser = false }) => {
  const getRankIcon = (rank) => {
    if (rank === 1) return <TrophyIcon className="h-6 w-6 text-yellow-500" />;
    if (rank === 2) return <StarIcon className="h-6 w-6 text-gray-400" />;
    if (rank === 3) return <FireIcon className="h-6 w-6 text-orange-500" />;
    return null;
  };

  const getRankColor = (rank) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
    if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
    if (rank === 3) return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white';
    return 'bg-white text-gray-900';
  };

  const getValueDisplay = () => {
    if (type === 'xp') {
      return (
        <div className="text-right">
          <div className="text-lg font-bold text-blue-600">{user.xp.toLocaleString()} XP</div>
          <div className="text-sm text-gray-500">Level {user.level}</div>
        </div>
      );
    } else {
      return (
        <div className="text-right">
          <div className="text-lg font-bold text-purple-600">
            {user.achievement_count} {user.achievement_count === 1 ? 'Achievement' : 'Achievements'}
          </div>
          <div className="text-sm text-gray-500">{user.xp.toLocaleString()} XP</div>
        </div>
      );
    }
  };

  return (
    <div className={`relative rounded-lg shadow-sm border-2 transition-all duration-200 hover:shadow-md ${
      isCurrentUser ? 'border-blue-400 bg-blue-50' : 'border-gray-200'
    }`}>
      {/* Rank Badge */}
      <div className={`absolute -top-2 -left-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getRankColor(rank)}`}>
        {getRankIcon(rank) || rank}
      </div>
      
      <div className="p-4 pl-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Profile Picture */}
            <div className="relative">
              <img
                src={user.profile_picture || '/default-avatar.png'}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                onError={(e) => {
                  e.target.src = '/default-avatar.png';
                }}
              />
              {isCurrentUser && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            
            {/* User Info */}
            <div>
              <h3 className={`font-semibold ${isCurrentUser ? 'text-blue-700' : 'text-gray-900'}`}>
                {user.name}
                {isCurrentUser && <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">You</span>}
              </h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>#{rank}</span>
                {type === 'xp' && (
                  <>
                    <span>•</span>
                    <span>{user.achievement_count} {user.achievement_count === 1 ? 'achievement' : 'achievements'}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Value Display */}
          {getValueDisplay()}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardCard; 