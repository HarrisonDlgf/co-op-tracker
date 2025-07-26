import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useApp } from '../context/AppContext';
import { extractUserInfo, isNortheasternEmail } from '../config/googleAuth';
import { 
  AcademicCapIcon, 
  CheckCircleIcon 
} from '@heroicons/react/24/outline';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, loading } = useApp();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      // Decode the JWT token to get user info
      const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credentialResponse.credential}`);
      const userInfo = await response.json();
      
      // Check if it's a Northeastern email
      if (!isNortheasternEmail(userInfo.email)) {
        alert('Please use your Northeastern email address (@northeastern.edu) to sign in.');
        return;
      }

      // Extract user info and login
      const userData = extractUserInfo(userInfo);
      await login(userData);
      
      // Navigate to dashboard on success
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
  };

  const handleGoogleError = () => {
    alert('Google login failed. Please try again.');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-teal-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 to-teal-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl px-8 py-10 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <AcademicCapIcon className="h-16 w-16 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Co-Op Tracker Pro
          </h1>
          <p className="text-gray-600">
            Sign in with your Northeastern email to start tracking your co-op journey
          </p>
        </div>

        {/* Northeastern Email Requirement */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <CheckCircleIcon className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-blue-900">
                Northeastern Students Only
              </h3>
              <p className="text-sm text-blue-700 mt-1">
                Please use your @northeastern.edu or @husky.neu.edu email address to sign in.
              </p>
            </div>
          </div>
        </div>

        {/* Google Login Button */}
        <div className="space-y-4">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap
            theme="filled_blue"
            size="large"
            text="signin_with"
            shape="rectangular"
            width="100%"
          />
          
          <div className="text-center">
            <p className="text-xs text-gray-500">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>

        {/* Features Preview */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3">What you'll get:</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center">
              <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
              Track all your co-op applications
            </li>
            <li className="flex items-center">
              <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
              Earn XP and unlock achievements
            </li>
            <li className="flex items-center">
              <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
              Monitor your application progress
            </li>
            <li className="flex items-center">
              <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
              Join the Northeastern co-op community
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Login; 