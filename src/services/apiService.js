// src/services/api.js
import axios from 'axios';
import keycloak from '../components/Keycloak';

const API_BASE_URL = 'http://localhost:8081/api';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 10000, // 10 seconds
});


// Add request interceptor to add auth headers
axiosInstance.interceptors.request.use(
  (config) => {
    try {
      const authData = JSON.parse(localStorage.getItem('authData') || '{}');
      if (authData.token) {
        config.headers['Authorization'] = `Bearer ${authData.token}`;
      }
      config.headers['Content-Type'] = 'application/json';
      config.headers['X-Requested-With'] = 'XMLHttpRequest';
      return config;
    } catch (error) {
      console.error('Error setting auth headers:', error);
      return Promise.reject(error);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);



// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

class ApiService {
  
  // Admin APIs
  static async getAllEmployees() {
    try {
      return await axiosInstance.get('/admin/getAll');
    } catch (error) {
      console.error('Failed to fetch employees:', error);
      throw error;
    }
  }

  static async addEmployee(employeeData) {
    try {
      return await axiosInstance.post('/admin/add', employeeData);
    } catch (error) {
      console.error('Failed to add employee:', error);
      throw error;
    }
  }

  static async updateEmployee(employeeData) {
    try {
      return await axiosInstance.put('/admin/update', employeeData);
    } catch (error) {
      console.error('Failed to update employee:', error);
      throw error;
    }
  }

  static async deleteEmployee(id) {
    try {
      return await axiosInstance.delete(`/admin/delete/${id}`);
    } catch (error) {
      console.error('Failed to delete employee:', error);
      throw error;
    }
  }

  // Employee APIs
  static async getEmployeeHome() {
    try {
      return await axiosInstance.get('/employee/home');
    } catch (error) {
      console.error('Failed to fetch employee home:', error);
      throw error;
    }
  }

//   // Auth and Logout
  static async logout(isAdmin = false) {
    try {
      const path = isAdmin ? 'admin' : 'employee';
      await axiosInstance.post(`/${path}/logout`);
      
      // Clear local storage
      localStorage.removeItem('authData');
      
      // Logout from Keycloak
      //await keycloak.logout();
      
      return 'Logged out successfully';
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }

// static async logout(isAdmin = false) {
//   try {
//     const path = isAdmin ? 'admin' : 'employee';
    
//     // Call backend logout endpoint
//     await axiosInstance.post(`/${path}/logout`);
//     return true;
//   } catch (error) {
//     console.error('API logout failed:', error);
//     throw error;
//   }
// }

static clearAuthData() {
  try{
  localStorage.removeItem('authData');
  localStorage.removeItem('intendedRoute');
  // Clear any other auth-related data you might have
  keycloak.clearToken();
}
  catch (error) {
    console.error('Error clearing auth data:', error);
  }
}



  // Store auth data
  static storeAuthData(token) {
    try {
      localStorage.setItem('authData', JSON.stringify({ token }));
    } catch (error) {
      console.error('Failed to store auth data:', error);
      throw error;
    }
  }

  // Handle unauthorized requests
  static handleUnauthorized() {
    localStorage.removeItem('authData');
    window.location.href = '/login';
  }

  
    static async refreshToken() {
      try {
        const authData = JSON.parse(localStorage.getItem('authData') || '{}');
        if (!authData.refreshToken) {
          return false;
        }
  
        const tokenData = await keycloak.updateToken(5);
        if (tokenData) {
          // Store the new tokens
          const newAuthData = {
            token: keycloak.token,
            refreshToken: keycloak.refreshToken,
            expiresAt: Date.now() + (keycloak.tokenParsed.exp - keycloak.tokenParsed.iat) * 1000,
            refreshExpiresAt: Date.now() + (keycloak.refreshTokenParsed.exp - keycloak.refreshTokenParsed.iat) * 1000
          };
          localStorage.setItem('authData', JSON.stringify(newAuthData));
          return true;
        }
        return false;
      } catch (error) {
        console.error('Token refresh failed:', error);
        return false;
      }
    }
  
    // Add to your ApiService class in src/services/apiService.js

static async isSessionValid() {
    try {
      const authData = this.getStoredAuthData();
      if (!authData) return false;
  
      // If token is not expired, session is still valid
      if (!this.isTokenExpired()) {
        return true;
      }
  
      // If token is expired but refresh token is valid, try to refresh
      if (!this.isRefreshTokenExpired()) {
        const refreshed = await this.refreshToken();
        return refreshed;
      }
  
      return false;
    } catch (error) {
      console.error('Session validation failed:', error);
      return false;
    }
  }

  static getStoredAuthData() {
    try {
      const authData = JSON.parse(localStorage.getItem('authData') || '{}');
      if (!authData.token) return null;
      return authData;
    } catch (error) {
      console.error('Error reading auth data:', error);
      return null;
    }
  }

  static isTokenExpired() {
    const authData = this.getStoredAuthData();
    if (!authData) return true;
    return Date.now() >= authData.expiresAt;
  }

  static isRefreshTokenExpired() {
    const authData = this.getStoredAuthData();
    if (!authData) return true;
    return Date.now() >= authData.refreshExpiresAt;
  }

}

// Add global error handler for unauthorized requests
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      ApiService.handleUnauthorized();
    }
    return Promise.reject(error);
  }
);

export default ApiService;