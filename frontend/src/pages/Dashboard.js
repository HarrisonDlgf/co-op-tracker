import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import StatusPieChart from '../components/dashboard/StatusPieChart';
import { 
  PlusIcon, 
  DocumentTextIcon, 
  TrophyIcon, 
  ChartBarIcon,
  FireIcon,
  StarIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user, applications, achievements, loading } = useApp();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = [
    {
      name: 'Total Applications',
      value: applications.length,
      icon: DocumentTextIcon,
      color: 'bg-blue-500',
      href: '/applications',
      description: 'View applications'
    },
    {
      name: 'Interviews',
      value: applications.filter(app => app.status === 'Interviewing').length,
      icon: ChartBarIcon,
      color: 'bg-yellow-500',
      href: '/applications?status=Interviewing',
      description: 'View your interviews'
    },
    {
      name: 'Offers',
      value: applications.filter(app => app.status === 'Offer').length,
      icon: TrophyIcon,
      color: 'bg-green-500',
      href: '/applications?status=Offer',
      description: 'View your offers'
    },
    {
      name: 'Achievements',
      value: achievements.length,
      icon: StarIcon,
      color: 'bg-purple-500',
      href: '/achievements',
      description: 'View unlocked achievements'
    }
  ];

  const recentApplications = applications.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user?.name}!</p>
        </div>
        <Link
          to="/applications"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Application
        </Link>
      </div>

      {/* User Stats */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Your Progress</h2>
          <div className="flex items-center space-x-2">
            <FireIcon className="h-5 w-5 text-orange-500" />
            <span className="text-lg font-semibold text-gray-900">{user?.xp} XP</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Level {user?.level}</span>
              <span className="text-sm text-gray-500">Next: Level {user?.level + 1}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((user?.xp % 100) || 0, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            to={stat.href}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color} group-hover:scale-110 transition-transform duration-200`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Application Status Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatusPieChart applications={applications} />
        
        {/* Recent Applications */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Applications</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {recentApplications.length > 0 ? (
              recentApplications.map((app) => (
                <div key={app.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{app.company}</h4>
                      <p className="text-sm text-gray-500">{app.position}</p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      app.status === 'Applied' ? 'bg-blue-100 text-blue-800' :
                      app.status === 'Interviewing' ? 'bg-yellow-100 text-yellow-800' :
                      app.status === 'Offer' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center">
                <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No applications yet</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by adding your first application.</p>
                <div className="mt-6">
                  <Link
                    to="/applications"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add Application
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 