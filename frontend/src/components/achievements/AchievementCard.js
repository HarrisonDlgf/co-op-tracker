import React from 'react';
import { TrophyIcon } from '@heroicons/react/24/outline';

const AchievementCard = ({ achievement, isUnlocked, xpReward }) => {
  return (
    <div className={`bg-white rounded-lg shadow p-6 border-2 ${
      isUnlocked ? 'border-green-200 bg-green-50' : 'border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-3xl">{achievement.icon}</span>
        {isUnlocked && (
          <TrophyIcon className="h-6 w-6 text-green-600" />
        )}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{achievement.name}</h3>
      <p className="text-sm text-gray-600 mb-3">
        {achievement.description}
      </p>
      <div className="flex items-center justify-between">
        {isUnlocked ? (
          <div className="flex items-center text-green-600 text-sm">
            <TrophyIcon className="h-4 w-4 mr-1" />
            Unlocked!
          </div>
        ) : (
          <div className="text-gray-400 text-sm">Not yet unlocked</div>
        )}
        {xpReward && (
          <div className="text-sm font-medium text-blue-600">
            +{xpReward} XP
          </div>
        )}
      </div>
    </div>
  );
};

export default AchievementCard; 