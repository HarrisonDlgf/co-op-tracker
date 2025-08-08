const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const token = localStorage.getItem('authToken');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        if (response.status === 401) {
          // token is either expired or invalid
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // authentication endpoints
  async loginWithGoogle(googleUser) {
    return this.request('/auth/google', {
      method: 'POST',
      body: JSON.stringify(googleUser),
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async refreshToken() {
    return this.request('/auth/refresh', {
      method: 'POST',
    });
  }

  // user endpoints
  async getUserProfile() {
    return this.request('/user/profile');
  }

  // applications endpoints
  async getApplications() {
    return this.request('/applications');
  }

  async createApplication(data) {
    return this.request('/applications', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateApplication(id, data) {
    return this.request(`/applications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteApplication(id) {
    return this.request(`/applications/${id}`, {
      method: 'DELETE',
    });
  }

  async bulkImportApplications(formData) {
    const url = `${this.baseURL}/applications/bulk-import`;
    const token = localStorage.getItem('authToken');
    
    const config = {
      method: 'POST',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: formData,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Bulk import request failed:', error);
      throw error;
    }
  }

  async bulkImportApplicationsJson(data) {
    return this.request('/applications/bulk-import', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getImportTemplate() {
    return this.request('/applications/import-template');
  }

  async getSampleTemplate() {
    return this.request('/applications/sample-template');
  }

  async exportApplications() {
    return this.request('/applications/export');
  }

  async clearAllApplications() {
    return this.request('/applications/clear-all', {
      method: 'DELETE',
    });
  }

  // achievements endpoints
  async getAchievements() {
    return this.request('/achievements');
  }

  // leaderboard endpoints
  async getLeaderboard() {
    return this.request('/leaderboard');
  }
}

export const apiService = new ApiService();
export default apiService; 