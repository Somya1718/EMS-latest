import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/apiService';
import './EmployeeDashboard.css';
import SessionTimeout from './SessionTimeout';

const EmployeeDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const authData = JSON.parse(localStorage.getItem('authData') || '{}');
  const userName = authData?.tokenParsed?.name || 'Employee';

  useEffect(() => {
    const initializeDashboard = async () => {
      if (!authData.token) {
        console.log('No authentication data found, redirecting to login');
        navigate('/login');
        return;
      }

      try {
       // await ApiService.testConnection();
        await loadEmployees();
      } catch (error) {
        console.error('Dashboard initialization failed:', error);
        if (error.response?.status === 401) {
          handleLogout();
        }
      } finally {
        setLoading(false);
      }
    };

    initializeDashboard();
  }, [navigate]);

  const loadEmployees = async () => {
    try {
      const data = await ApiService.getAllEmployees();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
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

  const handleHomeClick = () => {
    navigate('/home-dashboard');
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <span>Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <SessionTimeout />
      
      <div className="dashboard-header">
        <h1 className="dashboard-title">Employee Dashboard</h1>
        <div className="header-actions">
          <button className="home-button" onClick={handleHomeClick}>
            Home
          </button>
          <button className="btn btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        <h1>Welcome back, {userName}</h1>
        
        <div className="employees-table-container">
          <table className="employees-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id}>
                  <td>{employee.id}</td>
                  <td>{employee.name}</td>
                  <td>{employee.email}</td>
                  <td>{employee.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;