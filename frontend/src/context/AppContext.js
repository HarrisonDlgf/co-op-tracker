import React, { createContext, useContext, useReducer, useEffect } from 'react';
import apiService from '../services/api';

const AppContext = createContext();

const initialState = {
  user: null,
  applications: [],
  achievements: [],
  loading: false,
  notifications: [],
  isAuthenticated: false,
  authLoading: true,
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_AUTH_LOADING':
      return { ...state, authLoading: action.payload };
    
    case 'SET_USER':
      return { ...state, user: action.payload };
    
    case 'SET_APPLICATIONS':
      return { ...state, applications: action.payload };
    
    case 'SET_ACHIEVEMENTS':
      return { ...state, achievements: action.payload };
    
    case 'ADD_APPLICATION':
      return { 
        ...state, 
        applications: [...state.applications, action.payload] 
      };
    
    case 'UPDATE_APPLICATION':
      return {
        ...state,
        applications: state.applications.map(app => 
          app.id === action.payload.id ? action.payload : app
        ),
      };
    
    case 'DELETE_APPLICATION':
      return {
        ...state,
        applications: state.applications.filter(app => app.id !== action.payload),
      };
    
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };
    
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
      };
    
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        authLoading: false,
      };
    
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        applications: [],
        achievements: [],
        isAuthenticated: false,
        authLoading: false,
      };
    
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // check for existing authentication on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      const savedUser = localStorage.getItem('user');
      
      if (token && savedUser) {
        try {
          // verify token is still valid
          const userData = await apiService.getUserProfile();
          dispatch({ type: 'LOGIN_SUCCESS', payload: { user: userData.user } });
        } catch (error) {
          // Token is invalid, clear storage
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          dispatch({ type: 'LOGOUT' });
        }
      } else {
        dispatch({ type: 'SET_AUTH_LOADING', payload: false });
      }
    };

    checkAuth();
  }, []);

  const login = async (googleUserData) => {
    try {
      const response = await apiService.loginWithGoogle(googleUserData);
      
      // Store token and user data
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user: response.user } });
      
      // Fetch user data after successful login
      await fetchUserData();
      await fetchApplications();
      await fetchAchievements();
      
      addNotification('Successfully logged in!', 'success');
    } catch (error) {
      console.error('Login error:', error);
      addNotification('Login failed. Please try again.', 'error');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      
      dispatch({ type: 'LOGOUT' });
      addNotification('Successfully logged out!', 'success');
    }
  };

  const fetchUserData = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const userData = await apiService.getUserProfile();
      dispatch({ type: 'SET_USER', payload: userData.user });
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const fetchApplications = async () => {
    try {
      const data = await apiService.getApplications();
      dispatch({ type: 'SET_APPLICATIONS', payload: data.applications || [] });
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const fetchAchievements = async () => {
    try {
      const data = await apiService.getAchievements();
      dispatch({ type: 'SET_ACHIEVEMENTS', payload: data.achievements || [] });
    } catch (error) {
      console.error('Error fetching achievements:', error);
    }
  };

  const addApplication = async (applicationData) => {
    try {
      const response = await apiService.createApplication(applicationData);
      dispatch({ type: 'ADD_APPLICATION', payload: response.application });
      addNotification('Application added successfully!', 'success');
      return response;
    } catch (error) {
      addNotification('Failed to add application', 'error');
      throw error;
    }
  };

  const updateApplication = async (id, applicationData) => {
    try {
      const response = await apiService.updateApplication(id, applicationData);
      dispatch({ type: 'UPDATE_APPLICATION', payload: response.application });
      addNotification('Application updated successfully!', 'success');
      return response;
    } catch (error) {
      addNotification('Failed to update application', 'error');
      throw error;
    }
  };

  const deleteApplication = async (id) => {
    try {
      await apiService.deleteApplication(id);
      dispatch({ type: 'DELETE_APPLICATION', payload: id });
      addNotification('Application deleted successfully!', 'success');
    } catch (error) {
      addNotification('Failed to delete application', 'error');
      throw error;
    }
  };

  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    const notification = { id, message, type };
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
    
    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
    }, 5000);
  };

  const removeNotification = (id) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  };

  const value = {
    ...state,
    login,
    logout,
    fetchUserData,
    fetchApplications,
    fetchAchievements,
    addApplication,
    updateApplication,
    deleteApplication,
    addNotification,
    removeNotification,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}; 