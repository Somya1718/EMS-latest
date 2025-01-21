import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/apiService';
import keycloak from './Keycloak';
import SessionTimeout from './SessionTimeout';
import './HomeDashboard.css';

const HomeDashboard = () => {
  const navigate = useNavigate();
  const authData = JSON.parse(localStorage.getItem('authData') || '{}');
  const userName = authData?.tokenParsed?.name || 'User';

  useEffect(() => {
    const checkAuth = async () => {
      const authData = JSON.parse(localStorage.getItem('authData') || '{}');
      if (!authData.token) {
        console.log('No authentication data found, redirecting to login');
        navigate('/login');
        return;
      }

      try {
        //await ApiService.testConnection();
        await ApiService.getUserDetails();
      } catch (error) {
        console.error('Dashboard initialization failed:', error);
        if (error.response?.status === 401) {
          handleLogout();
        }
      }
    };

    checkAuth();
  }, [navigate]);

  const handleEmployeeClick = () => {
    navigate('/employee-dashboard');
  };

  const handleLogout = async () => {
    try {
      await ApiService.logout(true);
      localStorage.removeItem('authData');
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      localStorage.removeItem('authData');
      navigate('/login');
    }
  };

  return (
    <div className="dashboard-layout">
      <div className="sidebar">
        <div className="user-profile">
          <div className="avatar">
            {userName.charAt(0)}
          </div>
          <div className="user-info">
            <h3>Hello {userName}!</h3>
            <span className="user-role">Employee</span>
          </div>
        </div>
        <nav className="nav-menu">
          <button className="nav-item active" onClick={handleEmployeeClick}>
            Employee Management
          </button>
          <button className="nav-item" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </div>
      
      <div className="main-content">
        <SessionTimeout />
        <div className="content-header">
          <h1>Dashboard Overview</h1>
          <div className="date-selector">
            <span>Friday, 17 January 2025</span>
          </div>
        </div>
        
        <div className="dashboard-cards">
          <div className="quick-actions">
            <h2>Quick Actions</h2>
            <div className="action-buttons">
              <button className="action-btn" onClick={handleEmployeeClick}>
                View Employees
              </button>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeDashboard;