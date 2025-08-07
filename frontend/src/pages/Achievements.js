import React from 'react';
import { useApp } from '../context/AppContext';
import { TrophyIcon, StarIcon, FireIcon } from '@heroicons/react/24/outline';
import AchievementCard from '../components/achievements/AchievementCard';

// XP rewards for each achievement
const ACHIEVEMENT_XP_REWARDS = {
  'First Steps': 25,
  'Getting There': 50,
  'Application Master': 100,
  'Co-Op Grinder': 200,
  'Interview Prep Starts Now': 75,
  'Interview Pro': 150,
  'WE DID IT!': 300,
  'Offer Collector': 500,
  'Getting Good At This': 50,
  'Level Up!': 100,
  '10 Levels of Co-Op Grind, Wow': 250,
  'XP Hunter': 100,
  'XP Master': 200,
  'XP Legend': 500,
  'Consistent Grinder': 150,
  'Diverse Applications': 125,
  'Rejection Resilience': 100,
  'Quick Success': 400,
  'High Interview Rate': 175,
  'Perfect Streak': 600
};

// Achievement definitions for the frontend
const ACHIEVEMENT_DEFINITIONS = [
  { name: 'First Steps', description: 'Apply to your first co-op of the cycle', icon: '🎯' },
  { name: 'Getting There', description: 'Apply to 10 co-ops', icon: '💪' },
  { name: 'Application Master', description: 'Apply to 25 co-ops', icon: '📚' },
  { name: 'Co-Op Grinder', description: 'Apply to 50 co-ops', icon: '🏃‍♂️' },
  { name: 'Interview Prep Starts Now', description: 'Get your first interview', icon: '🎤' },
  { name: 'Interview Pro', description: 'Get 5 interviews', icon: '🎭' },
  { name: 'WE DID IT!', description: 'Receive your first offer', icon: '🏆' },
  { name: 'Offer Collector', description: 'Receive 3 offers', icon: '💎' },
  { name: 'Getting Good At This', description: 'Reach level 2', icon: '⭐' },
  { name: 'Level Up!', description: 'Reach level 5', icon: '🌟' },
  { name: '10 Levels of Co-Op Grind, Wow', description: 'Reach level 10', icon: '🔟' },
  { name: 'XP Hunter', description: 'Earn 500 total XP', icon: '🔥' },
  { name: 'XP Master', description: 'Earn 1000 total XP', icon: '⚡' },
  { name: 'XP Legend', description: 'Earn 2000 total XP', icon: '👑' },
  { name: 'Consistent Grinder', description: 'Apply to co-ops for 7 consecutive days', icon: '📅' },
  { name: 'Diverse Applications', description: 'Apply to 10 different companies', icon: '🏢' },
  { name: 'Rejection Resilience', description: 'Get rejected 10 times (but keep going!)', icon: '💪' },
  { name: 'Quick Success', description: 'Get an offer within 5 applications', icon: '🚀' },
  { name: 'High Interview Rate', description: 'Get interviews for 10% of your applications (min 4 apps)', icon: '📊' },
  { name: 'Perfect Streak', description: 'Get 3 offers in a row', icon: '🎯' }
];

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
            <p className="text-2xl font-bold text-gray-900">20</p>
            <p className="text-sm text-gray-600">Total Available</p>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <FireIcon className="h-8 w-8 text-orange-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {Math.round((achievements.length / 20) * 100)}%
            </p>
            <p className="text-sm text-gray-600">Completion Rate</p>
          </div>
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ACHIEVEMENT_DEFINITIONS.map((achievementDef) => {
          const isUnlocked = achievements.find(a => a.name === achievementDef.name);
          const xpReward = ACHIEVEMENT_XP_REWARDS[achievementDef.name];
          
          return (
            <AchievementCard
              key={achievementDef.name}
              achievement={achievementDef}
              isUnlocked={!!isUnlocked}
              xpReward={xpReward}
            />
          );
        })}
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