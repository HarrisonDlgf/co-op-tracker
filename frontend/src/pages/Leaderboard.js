import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import LeaderboardSection from '../components/leaderboard/LeaderboardSection';
import { apiService } from '../services/api';
import { useApp } from '../context/AppContext';
import { 
  TrophyIcon, 
  StarIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';

const Leaderboard = () => {
  const navigate = useNavigate();
  const { user } = useApp();
  const [leaderboardData, setLeaderboardData] = useState({
    xp_leaderboard: [],
    achievements_leaderboard: [],
    last_updated: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const setLastFetchTime = useState(null);

  const fetchLeaderboard = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await apiService.getLeaderboard();
      
      if (data && (data.xp_leaderboard || data.achievements_leaderboard)) {
        setLeaderboardData(data);
        setLastFetchTime(new Date());
        setError(null); 
      } else {
        throw new Error('Invalid data received from server');
      }
      
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err);
      setError('Failed to load leaderboard data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchLeaderboard();
  }, [user, navigate]);

  const handleRefresh = () => {
    fetchLeaderboard();
  };

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leaderboard</h1>
          <p className="text-gray-600 mt-1">Compete with your peers! See who has the most XP and achievements.</p>
        </div>
      </div>

        {error && (!leaderboardData.xp_leaderboard.length && !leaderboardData.achievements_leaderboard.length) && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Leaderboard Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* XP Leaderboard */}
          <LeaderboardSection
            title="Top XP Earners"
            data={leaderboardData.xp_leaderboard}
            type="xp"
            currentUserId={user.id}
            isLoading={isLoading}
            onRefresh={handleRefresh}
            lastUpdated={leaderboardData.last_updated}
          />

          <LeaderboardSection
            title="Most Achievements"
            data={leaderboardData.achievements_leaderboard}
            type="achievements"
            currentUserId={user.id}
            isLoading={isLoading}
            onRefresh={handleRefresh}
            lastUpdated={leaderboardData.last_updated}
          />
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-200 shadow-sm">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                <StarIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-2">How to climb the leaderboard</h3>
              <p className="text-blue-700 text-sm">Follow these tips to improve your ranking</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3 p-3 rounded-lg bg-white/50">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-600">1</span>
                </div>
                <p className="text-sm text-blue-800">Apply to more companies to earn XP</p>
              </div>
              
              <div className="flex items-start space-x-3 p-3 rounded-lg bg-white/50">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-600">2</span>
                </div>
                <p className="text-sm text-blue-800">Get interviews and offers for bonus XP</p>
              </div>
              
              <div className="flex items-start space-x-3 p-3 rounded-lg bg-white/50">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-600">3</span>
                </div>
                <p className="text-sm text-blue-800">Complete achievements to unlock special rewards</p>
              </div>
              
              <div className="flex items-start space-x-3 p-3 rounded-lg bg-white/50">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-600">4</span>
                </div>
                <p className="text-sm text-blue-800">Stay active and consistent in your co-op search</p>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Leaderboard; 