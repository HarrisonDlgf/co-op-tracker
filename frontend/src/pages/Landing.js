import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { AcademicCapIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated, authLoading } = useApp();

  useEffect(() => {
    if (!authLoading) {
      if (isAuthenticated) {
        navigate("/dashboard");
      } else {
        navigate("/login");
      }
    }
  }, [isAuthenticated, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-teal-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 to-teal-50">
      <div className="bg-white rounded-2xl shadow-xl px-8 py-10 min-w-[320px] text-center">
        <div className="flex justify-center mb-6">
          <AcademicCapIcon className="h-16 w-16 text-blue-600" />
        </div>
        <h1 className="mb-6 text-3xl font-bold text-blue-600">
          Welcome to <span className="text-gray-900">Co-Op Tracker Pro!</span>
        </h1>
        <p className="text-gray-600 mb-6">
          The gamified way to track your co-op applications and earn rewards
        </p>
        
        <div className="space-y-3 text-left mb-6">
          <div className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
            <span className="text-sm text-gray-700">Track all your applications</span>
          </div>
          <div className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
            <span className="text-sm text-gray-700">Earn XP and unlock achievements</span>
          </div>
          <div className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
            <span className="text-sm text-gray-700">Monitor your progress</span>
          </div>
        </div>
        
        <div className="text-sm text-gray-500">
          Redirecting to login...
        </div>
      </div>
    </div>
  );
};

export default Landing;