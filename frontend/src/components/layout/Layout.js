import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Logo from '../ui/Logo';
import { 
  HomeIcon, 
  DocumentTextIcon, 
  TrophyIcon, 
  ChartBarIcon,
  UserCircleIcon,
  ChevronDownIcon,
  ArrowRightStartOnRectangleIcon
} from '@heroicons/react/24/outline';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useApp();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Applications', href: '/applications', icon: DocumentTextIcon },
    { name: 'Achievements', href: '/achievements', icon: TrophyIcon },
    { name: 'Leaderboard', href: '/leaderboard', icon: ChartBarIcon },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Modern Top Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand - Moved further left */}
            <Link to="/dashboard" className="flex items-center hover:opacity-80 transition-all duration-200 group">
              <div className="mr-2.5 group-hover:scale-105 transition-transform duration-200">
                <Logo size="large" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Co-Op Tracker
              </span>
            </Link>
            
            {/* User Menu */}
            <div className="flex items-center">
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2 rounded-xl px-3 py-2 transition-all duration-200 hover:bg-gray-50/80"
                >
                  <div className="flex items-center space-x-3">
                    {user?.picture ? (
                      <div className="relative">
                        <img
                          src={user.picture}
                          alt={user.name}
                          className="h-8 w-8 rounded-full ring-2 ring-gray-200/50 hover:ring-blue-300 transition-all duration-200"
                        />
                        <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-400 border-2 border-white rounded-full"></div>
                      </div>
                    ) : (
                      <div className="relative">
                        <UserCircleIcon className="h-8 w-8 text-gray-400" />
                        <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-400 border-2 border-white rounded-full"></div>
                      </div>
                    )}
                    <span className="text-sm font-medium hidden sm:block">{user?.name}</span>
                    <ChevronDownIcon className="h-4 w-4 transition-transform duration-200" style={{ transform: showUserMenu ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                  </div>
                </button>

                {/* Modern Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl py-2 z-50 border border-gray-200/50">
                    <div className="px-4 py-3 text-sm text-gray-700 border-b border-gray-100/50">
                      <div className="font-semibold">{user?.name}</div>
                      <div className="text-gray-500 text-xs mt-0.5">{user?.email}</div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50/80 transition-all duration-200 rounded-lg mx-2"
                    >
                      <ArrowRightStartOnRectangleIcon className="h-4 w-4 mr-3 text-gray-400" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex">
        {/* Modern Sidebar */}
        <div className="w-64 bg-white/60 backdrop-blur-sm border-r border-gray-200/50 min-h-screen">
          <nav className="mt-6">
            <div className="px-3 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 mx-2 group ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-700 shadow-sm border border-blue-200/50'
                        : 'text-gray-600 hover:bg-gray-50/80 hover:text-gray-900 hover:shadow-sm'
                    }`}
                  >
                    <item.icon className={`mr-3 h-5 w-5 transition-all duration-200 ${
                      isActive 
                        ? 'text-blue-600 group-hover:scale-110' 
                        : 'text-gray-400 group-hover:text-gray-600 group-hover:scale-110'
                    }`} />
                    {item.name}
                    {isActive && (
                      <div className="ml-auto h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </div>

      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </div>
  );
};

export default Layout;
