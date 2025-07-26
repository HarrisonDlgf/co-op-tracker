import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AppProvider, useApp } from './context/AppContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Applications from './pages/Applications';
import Achievements from './pages/Achievements';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import NotificationToast from './components/NotificationToast';
import { GOOGLE_CLIENT_ID } from './config/googleAuth';

const NotificationContainer = () => {
  const { notifications, removeNotification } = useApp();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <NotificationToast
          key={notification.id}
          notification={notification}
          onRemove={removeNotification}
        />
      ))}
    </div>
  );
};

const AppRoutes = () => {
  return (
    <Router>
      <NotificationContainer />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Layout><Dashboard /></Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/applications" 
          element={
            <ProtectedRoute>
              <Layout><Applications /></Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/achievements" 
          element={
            <ProtectedRoute>
              <Layout><Achievements /></Layout>
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
