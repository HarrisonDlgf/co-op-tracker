import React from 'react';
import { useApp } from '../context/AppContext';
import { TrophyIcon, StarIcon, FireIcon } from '@heroicons/react/24/outline';

const Achievements = () => {
  const { achievements } = useApp();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Achievements</h1>
        <p className="text-gray-600 mt-1">Track your progress and unlock new milestones</p>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <TrophyIcon className="h-8 w-8 text-yellow-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{achievements.length}</p>
            <p className="text-sm text-gray-600">Achievements Unlocked</p>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <StarIcon className="h-8 w-8 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">7</p>
            <p className="text-sm text-gray-600">Total Available</p>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <FireIcon className="h-8 w-8 text-orange-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {Math.round((achievements.length / 7) * 100)}%
            </p>
            <p className="text-sm text-gray-600">Completion Rate</p>
          </div>
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* First Steps */}
        <div className={`bg-white rounded-lg shadow p-6 border-2 ${
          achievements.find(a => a.id === 1) ? 'border-green-200 bg-green-50' : 'border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl">🎯</span>
            {achievements.find(a => a.id === 1) && (
              <TrophyIcon className="h-6 w-6 text-green-600" />
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">First Steps</h3>
          <p className="text-sm text-gray-600 mb-3">
            Apply to your first co-op of the cycle
          </p>
          {achievements.find(a => a.id === 1) ? (
            <div className="flex items-center text-green-600 text-sm">
              <TrophyIcon className="h-4 w-4 mr-1" />
              Unlocked!
            </div>
          ) : (
            <div className="text-gray-400 text-sm">Not yet unlocked</div>
          )}
        </div>

        {/* Getting There */}
        <div className={`bg-white rounded-lg shadow p-6 border-2 ${
          achievements.find(a => a.id === 2) ? 'border-green-200 bg-green-50' : 'border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl">💪</span>
            {achievements.find(a => a.id === 2) && (
              <TrophyIcon className="h-6 w-6 text-green-600" />
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Getting There</h3>
          <p className="text-sm text-gray-600 mb-3">
            Apply to 10 co-ops
          </p>
          {achievements.find(a => a.id === 2) ? (
            <div className="flex items-center text-green-600 text-sm">
              <TrophyIcon className="h-4 w-4 mr-1" />
              Unlocked!
            </div>
          ) : (
            <div className="text-gray-400 text-sm">Not yet unlocked</div>
          )}
        </div>

        {/* Interview Prep Starts Now */}
        <div className={`bg-white rounded-lg shadow p-6 border-2 ${
          achievements.find(a => a.id === 3) ? 'border-green-200 bg-green-50' : 'border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl">🎤</span>
            {achievements.find(a => a.id === 3) && (
              <TrophyIcon className="h-6 w-6 text-green-600" />
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Interview Prep Starts Now</h3>
          <p className="text-sm text-gray-600 mb-3">
            Get your first interview
          </p>
          {achievements.find(a => a.id === 3) ? (
            <div className="flex items-center text-green-600 text-sm">
              <TrophyIcon className="h-4 w-4 mr-1" />
              Unlocked!
            </div>
          ) : (
            <div className="text-gray-400 text-sm">Not yet unlocked</div>
          )}
        </div>

        {/* WE DID IT! */}
        <div className={`bg-white rounded-lg shadow p-6 border-2 ${
          achievements.find(a => a.id === 4) ? 'border-green-200 bg-green-50' : 'border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl">🏆</span>
            {achievements.find(a => a.id === 4) && (
              <TrophyIcon className="h-6 w-6 text-green-600" />
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">WE DID IT!</h3>
          <p className="text-sm text-gray-600 mb-3">
            Receive your first offer
          </p>
          {achievements.find(a => a.id === 4) ? (
            <div className="flex items-center text-green-600 text-sm">
              <TrophyIcon className="h-4 w-4 mr-1" />
              Unlocked!
            </div>
          ) : (
            <div className="text-gray-400 text-sm">Not yet unlocked</div>
          )}
        </div>

        {/* Getting Good At This */}
        <div className={`bg-white rounded-lg shadow p-6 border-2 ${
          achievements.find(a => a.id === 5) ? 'border-green-200 bg-green-50' : 'border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl">⭐</span>
            {achievements.find(a => a.id === 5) && (
              <TrophyIcon className="h-6 w-6 text-green-600" />
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Getting Good At This</h3>
          <p className="text-sm text-gray-600 mb-3">
            Reach level 2
          </p>
          {achievements.find(a => a.id === 5) ? (
            <div className="flex items-center text-green-600 text-sm">
              <TrophyIcon className="h-4 w-4 mr-1" />
              Unlocked!
            </div>
          ) : (
            <div className="text-gray-400 text-sm">Not yet unlocked</div>
          )}
        </div>

        {/* XP Hunter */}
        <div className={`bg-white rounded-lg shadow p-6 border-2 ${
          achievements.find(a => a.id === 6) ? 'border-green-200 bg-green-50' : 'border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl">🔥</span>
            {achievements.find(a => a.id === 6) && (
              <TrophyIcon className="h-6 w-6 text-green-600" />
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">XP Hunter</h3>
          <p className="text-sm text-gray-600 mb-3">
            Earn 500 total XP
          </p>
          {achievements.find(a => a.id === 6) ? (
            <div className="flex items-center text-green-600 text-sm">
              <TrophyIcon className="h-4 w-4 mr-1" />
              Unlocked!
            </div>
          ) : (
            <div className="text-gray-400 text-sm">Not yet unlocked</div>
          )}
        </div>

        {/* 10 Levels of Co-Op Grind, Wow */}
        <div className={`bg-white rounded-lg shadow p-6 border-2 ${
          achievements.find(a => a.id === 7) ? 'border-green-200 bg-green-50' : 'border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl">🔟</span>
            {achievements.find(a => a.id === 7) && (
              <TrophyIcon className="h-6 w-6 text-green-600" />
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">10 Levels of Co-Op Grind, Wow</h3>
          <p className="text-sm text-gray-600 mb-3">
            Reach level 10
          </p>
          {achievements.find(a => a.id === 7) ? (
            <div className="flex items-center text-green-600 text-sm">
              <TrophyIcon className="h-4 w-4 mr-1" />
              Unlocked!
            </div>
          ) : (
            <div className="text-gray-400 text-sm">Not yet unlocked</div>
          )}
        </div>
      </div>

      {/* Motivation Message */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow p-6 text-white text-center">
        <h3 className="text-xl font-semibold mb-2">Keep Going!</h3>
        <p className="text-blue-100">
          Every application brings you closer to your dream co-op. Stay motivated and keep applying!
        </p>
      </div>
    </div>
  );
};

export default Achievements; 